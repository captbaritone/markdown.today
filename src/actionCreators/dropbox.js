import Dropbox from "dropbox";
import { push } from "react-router-redux";
import { debounce, get } from "lodash";
import { decrypt } from "sjcl";

import {
  isLoggedIn,
  getAuthToken,
  getDropboxFileContents,
  getEncryptionPassword,
  getEncryptedBlob
} from "../accessors";
import {
  MOCK_DROPBOX,
  SET_FROM_MD,
  DROPBOX_UPLOAD_COMPLETE,
  STARTING_DROPBOX_UPLOAD,
  SET_ENCRYPTED_BLOB,
  SET_AUTH_TOKEN
} from "../actionTypes";
import { addNotification } from "./";
import { fileIsEncrypted } from "../utils";
import { DROPBOX_CLIENT_ID, AUTH_REDIRECT_URL } from "../constants";

export const errorIs404 = error => {
  let errorObj;
  try {
    errorObj = JSON.parse(error);
  } catch (e) {
    return false;
  }
  return get(errorObj, ["error", "path", ".tag"]) === "not_found";
};

const getDefaultJournal = () => `# Journal

## ${new Date().toISOString()}

Welcome to Markdown Today!`;

const JOURNAL_FILENAME = "journal.md";
const JOURNAL_PATH = `/${JOURNAL_FILENAME}`;
const MOCK_JOURNAL = `# My Journal

## 2017-02-24T02:05:17.338Z

The polish is starting to pay off! Still some clunky bits (focusing inputs on ios, the \`<textarea>\` in general...) but I think it's probably ready to show people.

## 2017-02-02T02:05:17.338Z

I've added encryption support. This makes some annoying tradeoffs. Notably, it prevents you from editing your journal in a text editor, which was supposed to be a big part of this project. That said, the "trust no one" security that it brings is pretty cool!

## 2017-01-30T02:05:17.338Z

Okay! I think I've connected most of the big pieces. Still lots of polish to sort out, especially in the UI, but the big pieces are there.

## 2017-01-11T02:05:17.338Z

I've been playing with Material-UI and it seems to solve the issue of how to build a mobile friendly UI without having any particular experience in that arena.

## 2016-01-11T02:05:17.338Z

Starting work on a journaling application that accesses your journal as a markdown file on Dropbox and lets you edit it from a mobile browser. Still figuring out how to get the UI looking reasonable, but I think it should be possible.`;
//const MOCK_JOURNAL = `{"iv":"L/aB6yFONnInkws56OHrcQ==","v":1,"iter":10000,"ks":128,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"US4EEfq0KyY=","ct":"5ObD/LRkIjIoM000R7Y2qyBDmsTktTPAUE2YQKWUvafGPH+Hr8uspzG2Ke/hxnCZgQ3pZFc64V+kubduOKlp8nc4mhzEgvY/EqKXTh/FDRyFpfSJm7duwjgC4qlFfh2BtB4j+4NfqTjPR95trkM0sD6fPS4rtEMfMEo5LbKHkW6rQon5kpIYeuG8Qqw="}`;

export const authenticateToDropbox = () => {
  return (dispatch, getState) => {
    if (getState().dropbox.mock) {
      return true;
    }
    const dropbox = new Dropbox({ clientId: DROPBOX_CLIENT_ID });
    window.location = dropbox.getAuthenticationUrl(AUTH_REDIRECT_URL);
    return;
  };
};

const getDropboxClient = state => {
  if (!isLoggedIn(state)) {
    // TODO: Consider redirect to login page
    authenticateToDropbox();
  }
  const dropbox = new Dropbox({
    clientId: DROPBOX_CLIENT_ID,
    accessToken: getAuthToken(state)
  });
  return dropbox;
};

const setJournalMarkdown = md => ({ type: SET_FROM_MD, md });

export const attemptToDecryptJournal = () => {
  return (dispatch, getState) => {
    const state = getState();
    const password = getEncryptionPassword(state);
    const encryptedBlob = getEncryptedBlob(state);
    if (!password || !encryptedBlob) {
      return;
    }
    // This will throw if the password is wrong.
    // That should be okay, because this code path
    // is only ever executed with a validated password.
    const md = decrypt(password, encryptedBlob);
    if (md) {
      dispatch(setJournalMarkdown(md));
    }
  };
};
const setEncryptedContents = contents => {
  return dispatch => {
    dispatch({ type: SET_ENCRYPTED_BLOB, contents });
    dispatch(attemptToDecryptJournal());
  };
};

const setJournalContents = contents => {
  return dispatch => {
    if (fileIsEncrypted(contents)) {
      dispatch(setEncryptedContents(contents));
    } else {
      dispatch(setJournalMarkdown(contents));
    }
  };
};
const setJournalFromBlob = blob => {
  return (dispatch, getState) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", function() {
      dispatch(setJournalContents(reader.result));
    });
    reader.readAsText(blob);
  };
};

const actuallyDownloadJournal = () => {
  return (dispatch, getState) => {
    const dropbox = getDropboxClient(getState());
    dropbox
      .filesDownload({ path: JOURNAL_PATH })
      .then(file => {
        dispatch(setJournalFromBlob(file.fileBlob));
      })
      .catch(error => {
        dispatch(addNotification(`Error downloading journal from Dropbox`));
        console.log({ error });
      });
  };
};
const createJournalOnDropbox = () => {
  return (dispatch, getState) => {
    const dropbox = getDropboxClient(getState());
    const md = getDefaultJournal();
    dropbox
      .filesUpload({ contents: md, path: JOURNAL_PATH })
      .then(file => {
        dispatch(addNotification(`Created: ${JOURNAL_FILENAME} on Dropbox`));
        // `file` does not contain the contents, so we
        // reuse the content we already have.
        dispatch(setJournalMarkdown(md));
      })
      .catch(error => {
        dispatch(addNotification(`Error creating journal on Dropbox`));
        console.log({ error });
      });
  };
};

export const downloadJournal = () => {
  return (dispatch, getState) => {
    if (getState().dropbox.mock) {
      dispatch(setJournalContents(MOCK_JOURNAL));
      return;
    }
    const dropbox = getDropboxClient(getState());
    dropbox
      .filesGetMetadata({ path: JOURNAL_PATH })
      .then(file => {
        dispatch(actuallyDownloadJournal());
      })
      .catch(response => {
        if (errorIs404(response.error)) {
          dispatch(createJournalOnDropbox());
          return;
        }
        // Can be JSON.parse('{"error_summary": "invalid_access_token/...", "error": {".tag": "invalid_access_token"}}');
        dispatch(addNotification(`Error looking for journal on Dropbox`));
      });
  };
};

const _uploadToDropbox = (dispatch, getState) => {
  const state = getState();
  if (state.dropbox.mock) {
    return;
  }
  dispatch({ type: STARTING_DROPBOX_UPLOAD });
  const dropbox = getDropboxClient(state);
  const contents = getDropboxFileContents(state);
  dropbox
    .filesUpload({
      path: JOURNAL_PATH,
      contents,
      // Don't notify the user every time.
      // TODO: This doesn't seem to work.
      mute: true,
      mode: { ".tag": "overwrite" }
    })
    .then(result => {
      dispatch({ type: DROPBOX_UPLOAD_COMPLETE });
    })
    .catch(error => {
      dispatch(addNotification(`Error updating journal on Dropbox`));
      console.log({ error });
    });
};
export const uploadToDropbox = () => _uploadToDropbox;

const _debouncedUploadToDropbox = debounce(_uploadToDropbox, 5000);

export const debouncedUploadToDropbox = () => _debouncedUploadToDropbox;

export const mockDropbox = () => {
  return dispatch => {
    dispatch({ type: MOCK_DROPBOX });
    dispatch(push("/"));
  };
};

export const setAuthToken = token => ({ type: SET_AUTH_TOKEN, token });

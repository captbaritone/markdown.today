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
  SET_ENCRYPTED_BLOB
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

## 2017-02-11T02:05:17.338Z

Hello!

## 2017-02-02T02:05:17.338Z

Again!

## 2017-01-30T02:05:17.338Z

Again!


## 2017-01-11T02:05:17.338Z

Hello!

## 2016-01-11T02:05:17.338Z

Hello!`;
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
      .catch(() => {
        // TODO: Handle errors
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
        dispatch(addNotification(`Created: "Apps/Markdown Today/journal.md"`));
        // `file` does not contain the contents, so we
        // reuse the content we already have.
        dispatch(setJournalMarkdown(md));
      })
      .catch(error => {
        // TODO: Handle errors
        console.log({ error });
      });
  };
};

export const downloadJournal = () => {
  // TODO: Split this up into smaller actions
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
        if (responseIs404(response.error)) {
          dispatch(createJournalOnDropbox());
          return;
        }
        console.log("error");
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
      // TODO: Handle the error case
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

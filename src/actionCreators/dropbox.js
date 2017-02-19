import Dropbox from "dropbox";
import { push } from "react-router-redux";
import { debounce } from "lodash";
import { decrypt } from "sjcl";

import {
  isLoggedIn,
  getAuthToken,
  getDropboxFileContents,
  getEncryptionPassword,
  getUnencryptedBlob
} from "../accessors";
import {
  MOCK_DROPBOX,
  SET_FROM_MD,
  DROPBOX_UPLOAD_COMPLETE,
  STARTING_DROPBOX_UPLOAD,
  SET_UNENCRYPTED_BLOB
} from "../actionTypes";
import { fileIsEncrypted } from "../utils";
import { DROPBOX_CLIENT_ID, AUTH_REDIRECT_URL } from "../constants";

const DEFAULT_JOURNAL = "## Journal";
const JOURNAL_FILENAME = "journal.md";
const JOURNAL_PATH = `/${JOURNAL_FILENAME}`;
/*
const MOCK_JOURNAL = `# My Journal

## 2017-02-11T02:05:17.338Z

Hello!`;
*/
const MOCK_JOURNAL = `{"iv":"L/aB6yFONnInkws56OHrcQ==","v":1,"iter":10000,"ks":128,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"US4EEfq0KyY=","ct":"5ObD/LRkIjIoM000R7Y2qyBDmsTktTPAUE2YQKWUvafGPH+Hr8uspzG2Ke/hxnCZgQ3pZFc64V+kubduOKlp8nc4mhzEgvY/EqKXTh/FDRyFpfSJm7duwjgC4qlFfh2BtB4j+4NfqTjPR95trkM0sD6fPS4rtEMfMEo5LbKHkW6rQon5kpIYeuG8Qqw="}`;

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
  // TODO: Ensure this does not make an API call
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
    const unencryptedBlob = getUnencryptedBlob(state);
    if (!password || !unencryptedBlob) {
      return;
    }
    // TODO: Do we need to handle the case where this doesn't work? I think it throws.
    const md = decrypt(password, unencryptedBlob);
    if (md) {
      dispatch(setJournalMarkdown(md));
    }
  };
};
const setEncryptedContents = contents => {
  return dispatch => {
    dispatch({ type: SET_UNENCRYPTED_BLOB, contents });
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
    // TODO: Initialize the journal with an entry for today/now.
    dropbox
      .filesUpload({ contents: DEFAULT_JOURNAL, path: JOURNAL_PATH })
      .then(file => {
        // TODO: Use the return value, if it includes the content. `file.fileBlob`?
        dispatch(setJournalMarkdown(DEFAULT_JOURNAL));
      })
      .catch(() => {
        // TODO: Handle errors
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
      .catch(reason => {
        // TOOD: Check to make sure the reason we failed was that the file does not exist.
        // TODO: Dispatch action saying that we're creating a journal
        dispatch(createJournalOnDropbox());
        // console.log("error", reason);
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

import Dropbox from "dropbox";
import { push } from "react-router-redux";
import { debounce } from "lodash";

import { getAsDataURI } from "./utils";
import { getMarkdown, getAuthToken } from "./accessors";
import {
  SET_FROM_MD,
  DELETE_ENTRY,
  EDIT_ENTRY,
  ADD_ENTRY,
  SET_DRAWER_VISIBILITY,
  DROPBOX_UPLOAD_COMPLETE,
  STARTING_DROPBOX_UPLOAD,
  LOGOUT
} from "./actionTypes";
import { DROPBOX_CLIENT_ID, AUTH_REDIRECT_URL } from "./constants";
import { downloadURI } from "./utils";

const JOURNAL_FILENAME = "journal.md";
const JOURNAL_PATH = `/${JOURNAL_FILENAME}`;

export const authenticateToDropbox = () => {
  return () => {
    const dropbox = new Dropbox({ clientId: DROPBOX_CLIENT_ID });
    window.location = dropbox.getAuthenticationUrl(AUTH_REDIRECT_URL);
    return;
  };
};
const getDropboxClient = state => {
  if (!getAuthToken(state)) {
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

const setJournalFromBlob = blob => {
  return (dispatch, getState) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", function() {
      dispatch({ type: SET_FROM_MD, md: reader.result });
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
const DEFAULT_JOURNAL = "## Journal";
export const createJournalOnDropbox = () => {
  return (dispatch, getState) => {
    const dropbox = getDropboxClient(getState());
    // TODO: Initialize the journal with an entry for today/now.
    dropbox
      .filesUpload({ contents: DEFAULT_JOURNAL, path: JOURNAL_PATH })
      .then(file => {
        dispatch({ type: SET_FROM_MD, md: DEFAULT_JOURNAL });
      })
      .catch(() => {
        // TODO: Handle errors
      });
  };
};

export const downloadJournal = () => {
  // TODO: Split this up into smaller actions
  return (dispatch, getState) => {
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

export const downloadMarkdown = () => {
  return (dispatch, getState) => {
    const md = getMarkdown(getState());
    downloadURI(getAsDataURI(md), JOURNAL_FILENAME);
  };
};

const _uploadToDropbox = (dispatch, getState) => {
  dispatch({ type: STARTING_DROPBOX_UPLOAD });
  const dropbox = getDropboxClient(getState());
  const md = getMarkdown(getState());
  dropbox
    .filesUpload({
      path: JOURNAL_PATH,
      contents: md,
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

export const deleteEntry = id => {
  return (dispatch, getProps) => {
    dispatch({ type: DELETE_ENTRY, id });
    dispatch(uploadToDropbox());
  };
};

export const updateEntry = (id, markdown) => {
  return (dispatch, getState) => {
    dispatch({
      type: EDIT_ENTRY,
      id,
      markdown
    });
    dispatch(debouncedUploadToDropbox());
  };
};

export const addEntry = () => {
  return (dispatch, getState) => {
    dispatch({ type: ADD_ENTRY });
    dispatch(debouncedUploadToDropbox());
  };
};

export const setDrawerVisibility = visible => {
  return { type: SET_DRAWER_VISIBILITY, value: visible };
};

export const logout = () => {
  return (dispatch, getState) => {
    dispatch({ type: LOGOUT });
    dispatch(setDrawerVisibility(false));
    dispatch(push("/login/"));
  };
};

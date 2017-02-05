import Dropbox from "dropbox";
import { getAsDataURI } from "./utils";
import { getMarkdown } from "./acessors";
import { SET_FROM_MD } from "./actionTypes";
import { debounce } from "lodash";
import { downloadURI } from "./utils";

const CLIENT_ID = "pc9cssrvvmgo4bp";
const AUTH_REDIRECT_URL = "http://localhost:3000/auth/";
const JOURNAL_FILENAME = "journal.md";
const JOURNAL_PATH = `/${JOURNAL_FILENAME}`;

export const authenticateToDropbox = () => {
  return () => {
    const dropbox = new Dropbox({ clientId: CLIENT_ID });
    window.location = dropbox.getAuthenticationUrl(AUTH_REDIRECT_URL);
    return;
  };
};
const getDropboxClient = state => {
  if (!state.dropbox.authToken) {
    // TODO: Consider redirect to login page
    authenticateToDropbox();
  }
  // TODO: Ensure this does not make an API call
  const dropbox = new Dropbox({
    clientId: CLIENT_ID,
    accessToken: state.dropbox.authToken
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
export const createJournalOnDropbox = () => {
  return (dispatch, getState) => {
    const dropbox = getDropboxClient(getState());
    dropbox
      .filesUpload({ contents: "## Journal", path: JOURNAL_PATH })
      .then(file => {
        // TODO: Dispatch an action that populates the Journal from the data we already have
        dispatch(actuallyDownloadJournal());
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
  dispatch({ type: "STARTING_DROPBOX_UPLOAD" });
  const dropbox = getDropboxClient(getState());
  const md = getMarkdown(getState());
  dropbox
    .filesUpload({
      path: JOURNAL_PATH,
      contents: md,
      // Don't notify the user every time.
      mute: true,
      mode: { ".tag": "overwrite" }
    })
    .then(result => {
      dispatch({ type: "DROPBOX_UPLOAD_COMPLETE" });
    })
    .catch(error => {
      // TODO: Handle the error case
      console.log({ error });
    });
};
export const uploadToDropbox = () => _uploadToDropbox;

const _debouncedUploadToDropbox = debounce(_uploadToDropbox, 5000);

export const debouncedUploadToDropbox = () => _debouncedUploadToDropbox;

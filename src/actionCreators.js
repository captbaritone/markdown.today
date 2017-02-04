import Dropbox from "dropbox";
import { getAsDataURI } from "./utils";
import { getMarkdown } from "./acessors";
import { SET_FROM_MD } from "./actionTypes";

const getDropboxClient = state => {
  const dropbox = new Dropbox({ clientId: "pc9cssrvvmgo4bp" });
  if (!state.dropbox.authToken) {
    window.location = dropbox.getAuthenticationUrl(
      "http://localhost:3000/auth/"
    );
    return;
  }
  dropbox.setAccessToken(state.dropbox.authToken);
  return dropbox;
};

const JOURNAL_PATH = "/journal.md";

export const downloadJournal = () => {
  // TODO: Split this up into smaller actions
  return (dispatch, getState) => {
    const dropbox = getDropboxClient(getState());
    dropbox
      .filesGetMetadata({ path: JOURNAL_PATH })
      .then(file => {
        dropbox.filesDownload({ path: JOURNAL_PATH }).then(file => {
          const reader = new FileReader();
          reader.addEventListener("loadend", function() {
            console.log(reader.result);
            dispatch({ type: SET_FROM_MD, md: reader.result });
          });
          reader.readAsText(file.fileBlob);
        });
      })
      .catch(reason => {
        dropbox.filesUpload({ contents: "## Journal", path: JOURNAL_PATH });
        console.log("error", reason);
      });
  };
};

export const downloadMarkdown = () => {
  return (dispatch, getState) => {
    const dropbox = getDropboxClient(getState());
    const md = getMarkdown(getState());
    // TODO: Force download
    console.log(getAsDataURI(md));
  };
};

export const uploadToDropbox = () => {
  return (dispatch, getState) => {
    const dropbox = getDropboxClient(getState());
    const md = getMarkdown(getState());
    dropbox
      .filesUpload({
        path: JOURNAL_PATH,
        contents: md,
        // TODO: Set this to true
        mute: false,
        mode: { ".tag": "overwrite" }
      })
      .then(result => {
        console.log({ result });
      })
      .catch(error => {
        console.log({ error });
      });
  };
};

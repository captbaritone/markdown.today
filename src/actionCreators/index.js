import { replace } from "react-router-redux";
import getTime from "date-fns/get_time";

import { getAsDataURI } from "../utils";
import { getMarkdown } from "../accessors";
import {
  DELETE_ENTRY,
  EDIT_ENTRY,
  ADD_ENTRY,
  SET_DRAWER_VISIBILITY,
  LOGOUT,
  SET_ENCRYPTION_PASSWORD,
  SHOW_CHANGE_PASSWORD,
  HIDE_CHANGE_PASSWORD,
  ADD_NOTIFICATION,
  RESOLVE_FIRST_NOTIFICATION
} from "../actionTypes";
import { downloadURI } from "../utils";
import { uploadToDropbox, debouncedUploadToDropbox } from "./dropbox";

export {
  downloadJournal,
  uploadToDropbox,
  authenticateToDropbox,
  mockDropbox,
  attemptToDecryptJournal
} from "./dropbox";

const JOURNAL_FILENAME = "journal.md";

export const exportMarkdown = () => {
  return (dispatch, getState) => {
    const md = getMarkdown(getState());
    downloadURI(getAsDataURI(md), JOURNAL_FILENAME);
  };
};

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

export const editEntry = id => {
  return dispatch => {
    dispatch(replace(`/entry/${id}/edit`));
    // TODO: Find a way to focus the textarea.
  };
};
export const addEntry = () => {
  return (dispatch, getState) => {
    const date = getTime(new Date());
    const id = date;
    const markdown = "";
    dispatch({ type: ADD_ENTRY, date, id, markdown });
    dispatch(editEntry(id));
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
    dispatch(replace("/login/"));
  };
};

export const showChangePassword = () => ({ type: SHOW_CHANGE_PASSWORD });
export const hideChangePassword = () => {
  return dispatch => {
    dispatch({ type: HIDE_CHANGE_PASSWORD });
    //dispatch(setDrawerVisibility(false));
  };
};
export const addNotification = notification => ({
  type: ADD_NOTIFICATION,
  notification
});

export const resolveFirstNotification = () => ({
  type: RESOLVE_FIRST_NOTIFICATION
});
export const setEncryptionPassword = password => ({
  type: SET_ENCRYPTION_PASSWORD,
  password
});
export const updateEncryptionPassword = password => {
  return dispatch => {
    dispatch(setEncryptionPassword(password));
    dispatch(addNotification("Encryption password updated"));
    dispatch(uploadToDropbox());
    // TODO: Some kind of confirmation maybe?
  };
};
export const toggleEncryption = () => {
  return (dispatch, getState) => {};
};

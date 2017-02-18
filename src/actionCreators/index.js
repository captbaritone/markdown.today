// ?
import { replace } from "react-router-redux";

import { getAsDataURI } from "../utils";
import { getMarkdown } from "../accessors";
import {
  DELETE_ENTRY,
  EDIT_ENTRY,
  ADD_ENTRY,
  SET_DRAWER_VISIBILITY,
  LOGOUT
} from "../actionTypes";
import { downloadURI } from "../utils";
import { uploadToDropbox, debouncedUploadToDropbox } from "./dropbox";

export {
  downloadJournal,
  uploadToDropbox,
  authenticateToDropbox,
  mockDropbox
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
    dispatch(replace("/login/"));
  };
};

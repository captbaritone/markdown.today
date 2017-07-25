import { replace, push } from "react-router-redux";

import {
  SET_DRAWER_VISIBILITY,
  LOGOUT,
  SHOW_CHANGE_PASSWORD,
  HIDE_CHANGE_PASSWORD,
  SHOW_SET_PASSWORD,
  HIDE_SET_PASSWORD,
  SHOW_REMOVE_PASSWORD,
  HIDE_REMOVE_PASSWORD,
  ADD_NOTIFICATION,
  RESOLVE_FIRST_NOTIFICATION,
  TOGGLE_DRAWER,
  SHOW_SEARCH_INPUT,
  HIDE_SEARCH_INPUT,
  SET_SEARCH_QUERY
} from "../actionTypes";

export {
  downloadJournal,
  uploadToDropbox,
  authenticateToDropbox,
  mockDropbox,
  attemptToDecryptJournal,
  setAuthToken
} from "./dropbox";

export {
  setEncryptionPassword,
  changeEncryptionPassword,
  removeEncryption
} from "./encryption";

export {
  addEntry,
  deleteEntry,
  updateEntry,
  viewEntry,
  exportMarkdown,
  addEntryForToday,
  editEntriesForDay,
  setEntryDate
} from "./journal";

export const editEntry = id => {
  return dispatch => {
    dispatch(replace(`/journal/entry/${id}/edit`));
  };
};

export const goHome = () => push(`/journal/`);

export const setDrawerVisibility = visible => {
  return { type: SET_DRAWER_VISIBILITY, value: visible };
};

export const toggleDrawer = () => ({ type: TOGGLE_DRAWER });

export const logout = () => {
  return (dispatch, getState) => {
    dispatch({ type: LOGOUT });
    dispatch(setDrawerVisibility(false));
    dispatch(replace("/"));
  };
};

export const readAbout = () => {
  // Use a thunk here so that the rest of the app does not expect an action object
  return () =>
    (window.location = "https://github.com/captbaritone/markdown-journal");
};

export const showChangePassword = () => ({ type: SHOW_CHANGE_PASSWORD });
export const hideChangePassword = () => {
  return dispatch => {
    dispatch({ type: HIDE_CHANGE_PASSWORD });
    //dispatch(setDrawerVisibility(false));
  };
};
export const showSetPassword = () => ({ type: SHOW_SET_PASSWORD });
export const hideSetPassword = () => ({ type: HIDE_SET_PASSWORD });
export const showRemovePassword = () => ({ type: SHOW_REMOVE_PASSWORD });
export const hideRemovePassword = () => ({ type: HIDE_REMOVE_PASSWORD });
export const addNotification = notification => ({
  type: ADD_NOTIFICATION,
  notification
});

export const resolveFirstNotification = () => ({
  type: RESOLVE_FIRST_NOTIFICATION
});

export const showSearchInput = () => ({ type: SHOW_SEARCH_INPUT });
export const hideSearchInput = () => dispatch => {
  dispatch({ type: HIDE_SEARCH_INPUT });
  dispatch({ type: SET_SEARCH_QUERY, query: null });
};

import { replace } from "react-router-redux";

import {
  SET_DRAWER_VISIBILITY,
  LOGOUT,
  SHOW_CHANGE_PASSWORD,
  HIDE_CHANGE_PASSWORD,
  SHOW_SET_PASSWORD,
  HIDE_SET_PASSWORD,
  ADD_NOTIFICATION,
  RESOLVE_FIRST_NOTIFICATION,
  TOGGLE_DRAWER
} from "../actionTypes";

export {
  downloadJournal,
  uploadToDropbox,
  authenticateToDropbox,
  mockDropbox,
  attemptToDecryptJournal
} from "./dropbox";

export { setEncryptionPassword, updateEncryptionPassword } from "./encryption";

export { addEntry, deleteEntry, updateEntry, exportMarkdown } from "./journal";

export const editEntry = id => {
  return dispatch => {
    dispatch(replace(`/entry/${id}/edit`));
  };
};

export const setDrawerVisibility = visible => {
  return { type: SET_DRAWER_VISIBILITY, value: visible };
};

export const toggleDrawer = () => ({ type: TOGGLE_DRAWER });

export const logout = () => {
  return (dispatch, getState) => {
    dispatch({ type: LOGOUT });
    dispatch(setDrawerVisibility(false));
    dispatch(replace("/login/"));
  };
};

export const readAbout = () => {
  window.location = "https://github.com/captbaritone/markdown-journal";
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
export const addNotification = notification => ({
  type: ADD_NOTIFICATION,
  notification
});

export const resolveFirstNotification = () => ({
  type: RESOLVE_FIRST_NOTIFICATION
});

import { REHYDRATE } from "redux-persist/constants";
import { routerReducer } from "react-router-redux";
import { entriesFromMarkdown } from "./utils";
import getTime from "date-fns/get_time";
import { combineReducers } from "redux";
import { max, keys } from "lodash";
import {
  SET_FROM_MD,
  EDIT_ENTRY,
  DELETE_ENTRY,
  ADD_ENTRY,
  TOGGLE_DRAWER,
  SET_DRAWER_VISIBILITY
} from "./actionTypes";

const defaultDropboxSate = { authToken: null, uploading: false };

const dropboxReducer = (state = defaultDropboxSate, action) => {
  switch (action.type) {
    case "SET_AUTH_TOKEN":
      return Object.assign({}, state, { authToken: action.token });
    case "LOGOUT":
      return Object.assign({}, state, { authToken: null });
    case "STARTING_DROPBOX_UPLOAD":
      return Object.assign({}, state, { uploading: true });
    case "DROPBOX_UPLOAD_COMPLETE":
      return Object.assign({}, state, { uploading: false });
    case REHYDRATE:
      debugger;
      if (state.authToken) {
        // We don't want to clobber an existing authtoken
        return state;
      }
      return Object.assign({}, state, action.payload.dropbox);
    default:
      return state;
  }
};

const journalReducer = (previousState = null, action) => {
  // TODO: Handle Journal title, and open the door to other meta-data like `path`
  // First step might be ensuring all entry access is done via an accessor
  switch (action.type) {
    case SET_FROM_MD:
      return entriesFromMarkdown(action.md);
    case EDIT_ENTRY:
      return Object.assign({}, previousState, {
        [action.id]: Object.assign({}, previousState[action.id], {
          markdown: action.markdown
        })
      });
    case DELETE_ENTRY:
      const newState = Object.assign({}, previousState);
      delete newState[action.id];
      return newState;
    case ADD_ENTRY:
      const newId = max(keys(previousState)) + 1;
      const newEntry = { id: newId, date: getTime(new Date()), markdown: "" };
      // FIXME
      return Object.assign({}, previousState, { [newEntry.id]: newEntry });
    default:
      return previousState;
  }
};

const defaultViewState = { showDrawer: false };

const viewReducer = (previousState = defaultViewState, action) => {
  switch (action.type) {
    case TOGGLE_DRAWER:
      return Object.assign({}, previousState, {
        showDrawer: !previousState.showDrawer
      });
    case SET_DRAWER_VISIBILITY:
      return Object.assign({}, previousState, {
        showDrawer: action.value
      });
    default:
      return previousState;
  }
};

export default combineReducers({
  journal: journalReducer,
  view: viewReducer,
  dropbox: dropboxReducer,
  routing: routerReducer
});

import { combineReducers } from "redux";

import { entriesFromMarkdown } from "../utils";
import {
  SET_FROM_MD,
  EDIT_ENTRY,
  DELETE_ENTRY,
  ADD_ENTRY,
  LOGOUT,
  SET_ENCRYPTION_PASSWORD,
  SET_UNENCRYPTED_BLOB
} from "../actionTypes";

const defaultEncryptionState = { password: null, enencryptedBlob: null };
const encryption = (state = defaultEncryptionState, action) => {
  switch (action.type) {
    case SET_ENCRYPTION_PASSWORD:
      return Object.assign({}, state, { password: action.password });
    case SET_UNENCRYPTED_BLOB:
      return Object.assign({}, state, {
        unencryptedBlob: action.contents
      });
    case LOGOUT:
      return null;
    default:
      return state;

  }
};

const entries = (previousState = null, action) => {
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
      const newEntry = {
        id: action.id,
        date: action.date,
        markdown: action.markdown
      };
      return Object.assign({}, previousState, { [newEntry.id]: newEntry });
    case LOGOUT:
      return {};
    default:
      return previousState;
  }
};

const journal = combineReducers({
  entries,
  encryption
});
export default journal;

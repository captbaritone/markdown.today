// @flow

import type { CombinedReducer } from "redux";
import { combineReducers } from "redux";
import invariant from "invariant";
import { entriesFromMarkdown } from "../utils";
import type { ActionType } from "../actionTypes";

export type Encryption = {
  password: ?string,
  encryptedBlob: ?string
};

const defaultEncryptionState = { password: null, encryptedBlob: null };
const encryption = (
  state = defaultEncryptionState,
  action: ActionType
): Encryption => {
  switch (action.type) {
    case "SET_ENCRYPTION_PASSWORD":
      return Object.assign({}, state, { password: action.password });
    case "SET_ENCRYPTED_BLOB":
      return Object.assign({}, state, {
        encryptedBlob: action.contents
      });
    case "LOGOUT":
      return defaultEncryptionState;
    default:
      return state;
  }
};

export type Entry = {|
  // TODO: Ensure this matches the key
  +id: number,
  +date: number,
  +markdown: string
|};

export type Entries = {
  +[string]: Entry
};

const entries = (previousState = null, action: ActionType): ?Entries => {
  // TODO: Handle Journal title, and open the door to other meta-data like `path`
  // First step might be ensuring all entry access is done via an accessor
  switch (action.type) {
    case "SET_FROM_MD":
      return entriesFromMarkdown(action.md);
    case "EDIT_ENTRY":
      invariant(previousState !== null);
      return Object.assign({}, previousState, {
        [action.id]: Object.assign({}, previousState[action.id], {
          markdown: action.markdown
        })
      });
    case "DELETE_ENTRY":
      // TODO: Consider copying to a "trash" to enable "undelete".
      const newState = Object.assign({}, previousState);
      delete newState[action.id];
      return newState;
    case "ADD_ENTRY":
      const newEntry = {
        id: action.id,
        date: action.date,
        markdown: action.markdown
      };
      return Object.assign({}, previousState, { [newEntry.id]: newEntry });
    case "SET_ENTRY_DATE":
      invariant(previousState !== null);
      const originalEntry = previousState[action.id];
      const entryWithNewDate = Object.assign({}, originalEntry, {
        date: action.date
      });
      return Object.assign({}, previousState, {
        [action.id]: entryWithNewDate
      });
    case "LOGOUT":
      return null;
    default:
      return previousState;
  }
};

export type JournalState = {
  entries: ?Entries,
  encryption: Encryption
};

const journal: CombinedReducer<JournalState, ActionType> = combineReducers({
  entries,
  encryption
});
export default journal;

// @flow

import type { ActionType } from "../actionTypes";

export type DropboxState = {
  +authToken: ?string,
  +uploading: boolean,
  +mock: boolean,
  +dirty: boolean,
  +triedStashingDecoder: boolean
};

const defaultDropboxSate = {
  authToken: null,
  uploading: false,
  mock: false,
  dirty: false,
  triedStashingDecoder: false
};

const dropbox = (
  state: DropboxState = defaultDropboxSate,
  action: ActionType
): DropboxState => {
  switch (action.type) {
    case "SET_AUTH_TOKEN":
      return Object.assign({}, state, { authToken: action.token });
    case "LOGOUT":
      return Object.assign({}, state, { authToken: null, mock: false });
    case "STARTING_DROPBOX_UPLOAD":
      return Object.assign({}, state, { uploading: true });
    case "DROPBOX_UPLOAD_COMPLETE":
      return Object.assign({}, state, {
        uploading: false,
        dirty: false
      });
    case "MARK_JOURNAL_DIRTY":
      // TODO: Find a more robust way to know when we are dirty.
      return Object.assign({}, state, { dirty: true });
    case "MOCK_DROPBOX":
      return Object.assign({}, state, { mock: true });
    case "TRYING_TO_STASH_DECODER":
      return Object.assign({}, state, { triedStashingDecoder: true });
    default:
      return state;
  }
};

export default dropbox;

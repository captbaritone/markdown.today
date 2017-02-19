import {
  DROPBOX_UPLOAD_COMPLETE,
  STARTING_DROPBOX_UPLOAD,
  LOGOUT,
  SET_AUTH_TOKEN,
  MOCK_DROPBOX,
  SET_FROM_MD,
  EDIT_ENTRY,
  DELETE_ENTRY,
  ADD_ENTRY
} from "../actionTypes";

const defaultDropboxSate = {
  authToken: null,
  uploading: false,
  mock: false,
  dirty: false
};

const dropbox = (state = defaultDropboxSate, action) => {
  switch (action.type) {
    case SET_AUTH_TOKEN:
      return Object.assign({}, state, { authToken: action.token });
    case LOGOUT:
      return Object.assign({}, state, { authToken: null, mock: false });
    case STARTING_DROPBOX_UPLOAD:
      return Object.assign({}, state, { uploading: true });
    case DROPBOX_UPLOAD_COMPLETE:
      return Object.assign({}, state, {
        uploading: false,
        dirty: false
      });
    case SET_FROM_MD:
    case EDIT_ENTRY:
    case DELETE_ENTRY:
    case ADD_ENTRY:
      // TODO: Find a more robust way to know when we are dirty.
      return Object.assign({}, state, { dirty: true });
    case MOCK_DROPBOX:
      return Object.assign({}, state, { mock: true });
    default:
      return state;
  }
};

export default dropbox;

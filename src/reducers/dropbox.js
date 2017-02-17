import {
  DROPBOX_UPLOAD_COMPLETE,
  STARTING_DROPBOX_UPLOAD,
  LOGOUT,
  SET_AUTH_TOKEN,
  MOCK_DROPBOX
} from "../actionTypes";

const defaultDropboxSate = { authToken: null, uploading: false, mock: false };

const dropbox = (state = defaultDropboxSate, action) => {
  switch (action.type) {
    case SET_AUTH_TOKEN:
      return Object.assign({}, state, { authToken: action.token });
    case LOGOUT:
      return Object.assign({}, state, { authToken: null });
    case STARTING_DROPBOX_UPLOAD:
      return Object.assign({}, state, { uploading: true });
    case DROPBOX_UPLOAD_COMPLETE:
      return Object.assign({}, state, { uploading: false });
    case MOCK_DROPBOX:
      return Object.assign({}, state, { mock: true });
    default:
      return state;
  }
};

export default dropbox;

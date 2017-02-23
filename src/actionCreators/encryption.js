import { SET_ENCRYPTION_PASSWORD } from "../actionTypes";
import { uploadToDropbox } from "./dropbox";
import { addNotification } from "./";

export const setEncryptionPassword = password => ({
  type: SET_ENCRYPTION_PASSWORD,
  password
});
export const updateEncryptionPassword = password => {
  return dispatch => {
    dispatch(setEncryptionPassword(password));
    dispatch(addNotification("Encryption password updated"));
    dispatch(uploadToDropbox());
  };
};

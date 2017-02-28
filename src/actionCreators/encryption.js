import { SET_ENCRYPTION_PASSWORD } from "../actionTypes";
import { uploadToDropbox } from "./dropbox";
import { addNotification } from "./";

// Set the encryption password we want to use.
export const setEncryptionPassword = password => ({
  type: SET_ENCRYPTION_PASSWORD,
  password
});

export const changeEncryptionPassword = password => {
  return dispatch => {
    dispatch(setEncryptionPassword(password));
    dispatch(addNotification("Encryption password updated"));
    dispatch(uploadToDropbox());
  };
};

export const removeEncryption = changeEncryptionPassword.bind(null, null);

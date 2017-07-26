import { SET_ENCRYPTION_PASSWORD, SET_ENCRYPTED_BLOB } from "../actionTypes";
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
  };
};

export const removeEncryption = password => {
  return dispatch => {
    // TODO: Create new action type that does both of these.
    dispatch(setEncryptionPassword(null));
    dispatch({ type: SET_ENCRYPTED_BLOB, contents: null });
    dispatch(addNotification("Encryption removed"));
  };
};

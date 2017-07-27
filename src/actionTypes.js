// @flow
export type ActionType =
  | {| type: "SET_ENCRYPTION_PASSWORD", password: string |}
  | {| type: "SET_ENCRYPTED_BLOB", contents: string |}
  | {| type: "LOGOUT" |}
  | {| type: "SET_FROM_MD", md: string |}
  | {| type: "EDIT_ENTRY", id: number, markdown: string |}
  | {| type: "SET_ENTRY_DATE", id: number, date: number |}
  | {| type: "SET_SEARCH_QUERY", query: string |}
  | {| type: "ADD_NOTIFICATION", notification: string |}
  | {| type: "SET_AUTH_TOKEN", token: string |}
  | {| type: "STARTING_DROPBOX_UPLOAD" |}
  | {| type: "DROPBOX_UPLOAD_COMPLETE" |}
  | {| type: "MARK_JOURNAL_DIRTY" |}
  | {| type: "MOCK_DROPBOX" |}
  | {| type: "ADD_ENTRY", date: number, id: number, markdown: string |}
  | {| type: "DELETE_ENTRY", id: number |}
  | {| type: "LOGOUT" |};

export const SET_FROM_MD = "SET_FROM_MD";
export const EDIT_ENTRY = "EDIT_ENTRY";
export const DELETE_ENTRY = "DELETE_ENTRY";
export const ADD_ENTRY = "ADD_ENTRY";
export const TOGGLjjjjjjE_DRAWER = "TOGGLE_DRAWER";
export const SET_DRAWER_VISIBILITY = "SET_DRAWER_VISIBILITY";
export const DROPBOX_UPLOAD_COMPLETE = "DROPBOX_UPLOAD_COMPLETE";
export const STARTING_DROPBOX_UPLOAD = "STARTING_DROPBOX_UPLOAD";
export const SET_AUTH_TOKEN = "SET_AUTH_TOKEN";
export const LOGOUT = "LOGOUT";
export const MOCK_DROPBOX = "MOCK_DROPBOX";
export const SET_ENCRYPTION_PASSWORD = "SET_ENCRYPTION_PASSWORD";
export const SET_ENCRYPTED_BLOB = "SET_ENCRYPTED_BLOB";
export const SHOW_CHANGE_PASSWORD = "SHOW_CHANGE_PASSWORD";
export const HIDE_CHANGE_PASSWORD = "HIDE_CHANGE_PASSWORD";
export const SHOW_SET_PASSWORD = "SHOW_SET_PASSWORD";
export const HIDE_SET_PASSWORD = "HIDE_SET_PASSWORD";
export const SHOW_REMOVE_PASSWORD = "SHOW_REMOVE_PASSWORD";
export const HIDE_REMOVE_PASSWORD = "HIDE_REMOVE_PASSWORD";
export const ADD_NOTIFICATION = "ADD_NOTIFICATION";
export const RESOLVE_FIRST_NOTIFICATION = "RESOLVE_FIRST_NOTIFICATION";
export const SET_SEARCH_QUERY = "SET_SEARCH_QUERY";
export const SHOW_SEARCH_INPUT = "SHOW_SEARCH_INPUT";
export const HIDE_SEARCH_INPUT = "HIDE_SEARCH_INPUT";
export const SET_ENTRY_DATE = "SET_ENTRY_DATE";
export const MARK_JOURNAL_DIRTY = "MARK_JOURNAL_DIRTY";

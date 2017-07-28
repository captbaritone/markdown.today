// @flow

import type { DropboxState } from "./dropbox";
import type { JournalState } from "./journal";
import type { ViewState } from "./view";

import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";

import dropbox from "./dropbox";
import journal from "./journal";
import view from "./view";

export type AppState = {
  +dropbox: DropboxState,
  +journal: JournalState,
  +view: ViewState
};

export default combineReducers({
  journal,
  view,
  dropbox,
  routing: routerReducer
});

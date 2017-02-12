import { routerReducer } from "react-router-redux";
import { combineReducers } from "redux";

import dropbox from "./dropbox";
import journal from "./journal";
import view from "./view";

export default combineReducers({
  journal,
  view,
  dropbox,
  routing: routerReducer
});

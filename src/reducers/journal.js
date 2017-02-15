import getTime from "date-fns/get_time";
import { max, keys } from "lodash";

import { entriesFromMarkdown } from "../utils";
import {
  SET_FROM_MD,
  EDIT_ENTRY,
  DELETE_ENTRY,
  ADD_ENTRY,
  LOGOUT
} from "../actionTypes";

const journal = (previousState = null, action) => {
  // TODO: Handle Journal title, and open the door to other meta-data like `path`
  // First step might be ensuring all entry access is done via an accessor
  switch (action.type) {
    case SET_FROM_MD:
      return entriesFromMarkdown(action.md);
    case EDIT_ENTRY:
      return Object.assign({}, previousState, {
        [action.id]: Object.assign({}, previousState[action.id], {
          markdown: action.markdown
        })
      });
    case DELETE_ENTRY:
      const newState = Object.assign({}, previousState);
      delete newState[action.id];
      return newState;
    case ADD_ENTRY:
      const newId = max(keys(previousState)) + 1;
      const newEntry = { id: newId, date: getTime(new Date()), markdown: "" };
      // FIXME
      return Object.assign({}, previousState, { [newEntry.id]: newEntry });
    case LOGOUT:
      return {};
    default:
      return previousState;
  }
};

export default journal;

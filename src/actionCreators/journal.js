import { push } from "react-router-redux";
import getTime from "date-fns/get_time";
import format from "date-fns/format";

import { getAsDataURI } from "../utils";
import { getMarkdown, getEntriesForDay } from "../accessors";
import {
  DELETE_ENTRY,
  EDIT_ENTRY,
  ADD_ENTRY,
  SET_ENTRY_DATE
} from "../actionTypes";

import { downloadURI } from "../utils";
import { editEntry, addNotification } from "./";

const JOURNAL_FILENAME = "journal.md";

export const addEntry = dateObj => {
  return (dispatch, getState) => {
    const date = getTime(dateObj);
    const id = date;
    const markdown = "";
    dispatch({ type: ADD_ENTRY, date, id, markdown });
    dispatch(editEntry(id));
  };
};

export const addEntryForToday = () => {
  return addEntry(new Date());
};

export const editEntriesForDay = date => {
  return (dispatch, getState) => {
    const entries = getEntriesForDay(getState(), date);
    if (entries.length === 0) {
      dispatch(addEntry(date));
    } else if (entries.length === 1) {
      dispatch(editEntry(entries[0].id));
    } else {
      alert("Whoops. There are more than one entires for this date.");
    }
  };
};

export const deleteEntry = id => {
  return (dispatch, getProps) => {
    dispatch({ type: DELETE_ENTRY, id });
    dispatch(addNotification("Entry deleted."));
  };
};

export const updateEntry = (id, markdown) => {
  return (dispatch, getState) => {
    dispatch({ type: EDIT_ENTRY, id, markdown });
  };
};

export const exportMarkdown = () => {
  return (dispatch, getState) => {
    const md = getMarkdown(getState());
    downloadURI(getAsDataURI(md), JOURNAL_FILENAME);
  };
};

export const viewEntry = id => push(`/journal/entry/${id}`);

export const setEntryDate = (id, date) => {
  return (dispatch, getState) => {
    dispatch({ type: SET_ENTRY_DATE, id, date });
    dispatch(
      addNotification(
        `Updated entry date to: ${format(date, "MMM. Do, YYYY")}.`
      )
    );
  };
};

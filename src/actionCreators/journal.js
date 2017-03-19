import { push } from "react-router-redux";
import getTime from "date-fns/get_time";

import { getAsDataURI } from "../utils";
import { getMarkdown } from "../accessors";
import { DELETE_ENTRY, EDIT_ENTRY, ADD_ENTRY } from "../actionTypes";

import { downloadURI } from "../utils";
import { uploadToDropbox, debouncedUploadToDropbox } from "./dropbox";
import { editEntry, addNotification } from "./";

const JOURNAL_FILENAME = "journal.md";

export const addEntry = () => {
  return (dispatch, getState) => {
    const date = getTime(new Date());
    const id = date;
    const markdown = "";
    dispatch({ type: ADD_ENTRY, date, id, markdown });
    dispatch(editEntry(id));
    dispatch(debouncedUploadToDropbox());
  };
};

export const deleteEntry = id => {
  return (dispatch, getProps) => {
    dispatch({ type: DELETE_ENTRY, id });
    dispatch(uploadToDropbox());
    dispatch(addNotification("Entry deleted."));
  };
};

export const updateEntry = (id, markdown) => {
  return (dispatch, getState) => {
    dispatch({ type: EDIT_ENTRY, id, markdown });
    dispatch(debouncedUploadToDropbox());
  };
};

export const exportMarkdown = () => {
  return (dispatch, getState) => {
    const md = getMarkdown(getState());
    downloadURI(getAsDataURI(md), JOURNAL_FILENAME);
  };
};

export const viewEntry = id => push(`/journal/entry/${id}`);

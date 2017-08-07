// @flow

import type { AppState } from "./reducers";
import type { Entries } from "./reducers/journal";

import { encrypt } from "sjcl";
import isSameDay from "date-fns/is_same_day";
import { filter, map, sortBy, get, first } from "lodash";

export const getAuthToken = (state: AppState) => state.dropbox.authToken;

export const getJournal = (state: AppState) => state.journal;
export const getEntries = (state: AppState) => state.journal.entries;

export const journalIsLoading = (state: AppState) => getEntries(state) === null;

export const getEntriesAsArray = (entries: ?Entries) => {
  return entries && sortBy(map(entries), "date").reverse();
};

export const getJournalAsArray = (state: AppState) => {
  return getEntriesAsArray(getEntries(state));
};

export const getEntryById = (state: AppState, id: number) =>
  get(getEntries(state), id, null);

export const getEntriesForDay = (state: AppState, date: number) =>
  filter(getEntries(state), entry => isSameDay(date, entry.date));

let lastState = null;
let lastQuery: ?string = null;
let cache = null;
export const getEntriesContainingString = (state: AppState, query: ?string) => {
  // Map to convert object to array.
  let entries = map(getEntries(state));
  if (query == null) {
    return entries;
  }
  if (state === lastState) {
    if (query === lastQuery) {
      // Cool! We can use the same response we calculated last time.
      return cache;
    }
    if (lastQuery && query.startsWith(lastQuery)) {
      // We know these will be a subset of the last results, so let's start there.
      entries = cache;
    }
  }

  const lowerCaseQuery = query.toLowerCase();

  const result = query
    ? filter(entries, entry =>
        entry.markdown.toLowerCase().includes(lowerCaseQuery)
      )
    : entries;
  lastQuery = query;
  cache = result;
  lastState = state;
  return result;
};

const primaryHeading = str => {
  return `# ${str}`;
};
const secondaryHeading = str => {
  return `## ${str}`;
};
export const getMarkdown = (state: AppState) => {
  const entries = getJournalAsArray(state) || [];
  return entries
    .reduce(
      (acc, entry) => {
        return [
          ...acc,
          secondaryHeading(new Date(entry.date).toISOString()),
          entry.markdown
        ];
      },
      [primaryHeading("My Journal")]
    )
    .join("\n\n");
};

export const isLoggedIn = (state: AppState) =>
  !!getAuthToken(state) || state.dropbox.mock;
export const shouldShowChangePassword = (state: AppState) =>
  state.view.showChangePassword;
export const shouldShowSetPassword = (state: AppState) =>
  state.view.showSetPassword;
export const shouldShowRemovePassword = (state: AppState) =>
  state.view.showRemovePassword;
export const getEncryptionPassword = (state: AppState) =>
  state.journal.encryption.password;
export const isEncrypted = (state: AppState) => !!getEncryptionPassword(state);
export const getEncryptedBlob = (state: AppState) =>
  state.journal.encryption.encryptedBlob;
export const needsEncryptionPassword = (state: AppState) =>
  !!getEncryptedBlob(state) && !getEncryptionPassword(state);

export const getDropboxFileContents = (state: AppState) => {
  const md = getMarkdown(state);
  if (!isEncrypted(state)) {
    return md;
  }
  return encrypt(getEncryptionPassword(state), md);
};

export const dropboxIsMocked = (state: AppState): boolean => state.dropbox.mock;

export const nextNotification = (state: AppState) =>
  first(state.view.notifications);

export const shouldShowDrawer = (state: AppState) => state.view.showDrawer;
export const isUploading = (state: AppState) => state.dropbox.uploading;
export const isDirty = (state: AppState) => state.dropbox.dirty;

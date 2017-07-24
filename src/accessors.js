import { encrypt } from "sjcl";
import isSameDay from "date-fns/is_same_day";
import { filter, map, sortBy, get, first } from "lodash";

export const getAuthToken = state => state.dropbox.authToken;

export const getEntries = state => state.journal.entries;

export const getEntriesAsArray = entries => {
  return entries && sortBy(map(entries), "date").reverse();
};

export const getJournalAsArray = state => {
  return getEntriesAsArray(getEntries(state));
};

export const getEntryById = (state, id) => get(getEntries(state), id, null);

export const getEntriesForDay = (state, date) =>
  filter(getEntries(state), entry => isSameDay(date, entry.date));

let lastState = null;
let lastQuery = null;
let cache = null;
export const getEntriesContainingString = (state, query) => {
  // Map to convert object to array.
  let entries = map(getEntries(state));
  if (state === lastState) {
    if (query === lastQuery) {
      // Cool! We can use the same response we calculated last time.
      return cache;
    }
    if (query.startsWith(lastQuery)) {
      // We know these will be a subset of the last results, so let's start there.
      entries = cache;
    }
  }

  const result = query
    ? filter(entries, entry =>
        entry.markdown.toLowerCase().includes(query.toLowerCase())
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
export const getMarkdown = state => {
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

export const isLoggedIn = state => !!getAuthToken(state) || state.dropbox.mock;
export const shouldShowChangePassword = state => state.view.showChangePassword;
export const shouldShowSetPassword = state => state.view.showSetPassword;
export const shouldShowRemovePassword = state => state.view.showRemovePassword;
export const getEncryptionPassword = state => state.journal.encryption.password;
export const isEncrypted = state => !!getEncryptionPassword(state);
export const getEncryptedBlob = state => state.journal.encryption.encryptedBlob;
export const needsEncryptionPassword = state =>
  !!getEncryptedBlob(state) && !getEncryptionPassword(state);

export const getDropboxFileContents = state => {
  const md = getMarkdown(state);
  if (!isEncrypted(state)) {
    return md;
  }
  return encrypt(getEncryptionPassword(state), md);
};

export const nextNotification = state => first(state.view.notifications);

export const shouldShowDrawer = state => state.view.showDrawer;
export const isUploading = state => state.dropbox.uploading;
export const isDirty = state => state.dropbox.dirty;

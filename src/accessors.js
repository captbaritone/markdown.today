import { encrypt } from "sjcl";
import { map, sortBy, get } from "lodash";

export const getAuthToken = state => state.dropbox.authToken;

// TODO: Reanme to getEntries
export const getJournal = state => state.journal.entries;

export const getJournalAsArray = state => {
  return getJournal(state) && sortBy(map(getJournal(state)), "date").reverse();
};
export const getEntryById = (state, id) => get(getJournal(state), id, null);

const primaryHeading = str => {
  return `# ${str}`;
};
const secondaryHeading = str => {
  return `## ${str}`;
};
export const getMarkdown = state => {
  return getJournalAsArray(state)
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
export const shouldShowSettings = state => state.view.showSettings;
export const getEncryptionPassword = state => state.journal.encryption.password;
export const isEncrypted = state => !!getEncryptionPassword(state);
export const getUnencryptedBlob = state =>
  state.journal.encryption.unencryptedBlob;
export const needsEncryptionPassword = state =>
  !!getUnencryptedBlob(state) && !getEncryptionPassword(state);

export const getDropboxFileContents = state => {
  const md = getMarkdown(state);
  if (!isEncrypted(state)) {
    return md;
  }
  return encrypt(getEncryptionPassword(state), md);
};

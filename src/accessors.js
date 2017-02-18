import { map, sortBy, get } from "lodash";

export const getAuthToken = state => state.dropbox.authToken;

export const getJournal = state => state.journal;

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

export const isLoggedIn = state => !!getAuthToken(state) || state.dropbo.mock;

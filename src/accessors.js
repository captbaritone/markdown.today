import { map, sortBy } from "lodash";

export const getAuthToken = state => state.dropbox.authToken;

export const getJournal = state => state.journal;

export const getJournalAsArray = state => {
  return getJournal(state) && sortBy(map(getJournal(state)), "date").reverse();
};

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

export const isLoggedIn = state => !!getAuthToken(state);

import { sortByDate, formatTimestamp } from "./utils";

export const getJournalAsArray = state => {
  return state.journal &&
    Object.keys(state.journal).map(id => state.journal[id]).sort(sortByDate);
};

const primaryHeading = str => {
  return `# ${str}`;
};
const secondaryHeading = str => {
  return `## ${str}`;
};
export const getMarkdown = state => {
  return getJournalAsArray(state).reduce((acc, entry) => {
    return [
      ...acc,
      secondaryHeading(formatTimestamp(entry.date)),
      entry.markdown
    ];
  }, [ primaryHeading("My Journal") ]).join("\n\n");
};

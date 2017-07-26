import { getJournal } from "./accessors";
import { markJournalDirty, debouncedUploadToDropbox } from "./actionCreators";

// Watch for changes to the journal and write them to Dropbox.
const dropboxMiddleware = store => next => action => {
  const journal = getJournal(store.getState());
  const nextAction = next(action);
  const newJournal = getJournal(store.getState());

  if (newJournal !== journal) {
    store.dispatch(markJournalDirty());
    store.dispatch(debouncedUploadToDropbox());
  }

  return nextAction;
};

export default dropboxMiddleware;

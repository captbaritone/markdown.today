import { getJournal, journalIsLoading } from "./accessors";
import { markJournalDirty, debouncedUploadToDropbox } from "./actionCreators";

// Watch for changes to the journal and write them to Dropbox.
const dropboxMiddleware = store => next => action => {
  const journal = getJournal(store.getState());
  const wasLoaded = !journalIsLoading(store.getState());
  const nextAction = next(action);
  const newJournal = getJournal(store.getState());
  const isLoaded = !journalIsLoading(store.getState());
  const journalsDiffer = newJournal !== journal;

  if (isLoaded && journalsDiffer && wasLoaded) {
    store.dispatch(markJournalDirty());
    store.dispatch(debouncedUploadToDropbox());
  }

  return nextAction;
};

export default dropboxMiddleware;

import {
  getJournal,
  journalIsLoading,
  isLoggedIn,
  isEncrypted
} from "./accessors";
import {
  markJournalDirty,
  debouncedUploadToDropbox
  //stashDecoder
} from "./actionCreators";

// Watch for changes to the journal and write them to Dropbox.
const dropboxMiddleware = store => next => action => {
  const journal = getJournal(store.getState());
  const wasLoaded = !journalIsLoading(store.getState());
  const nextAction = next(action);

  const newState = store.getState();
  const newJournal = getJournal(newState);
  const isLoaded = !journalIsLoading(newState);
  const journalsDiffer = newJournal !== journal;

  if (isLoaded && journalsDiffer && wasLoaded) {
    store.dispatch(markJournalDirty());
    store.dispatch(debouncedUploadToDropbox());
  }

  if (
    !newState.dropbox.triedStashingDecoder &&
    isEncrypted(newState) &&
    isLoggedIn(newState)
  ) {
    //store.dispatch(stashDecoder());
  }

  return nextAction;
};

export default dropboxMiddleware;

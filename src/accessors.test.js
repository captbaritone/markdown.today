// @flow
import { getStore } from "./store";
import { getEntriesContainingString, getEntryById } from "./accessors";
describe("getEntriesContainingString", () => {
  it("returns an empty array for an empty state", () => {
    const store = getStore();
    const actual = getEntriesContainingString(store.getState(), "foo");
    const expected = [];
    expect(actual).toEqual(expected);
  });
  it("returns all entries for a null query", () => {
    const store = getStore();
    store.dispatch({
      type: "ADD_ENTRY",
      date: 1,
      id: 1,
      markdown: "Entry one foo"
    });
    const actual = getEntriesContainingString(store.getState(), null);
    const expected = [getEntryById(store.getState(), 1)];
    expect(actual).toEqual(expected);
  });
  it("returns all entries for an empty query", () => {
    const store = getStore();
    store.dispatch({
      type: "ADD_ENTRY",
      date: 1,
      id: 1,
      markdown: "Entry one foo"
    });
    const actual = getEntriesContainingString(store.getState(), "");
    const expected = [getEntryById(store.getState(), 1)];
    expect(actual).toEqual(expected);
  });
  it("returns entries containing a query", () => {
    const store = getStore();
    store.dispatch({
      type: "ADD_ENTRY",
      date: 1,
      id: 1,
      markdown: "Entry one foo"
    });
    store.dispatch({
      type: "ADD_ENTRY",
      date: 2,
      id: 2,
      markdown: "Entry two bar"
    });
    const actual = getEntriesContainingString(store.getState(), "foo");
    const expected = [getEntryById(store.getState(), 1)];
    expect(actual).toEqual(expected);
  });
  it("returns entries that match case insensitively", () => {
    const store = getStore();
    store.dispatch({
      type: "ADD_ENTRY",
      date: 1,
      id: 1,
      markdown: "Entry one FOO"
    });
    const actual = getEntriesContainingString(store.getState(), "foo");
    const expected = [getEntryById(store.getState(), 1)];
    expect(actual).toEqual(expected);
  });
});

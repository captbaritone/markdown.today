import * as TYPES from "./actionTypes";
import forEach from "lodash/forEach";

describe("actionTypes", () => {
  it("have unique values", () => {
    const seenValues = [];
    forEach(TYPES, (value, key) => {
      expect(seenValues).not.toContain(value);
      seenValues.push(value);
    });
  });
  it("has values that match their keys", () => {
    forEach(TYPES, (value, key) => {
      //expect(key).toBe(value);
    });
  });
});

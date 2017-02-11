import {
  entriesFromMarkdown,
  isISODatetime,
  extractISODatetime
} from "./utils";

describe("entriesFromMarkdown", () => {
  it("can parse a simple Journal", () => {
    const md = `## 2017-03-01T08:00:00.000Z`;
    expect(
      entriesFromMarkdown(md)
    ).toEqual({ "1": { date: 1488355200000, id: 1, markdown: "" } });
  });
  it("can parse a journal with a title", () => {
    const md = `# My Jouranl

## 2017-03-01T08:00:00.000Z`;
    expect(
      entriesFromMarkdown(md)
    ).toEqual({ "1": { date: 1488355200000, id: 1, markdown: "" } });
  });
  it("can parse a journal with a title", () => {
    const md = `# My Journal

## 2017-02-11T02:05:17.338Z

Hello!`;
    expect(
      entriesFromMarkdown(md)
    ).toEqual({ "1": { date: 1486778717338, id: 1, markdown: "Hello!" } });
  });
});

describe("isISODatetime", () => {
  it("matches some date strings", () => {
    expect(isISODatetime("2017-03-01T08:00:00.000Z")).toBe(true);
  });
  it("does not match strings which mearly contain date strings", () => {
    expect(isISODatetime("## 2017-03-01T08:00:00.000Z")).toBe(false);
  });
});

describe("extractISODatetime", () => {
  it("can pull out an entire string", () => {
    expect(
      extractISODatetime("2017-03-01T08:00:00.000Z")
    ).toBe("2017-03-01T08:00:00.000Z");
  });
  it("can pull an ISO date out of a title", () => {
    expect(
      extractISODatetime("## 2017-03-01T08:00:00.000Z")
    ).toBe("2017-03-01T08:00:00.000Z");
  });
  it("can pull an ISO date out of a portion of a title", () => {
    expect(
      extractISODatetime("## My Great Day (2017-03-01T08:00:00.000Z)")
    ).toBe("2017-03-01T08:00:00.000Z");
  });
});

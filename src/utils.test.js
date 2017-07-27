// @flow
import {
  entriesFromMarkdown,
  isISODatetime,
  extractISODatetime,
  fileIsEncrypted,
  getHeading
} from "./utils";

describe("entriesFromMarkdown", () => {
  it("can parse a simple Journal", () => {
    const md = `## 2017-03-01T08:00:00.000Z`;
    expect(entriesFromMarkdown(md)).toEqual({
      "1488355200000": { date: 1488355200000, id: 1488355200000, markdown: "" }
    });
  });
  it("can parse a journal with a title", () => {
    const md = `# My Jouranl

## 2017-03-01T08:00:00.000Z`;
    expect(entriesFromMarkdown(md)).toEqual({
      "1488355200000": { date: 1488355200000, id: 1488355200000, markdown: "" }
    });
  });
  it("can parse a journal with a title", () => {
    const md = `# My Journal

## 2017-02-11T02:05:17.338Z

Hello!`;
    expect(entriesFromMarkdown(md)).toEqual({
      "1486778717338": {
        date: 1486778717338,
        id: 1486778717338,
        markdown: "Hello!"
      }
    });
  });
  it("can parse a journal with a title and subheading", () => {
    const md = `# My Journal

## 2017-02-11T02:05:17.338Z

### Additional heading

Hello!`;
    expect(entriesFromMarkdown(md)).toEqual({
      "1486778717338": {
        date: 1486778717338,
        id: 1486778717338,
        markdown: `### Additional heading

Hello!`
      }
    });
  });
});

describe("isISODatetime", () => {
  it("matches some date strings", () => {
    expect(isISODatetime("2017-03-01T08:00:00.000Z")).toBe(true);
  });
  it("does not match strings which mearly contain date strings", () => {
    expect(isISODatetime("## 2017-03-01T08:00:00.000Z")).toBe(false);
  });
  it("matches simple ISO dates", () => {
    expect(isISODatetime("2017-03-01")).toBe(true);
  });
});

describe("extractISODatetime", () => {
  it("can pull out an entire string", () => {
    expect(extractISODatetime("2017-03-01T08:00:00.000Z")).toBe(
      "2017-03-01T08:00:00.000Z"
    );
  });
  it("can pull out a simple date", () => {
    expect(extractISODatetime("2017-03-01")).toBe("2017-03-01");
  });
  it("can pull an ISO date out of a title", () => {
    expect(extractISODatetime("## 2017-03-01T08:00:00.000Z")).toBe(
      "2017-03-01T08:00:00.000Z"
    );
  });
  it("can pull an ISO date out of a portion of a title", () => {
    expect(
      extractISODatetime("## My Great Day (2017-03-01T08:00:00.000Z)")
    ).toBe("2017-03-01T08:00:00.000Z");
  });
  it("can pull a simple ISO date out of a portion of a title", () => {
    expect(extractISODatetime("## My Great Day (2017-03-01)")).toBe(
      "2017-03-01"
    );
  });
});

describe("fileIsEncrypted", () => {
  it("Markdown is not encrypted", () => {
    expect(fileIsEncrypted("# My Journal")).toBe(false);
  });
  it("this JSON blob is encrypted", () => {
    expect(
      fileIsEncrypted(
        `{"iv":"IgRCizyiQsvV0hwzGYttcw==","v":1,"iter":10000,"ks":128,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"US4EEfq0KyY=","ct":"fVPT2gDG08IQI0L2POT/p2BE80BVGzxZnDVygHqm5szBAPu/htyGvh/cUAAdy5u4qV13apfz94OaTPKPE302+vuO11xZlLNrNFqYrFaVDQrb98TOM2Uz4+sWuyM4p+1QBANJpBZTVPheHaayF39+qiQ7rhT1duebDToFw0a0qp4qLWa6VDPEJ21VaXfcoQ=="}`
      )
    ).toBe(true);
  });
  it("Empty string is not encrypted", () => {
    expect(fileIsEncrypted("")).toBe(false);
  });
});

describe("getHeading", () => {
  it("Shows a heading for the first item", () => {
    expect(getHeading(undefined, "2017-02-01")).toBe("February 2017");
  });
  it("Shows no heading if dates are in the same month", () => {
    expect(getHeading("2017-02-20", "2017-02-01")).toBeNull();
  });
  it("Shows a heading if dates are in the same month but different years", () => {
    expect(getHeading("2016-02-20", "2017-02-01")).toBe("February 2017");
  });
});

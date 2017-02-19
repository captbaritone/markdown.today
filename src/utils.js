import parse from "date-fns/parse";
import getTime from "date-fns/get_time";
import format from "date-fns/format";
import { keyBy } from "lodash";

import { TITLE_DATE_FORMAT } from "./constants";

const ISO_DATETIME_REGEX = /\d{4}-[01]\d-[0-3]\d(T[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))?/;

export const isISODatetime = str => {
  return str.replace(ISO_DATETIME_REGEX, "") === "";
};

export const extractISODatetime = str => {
  const matches = str.match(ISO_DATETIME_REGEX);
  return matches ? matches[0] : null;
};

export const entriesFromMarkdown = md => {
  const lines = md.split("\n");
  // TOOD: Maybe make ids a hash of the title?
  const entries = lines.reduce(
    (acc, curr) => {
      const entry = acc[acc.length - 1];
      if (extractISODatetime(curr)) {
        const timestamp = getTime(parse(extractISODatetime(curr)));
        acc.push({
          id: timestamp,
          date: timestamp,
          markdown: ""
        });
      } else if (entry) {
        const entry = acc[acc.length - 1];
        entry.markdown += "\n" + curr;
      }
      return acc;
    },
    []
  );

  const trimmedEntries = entries.map(entry =>
    Object.assign({}, entry, { markdown: entry.markdown.trim() }));

  return keyBy(trimmedEntries, "id");
};
export const formatTimestamp = timestamp =>
  format(timestamp, TITLE_DATE_FORMAT);

export const getAsDataURI = text => {
  const base64 = window.btoa(text);
  return `data:text/text;base64,${base64}`;
};

export const fileIsEncrypted = contents => {
  try {
    // TODO: Come up with a more robust solution here.
    JSON.parse(contents);
    return true;
  } catch (err) {
    return false;
  }
};
export const downloadURI = (uri, name) => {
  // TODO: Test in Firefox/IE
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
};

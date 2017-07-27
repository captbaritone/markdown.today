// @flow
import type { Entries, Entry } from "./reducers/journal";
import parse from "date-fns/parse";
import getTime from "date-fns/get_time";
import format from "date-fns/format";
import isSameMonth from "date-fns/is_same_month";
import { keyBy } from "lodash";

import { TITLE_DATE_FORMAT } from "./constants";

const ISO_DATETIME_REGEX = /\d{4}-[01]\d-[0-3]\d(T[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))?/;

export const isISODatetime = (str: string) => {
  return str.replace(ISO_DATETIME_REGEX, "") === "";
};

export const extractISODatetime = (str: string): ?string => {
  const matches = str.match(ISO_DATETIME_REGEX);
  return matches ? matches[0] : null;
};

export const entriesFromMarkdown = (md: string): Entries => {
  const lines = md.split("\n");
  const entries = lines.reduce((acc, curr) => {
    const entry = acc[acc.length - 1];
    const dateString = extractISODatetime(curr);
    if (dateString != null) {
      const timestamp = getTime(parse(dateString));
      acc.push(
        ({
          id: timestamp,
          date: timestamp,
          markdown: ""
        }: Entry)
      );
    } else if (entry) {
      const entry = acc[acc.length - 1];
      entry.markdown += "\n" + curr;
    }
    return acc;
  }, []);

  const trimmedEntries = entries.map(entry =>
    Object.assign({}, entry, { markdown: entry.markdown.trim() })
  );

  return keyBy(trimmedEntries, "id");
};
export const formatTimestamp = (timestamp: number) =>
  format(timestamp, TITLE_DATE_FORMAT);

export const getAsDataURI = (text: string) => {
  const base64 = window.btoa(text);
  return `data:text/text;base64,${base64}`;
};

export const fileIsEncrypted = (contents: string) => {
  try {
    // TODO: Come up with a more robust solution here.
    JSON.parse(contents);
    return true;
  } catch (err) {
    return false;
  }
};
export const downloadURI = (uri: string, name: string) => {
  // TODO: Test in Firefox/IE
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  window.document.body.appendChild(link);
  link.click();
};

export const getHeading = (lastDate: ?string, date: string) => {
  if (lastDate && isSameMonth(lastDate, date)) {
    return null;
  }
  return format(date, "MMMM YYYY");
};

import parse from "date-fns/parse";
import getTime from "date-fns/get_time";
import { TITLE_DATE_FORMAT } from "./constants";
import format from "date-fns/format";

export const getEntryById = (state, id) => state.journal[id];

const indexById = arr => {
  return arr.reduce(
    (acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    },
    {}
  );
};

export const sortByDate = (a, b) => {
  if (a.date === b.date) {
    return 0;
  }
  return a.date > b.date ? -1 : 1;
};

export const entriesFromMarkdown = md => {
  const lines = md.split("\n");
  let nextId = 1;
  // TOOD: Maybe make ids a hash of the title?
  const entries = lines.reduce(
    (acc, curr) => {
      if (/^## \d{4}-\d{2}-\d{2}$/.test(curr)) {
        acc.push({
          id: nextId,
          date: getTime(parse(curr.match(/\d{4}-\d{2}-\d{2}/)[0])),
          markdown: ""
        });
        nextId++;
      } else {
        const entry = acc[acc.length - 1];
        entry.markdown += "\n" + curr;
      }
      return acc;
    },
    []
  );

  const trimmedEntries = entries.map(
    entry => Object.assign({}, entry, { markdown: entry.markdown.trim() })
  );

  return indexById(trimmedEntries);
};
export const formatTimestamp = timestamp =>
  format(timestamp, TITLE_DATE_FORMAT);

export const getAsDataURI = text => {
  const base64 = window.btoa(text);
  return `data:text/text;base64,${base64}`;
};

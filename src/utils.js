import parse from 'date-fns/parse';
import getTime from 'date-fns/get_time'

export const getEntryById = (state, id) => (
    state.journal[id]
);

const indexById = (arr) => {
    return arr.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
    }, {});
};

export const entriesFromMarkdown = (md) => {
    const lines = md.split('\n');
    let nextId = 1; // TOOD: Maybe make ids a hash of the title?
    const entries = lines.reduce((acc, curr) => {
        if (/^## \d{4}-\d{2}-\d{2}$/.test(curr)) {
            acc.push({
                id: nextId,
                date: getTime(parse(curr.match(/\d{4}-\d{2}-\d{2}/)[0])),
                markdown: ''
            });
            nextId++;
        } else {
            const entry = acc[acc.length -1];
            entry.markdown += '\n' + curr;
        }
        return acc;
    }, []);

    return indexById(entries);
};


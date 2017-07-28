// @flow
import type { AppState } from "../reducers";
import type { Entry } from "../reducers/journal";

import React from "react";
import { connect } from "react-redux";
import MenuItem from "material-ui/MenuItem";
import { grey400 } from "material-ui/styles/colors";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import Avatar from "material-ui/Avatar";
import { ListItem } from "material-ui/List";
import IconMenu from "material-ui/IconMenu";
import EventNote from "material-ui/svg-icons/notification/event-note";
import format from "date-fns/format";
import { deleteEntry, editEntry, viewEntry } from "../actionCreators";
import { getEntryById } from "../accessors";
import Highlighter from "react-highlight-words";

const iconButtonElement = (
  <IconButton touch={true} tooltipPosition="bottom-left">
    <MoreVertIcon color={grey400} />
  </IconButton>
);

type Props = {
  entry: Entry,
  editEntry: () => void,
  deleteEntry: () => void,
  viewEntry: () => void,
  searchQuery: string
};

const EntryListItem = ({
  entry,
  editEntry,
  deleteEntry,
  viewEntry,
  searchQuery
}: Props) =>
  <ListItem
    leftAvatar={<Avatar icon={<EventNote />} />}
    primaryText={format(entry.date, "dddd [the] Do, ha")}
    rightIconButton={
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem onTouchTap={editEntry}>Edit</MenuItem>
        <MenuItem onTouchTap={deleteEntry}>Delete</MenuItem>
      </IconMenu>
    }
    secondaryText={
      searchQuery
        ? <span>
            {/* Wrapping <span> is needed so Material-ui can inject style. */}
            {/* TODO: Trim the string so that you can always see the match. */}
            <Highlighter
              autoEscape={true}
              searchWords={[searchQuery]}
              textToHighlight={entry.markdown}
            />
          </span>
        : entry.markdown
    }
    secondaryTextLines={2}
    onTouchTap={viewEntry}
  />;

const mapStateToProps = (state: AppState, { id }) => ({
  entry: getEntryById(state, id),
  searchQuery: state.view.searchQuery
});

const mapDispatchToProps = (dispatch: *, { id }) => ({
  viewEntry: () => dispatch(viewEntry(id)),
  editEntry: () => dispatch(editEntry(id)),
  deleteEntry: () => dispatch(deleteEntry(id))
});
export default connect(mapStateToProps, mapDispatchToProps)(EntryListItem);

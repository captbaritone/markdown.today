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

const iconButtonElement = (
  <IconButton touch={true} tooltipPosition="bottom-left">
    <MoreVertIcon color={grey400} />
  </IconButton>
);

const EntryListItem = ({ entry, editEntry, deleteEntry, viewEntry }) => (
  <ListItem
    leftAvatar={<Avatar icon={<EventNote />} />}
    primaryText={format(entry.date, "dddd [the] Do, ha")}
    rightIconButton={
      (
        <IconMenu iconButtonElement={iconButtonElement}>
          <MenuItem onTouchTap={editEntry}>
            Edit
          </MenuItem>
          <MenuItem onTouchTap={deleteEntry}>
            Delete
          </MenuItem>
        </IconMenu>
      )
    }
    secondaryText={entry.markdown}
    secondaryTextLines={2}
    onTouchTap={viewEntry}
  />
);

const mapStateToProps = (state, { id }) => ({
  entry: getEntryById(state, id)
});

const mapDispatchToProps = (dispatch, { id }) => ({
  viewEntry: () => dispatch(viewEntry(id)),
  editEntry: () => dispatch(editEntry(id)),
  deleteEntry: () => dispatch(deleteEntry(id))
});
export default connect(mapStateToProps, mapDispatchToProps)(EntryListItem);

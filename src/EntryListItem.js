import React from "react";
import { push } from "react-router-redux";
import { connect } from "react-redux";
import MenuItem from "material-ui/MenuItem";
import { grey400 } from "material-ui/styles/colors";
import IconButton from "material-ui/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import Avatar from "material-ui/Avatar";
import { ListItem } from "material-ui/List";
import IconMenu from "material-ui/IconMenu";
import EditorInsertChart from "material-ui/svg-icons/editor/insert-chart";
import marked from "marked";
import { formatTimestamp } from "./utils";
import { deleteEntry } from "./actionCreators";

const iconButtonElement = (
  <IconButton touch={true} tooltip="more" tooltipPosition="bottom-left">
    <MoreVertIcon color={grey400} />
  </IconButton>
);

const EntryListItem = ({ entry, editEntry, deleteEntry, viewEntry }) => (
  <ListItem
    leftAvatar={<Avatar icon={<EditorInsertChart />} />}
    primaryText={formatTimestamp(entry.date)}
    rightIconButton={
      (
        <IconMenu iconButtonElement={iconButtonElement}>
          <MenuItem onTouchTap={editEntry(entry.id)}>
            Edit
          </MenuItem>
          <MenuItem onTouchTap={deleteEntry(entry.id)}>
            Delete
          </MenuItem>
        </IconMenu>
      )
    }
    secondaryText={
      <div dangerouslySetInnerHTML={{ __html: marked(entry.markdown) }} />
    }
    secondaryTextLines={2}
    onClick={viewEntry(entry.id)}
  />
);

const mapStateToProps = (state, ownProps) => ({
  entry: state.journal[ownProps.id]
});

const mapDispatchToProps = dispatch => ({
  viewEntry: id => () => dispatch(push(`entry/${id}`)),
  editEntry: id => () => dispatch(push(`entry/${id}/edit`)),
  deleteEntry: id => () => dispatch(deleteEntry(id))
});
export default connect(mapStateToProps, mapDispatchToProps)(EntryListItem);

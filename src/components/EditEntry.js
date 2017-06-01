import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import format from "date-fns/format";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import KeyboardArrowLeft from "material-ui/svg-icons/image/navigate-before";
import CircularProgress from "material-ui/CircularProgress";
import { getEntryById } from "../accessors";
import { updateEntry } from "../actionCreators";
import SavingProgress from "./SavingProgress";
import { deleteEntry, viewEntry } from "../actionCreators";

import MenuItem from "material-ui/MenuItem";
import IconMenu from "material-ui/IconMenu";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";

import Editor from "./Editor";

const iconButtonElement = (
  <IconButton touch={true}>
    <MoreVertIcon />
  </IconButton>
);

const EditEntry = ({
  title,
  goHome,
  viewEntry,
  deleteEntry,
  loaded,
  id,
  handleChange,
  markdown
}) => (
  <div>
    <AppBar
      titleStyle={{ textAlign: "center" }}
      title={title}
      iconElementLeft={
        <IconButton onClick={goHome}>
          <KeyboardArrowLeft />
        </IconButton>
      }
      iconElementRight={
        <IconMenu iconButtonElement={iconButtonElement}>
          <MenuItem onTouchTap={viewEntry}>
            View
          </MenuItem>
          <MenuItem onTouchTap={deleteEntry}>
            Delete
          </MenuItem>
        </IconMenu>
      }
    />
    <SavingProgress />
    {!loaded
      ? <div style={{ width: "100%", textAlign: "center", marginTop: "300px" }}>
          <CircularProgress size={80} thickness={5} />
        </div>
      : <Editor
          onChange={handleChange}
          content={markdown}
          placeholder="What happened today?"
        />}
  </div>
);

const mapStateToProps = (state, ownProps) => {
  const entry = getEntryById(state, ownProps.routeParams.id);
  return {
    // What if the entry was deleted?
    loaded: !!entry,
    title: entry && format(entry.date, "MMM. Do, YYYY"),
    markdown: entry && entry.markdown
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleChange: e =>
    dispatch(updateEntry(ownProps.routeParams.id, e.target.value)),
  goHome: () => dispatch(push("/journal/")),
  deleteEntry: () => {
    dispatch(deleteEntry(ownProps.routeParams.id));
    dispatch(push("/journal/"));
  },
  viewEntry: () => dispatch(viewEntry(ownProps.routeParams.id))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditEntry);

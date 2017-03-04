import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import AppBar from "material-ui/AppBar";
import TextField from "material-ui/TextField";
import IconButton from "material-ui/IconButton";
import KeyboardArrowLeft from "material-ui/svg-icons/image/navigate-before";
import CircularProgress from "material-ui/CircularProgress";
import { getEntryById } from "../accessors";
import { formatTimestamp } from "../utils";
import { updateEntry } from "../actionCreators";
import SavingProgress from "./SavingProgress";
import { deleteEntry } from "../actionCreators";

import MenuItem from "material-ui/MenuItem";
import IconMenu from "material-ui/IconMenu";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";

const iconButtonElement = (
  <IconButton touch={true}>
    <MoreVertIcon />
  </IconButton>
);

const EditEntry = (
  { title, goHome, deleteEntry, loaded, id, handleChange, markdown }
) => (
  <div>
    <AppBar
      title={title}
      iconElementLeft={
        (
          <IconButton onClick={goHome}>
            <KeyboardArrowLeft />
          </IconButton>
        )
      }
      iconElementRight={
        (
          <IconMenu iconButtonElement={iconButtonElement}>
            <MenuItem onTouchTap={deleteEntry}>
              Delete
            </MenuItem>
          </IconMenu>
        )
      }
    />
    <SavingProgress />
    {!loaded
      ? <div style={{ width: "100%", textAlign: "center", marginTop: "300px" }}>
          <CircularProgress size={80} thickness={5} />
        </div>
      : <TextField
          inputStyle={{
            fontSize: "18px",
            lineHeight: "24px"
          }}
          id={`${id}`}
          onChange={handleChange}
          fullWidth={true}
          multiLine={true}
          value={markdown}
          autoFocus
          placeholder="What happened today?"
        />}
  </div>
);

const mapStateToProps = (state, ownProps) => {
  const entry = getEntryById(state, ownProps.routeParams.id);
  return {
    // What if the entry was deleted?
    loaded: !!entry,
    title: entry && formatTimestamp(entry.date),
    markdown: entry && entry.markdown
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleChange: e =>
    dispatch(updateEntry(ownProps.routeParams.id, e.target.value)),
  goHome: () => dispatch(push("/")),
  deleteEntry: () => dispatch(deleteEntry(ownProps.id))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditEntry);

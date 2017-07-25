import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import format from "date-fns/format";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import KeyboardArrowLeft from "material-ui/svg-icons/image/navigate-before";
import DatePicker from "material-ui/DatePicker";
import muiThemeable from "material-ui/styles/muiThemeable";
import { getEntryById } from "../accessors";
import { updateEntry } from "../actionCreators";
import JournalContent from "./JournalContent";
import { deleteEntry, viewEntry, setEntryDate } from "../actionCreators";

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
  date,
  setEntryDate,
  handleChange,
  markdown,
  muiTheme
}) =>
  <div>
    <AppBar
      titleStyle={{ textAlign: "center" }}
      title={
        loaded
          ? <DatePicker
              id={`date-${id}`}
              value={new Date(date)}
              autoOk={true}
              formatDate={date => format(date, "MMM. Do, YYYY")}
              onChange={setEntryDate}
              inputStyle={{
                color: muiTheme.appBar.textColor,
                fontSize: "20px"
              } /* Note: This prop is undocumented. I think it gets passed to the underlying TextEditor */}
            />
          : "Loading..."
      }
      iconElementLeft={
        <IconButton onClick={goHome}>
          <KeyboardArrowLeft />
        </IconButton>
      }
      iconElementRight={
        <IconMenu iconButtonElement={iconButtonElement}>
          <MenuItem onTouchTap={viewEntry}>View</MenuItem>
          <MenuItem onTouchTap={deleteEntry}>Delete</MenuItem>
        </IconMenu>
      }
    />

    <JournalContent isLoading={!loaded}>
      {() =>
        <Editor
          id={`markdown-${id}`}
          onChange={handleChange}
          content={markdown}
          placeholder="What happened today?"
        />}
    </JournalContent>
  </div>;

const mapStateToProps = (state, ownProps) => {
  const entry = getEntryById(state, ownProps.routeParams.id);
  return {
    // What if the entry was deleted?
    loaded: !!entry,
    title: entry && format(entry.date, "MMM. Do, YYYY"),
    markdown: entry && entry.markdown,
    date: entry && entry.date
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
  viewEntry: () => dispatch(viewEntry(ownProps.routeParams.id)),
  setEntryDate: (e, date) => {
    dispatch(setEntryDate(ownProps.routeParams.id, Number(date)));
  }
});

export default muiThemeable()(
  connect(mapStateToProps, mapDispatchToProps)(EditEntry)
);

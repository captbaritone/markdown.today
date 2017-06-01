import React, { Component } from "react";
import { connect } from "react-redux";
import AddBox from "material-ui/svg-icons/content/add-box";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import InfiniteCalendar, {
  Calendar,
  defaultMultipleDateInterpolation,
  withMultipleDates
} from "react-infinite-calendar";
import "react-infinite-calendar/styles.css"; // only needs to be imported once

import { getJournalAsArray } from "../accessors";
import {
  addEntry,
  addEntryForToday,
  toggleDrawer,
  editEntriesForDay
} from "../actionCreators";
import JournalContent from "./JournalContent";

const MultipleDatesCalendar = withMultipleDates(Calendar);

class Journal extends Component {
  render() {
    return (
      <div>
        <AppBar
          title={"Markdown Today"}
          titleStyle={{ textAlign: "center" }}
          onLeftIconButtonTouchTap={this.props.toggleDrawer}
          iconElementRight={
            <IconButton tooltip="New" onTouchTap={this.props.addEntryForToday}>
              <AddBox />
            </IconButton>
          }
        />
        <JournalContent isLoading={!this.props.entries}>
          {() => (
            <InfiniteCalendar
              width="100%"
              Component={MultipleDatesCalendar}
              interpolateSelection={defaultMultipleDateInterpolation}
              selected={this.props.entries.map(entry => new Date(entry.date))}
              displayOptions={{
                showHeader: false
              }}
              onSelect={this.props.editEntriesForDay}
            />
          )}
        </JournalContent>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  entries: getJournalAsArray(state),
  // TODO: Move to acessor
  showDrawer: state.view.showDrawer
});

export default connect(mapStateToProps, {
  addEntry,
  addEntryForToday,
  toggleDrawer,
  editEntriesForDay
})(Journal);

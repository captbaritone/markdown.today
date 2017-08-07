import React, { Component } from "react";
import { compose } from "redux";
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
import muiThemeable from "material-ui/styles/muiThemeable";

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
    const { palette } = this.props.muiTheme;
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
          {() =>
            <InfiniteCalendar
              width="100%"
              height={window.innerHeight - 64 - 49}
              Component={MultipleDatesCalendar}
              interpolateSelection={defaultMultipleDateInterpolation}
              selected={this.props.entries.map(entry => new Date(entry.date))}
              displayOptions={{
                showHeader: false
              }}
              onSelect={this.props.editEntriesForDay}
              theme={{
                floatingNav: {
                  chevron: palette.alternateTextColor,
                  color: palette.alternateTextColor,
                  background: palette.textColor
                },
                selectionColor: palette.primary1Color,
                textColor: {
                  active: palette.alternateTextColor,
                  default: palette.textColor
                },
                todayColor: palette.primary1Color,
                weekdayColor: palette.primary1Color
              }}
            />}
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

const enhance = compose(
  connect(mapStateToProps, {
    addEntry,
    addEntryForToday,
    toggleDrawer,
    editEntriesForDay
  }),
  muiThemeable()
);

export default enhance(Journal);

import React, { Component } from "react";
import { connect } from "react-redux";
import AddBox from "material-ui/svg-icons/content/add-box";
import { List } from "material-ui/List";
import AppBar from "material-ui/AppBar";
import Divider from "material-ui/Divider";
import IconButton from "material-ui/IconButton";
import Subheader from "material-ui/Subheader";

import { getJournalAsArray } from "../accessors";
import { addEntryForToday, toggleDrawer } from "../actionCreators";
import EntryListItem from "./EntryListItem";
import JournalContent from "./JournalContent";
import { getHeading } from "../utils";

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
            <List>
              {this.props.entries.reduce((memo, entry, i, entries) => {
                const previous = entries[i - 1];
                const previousDate = previous && previous.date;
                return memo.concat([
                  <Subheader key={`heading-${entry.id}`}>
                    {getHeading(previousDate, entry.date)}
                  </Subheader>,
                  <EntryListItem id={entry.id} key={`entry-${entry.id}`} />,
                  <Divider inset={true} key={`divider-${entry.id}`} />
                ]);
              }, [])}
            </List>
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

export default connect(mapStateToProps, { addEntryForToday, toggleDrawer })(
  Journal
);

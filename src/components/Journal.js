import React, { Component } from "react";
import { connect } from "react-redux";
import AddBox from "material-ui/svg-icons/content/add-box";
import { List } from "material-ui/List";
import AppBar from "material-ui/AppBar";
import Divider from "material-ui/Divider";
import CircularProgress from "material-ui/CircularProgress";
import IconButton from "material-ui/IconButton";
import Subheader from "material-ui/Subheader";

import { getJournalAsArray } from "../accessors";
import { addEntry, toggleDrawer } from "../actionCreators";
import EntryListItem from "./EntryListItem";
import SavingProgress from "./SavingProgress";
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
            <IconButton tooltip="New" onTouchTap={this.props.addEntry}>
              <AddBox />
            </IconButton>
          }
        />
        <SavingProgress />
        {!this.props.entries
          ? <div
              style={{ width: "100%", textAlign: "center", marginTop: "300px" }}
            >
              <CircularProgress size={80} thickness={5} />
            </div>
          : <div>
              <List>
                {this.props.entries.reduce(
                  (memo, entry, i, entries) => {
                    const previous = entries[i - 1];
                    const previousDate = previous && previous.date;
                    return memo.concat([
                      <Subheader key={`heading-${entry.id}`}>
                        {getHeading(previousDate, entry.date)}
                      </Subheader>,
                      <EntryListItem id={entry.id} key={`entry-${entry.id}`} />,
                      <Divider inset={true} key={`divider-${entry.id}`} />
                    ]);
                  },
                  []
                )}
              </List>
            </div>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  entries: getJournalAsArray(state),
  // TODO: Move to acessor
  showDrawer: state.view.showDrawer
});

export default connect(mapStateToProps, { addEntry, toggleDrawer })(Journal);

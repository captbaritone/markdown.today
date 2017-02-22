import React, { Component } from "react";
import { connect } from "react-redux";
import AddBox from "material-ui/svg-icons/content/add-box";
import { List } from "material-ui/List";
import AppBar from "material-ui/AppBar";
import Divider from "material-ui/Divider";
import CircularProgress from "material-ui/CircularProgress";
import IconButton from "material-ui/IconButton";

import { getJournalAsArray } from "../accessors";
import { addEntry, toggleDrawer } from "../actionCreators";
import EntryListItem from "./EntryListItem";
import SavingProgress from "./SavingProgress";

class Home extends Component {
  render() {
    return (
      <div>
        <AppBar
          title="Markdown Today"
          titleStyle={{ textAlign: "center" }}
          onLeftIconButtonTouchTap={this.props.toggleDrawer}
          iconElementRight={
            (
              <IconButton tooltip="New" onTouchTap={this.props.addEntry}>
                <AddBox />
              </IconButton>
            )
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
                {this.props.entries.map(entry => [
                  <EntryListItem id={entry.id} />,
                  <Divider inset={true} />
                ])}
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

export default connect(mapStateToProps, { addEntry, toggleDrawer })(Home);

import React, { Component } from "react";
import { connect } from "react-redux";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import Subheader from "material-ui/Subheader";
import { List } from "material-ui/List";
import AppBar from "material-ui/AppBar";
import Divider from "material-ui/Divider";
import CircularProgress from "material-ui/CircularProgress";
import { getJournalAsArray } from "./acessors";
import EntryListItem from "./EntryListItem";

const style = { marginRight: 20, float: "right" };

class Home extends Component {
  render() {
    return (
      <div>
        <AppBar
          title="Markdown Journal"
          onLeftIconButtonTouchTap={this.props.toggleDrawer}
        />
        {
          !this.props.entries
            ? <div
              style={{ width: "100%", textAlign: "center", marginTop: "300px" }}
            >
              <CircularProgress size={80} thickness={5} />
            </div>
            : <div>
              <List>
                <Subheader>Today</Subheader>
                {this.props.entries.map(entry => [
                  <EntryListItem id={entry.id} />,
                  <Divider inset={true} />
                ])}
              </List>
              <FloatingActionButton style={style} onClick={this.props.addEntry}>
                <ContentAdd />
              </FloatingActionButton>
            </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  entries: getJournalAsArray(state),
  showDrawer: state.view.showDrawer
});

const mapDispatchToProps = dispatch => ({
  addEntry: () => dispatch({ type: "ADD_ENTRY" }),
  toggleDrawer: () => dispatch({ type: "TOGGLE_DRAWER" })
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

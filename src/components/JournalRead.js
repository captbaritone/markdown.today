import React, { Component } from "react";
import { connect } from "react-redux";
import AppBar from "material-ui/AppBar";
import { CardText } from "material-ui/Card";
import CircularProgress from "material-ui/CircularProgress";
import KeyboardArrowLeft from "material-ui/svg-icons/image/navigate-before";
import IconButton from "material-ui/IconButton";
import ReactMarkdown from "react-markdown";

import "github-markdown-css/github-markdown.css";

import { getMarkdown, getJournalAsArray } from "../accessors";
import {
  addEntry,
  addEntryForToday,
  toggleDrawer,
  editEntriesForDay,
  goHome
} from "../actionCreators";
import SavingProgress from "./SavingProgress";

class Journal extends Component {
  render() {
    return (
      <div>
        <AppBar
          titleStyle={{ textAlign: "center" }}
          title={"Markdown Today" /* Consider a better title */}
          iconElementLeft={
            <IconButton onClick={this.props.goHome}>
              <KeyboardArrowLeft />
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
              : <CardText>
                <ReactMarkdown
                  className="markdown-body"
                  source={this.props.markdown}
                  escapeHtml={true}
                />
              </CardText>
            </div>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  entries: getJournalAsArray(state),
  markdown: getMarkdown(state),
  // TODO: Move to acessor
  showDrawer: state.view.showDrawer
});

export default connect(mapStateToProps, {
  addEntry,
  addEntryForToday,
  toggleDrawer,
  editEntriesForDay,
  goHome
})(Journal);

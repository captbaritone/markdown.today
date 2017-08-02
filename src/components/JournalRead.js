import React, { Component } from "react";
import { connect } from "react-redux";
import AppBar from "material-ui/AppBar";
import { CardText } from "material-ui/Card";
import KeyboardArrowLeft from "material-ui/svg-icons/image/navigate-before";
import IconButton from "material-ui/IconButton";
import ReactMarkdown from "react-markdown";
import { viewEntry } from "../actionCreators";

import "github-markdown-css/github-markdown.css";

import { getMarkdown, getJournalAsArray } from "../accessors";
import {
  addEntry,
  addEntryForToday,
  toggleDrawer,
  editEntriesForDay,
  goHome
} from "../actionCreators";

import JournalContent from "./JournalContent";

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
        <JournalContent isLoading={!this.props.entries}>
          {() =>
            <CardText>
              <h1>My Journal</h1>
              {this.props.entries.map(entry =>
                <div key={entry.id}>
                  <h2
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => this.props.viewEntry(entry.id)}
                  >
                    {/* TODO: Extract this, and the logic that makes the .md into a function. */}
                    {new Date(entry.date).toISOString()}
                  </h2>
                  <ReactMarkdown
                    className="markdown-body"
                    source={entry.markdown}
                    escapeHtml={true}
                  />
                </div>
              )}
            </CardText>}
        </JournalContent>
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
  goHome,
  viewEntry
})(Journal);

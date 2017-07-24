import React from "react";
import { connect } from "react-redux";
import AppBar from "material-ui/AppBar";
import { CardText } from "material-ui/Card";
import IconButton from "material-ui/IconButton";
import KeyboardArrowLeft from "material-ui/svg-icons/image/navigate-before";
import EditIcon from "material-ui/svg-icons/image/edit";
import format from "date-fns/format";
import ReactMarkdown from "react-markdown";
import JournalContent from "./JournalContent";
import { getEntryById } from "../accessors";
import { editEntry, goHome } from "../actionCreators";

import "github-markdown-css/github-markdown.css";

const Entry = ({ title, goHome, editEntry, loaded, markdown }) =>
  <div>
    <AppBar
      titleStyle={{ textAlign: "center" }}
      title={title}
      iconElementLeft={
        <IconButton onClick={goHome}>
          <KeyboardArrowLeft />
        </IconButton>
      }
      iconElementRight={
        <IconButton onClick={editEntry}>
          <EditIcon />
        </IconButton>
      }
    />

    <JournalContent isLoading={!loaded}>
      {() =>
        <CardText>
          <ReactMarkdown
            className="markdown-body"
            source={markdown}
            escapeHtml={true}
          />
        </CardText>}
    </JournalContent>
  </div>;

const mapStateToProps = (state, ownProps) => {
  const entry = getEntryById(state, ownProps.routeParams.id);
  return {
    // TODO: What if the entry was deleted?
    loaded: !!entry,
    title: entry && format(entry.date, "MMM. Do, YYYY"),
    markdown: entry && entry.markdown
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  goHome: () => dispatch(goHome()),
  editEntry: () => dispatch(editEntry(ownProps.routeParams.id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Entry);

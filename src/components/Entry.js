import React from "react";
import { connect } from "react-redux";
import AppBar from "material-ui/AppBar";
import { CardText } from "material-ui/Card";
import IconButton from "material-ui/IconButton";
import KeyboardArrowLeft from "material-ui/svg-icons/image/navigate-before";
import EditIcon from "material-ui/svg-icons/image/edit";
import { push } from "react-router-redux";
import format from "date-fns/format";
import CircularProgress from "material-ui/CircularProgress";
import ReactMarkdown from "react-markdown";
import { getEntryById } from "../accessors";
import { editEntry } from "../actionCreators";

import "github-markdown-css/github-markdown.css";

const Entry = ({ title, goHome, editEntry, loaded, markdown }) => (
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
    {!loaded
      ? <div style={{ width: "100%", textAlign: "center", marginTop: "300px" }}>
          <CircularProgress size={80} thickness={5} />
        </div>
      : <CardText>
          <ReactMarkdown
            className="markdown-body"
            source={markdown}
            escapeHtml={true}
          />
        </CardText>}
  </div>
);

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
  goHome: () => dispatch(push("/journal/")),
  editEntry: () => dispatch(editEntry(ownProps.routeParams.id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Entry);

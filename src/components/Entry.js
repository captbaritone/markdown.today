import React, { Component } from "react";
import { connect } from "react-redux";
import AppBar from "material-ui/AppBar";
import { Card, CardText } from "material-ui/Card";
import IconButton from "material-ui/IconButton";
import KeyboardArrowLeft from "material-ui/svg-icons/image/navigate-before";
import EditIcon from "material-ui/svg-icons/image/edit";
import { push } from "react-router-redux";
import marked from "marked";
import CircularProgress from "material-ui/CircularProgress";
import { getEntryById } from "../accessors";
import { formatTimestamp } from "../utils";
import { editEntry } from "../actionCreators";

class Entry extends Component {
  render() {
    return (
      <div>
        <AppBar
          title={this.props.title}
          iconElementLeft={
            (
              <IconButton onClick={this.props.goHome}>
                <KeyboardArrowLeft />
              </IconButton>
            )
          }
          iconElementRight={
            (
              <IconButton onClick={this.props.editEntry}>
                <EditIcon />
              </IconButton>
            )
          }
        />
        {!this.props.loaded
          ? <div
              style={{ width: "100%", textAlign: "center", marginTop: "300px" }}
            >
              <CircularProgress size={80} thickness={5} />
            </div>
          : <Card>
              <CardText>
                <div
                  style={{ fontSize: "18px", lineHeight: "24px" }}
                  dangerouslySetInnerHTML={{
                    __html: marked(this.props.markdown)
                  }}
                />
              </CardText>
            </Card>}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const entry = getEntryById(state, ownProps.routeParams.id);
  return {
    // TODO: What if the entry was deleted?
    loaded: !!entry,
    title: entry && formatTimestamp(entry.date),
    markdown: entry && entry.markdown
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  goHome: () => dispatch(push("/")),
  editEntry: () => dispatch(editEntry(ownProps.routeParams.id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Entry);

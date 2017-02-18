import React, { Component } from "react";
import { connect } from "react-redux";
import AppBar from "material-ui/AppBar";
import { Card, CardText } from "material-ui/Card";
import IconButton from "material-ui/IconButton";
import KeyboardArrowLeft from "material-ui/svg-icons/image/navigate-before";
import EditIcon from "material-ui/svg-icons/image/edit";
import { push } from "react-router-redux";
import marked from "marked";
import { getEntryById, formatTimestamp } from "../utils";
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
        <Card>
          <CardText>
            <div
              dangerouslySetInnerHTML={{ __html: marked(this.props.markdown) }}
            />
          </CardText>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const entry = getEntryById(state, ownProps.routeParams.id);
  return { title: formatTimestamp(entry.date), markdown: entry.markdown };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  goHome: () => dispatch(push("/")),
  editEntry: () => dispatch(editEntry(ownProps.routeParams.id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Entry);

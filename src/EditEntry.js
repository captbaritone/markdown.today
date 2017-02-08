import React, { Component } from "react";
import { connect } from "react-redux";
import AppBar from "material-ui/AppBar";
import TextField from "material-ui/TextField";
import IconButton from "material-ui/IconButton";
import KeyboardArrowLeft from "material-ui/svg-icons/image/navigate-before";
import { getEntryById, formatTimestamp } from "./utils";
import { push } from "react-router-redux";
import { updateEntry } from "./actionCreators";

class EditEntry extends Component {
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
        />
        <TextField
          id={`${this.props.id}`}
          onChange={this.props.handleChange}
          fullWidth={true}
          multiLine={true}
          value={this.props.markdown}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const entry = getEntryById(state, ownProps.routeParams.id);
  return {
    id: entry.id,
    title: formatTimestamp(entry.date),
    markdown: entry.markdown
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleChange: e =>
    dispatch(updateEntry(ownProps.routeParams.id, e.target.value)),
  goHome: () => dispatch(push("/"))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditEntry);

import React from "react";
import { connect } from "react-redux";
import LinearProgress from "material-ui/LinearProgress";

const SavingProgress = props =>
  props.uploading
    ? <LinearProgress mode="indeterminate" style={{ position: "absolute" }} />
    : null;

const mapStateToProps = state => ({
  uploading: state.dropbox.uploading
});

export default connect(mapStateToProps)(SavingProgress);

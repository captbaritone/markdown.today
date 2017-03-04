import React from "react";
import { connect } from "react-redux";
import LinearProgress from "material-ui/LinearProgress";
import { isUploading } from "../accessors";

const SavingProgress = props =>
  props.uploading
    ? <LinearProgress mode="indeterminate" style={{ position: "absolute" }} />
    : null;

const mapStateToProps = state => ({
  uploading: isUploading(state)
});

export default connect(mapStateToProps)(SavingProgress);

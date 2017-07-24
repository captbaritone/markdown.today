import React from "react";
import { connect } from "react-redux";
import Snackbar from "material-ui/Snackbar";

import { nextNotification } from "../accessors";
import { resolveFirstNotification } from "../actionCreators";

const Notifications = props =>
  <Snackbar
    open={!!props.message}
    message={props.message}
    autoHideDuration={4000}
    onRequestClose={props.resolveNotification}
  />;

const mapDispatchToProps = dispatch => ({
  resolveNotification: () => dispatch(resolveFirstNotification())
});
const mapStateToProps = state => ({
  message: nextNotification(state) || ""
});
export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

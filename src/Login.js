import React from "react";
import { connect } from "react-redux";
import { authenticateToDropbox } from "./actionCreators";

// TODO: Format this page better.
const Login = props => (
  <div>
    <button onClick={props.login}>Login</button>
  </div>
);

const mapDispatchToProps = dispatch => ({
  // TODO: Only insitage login, let future actions worry about downloading
  login: () => dispatch(authenticateToDropbox())
});

export default connect(() => ({}), mapDispatchToProps)(Login);

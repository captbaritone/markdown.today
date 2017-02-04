import React from "react";
import { connect } from "react-redux";
import { SET_FROM_MD } from "./actionTypes";
import { downloadMarkdown } from "./actionCreators";

const Login = props => {
  props.dispatch(downloadMarkdown());
};

export default connect(() => ({}))(Login);

import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { parse } from "qs";

import { setAuthToken } from "../actionCreators";

class Auth extends React.Component {
  componentWillMount() {
    const accessToken = parse(this.props.location.hash.slice(1)).access_token;
    this.props.dispatch(setAuthToken(accessToken));
    // TODO: Get desired URL from URL or some such thing
    this.props.dispatch(push("/"));
  }
  render() {
    return null;
  }
}

export default connect(null)(Auth);

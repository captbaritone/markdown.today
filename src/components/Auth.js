import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { parse } from "qs";

import { setAuthToken } from "../actionCreators";

class Auth extends React.Component {
  componentWillMount() {
    // This is essentially a 301 redirect. Dropbox will redirect to a URL that
    // loads this route. This route will never render, it simply does some work
    // and then sends you to a different route. Kinda gross, but I don't really
    // see a much better solution.
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

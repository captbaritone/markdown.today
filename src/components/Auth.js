import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { parse } from "qs";
import { downloadJournal } from "../actionCreators";

class Auth extends React.Component {
  componentWillMount() {
    const accessToken = parse(this.props.location.hash.slice(1)).access_token;
    // TODO: Convert to action creator
    this.props.dispatch({ type: "SET_AUTH_TOKEN", token: accessToken });
    this.props.dispatch(downloadJournal());
    // TODO: Get desired URL from URL or some such thing
    this.props.dispatch(push("/"));
  }
  render() {
    return null;
  }
}

export default connect(() => ({}))(Auth);

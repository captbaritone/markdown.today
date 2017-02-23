import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { parse } from "qs";
import { downloadJournal } from "../actionCreators";

const getHash = () => this.props.location.hash.slice(1);
const getAccessTokenFromHash = () => parse(getHash()).access_token;

class Auth extends React.Component {
  componentWillMount() {
    const accessToken = getAccessTokenFromHash();
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

export default connect(null)(Auth);

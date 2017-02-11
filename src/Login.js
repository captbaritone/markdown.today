import React from "react";
import { connect } from "react-redux";
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { authenticateToDropbox } from "./actionCreators";

// TODO: Format this page better.
const Login = props => (
  <div style={{height: '100vh', overflowY: "auto"}}>
  <Paper style={{height: '100%', display: 'flex', flexDirection: 'column', 'justifyContent': 'center'}} >
    <RaisedButton
          label="Login to Dropbox"
          labelPosition="before"
          primary={true}
        style={{width: '80%', margin: '0 auto'}}
        onTouchTap={props.login}
    />
  </Paper>
    </div>
);

const mapDispatchToProps = dispatch => ({
  // TODO: Only insitage login, let future actions worry about downloading
  login: () => dispatch(authenticateToDropbox())
});

export default connect(() => ({}), mapDispatchToProps)(Login);

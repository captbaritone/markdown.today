import React from "react";
import { connect } from "react-redux";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import { decrypt } from "sjcl";

import {
  attemptToDecryptJournal,
  setEncryptionPassword
} from "../actionCreators";
import { needsEncryptionPassword, getUnencryptedBlob } from "../accessors";

class PasswordPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = { password: "" };
    this.updatePassword = this.updatePassword.bind(this);
  }

  updatePassword(e) {
    const password = e.target.value;
    this.setState({ password });
    try {
      decrypt(password, this.props.unencryptedBlob);
    } catch (e) {
      return;
    }
    this.props.setEncryptionPassword(password);
    this.props.attemptToDecryptJournal();
  }

  render() {
    // TODO: Consider a max width.
    // TODO: Focus input
    return (
      <Dialog
        title="Encryption Password"
        open={this.props.open}
        actions={
          (
            <FlatButton
              label="Cancel"
              primary={false}
              onTouchTap={this.props.hideSettings}
            />
          )
        }
      >
        <TextField
          hintText="Encryption Password"
          floatingLabelText="Password"
          type="password"
          onChange={this.updatePassword}
          value={this.state.password}
          autoFocus
        />
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  open: needsEncryptionPassword(state),
  unencryptedBlob: getUnencryptedBlob(state)
});

const mapDispatchToProps = dispatch => ({
  attemptToDecryptJournal: () => dispatch(attemptToDecryptJournal()),
  setEncryptionPassword: password => dispatch(setEncryptionPassword(password))
});

export default connect(mapStateToProps, mapDispatchToProps)(PasswordPrompt);

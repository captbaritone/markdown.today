import React from "react";
import { connect } from "react-redux";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import { decrypt } from "sjcl";

import {
  attemptToDecryptJournal,
  setEncryptionPassword,
  logout
} from "../actionCreators";
import { needsEncryptionPassword, getEncryptedBlob } from "../accessors";

export class PasswordPrompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = { password: "", isValid: false };
    this.updatePassword = this.updatePassword.bind(this);
    this.checkValidity = this.checkValidity.bind(this);
    this.decrypt = this.decrypt.bind(this);
  }

  checkValidity() {
    let isValid = true;
    try {
      decrypt(this.state.password, this.props.encryptedBlob);
    } catch (e) {
      isValid = false;
    }
    return isValid;
  }

  updatePassword(e) {
    const password = e.target.value;
    this.setState({ password });
  }

  decrypt(e) {
    e.preventDefault();
    if (!this.checkValidity()) {
      return;
    }
    this.props.setEncryptionPassword(this.state.password);
    this.props.attemptToDecryptJournal();
  }

  render() {
    // TODO: Consider a max width.
    // TODO: Focus input
    return (
      <Dialog
        contentStyle={{ maxWidth: "300px" }}
        title="Unlock Journal"
        open={this.props.open}
        actions={[
          <FlatButton
            label="Cancel"
            secondary={true}
            onTouchTap={this.props.logout}
          />,
          <FlatButton
            disabled={!this.checkValidity()}
            onTouchTap={this.decrypt}
            label="Decrypt"
            primary={true}
          />
        ]}
      >
        <form onSubmit={this.decrypt}>
          <TextField
            hintText="Encryption Password"
            floatingLabelText="Password"
            type="password"
            onChange={this.updatePassword}
            value={this.state.password}
            autoFocus
          />
        </form>
      </Dialog>
    );
  }
}

PasswordPrompt.propTypes = {
  open: React.PropTypes.bool.isRequired,
  encryptedBlob: React.PropTypes.string,
  attemptToDecryptJournal: React.PropTypes.func.isRequired,
  setEncryptionPassword: React.PropTypes.func.isRequired,
  logout: React.PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  open: needsEncryptionPassword(state),
  encryptedBlob: getEncryptedBlob(state)
});

const mapDispatchToProps = {
  attemptToDecryptJournal,
  setEncryptionPassword,
  logout
};

export default connect(mapStateToProps, mapDispatchToProps)(PasswordPrompt);

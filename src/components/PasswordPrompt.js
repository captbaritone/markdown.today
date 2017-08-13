// @flow

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

type State = {
  password: string,
  isValid: boolean,
  hasSubmitted: boolean
};

type Props = {
  encryptedBlob: ?string,
  setEncryptionPassword: string => void,
  attemptToDecryptJournal: () => void,
  logout: () => void,
  open: () => void
};

export class PasswordPrompt extends React.Component {
  state: State;
  constructor(props: Props) {
    super(props);
    this.state = { password: "", isValid: false, hasSubmitted: false };
    (this: any).updatePassword = this.updatePassword.bind(this);
    (this: any).checkValidity = this.checkValidity.bind(this);
    (this: any).decrypt = this.decrypt.bind(this);
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

  updatePassword(e: Event) {
    if (e.target instanceof HTMLInputElement) {
      const password = e.target.value;
      this.setState({ password });
    }
  }

  decrypt(e: Event) {
    e.preventDefault();
    if (!this.checkValidity()) {
      this.setState({ hasSubmitted: true });
      return;
    }
    this.props.setEncryptionPassword(this.state.password);
    this.props.attemptToDecryptJournal();
  }

  render() {
    const errorText =
      this.state.hasSubmitted && !this.checkValidity()
        ? "Wrong password. Try again."
        : null;
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
            onTouchTap={this.decrypt}
            label="Decrypt"
            primary={true}
          />
        ]}
      >
        <form onSubmit={this.decrypt}>
          <TextField
            errorText={errorText}
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

import React from "react";
import { connect } from "react-redux";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";

import {
  updateEncryptionPassword,
  hideRemovePassword
} from "../actionCreators";
import { getEncryptionPassword, shouldShowRemovePassword } from "../accessors";

const defaultState = {
  enteredCurrentPassword: ""
};
class RemovePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.handleCurrenPasswordChange = this.handleCurrenPasswordChange.bind(
      this
    );
    this.hideChangePassword = this.hideChangePassword.bind(this);
  }

  handleCurrenPasswordChange(e) {
    this.setState({ enteredCurrentPassword: e.target.value });
  }
  hideChangePassword() {
    this.setState(defaultState);
    this.props.hideChangePassword();
  }

  render() {
    const currentPasswordMatches = this.state.enteredCurrentPassword ===
      this.props.encryptionPassword;
    return (
      <Dialog
        contentStyle={{ maxWidth: "300px" }}
        title="Remove Encryption"
        open={this.props.open}
        modal={true}
        actions={[
          (
            <FlatButton
              label="Cancel"
              onTouchTap={this.hideChangePassword}
              secondary={true}
            />
          ),
          (
            <FlatButton
              disabled={!currentPasswordMatches}
              label="Decrypt"
              primary={true}
              onTouchTap={() => this.props.updateEncryptionPassword(null)}
            />
          )
        ]}
      >
        <TextField
          errorText={
            !currentPasswordMatches &&
              this.state.enteredCurrentPassword &&
              "Must match your current encryption password."
          }
          hintText="Current Password"
          floatingLabelText="Current Password"
          type="password"
          value={this.state.enteredCurrentPassword}
          onChange={this.handleCurrenPasswordChange}
          autoFocus
        />
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  open: shouldShowRemovePassword(state),
  encryptionPassword: getEncryptionPassword(state)
});

const mapDispatchToProps = dispatch => ({
  updateEncryptionPassword: newPassword => {
    dispatch(updateEncryptionPassword(newPassword));
    dispatch(hideRemovePassword());
  },
  hideRemovePassword: () => dispatch(hideRemovePassword())
});

export default connect(mapStateToProps, mapDispatchToProps)(RemovePassword);

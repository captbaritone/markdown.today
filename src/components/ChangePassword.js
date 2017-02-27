import React from "react";
import { connect } from "react-redux";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";

import { changeEnryptionPassword, hideChangePassword } from "../actionCreators";
import { getEncryptionPassword, shouldShowChangePassword } from "../accessors";

const defaultState = {
  enteredCurrentPassword: "",
  enteredNewPassword: "",
  enteredConfirmNewPassword: ""
};
class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.handleCurrenPasswordChange = this.handleCurrenPasswordChange.bind(
      this
    );
    this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
    this.handleConfirmNewPasswordChange = this.handleConfirmNewPasswordChange.bind(
      this
    );
    this.hideChangePassword = this.hideChangePassword.bind(this);
  }

  handleCurrenPasswordChange(e) {
    this.setState({ enteredCurrentPassword: e.target.value });
  }
  handleNewPasswordChange(e) {
    this.setState({ enteredNewPassword: e.target.value });
  }
  handleConfirmNewPasswordChange(e) {
    this.setState({ enteredConfirmNewPassword: e.target.value });
  }

  hideChangePassword() {
    this.setState(defaultState);
    this.props.hideChangePassword();
  }

  render() {
    // TODO: Maybe debounce these? This article may have some ideas:
    // https://medium.com/wdstack/inline-validation-in-forms-designing-the-experience-123fb34088ce#.mf99mi3bf
    const currentPasswordMatches = this.state.enteredCurrentPassword ===
      this.props.encryptionPassword;
    const newPasswordsMatch = this.state.enteredNewPassword ===
      this.state.enteredConfirmNewPassword;
    return (
      <Dialog
        contentStyle={{ maxWidth: "300px" }}
        title="Change Password"
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
              disabled={!(currentPasswordMatches && newPasswordsMatch)}
              label="Update"
              primary={true}
              onTouchTap={() =>
                this.props.changeEnryptionPassword(
                  this.state.enteredNewPassword
                )}
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
        <br />
        <TextField
          hintText="New Password"
          floatingLabelText="New Password"
          type="password"
          value={this.state.enteredNewPassword}
          onChange={this.handleNewPasswordChange}
        />
        <br />
        <TextField
          errorText={
            !newPasswordsMatch &&
              this.state.enteredConfirmNewPassword &&
              "Must match the password given above."
          }
          hintText="Confirm New Password"
          floatingLabelText="Confirm New Password"
          type="password"
          value={this.state.enteredConfirmNewPassword}
          onChange={this.handleConfirmNewPasswordChange}
        />
        <p><strong>Note:</strong> This password cannot be recovered if lost.</p>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  open: shouldShowChangePassword(state),
  encryptionPassword: getEncryptionPassword(state)
});

const mapDispatchToProps = dispatch => ({
  changeEnryptionPassword: newPassword => {
    dispatch(changeEnryptionPassword(newPassword));
    dispatch(hideChangePassword());
  },
  hideChangePassword: () => dispatch(hideChangePassword())
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);

import React from "react";
import { connect } from "react-redux";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";

import { updateEncryptionPassword, hideSetPassword } from "../actionCreators";
import { shouldShowSetPassword } from "../accessors";

const defaultState = {
  enteredNewPassword: "",
  enteredConfirmNewPassword: ""
};
class SetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
    this.handleConfirmNewPasswordChange = this.handleConfirmNewPasswordChange.bind(
      this
    );
    this.hideSetPassword = this.hideSetPassword.bind(this);
  }

  handleNewPasswordChange(e) {
    this.setState({ enteredNewPassword: e.target.value });
  }
  handleConfirmNewPasswordChange(e) {
    this.setState({ enteredConfirmNewPassword: e.target.value });
  }

  hideSetPassword() {
    this.setState(defaultState);
    this.props.hideSetPassword();
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
        title="Set Password"
        open={this.props.open}
        modal={true}
        actions={
          (
            <div>
              <FlatButton
                label="Cancel"
                onTouchTap={this.hideSetPassword}
                primary={true}
              />
              <FlatButton
                disabled={!(currentPasswordMatches && newPasswordsMatch)}
                label="Set"
                primary={true}
                onTouchTap={() =>
                  this.props.updateEncryptionPassword(
                    this.state.enteredNewPassword
                  )}
              />
            </div>
          )
        }
      >
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
  open: shouldShowSetPassword(state)
});

const mapDispatchToProps = dispatch => ({
  updateEncryptionPassword: newPassword => {
    dispatch(updateEncryptionPassword(newPassword));
    dispatch(hideSetPassword());
  },
  hideSetPassword: () => dispatch(hideSetPassword())
});

export default connect(mapStateToProps, mapDispatchToProps)(SetPassword);

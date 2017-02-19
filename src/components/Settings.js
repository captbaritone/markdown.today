import React from "react";
import { connect } from "react-redux";
import Dialog from "material-ui/Dialog";
import Toggle from "material-ui/Toggle";
import FlatButton from "material-ui/FlatButton";

import { setEncryptionPassword, hideSettings } from "../actionCreators";
import { shouldShowSettings, isEncrypted } from "../accessors";

const Settings = props => (
  <Dialog
    title="Settings"
    open={props.open}
    actions={
      <FlatButton label="Done" primary={true} onTouchTap={props.hideSettings} />
    }
  >
    <Toggle
      label="Encrypt Journal"
      toggled={props.encryptionEnabled}
      onToggle={props.enableEncryption}
    />
  </Dialog>
);

const mapStateToProps = state => ({
  open: shouldShowSettings(state),
  encryptionEnabled: isEncrypted(state)
});

const mapDispatchToProps = dispatch => ({
  // FIXME: This should toggle and prompt for password.
  enableEncryption: () => dispatch(setEncryptionPassword("hunter2")),
  hideSettings: () => dispatch(hideSettings())
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

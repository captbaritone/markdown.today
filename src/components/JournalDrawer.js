import React from "react";
import { connect } from "react-redux";
import Drawer from "material-ui/Drawer";
import AppBar from "material-ui/AppBar";
import MenuItem from "material-ui/MenuItem";
import Download from "material-ui/svg-icons/file/file-download";
import ExitToApp from "material-ui/svg-icons/action/exit-to-app";
import Lock from "material-ui/svg-icons/action/lock";
import LockOpen from "material-ui/svg-icons/action/lock-open";
import Divider from "material-ui/Divider";
import {
  exportMarkdown,
  setDrawerVisibility,
  logout,
  toggleEncryption,
  showChangePassword,
  showSetPassword,
  showRemovePassword
} from "../actionCreators";
import { isLoggedIn, isEncrypted } from "../accessors";
import { TOGGLE_DRAWER } from "../actionTypes";

// TODO: Support loading indicator to the right of "Save to Dropbox"
const JournalDrawer = props => (
  <Drawer
    open={props.showDrawer}
    docked={false}
    onRequestChange={props.setDrawerVisibility}
  >
    <AppBar
      title="Options"
      iconElementLeft={<span />}
      onTouchTap={props.toggleDrawer}
    />
    {props.isEncrypted
      ? [
          (
            <MenuItem
              key="update"
              leftIcon={<Lock />}
              onClick={props.showChangePassword}
            >
              Update Password
            </MenuItem>
          ),
          (
            <MenuItem
              key="remove"
              leftIcon={<LockOpen />}
              onClick={props.showRemovePassword}
            >
              Remove Encryption
            </MenuItem>
          )
        ]
      : <MenuItem leftIcon={<Lock />} onClick={props.showSetPassword}>
          Encrypt
        </MenuItem>}
    <MenuItem leftIcon={<Download />} onClick={props.export}>
      Export (.md)
    </MenuItem>
    <MenuItem leftIcon={<ExitToApp />} onClick={props.logout}>
      Logout
    </MenuItem>
    <Divider />
    <MenuItem onTouchTap={props.readAbout}>
      GitHub
    </MenuItem>
  </Drawer>
);

const mapStateToProps = state => ({
  // TODO: Move to actionCreators
  showDrawer: state.view.showDrawer,
  isLogedIn: isLoggedIn(state),
  isEncrypted: isEncrypted(state)
});

const mapDispatchToProps = dispatch => ({
  toggleDrawer: () => dispatch({ type: TOGGLE_DRAWER }),
  export: () => dispatch(exportMarkdown()),
  logout: () => dispatch(logout()),
  readAbout: () =>
    window.location = "https://github.com/captbaritone/markdown-journal",
  setDrawerVisibility: value => dispatch(setDrawerVisibility(value)),
  showChangePassword: () => dispatch(showChangePassword()),
  showSetPassword: () => dispatch(showSetPassword()),
  showRemovePassword: () => dispatch(showRemovePassword()),
  toggleEncryption: () => dispatch(toggleEncryption())
});

export default connect(mapStateToProps, mapDispatchToProps)(JournalDrawer);

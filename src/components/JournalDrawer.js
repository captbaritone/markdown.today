import React from "react";
import { connect } from "react-redux";
import Drawer from "material-ui/Drawer";
import AppBar from "material-ui/AppBar";
import MenuItem from "material-ui/MenuItem";
import Download from "material-ui/svg-icons/file/file-download";
import ExitToApp from "material-ui/svg-icons/action/exit-to-app";
import Lock from "material-ui/svg-icons/action/lock";
import Divider from "material-ui/Divider";
import {
  exportMarkdown,
  setDrawerVisibility,
  logout,
  showChangePassword,
  showSetPassword,
  toggleDrawer,
  readAbout
} from "../actionCreators";
import { isLoggedIn, isEncrypted } from "../accessors";

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
      ? <MenuItem leftIcon={<Lock />} onClick={props.showChangePassword}>
          Change Password
        </MenuItem>
      : <MenuItem leftIcon={<Lock />} onClick={props.showSetPassword}>
          Set Password
        </MenuItem>}
    <MenuItem leftIcon={<Download />} onClick={props.exportMarkdown}>
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
  // TODO: Move to accessor
  showDrawer: state.view.showDrawer,
  isLogedIn: isLoggedIn(state),
  isEncrypted: isEncrypted(state)
});

const mapDispatchToProps = {
  toggleDrawer,
  exportMarkdown,
  logout,
  readAbout,
  setDrawerVisibility,
  showChangePassword,
  showSetPassword
};

export default connect(mapStateToProps, mapDispatchToProps)(JournalDrawer);

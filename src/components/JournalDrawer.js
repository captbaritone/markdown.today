import React from "react";
import { connect } from "react-redux";
import Drawer from "material-ui/Drawer";
import AppBar from "material-ui/AppBar";
import MenuItem from "material-ui/MenuItem";
import Download from "material-ui/svg-icons/file/file-download";
import ExitToApp from "material-ui/svg-icons/action/exit-to-app";
import Save from "material-ui/svg-icons/content/save";
import Lock from "material-ui/svg-icons/action/lock";
import LockOpen from "material-ui/svg-icons/action/lock-open";
import Divider from "material-ui/Divider";
import GitHub from "react-icons/lib/go/mark-github";
import {
  exportMarkdown,
  setDrawerVisibility,
  logout,
  toggleEncryption,
  showChangePassword,
  showSetPassword,
  showRemovePassword,
  readAbout,
  toggleDrawer,
  uploadToDropbox
} from "../actionCreators";
import {
  isLoggedIn,
  isEncrypted,
  shouldShowDrawer,
  isUploading,
  isDirty,
  dropboxIsMocked
} from "../accessors";

// TODO: Support loading indicator to the right of "Save to Dropbox"
const JournalDrawer = props =>
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
    {props.areMocked
      ? <MenuItem
          key="save"
          leftIcon={
            <Save
              color={
                !props.isDirty || props.isUploading
                  ? "rgba(0, 0, 0, 0.298039)"
                  : null
              }
            />
          }
          onClick={props.uploadToDropbox}
          disabled={props.isUploading || !props.isDirty}
        >
          {/* TODO Nested ternary statements?? Are you crazy?? */}
          {props.isUploading
            ? "Saving..."
            : !props.isDirty ? "All changes saved" : "Save"}
        </MenuItem>
      : null}
    <Divider />
    {props.isEncrypted &&
      <MenuItem
        key="update"
        leftIcon={<Lock />}
        onClick={props.showChangePassword}
      >
        Update Password
      </MenuItem>}
    {props.isEncrypted
      ? <MenuItem
          key="remove"
          leftIcon={<LockOpen />}
          onTouchTap={props.showRemovePassword}
        >
          Remove Encryption
        </MenuItem>
      : <MenuItem leftIcon={<Lock />} onTouchTap={props.showSetPassword}>
          Encrypt
        </MenuItem>}
    <MenuItem leftIcon={<Download />} onTouchTap={props.exportMarkdown}>
      Export (.md)
    </MenuItem>
    <Divider />
    <MenuItem leftIcon={<ExitToApp />} onTouchTap={props.logout}>
      {props.areMocked ? "Exit Demo" : "Logout"}
    </MenuItem>
    <Divider />
    <MenuItem leftIcon={<GitHub />} onTouchTap={props.readAbout}>
      GitHub
    </MenuItem>
  </Drawer>;

const mapStateToProps = state => ({
  // TODO: Move to accessor
  showDrawer: shouldShowDrawer(state),
  isLogedIn: isLoggedIn(state),
  isEncrypted: isEncrypted(state),
  isUploading: isUploading(state),
  isDirty: isDirty(state),
  areMocked: dropboxIsMocked(state)
});

const mapDispatchToProps = {
  toggleDrawer,
  exportMarkdown,
  logout,
  readAbout,
  setDrawerVisibility,
  showChangePassword,
  showSetPassword,
  showRemovePassword,
  toggleEncryption,
  uploadToDropbox
};

export default connect(mapStateToProps, mapDispatchToProps)(JournalDrawer);

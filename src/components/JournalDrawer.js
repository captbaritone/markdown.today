import React from "react";
import { connect } from "react-redux";
import Drawer from "material-ui/Drawer";
import Subheader from "material-ui/Subheader";
import MenuItem from "material-ui/MenuItem";
import Download from "material-ui/svg-icons/file/file-download";
import ExitToApp from "material-ui/svg-icons/action/exit-to-app";
import FileCloudUpload from "material-ui/svg-icons/file/cloud-upload";
import Divider from "material-ui/Divider";
import {
  exportMarkdown,
  uploadToDropbox,
  setDrawerVisibility,
  logout
} from "../actionCreators";
import { isLoggedIn } from "../accessors";
import { TOGGLE_DRAWER } from "../actionTypes";

// TODO: Support loading indicator to the right of "Save to Dropbox"
const JournalDrawer = props => (
  <Drawer
    open={props.showDrawer}
    docked={false}
    onRequestChange={props.setDrawerVisibility}
  >
    <Subheader onClick={props.toggleDrawer}>MD Journal</Subheader>
    <MenuItem leftIcon={<FileCloudUpload />} onClick={props.upload}>
      Save to Dropbox
    </MenuItem>
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
  isLogedIn: isLoggedIn(state)
});

const mapDispatchToProps = dispatch => ({
  toggleDrawer: () => dispatch({ type: TOGGLE_DRAWER }),
  export: () => dispatch(exportMarkdown()),
  upload: () => {
    dispatch(uploadToDropbox());
    dispatch(setDrawerVisibility(false));
  },
  logout: () => dispatch(logout()),
  readAbout: () =>
    window.location = "https://github.com/captbaritone/markdown-journal",
  setDrawerVisibility: value => dispatch(setDrawerVisibility(value))
});

export default connect(mapStateToProps, mapDispatchToProps)(JournalDrawer);

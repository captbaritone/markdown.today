import React from "react";
import { connect } from "react-redux";
import Drawer from "material-ui/Drawer";
import Subheader from "material-ui/Subheader";
import MenuItem from "material-ui/MenuItem";
import Download from "material-ui/svg-icons/file/file-download";
import { downloadMarkdown } from "./actionCreators";
import { TOGGLE_DRAWER } from "./actionTypes";

const JournalDrawer = props => (
  <Drawer open={props.showDrawer}>
    <Subheader onClick={props.toggleDrawer}>MD Journal</Subheader>
    <MenuItem leftIcon={<Download />} onClick={props.download}>
      Download (.md)
    </MenuItem>
  </Drawer>
);

const mapStateToProps = state => ({ showDrawer: state.view.showDrawer });

const mapDispatchToProps = dispatch => ({
  toggleDrawer: () => dispatch({ type: TOGGLE_DRAWER }),
  download: () => dispatch(downloadMarkdown())
});

export default connect(mapStateToProps, mapDispatchToProps)(JournalDrawer);

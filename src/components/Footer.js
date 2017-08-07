import React from "react";
import {
  BottomNavigation,
  BottomNavigationItem
} from "material-ui/BottomNavigation";
import ViewListIcon from "material-ui/svg-icons/action/view-list";
import DateRangeIcon from "material-ui/svg-icons/action/date-range";
import SubjectIcon from "material-ui/svg-icons/action/subject";
import Paper from "material-ui/Paper";

const Footer = () =>
  <Paper zDepth={1} style={{ position: "fixed", bottom: 0, width: "100%" }}>
    <BottomNavigation selectedIndex={0}>
      <BottomNavigationItem icon={<ViewListIcon />} />
      <BottomNavigationItem icon={<DateRangeIcon />} />
      <BottomNavigationItem icon={<SubjectIcon />} />
    </BottomNavigation>
  </Paper>;

export default Footer;

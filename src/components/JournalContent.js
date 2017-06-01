import React from "react";
import CircularProgress from "material-ui/CircularProgress";

import SavingProgress from "./SavingProgress";

const LoadingPage = () => (
  <div style={{ width: "100%", textAlign: "center", marginTop: "300px" }}>
    <CircularProgress size={80} thickness={5} />
  </div>
);

const JournalContent = ({ isLoading, children }) => (
  <div>
    <SavingProgress />
    {isLoading ? <LoadingPage /> : children()}
  </div>
);

JournalContent.propTypes = {
  isLoading: React.PropTypes.bool,
  children: React.PropTypes.func
};

export default JournalContent;

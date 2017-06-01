import React from "react";
import { connect } from "react-redux";
import CircularProgress from "material-ui/CircularProgress";

import { getJournalAsArray } from "../accessors";
import SavingProgress from "./SavingProgress";

const JournalContent = ({ entries, children }) => (
  <div>
    <SavingProgress />
    {!entries
      ? <div style={{ width: "100%", textAlign: "center", marginTop: "300px" }}>
          <CircularProgress size={80} thickness={5} />
        </div>
      : children}
  </div>
);

const mapStateToProps = state => ({
  entries: getJournalAsArray(state)
});

export default connect(mapStateToProps)(JournalContent);

// @flow
import React from "react";
import { connect } from "react-redux";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import { isDirty } from "../accessors";
import { logout } from "../actionCreators";

type Props = {
  isDirty: boolean,
  open: boolean,
  cancel: () => void,
  logout: () => void
};

const WARNING = `Your Jounal is not fully saved. Are you sure you want to log out?`;

const LogoutPrompt = (props: Props) =>
  <Dialog
    open={props.open}
    actions={[
      <FlatButton label="Cancel" primary={true} onTouchTap={props.cancel} />,
      <FlatButton
        label={props.isDirty ? "Discard" : "Logout"}
        secondary={true}
        onTouchTap={() => {
          props.logout();
          // Ideally logging out would clear the drawer's "attempting to log out" state, but for now we cheat.
          props.cancel();
        }}
      />
    ]}
  >
    <div>
      {props.isDirty
        ? WARNING
        : <s>
            {WARNING}
          </s>}
      {props.isDirty ||
        <div>
          <br />
          <strong>Update:</strong> Your journal has now been saved. It is safe
          to logout.
        </div>}
    </div>
  </Dialog>;

const mapStateToProps = state => ({
  isDirty: isDirty(state)
});

const mapDispatchToProps = { logout };

export default connect(mapStateToProps, mapDispatchToProps)(LogoutPrompt);

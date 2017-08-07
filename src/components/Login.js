import React from "react";
import { connect } from "react-redux";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import { darkWhite } from "material-ui/styles/colors";
import { authenticateToDropbox, mockDropbox } from "../actionCreators";
import lightBaseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import typography from "material-ui/styles/typography";

const features = [
  "Stores journal as markdown",
  "Browser connects directly to Dropbox",
  "Optional in-browser AES encryption",
  <span>
    Free and{" "}
    <a
      style={{ color: darkWhite }}
      target="_blank"
      href="https://github.com/captbaritone/markdown.today"
    >
      open source
    </a>
  </span>
];

const pageStyle = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  backgroundColor: lightBaseTheme.palette.primary1Color,
  color: darkWhite,
  textAlign: "center",
  fontWeight: typography.fontWeightLight
};

const h1Style = {
  fontWeight: typography.fontWeightLight,
  margin: "0"
};

const h2Style = {
  fontSize: "20px",
  paddingTop: "19px",
  margin: "0",
  fontWeight: typography.fontWeightLight
};

/*
// TODO: Enable these when we are on a large display.
const h1WhenLarge = Object.assign({}, h1Style, {
  fontSize: 56
});
const h2WhenLarge = Object.assign({}, h2Style, {
  fontSize: 24,
  lineHeight: "32px",
  paddingTop: 16,
  marginBottom: 12
});
*/

const ulStyle = {
  listStyle: "none",
  padding: 0,
  margin: "50px 0"
};

// TODO: Format this page better.
const Login = props =>
  <div style={{ height: "100vh", overflowY: "auto" }}>
    <Paper style={pageStyle}>
      <h1 style={h1Style}>Markdown Today</h1>
      <h2 style={h2Style}>Journal from any browser</h2>
      <ul style={ulStyle}>
        {features.map((feature, i) =>
          <li key={i} style={{ margin: "5px" }}>
            {feature}
          </li>
        )}
      </ul>
      <RaisedButton
        label="Login with Dropbox"
        labelPosition="before"
        style={{ width: "80%", margin: "0 auto", maxWidth: "300px" }}
        onTouchTap={props.login}
        labelStyle={{
          color: lightBaseTheme.palette.primary1Color
        }}
      />
      <br />
      {process.env.NODE_ENV === "development" &&
        <a
          onClick={props.mockDropbox}
          style={{
            cursor: "pointer",
            display: "block",
            fontWeight: 500,
            textTransform: "uppercase",
            color: "#fff",
            textDecoration: "underline",
            fontSize: "14px",
            marginTop: "2em"
          }}
        >
          Try a Demo
        </a>}
      <p
        style={{
          position: "fixed",
          bottom: "0",
          width: "100%",
          fontSize: "12px"
        }}
      >
        By{" "}
        <a
          style={{ color: lightBaseTheme.palette.alternateTextColor }}
          href="https://jordaneldredge.com"
        >
          Jordan Eldredge
        </a>
      </p>
    </Paper>
  </div>;

const mapDispatchToProps = dispatch => ({
  // TODO: Only insitage login, let future actions worry about downloading
  login: () => dispatch(authenticateToDropbox()),
  mockDropbox: () => dispatch(mockDropbox())
});

export default connect(() => ({}), mapDispatchToProps)(Login);

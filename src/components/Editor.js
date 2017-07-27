// @flow
import React from "react";

const wrapperStyle = {
  display: "flex",
  flexDirection: "column",
  minHeight: "calc(100vh - 64px)"
};
const style = {
  border: "none",
  width: "100%",
  fontSize: "18px",
  lineHeight: "24px",
  fontFamily: "Roboto, sans-serif", // TODO: Pull this from the theme.
  boxSizing: "border-box",
  padding: "16px", // TODO: Find a way for this to share with "view" mode,
  flex: 1,
  outline: "none", // Hide the focus outline
  resize: "none", // Hide the resize handle.
  color: "rgba(0, 0, 0, 0.870588)" // TODO: Pull this from the color scheme
};

const autoFocusRef = input => input && input.focus();
type Props = {
  content: string,
  onChange: () => void,
  placeholder: string
};

const Editor = ({ content, onChange, placeholder }: Props) =>
  <div style={wrapperStyle}>
    <textarea
      onChange={onChange}
      value={content}
      style={style}
      placeholder={placeholder}
      ref={autoFocusRef}
    />
  </div>;

export default Editor;

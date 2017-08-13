// @flow
import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import ReactHighlightWords from "react-highlight-words";

const HIGHLIGHTED_CLASS_NAME = "highlighted";

type Props = {
  children: string,
  query: ?string
};

class Highlighter extends Component {
  props: Props;
  state = {};
  node: ?Element;

  constructor(props: Props) {
    super(props);
    this.state = { offsetTop: 0 };
    this.node = null;
  }
  componentDidMount() {
    // $FlowFixMe Flow does not know that this will always be the wrapping div.
    this.node = findDOMNode(this);
    this.focusHighlight();
  }
  componentDidUpdate(prevProps: Props) {
    if (
      this.props.query !== prevProps.query ||
      this.props.children !== prevProps.children
    ) {
      this.focusHighlight();
    }
  }
  focusHighlight() {
    const { node } = this;
    if (!node) {
      return;
    }
    const highlights = node.getElementsByClassName(HIGHLIGHTED_CLASS_NAME);
    const firstHighlight = highlights.length ? highlights[0] : null;
    if (!firstHighlight) {
      return;
    }
    const { offsetTop } = firstHighlight;
    // Be careful not to cause an infinite loop.
    if (offsetTop !== this.state.offsetTop) {
      this.setState({ offsetTop });
    }
  }
  render() {
    return (
      <div style={{ marginTop: -this.state.offsetTop, position: "relative" }}>
        <ReactHighlightWords
          autoEscape={true}
          highlightClassName={HIGHLIGHTED_CLASS_NAME}
          searchWords={[this.props.query]}
          textToHighlight={this.props.children}
        />
      </div>
    );
  }
}

export default Highlighter;

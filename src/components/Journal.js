import React, { Component } from "react";
import { connect } from "react-redux";
import AddBox from "material-ui/svg-icons/content/add-box";
import Search from "material-ui/svg-icons/action/search";
import ArrowBack from "material-ui/svg-icons/navigation/arrow-back";
import { List } from "material-ui/List";
import AppBar from "material-ui/AppBar";
import Divider from "material-ui/Divider";
import IconButton from "material-ui/IconButton";
import Subheader from "material-ui/Subheader";
import TextField from "material-ui/TextField";
import muiThemeable from "material-ui/styles/muiThemeable";

import { getEntriesAsArray, getEntriesContainingString } from "../accessors";
import {
  addEntryForToday,
  toggleDrawer,
  showSearchInput,
  hideSearchInput
} from "../actionCreators";
import EntryListItem from "./EntryListItem";
import JournalContent from "./JournalContent";
import { getHeading } from "../utils";

const mapStateToProps = state => ({
  entries: getEntriesAsArray(
    getEntriesContainingString(state, state.view.searchQuery)
  ),
  // TODO: Move to acessor
  showDrawer: state.view.showDrawer,
  shouldShowSearchInput: state.view.showSearchInput,
  searchQuery: state.view.searchQuery
});

const setSearchQuery = e => ({
  type: "SET_SEARCH_QUERY",
  query: e.target.value
});

const connectJounral = connect(mapStateToProps, {
  addEntryForToday,
  toggleDrawer,
  setSearchQuery,
  showSearchInput,
  hideSearchInput
});

class MainHeading extends React.Component {
  componentDidMount() {
    window.document.addEventListener("keydown", this._handleKeyPress);
  }
  componentWillUnmount() {
    window.document.removeEventListener("keydown", this._handleKeyPress);
  }

  _handleKeyPress = e => {
    if (e.key === "/") {
      this.props.showSearchInput();
      e.preventDefault();
    }
  };

  render() {
    const { props } = this;
    return (
      <AppBar
        title={"Markdown Today"}
        titleStyle={{ textAlign: "center" }}
        onLeftIconButtonTouchTap={props.toggleDrawer}
        iconElementRight={
          <span>
            <IconButton tooltip="Search" onTouchTap={props.showSearchInput}>
              {" "}<Search color={props.muiTheme.appBar.textColor} />{" "}
            </IconButton>{" "}
            <IconButton tooltip="New" onTouchTap={props.addEntryForToday}>
              {" "}<AddBox color={props.muiTheme.appBar.textColor} />{" "}
            </IconButton>{" "}
          </span>
        }
      />
    );
  }
}

MainHeading = muiThemeable()(connectJounral(MainHeading));

class SearchHeading extends React.Component {
  componentDidMount(prevProps) {
    this.inputNode.focus();
  }
  componentWillUnmount() {
    this.props.hideSearchInput();
  }
  _handleChange = e => {
    switch (e.key) {
      case "Enter":
        // TODO: Open the selected entry
        break;
      case "ArrowDown":
        // TODO: Move the selected entry down
        break;
      case "ArrowUp":
        // TODO: Move the selected entry up
        break;
      case "Escape":
        this.props.hideSearchInput();
        break;
      default:
        break;
    }
  };
  render() {
    return (
      <AppBar
        title={
          <TextField
            value={this.props.searchQuery || ""}
            onKeyDown={this._handleChange}
            onChange={this.props.setSearchQuery}
            ref={node => (this.inputNode = node)}
            inputStyle={{
              color: this.props.muiTheme.appBar.textColor,
              fontSize: "20px"
            }}
            hintStyle={{ color: this.props.muiTheme.tabs.textColor }}
            hintText="Search"
          />
        }
        iconElementLeft={
          <IconButton>
            <ArrowBack />
          </IconButton>
        }
        onLeftIconButtonTouchTap={this.props.hideSearchInput}
      />
    );
  }
}

SearchHeading = muiThemeable()(connectJounral(SearchHeading));

class Journal extends Component {
  render() {
    return (
      <div>
        {this.props.shouldShowSearchInput ? <SearchHeading /> : <MainHeading />}
        <JournalContent isLoading={!this.props.entries}>
          {/* TODO: Indicate when we are searching but there are no matches */}
          {() =>
            <List>
              {this.props.entries.reduce((memo, entry, i, entries) => {
                const previous = entries[i - 1];
                const previousDate = previous && previous.date;
                return memo.concat([
                  <Subheader key={`heading-${entry.id}`}>
                    {getHeading(previousDate, entry.date)}
                  </Subheader>,
                  <EntryListItem id={entry.id} key={`entry-${entry.id}`} />,
                  <Divider inset={true} key={`divider-${entry.id}`} />
                ]);
              }, [])}
            </List>}
        </JournalContent>
      </div>
    );
  }
}

export default connectJounral(Journal);

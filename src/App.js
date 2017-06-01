import { Router, Route, browserHistory } from "react-router";
import React, { Component } from "react";
import injectTapEventPlugin from "react-tap-event-plugin";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Provider } from "react-redux";

import Journal from "./components/Journal";
import JournalCalendar from "./components/JournalCalendar";
import JournalRead from "./components/JournalRead";
import Entry from "./components/Entry";
import EditEntry from "./components/EditEntry";
import "./App.css";
import JournalDrawer from "./components/JournalDrawer";
import PasswordPrompt from "./components/PasswordPrompt";
import ChangePassword from "./components/ChangePassword";
import SetPassword from "./components/SetPassword";
import RemovePassword from "./components/RemovePassword";
import Login from "./components/Login";
import Auth from "./components/Auth";
import Notifications from "./components/Notifications";
import { downloadJournal } from "./actionCreators";
import { getEntries, isLoggedIn } from "./accessors";
import { getStore } from "./store";

const store = getStore();
function requireAuth(nextState, replace) {
  const state = store.getState();
  if (!isLoggedIn(state)) {
    // TODO: Stash redirect URL
    replace({ pathname: "/" });
  } else if (!getEntries(state)) {
    store.dispatch(downloadJournal());
  }
}

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const Routes = props => (
  <Router history={browserHistory}>
    <Route path="/journal/" component={Journal} onEnter={requireAuth} />
    <Route
      path="/journal/calendar/"
      component={JournalCalendar}
      onEnter={requireAuth}
    />
    <Route
      path="/journal/read/"
      component={JournalRead}
      onEnter={requireAuth}
    />
    <Route path="/journal/entry/:id" component={Entry} onEnter={requireAuth} />
    <Route
      path="/journal/entry/:id/edit"
      component={EditEntry}
      onEnter={requireAuth}
    />
    <Route path="/" component={Login} />
    <Route path="/auth/" component={Auth} />
  </Router>
);

class WrappedApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider>
          <div>
            <JournalDrawer />
            <Notifications />
            <ChangePassword />
            <SetPassword />
            <RemovePassword />
            <PasswordPrompt />
            <Routes />
          </div>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default WrappedApp;

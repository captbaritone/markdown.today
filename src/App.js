import { Router, Route, browserHistory } from "react-router";
import React, { Component } from "react";
import injectTapEventPlugin from "react-tap-event-plugin";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Provider } from "react-redux";
import { routerMiddleware } from "react-router-redux";
import { compose, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import persistState from "redux-localstorage";

import Home from "./components/Home.js";
import Entry from "./components/Entry.js";
import EditEntry from "./components/EditEntry.js";
import "./App.css";
import reducer from "./reducers";
import JournalDrawer from "./components/JournalDrawer";
import PasswordPrompt from "./components/PasswordPrompt";
import ChangePassword from "./components/ChangePassword";
import SetPassword from "./components/SetPassword";
import RemovePassword from "./components/RemovePassword";
import Login from "./components/Login";
import Auth from "./components/Auth";
import Notifications from "./components/Notifications";
import { downloadJournal } from "./actionCreators";
import { getEntries, getAuthToken, isLoggedIn } from "./accessors";

const slicer = paths => {
  return state => {
    return Object.assign({}, {
      dropbox: {
        authToken: getAuthToken(state)
      }
    });
  };
};

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  // TODO: Consider raven-for-redux middleware
  compose(
    persistState("dropbox", { slicer }),
    applyMiddleware(thunk, routerMiddleware(browserHistory))
  )
);

function requireAuth(nextState, replace) {
  const state = store.getState();
  if (!isLoggedIn(state)) {
    // TODO: Stash redirect URL
    replace({ pathname: "/login/" });
  } else if (!getEntries(state)) {
    // TODO: Consider storing this in local storage?
    store.dispatch(downloadJournal());
  }
}

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const Routes = props => (
  <Router history={browserHistory}>
    <Route path="/" component={Home} onEnter={requireAuth} />
    <Route path="/entry/:id" component={Entry} onEnter={requireAuth} />
    <Route path="/entry/:id/edit" component={EditEntry} onEnter={requireAuth} />
    <Route path="/login/" component={Login} />
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

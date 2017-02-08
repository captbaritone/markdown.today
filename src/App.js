import { Router, Route, browserHistory } from "react-router";
import React, { Component } from "react";
import injectTapEventPlugin from "react-tap-event-plugin";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Provider } from "react-redux";
import { routerMiddleware } from "react-router-redux";

import { compose, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import Home from "./Home.js";
import Entry from "./Entry.js";
import EditEntry from "./EditEntry.js";
import "./App.css";
import reducer from "./reducer";
import JournalDrawer from "./JournalDrawer";
import Login from "./Login";
import Auth from "./Auth";
import { downloadJournal } from "./actionCreators";
import persistState from "redux-localstorage";

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  // TODO: Consider raven-for-redux middleware
  compose(
    persistState("dropbox"),
    applyMiddleware(thunk, routerMiddleware(browserHistory))
  )
);

// TODO: Consider storing this in local storage
store.dispatch(downloadJournal());

function requireAuth(nextState, replace) {
  const state = store.getState();
  if (!state.dropbox.authToken) {
    // TODO: Stash redirect URL
    replace({ pathname: "/login/" });
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
            <Routes />
          </div>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default WrappedApp;

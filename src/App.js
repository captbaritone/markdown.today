import { Router, Route, browserHistory } from "react-router";
import React, { Component } from "react";
import injectTapEventPlugin from "react-tap-event-plugin";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Provider } from "react-redux";
import { routerMiddleware } from "react-router-redux";
import { SET_FROM_MD } from "./actionTypes";

import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import Home from "./Home.js";
import Entry from "./Entry.js";
import EditEntry from "./EditEntry.js";
import "./App.css";
import reducer from "./reducer";
import JournalDrawer from "./JournalDrawer";

//import Dropbox from "dropbox";
const md = `## 2016-06-20

Today I had a great time:

* I Wrote an app
* Had fun

I even heared this great quote:

> I heard a great quote.

## 2016-03-11

Today was meh. Not much happened. I _think_ it was okay.
`;

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk, routerMiddleware(browserHistory))
);

/*
var dbx = new Dropbox({ accessToken: 'dz6E5r3zLiMAAAAAAADZ0Oq9c-mU7H_UQITuvC-I_2RKLgpFpbXeslZbXl5wFoRE' });
dbx.filesDownload({path: '/Apps/markdown-journal/journal.md'})
    .then(function(response) {
        var myReader = new FileReader(); 
        myReader.addEventListener("loadend", function(e){
            store.dispatch({type: SET_FROM_MD, md: e.srcElement.result});
        });
        myReader.readAsText(response.fileBlob);
    })
    .catch(function(error) {
        console.log(error);
    });
*/
store.dispatch({ type: SET_FROM_MD, md });

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const Routes = props => (
  <Router history={browserHistory}>
    <Route path="/" component={Home} />
    <Route path="/entry/:id" component={Entry} />
    <Route path="/entry/:id/edit" component={EditEntry} />
    {}
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

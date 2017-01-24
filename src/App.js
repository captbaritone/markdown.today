import {Router, Route, browserHistory} from 'react-router'
import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Provider} from 'react-redux';
import { routerMiddleware, routerReducer } from 'react-router-redux'

import {createStore, applyMiddleware, combineReducers} from 'redux';
import Home from './Home.js';
import Entry from './Entry.js';
import EditEntry from './EditEntry.js';
import {entriesFromMarkdown} from './utils';
import './App.css';
import getTime from 'date-fns/get_time'

const md = `## 2016-06-20

Today I had a great time:

* I Wrote an app
* Had fun

I even heared this great quote:

> I heard a great quote.

## 2016-03-11

Today was meh. Not much happened. I _think_ it was okay.
`;

const entryObj = entriesFromMarkdown(md);
const reducer = (previousState = entryObj, action) => {
    switch (action.type) {
        case 'EDIT_ENTRY':
            return Object.assign({}, previousState, {
                [action.id]: Object.assign({}, previousState[action.id], {markdown: action.markdown})
            });
        case 'DELETE_ENTRY':
            return Object.assign({}, previousState, {
                [action.id]: undefined
            });
        case 'ADD_ENTRY':
            const newId = Math.max.apply(null, Object.keys(previousState)) + 1;
            const newEntry = {
                id: newId,
                date: getTime(new Date()),
                markdown: ''
            };
            // FIXME
            return Object.assign({}, previousState, {
                [newEntry.id]: newEntry
            });
        default:
            return previousState;
    }

};

const combinedReducers = combineReducers({
      journal: reducer,
      routing: routerReducer
})

const store = createStore(
    combinedReducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(routerMiddleware(browserHistory))
);

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const Routes = (props) => (
    <Router history={browserHistory}>
        <Route path="/" component={Home} />
        <Route path="/entry/:id" component={Entry} />
        <Route path="/entry/:id/edit" component={EditEntry} />
    {/*<Route path="*" component={NoMatch}/>*/}
    </Router>
);

class WrappedApp extends Component {
  render() {
    return (
        <Provider store={store}>
            <MuiThemeProvider>
                <Routes />
            </MuiThemeProvider>
        </Provider>
    );
  }
}

export default WrappedApp;

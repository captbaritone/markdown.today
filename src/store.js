// @flow
import type { ThunkOrActionType } from "./actionCreators";
import type { ActionType } from "./actionTypes";
import type { AppState } from "./reducers";
import type { Store as ReduxStore } from "redux";

import { browserHistory } from "react-router";
import { routerMiddleware } from "react-router-redux";
import { compose, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import persistState from "redux-localstorage";

import reducer from "./reducers";
import { getAuthToken } from "./accessors";
import dropboxMiddleware from "./dropboxMiddleware";

export type Dispatch = (action: ThunkOrActionType) => void;
export type Store = ReduxStore<AppState, ActionType>;

export const getStore = (): Store => {
  const slicer = paths => {
    return (state: AppState) => {
      return Object.assign(
        {},
        {
          dropbox: {
            authToken: getAuthToken(state)
          }
        }
      );
    };
  };

  return createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
    compose(
      persistState("dropbox", { slicer }),
      applyMiddleware(
        thunk,
        routerMiddleware(browserHistory),
        dropboxMiddleware
      )
    )
  );
};

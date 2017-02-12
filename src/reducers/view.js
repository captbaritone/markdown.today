import { TOGGLE_DRAWER, SET_DRAWER_VISIBILITY } from "../actionTypes";

const defaultViewState = { showDrawer: false };

const view = (previousState = defaultViewState, action) => {
  switch (action.type) {
    case TOGGLE_DRAWER:
      return Object.assign({}, previousState, {
        showDrawer: !previousState.showDrawer
      });
    case SET_DRAWER_VISIBILITY:
      return Object.assign({}, previousState, {
        showDrawer: action.value
      });
    default:
      return previousState;
  }
};

export default view;

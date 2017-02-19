import {
  TOGGLE_DRAWER,
  SET_DRAWER_VISIBILITY,
  SHOW_SETTINGS,
  HIDE_SETTINGS
} from "../actionTypes";

const defaultViewState = { showDrawer: false, showSettings: false };

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
    case SHOW_SETTINGS:
      return Object.assign({}, previousState, {
        showSettings: true
      });
    case HIDE_SETTINGS:
      return Object.assign({}, previousState, {
        showSettings: false
      });
    default:
      return previousState;
  }
};

export default view;

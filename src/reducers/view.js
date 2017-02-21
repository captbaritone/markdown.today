import {
  TOGGLE_DRAWER,
  SET_DRAWER_VISIBILITY,
  SHOW_CHANGE_PASSWORD,
  HIDE_CHANGE_PASSWORD,
  ADD_NOTIFICATION,
  RESOLVE_FIRST_NOTIFICATION
} from "../actionTypes";

const defaultViewState = {
  showDrawer: false,
  showChangePassword: false,
  notifications: []
};

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
    case SHOW_CHANGE_PASSWORD:
      return Object.assign({}, previousState, {
        showChangePassword: true
      });
    case HIDE_CHANGE_PASSWORD:
      return Object.assign({}, previousState, {
        showChangePassword: false
      });
    case ADD_NOTIFICATION:
      return Object.assign({}, previousState, {
        notifications: [...previousState.notifications, action.notification]
      });
    case RESOLVE_FIRST_NOTIFICATION:
      return Object.assign({}, previousState, {
        notifications: previousState.notifications.slice(1)
      });
    default:
      return previousState;
  }
};

export default view;

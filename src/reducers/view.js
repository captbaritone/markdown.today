import {
  TOGGLE_DRAWER,
  SET_DRAWER_VISIBILITY,
  SHOW_CHANGE_PASSWORD,
  HIDE_CHANGE_PASSWORD,
  SHOW_SET_PASSWORD,
  HIDE_SET_PASSWORD,
  SHOW_REMOVE_PASSWORD,
  HIDE_REMOVE_PASSWORD,
  ADD_NOTIFICATION,
  RESOLVE_FIRST_NOTIFICATION,
  SET_SEARCH_QUERY
} from "../actionTypes";

const defaultViewState = {
  showDrawer: false,
  showChangePassword: false,
  showSetPassword: false,
  showRemovePassword: false,
  notifications: [],
  searchQuery: null
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
    case SHOW_SET_PASSWORD:
      return Object.assign({}, previousState, {
        showSetPassword: true
      });
    case HIDE_SET_PASSWORD:
      return Object.assign({}, previousState, {
        showSetPassword: false
      });
    case SHOW_REMOVE_PASSWORD:
      return Object.assign({}, previousState, {
        showRemovePassword: true
      });
    case HIDE_REMOVE_PASSWORD:
      return Object.assign({}, previousState, {
        showRemovePassword: false
      });
    case ADD_NOTIFICATION:
      return Object.assign({}, previousState, {
        notifications: [...previousState.notifications, action.notification]
      });
    case RESOLVE_FIRST_NOTIFICATION:
      return Object.assign({}, previousState, {
        notifications: previousState.notifications.slice(1)
      });
    case SET_SEARCH_QUERY:
      return Object.assign({}, previousState, { searchQuery: action.query });
    default:
      return previousState;
  }
};

export default view;

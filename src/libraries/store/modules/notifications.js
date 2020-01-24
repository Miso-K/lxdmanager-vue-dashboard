export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

let timer;

/**
 * Initial state
 * @type {Object}
 */
const notificationsState = {
  active: false,
  messages: []
};

/**
 * Getters
 * @type {Object}
 */
const notificationsGetters = {
  notifications: state => state.notifications
};

/* eslint-disable no-param-reassign */
/**
 * Mutations
 * @type {Object}
 */
const notificationsMutations = {
  [ADD_NOTIFICATION]: (state, n) => {
    state.messages.push({ message: n.message, id: n.id, color: n.color ? n.color : '' });
  },
  [OPEN_SNACKBAR]: (state) => {
    state.active = true;
    // console.log(state, id);
    // state.messages
  },
  [CLOSE_SNACKBAR]: (state) => {
    state.active = false;
    state.messages.splice(0, 1);
    // console.log(state);
  }
};
/* eslint-enable no-param-reassign */

/**
 * Actions
 * @type {Object}
 */
const notificationsActions = {
  notify({ state, commit }, msg) {
    // console.log('NOTIFY');
    commit(ADD_NOTIFICATION, msg);

    commit(OPEN_SNACKBAR);

    timer = setInterval(() => {
      // console.log('setInterval');

      commit(CLOSE_SNACKBAR);

      if (state.messages.length > 1) {
        commit(OPEN_SNACKBAR);
      } else {
        clearInterval(timer);
      }
    }, 5000);
  },
  closeNotif() {
    // console.log('closeNotif');
  }
};

// Export module
export default {
  state: notificationsState,
  getters: notificationsGetters,
  mutations: notificationsMutations,
  actions: notificationsActions
};

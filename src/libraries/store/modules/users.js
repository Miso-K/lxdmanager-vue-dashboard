import _map from 'lodash/map';
import { MeService, UsersService } from '../../services';
import formatUser from '../../utils/format/user';
import { formatCreateUser, formatUpdateUser } from '../../utils/format/userActions';
import storage from '../../utils/storage';
import i18n from '../../i18n';

export const USERS_REQUEST = 'USERS_REQUEST';
export const USERS_SUCCESS = 'USERS_SUCCESS';
export const USERS_FAILURE = 'USERS_FAILURE';
export const ME_SUCCESS = 'ME_SUCCESS';
export const SET_OTP_SECRET = 'SET_OTP_SECRET';

export const STORAGE_USERS_KEY = 'STORAGE_USERS';
export const STORAGE_LANGUAGE_KEY = 'STORAGE_LANGUAGE';

const storedUsers = storage.get(STORAGE_USERS_KEY);
const storedLanguage = storage.get(STORAGE_LANGUAGE_KEY);
/**
 * Initial state
 * @type {Object}
 */
const usersState = {
  // instances: storedInstances || [],
  users: storedUsers || [],
  myself: {},
  language: storedLanguage || 'en',
  otp: {},
  loading: false
};

/**
 * Getters
 * @type {Object}
 */
const usersGetters = {
  myself: state => state.myself,
  language: state => state.language,
  users: state => state.users,
  user: state => id => state.users[id],
  usersTableData(state, getters) {
    if (Object.keys(getters.users).length === 0) return false;
    return _map(getters.users, user => formatUser(user)); // eslint-disable-line max-len
  }
};

/**
 * Mutations
 * @type {Object}
 */
const usersMutations = {
  [USERS_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [USERS_SUCCESS]: (state, users) => {
    Object.assign(state, { ...users, loading: false });
    storage.set(STORAGE_USERS_KEY, users.users);
  },
  [USERS_FAILURE]: (state, err) => {
    console.log(USERS_FAILURE, err);
    Object.assign(state, { loading: false });
    storage.remove(STORAGE_USERS_KEY);
  },
  [ME_SUCCESS]: (state, myself) => {
    Object.assign(state, { myself, loading: false });
    // console.log(myself);
    storage.set(STORAGE_LANGUAGE_KEY, myself.language);
  },
  [SET_OTP_SECRET]: (state, otp) => {
    Object.assign(state, { otp, loading: false });
  }
};

/**
 * Actions
 * @type {Object}
 */
const usersActions = {
  fetchMe({ commit }) {
    commit(USERS_REQUEST);

    MeService.get().then((res) => {
      i18n.locale = res.data.data.language;
      commit(ME_SUCCESS, res.data.data);
    }).catch((err) => {
      commit(USERS_FAILURE, err);
    });
  },

  fetchUsers({ commit }) {
    commit(USERS_REQUEST);

    UsersService.get().then((res) => {
      // console.log(res);
      res.users = res.data.data;
      commit(USERS_SUCCESS, res);
    }).catch((err) => {
      commit(USERS_FAILURE, err);
    });
  },

  createUser({ commit }, data) {
    commit(USERS_REQUEST);
    console.log(data);
    const obj = formatCreateUser(data);
    // console.log(obj);
    return UsersService.post(obj).then((res) => {
      // console.log(res);
      commit(USERS_SUCCESS, res.data.data);
    }).catch((err) => {
      commit(USERS_FAILURE, err);
    });
  },

  updateUser({ commit }, data) {
    commit(USERS_REQUEST);
    // console.log('update log:');
    // console.log(data);

    const obj = formatUpdateUser(data);
    console.log(obj);
    return UsersService.put(data.id, obj).then((res) => {
      // console.log(res);
      commit(USERS_SUCCESS, res.data);
    }).catch((err) => {
      commit(USERS_FAILURE, err);
    });
  },

  updateMe({ commit }, data) {
    commit(USERS_REQUEST);

    const obj = { data };
    obj.data.type = 'users';
    obj.data.postal_code = data.postal_code;

    return MeService.put(obj).then((res) => {
      // console.log(res);
      commit(USERS_SUCCESS, res.data);
    }).catch((err) => {
      commit(USERS_FAILURE, err);
    });
  },

  otpMe({ commit }) {
    commit(USERS_REQUEST);
    MeService.otp().then((res) => {
      // console.log(res.otp[0].attributes);
      res.otp = res.data.data;
      commit(SET_OTP_SECRET, res.otp);
    }).catch((err) => {
      commit(USERS_FAILURE, err);
    });
  },

  deleteUser({ commit }, id) {
    commit(USERS_REQUEST);
    UsersService.delete(id).then((res) => {
      commit(USERS_SUCCESS, res);
    }).catch((err) => {
      commit(USERS_FAILURE, err);
    });
  }
};

// Export module
export default {
  state: usersState,
  getters: usersGetters,
  mutations: usersMutations,
  actions: usersActions
};

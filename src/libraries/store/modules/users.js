import _map from 'lodash/map';
import { MeService, UsersService } from '../../services';
import formatUser from '../../utils/format/user';

export const USERS_REQUEST = 'USERS_REQUEST';
export const USERS_SUCCESS = 'USERS_SUCCESS';
export const USERS_FAILURE = 'USERS_FAILURE';
export const SET_OTP_SECRET = 'SET_OTP_SECRET';

/**
 * Initial state
 * @type {Object}
 */
const usersState = {
  users: {},
  myself: {},
  otp: {},
  loading: false
};

/**
 * Getters
 * @type {Object}
 */
const usersGetters = {
  myself: state => state.myself,
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
  },
  [USERS_FAILURE]: (state, err) => {
    console.log(USERS_FAILURE, err);
    Object.assign(state, { loading: false });
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
      // console.log(res.data.data);
      res.myself = res.data.data;
      commit(USERS_SUCCESS, res);
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
    // console.log('create log:');
    // console.log(data);

    const obj = {
      data: {
        type: 'users',
        admin: false,
        username: data.username,
        name: data.name,
        email: data.email,
        password: data.password,
        relationships: {
          groups: [
            {
              type: 'groups',
              id: 2
            }
          ],
          containers: data.containers ? data.containers.map(c => ({
            type: 'containers',
            id: c
          })) : []
        }
      }
    };
    if (data.phone !== '') {
      obj.data.phone = data.phone;
    }
    if (data.address !== '') {
      obj.data.address = data.address;
    }
    if (data.city !== '') {
      obj.data.city = data.city;
    }
    if (data.country !== '') {
      obj.data.country = data.country;
    }
    if (data.postal_code !== '') {
      obj.data.postal_code = data.postal_code;
    }
    if (data.ico !== '') {
      obj.data.ico = data.ico;
    }
    if (data.ic_dph !== '') {
      obj.data.ic_dph = data.ic_dph;
    }
    if (data.dic !== '') {
      obj.data.dic = data.dic;
    }
    if (data.language !== '') {
      obj.data.language = data.language;
    }
    if (data.otp_type !== '' && data.otp_type) {
      obj.data.otp_type = data.otp_type;
    }
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

    const obj = {
      data: {
        type: 'users',
        id: data.id,
        username: data.username,
        name: data.name,
        email: data.email,
        relationships: {
          groups: [
            {
              type: 'groups',
              id: 2
            }
          ],
          containers: data.containers ? data.containers.map(c => ({
            type: 'containers',
            id: c
          })) : []
        }
      }
    };
    if (data.password !== '' && data.password) {
      obj.data.password = data.password;
    }
    if (data.phone !== '' && data.phone) {
      obj.data.phone = data.phone;
    }
    if (data.address !== '' && data.address) {
      obj.data.address = data.address;
    }
    if (data.city !== '' && data.city) {
      obj.data.city = data.city;
    }
    if (data.country !== '' && data.country) {
      obj.data.country = data.country;
    }
    if (data.postal_code !== '' && data.postal_code) {
      obj.data.postal_code = data.postal_code;
    }
    if (data.ico !== '' && data.ico) {
      obj.data.ico = data.ico;
    }
    if (data.ic_dph !== '' && data.ic_dph) {
      obj.data.ic_dph = data.ic_dph;
    }
    if (data.dic !== '' && data.dic) {
      obj.data.dic = data.dic;
    }
    if (data.language !== '' && data.language) {
      obj.data.language = data.language;
    }
    if (data.otp_type !== '' && data.otp_type) {
      obj.data.otp_type = data.otp_type;
    }
    // console.log(obj);
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

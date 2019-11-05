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
  otp: {},
  loading: true
};

/**
 * Getters
 * @type {Object}
 */
const usersGetters = {
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
      commit(USERS_SUCCESS, res);
    }).catch((err) => {
      commit(USERS_FAILURE, err);
    });
  },

  fetchUsers({ commit }) {
    commit(USERS_REQUEST);

    UsersService.get().then((res) => {
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
        attributes: {
          admin: false,
          username: data.username,
          name: data.name,
          email: data.email,
          password: data.password
        },
        relationships: {
          groups: {
            data: [
              {
                type: 'groups',
                id: 2
              }
            ]
          },
          containers: {
            data: data.containers ? data.containers.map(c => ({
              type: 'containers',
              id: c
            })) : []
          }
        }
      }
    };
    if (data.phone !== '') {
      obj.data.attributes.phone = data.phone;
    }
    if (data.address !== '') {
      obj.data.attributes.address = data.address;
    }
    if (data.city !== '') {
      obj.data.attributes.city = data.city;
    }
    if (data.country !== '') {
      obj.data.attributes.country = data.country;
    }
    if (data.postal_code !== '') {
      obj.data.attributes.postal_code = data.postal_code;
    }
    if (data.ico !== '') {
      obj.data.attributes.ico = data.ico;
    }
    if (data.ic_dph !== '') {
      obj.data.attributes.ic_dph = data.ic_dph;
    }
    if (data.dic !== '') {
      obj.data.attributes.dic = data.dic;
    }
    if (data.language !== '') {
      obj.data.attributes.language = data.language;
    }
    if (data.otp_type !== '' && data.otp_type) {
      obj.data.attributes.otp_type = data.otp_type;
    }
    // console.log(obj);
    return UsersService.post(obj).then((res) => {
      // console.log(res);
      commit(USERS_SUCCESS, res.data);
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
        attributes: {
          username: data.username,
          name: data.name,
          email: data.email
        },
        relationships: {
          groups: {
            data: [
              {
                type: 'groups',
                id: 2
              }
            ]
          },
          containers: {
            data: data.containers ? data.containers.map(c => ({
              type: 'containers',
              id: c
            })) : []
          }
        }
      }
    };
    if (data.password !== '' && data.password) {
      obj.data.attributes.password = data.password;
    }
    if (data.phone !== '' && data.phone) {
      obj.data.attributes.phone = data.phone;
    }
    if (data.address !== '' && data.address) {
      obj.data.attributes.address = data.address;
    }
    if (data.city !== '' && data.city) {
      obj.data.attributes.city = data.city;
    }
    if (data.country !== '' && data.country) {
      obj.data.attributes.country = data.country;
    }
    if (data.postal_code !== '' && data.postal_code) {
      obj.data.attributes.postal_code = data.postal_code;
    }
    if (data.ico !== '' && data.ico) {
      obj.data.attributes.ico = data.ico;
    }
    if (data.ic_dph !== '' && data.ic_dph) {
      obj.data.attributes.ic_dph = data.ic_dph;
    }
    if (data.dic !== '' && data.dic) {
      obj.data.attributes.dic = data.dic;
    }
    if (data.language !== '' && data.language) {
      obj.data.attributes.language = data.language;
    }
    if (data.otp_type !== '' && data.otp_type) {
      obj.data.attributes.otp_type = data.otp_type;
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

    const obj = {
      data: {
        type: 'users',
        attributes: data
      }
    };
    obj.data.attributes.postal_code = data.postal_code;

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
      commit(SET_OTP_SECRET, res.otp[0].attributes);
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

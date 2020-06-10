import jwtDecode from 'jwt-decode';
import { AuthService } from '../../services';
import { getUserAbilities } from '../../utils/auth';
import storage from '../../utils/storage';

export const STORAGE_TOKEN_KEY = 'lwp_token';
export const STORAGE_REFRESH_TOKEN_KEY = 'lwp_token2';
export const STORAGE_ME_KEY = 'lwp_me';

export const TOKEN_REQUEST = 'TOKEN_REQUEST';
export const TOKEN_SUCCESS = 'TOKEN_SUCCESS';
export const TOKEN_FAILURE = 'TOKEN_FAILURE';

export const CHECK_TOKEN_REQUEST = 'CHECK_TOKEN_REQUEST';
export const CHECK_TOKEN_SUCCESS = 'CHECK_TOKEN_SUCCESS';
export const CHECK_TOKEN_FAILURE = 'CHECK_TOKEN_FAILURE';

export const LOGOUT = 'LOGOUT';

const storedToken = storage.get(STORAGE_TOKEN_KEY);
const storedRefreshToken = storage.get(STORAGE_REFRESH_TOKEN_KEY);

/**
 * Initial state
 * @type {Object}
 */
const authState = {
  token: storedToken || null,
  refresh_token: storedRefreshToken || null,
  otp_token: null,
  otp_confirmed: null
};

/**
 * Getters
 * @type {Object}
 */
const authGetters = {
  token: state => state.token,
  refresh_token: state => state.refresh_token,
  otp_token: state => state.otp_token,
  otpConfirmed: state => state.otp_confirmed,
  identity: ({ token }) => token ? jwtDecode(token).identity : null, // eslint-disable-line no-confusing-arrow,max-len
  me(state, getters, rootState, { myself, groups, abilities }) {
    // const index = users.findIndex(e => e.id === getters.identity);
    return {
      ...myself,
      abilities: getUserAbilities({ myself, groups, abilities }, getters.identity)
      // groups: getUserGroups({ myself, groups }, getters.identity)
    };
  }
};

/**
 * Mutations
 * @type {Object}
 */
const authMutations = {
  [TOKEN_REQUEST]: () => {
    console.log('fetching token...');
  },
  [TOKEN_SUCCESS]: (state, data) => {
    Object.assign(state, {
      token: data.access_token,
      // eslint-disable-next-line max-len
      refresh_token: data.refresh_token ? data.refresh_token : storage.get(STORAGE_REFRESH_TOKEN_KEY),
      otp_confirmed: jwtDecode(data.access_token).user_claims.otp_confirmed,
      me: jwtDecode(data.access_token).identity
    });
    // eslint-disable-next-line max-len
    storage.set(STORAGE_TOKEN_KEY, data.access_token);
    // eslint-disable-next-line max-len
    storage.set(STORAGE_REFRESH_TOKEN_KEY, data.refresh_token ? data.refresh_token : storage.get(STORAGE_REFRESH_TOKEN_KEY));
  },
  [TOKEN_FAILURE]: (state, err) => {
    console.log(TOKEN_FAILURE, err);
    Object.assign(state, { token: null, me: null });
    storage.remove(STORAGE_TOKEN_KEY);
    storage.remove(STORAGE_REFRESH_TOKEN_KEY);
  },
  [LOGOUT]: (state) => {
    Object.assign(state, { token: null, me: null });
    storage.remove(STORAGE_TOKEN_KEY);
    storage.remove(STORAGE_REFRESH_TOKEN_KEY);
    location.reload();
  }
};

/**
 * Actions
 * @type {Object}
 */
const authActions = {
  token({ commit }, { username, password }) {
    commit(TOKEN_REQUEST);

    return AuthService.token({
      username: username.trim(),
      password: password.trim()
    }).then((res) => {
      // console.log(res.data);
      commit(TOKEN_SUCCESS, res.data);
    }).catch((err) => {
      commit(TOKEN_FAILURE, err);
    });
  },

  checkToken({ commit, getters }) {
    return new Promise((resolve) => {
      // validate local store
      if (!getters.token) {
        return resolve(false);
      }

      // remote
      AuthService.check()
        .then(() => resolve(true))
        .catch((err) => {
          commit(TOKEN_FAILURE, err);
          return resolve(false);
        });

      return undefined;
    });
  },

  otpToken({ commit }, { secret }) {
    commit(TOKEN_REQUEST);
    return AuthService.otpToken({
      secret: secret.trim()
    }).then((res) => {
      // console.log(res.data);
      commit(TOKEN_SUCCESS, res.data);
    }).catch((err) => {
      // console.log(err);
      commit(TOKEN_FAILURE, err);
    });
  },

  refreshToken({ commit }) {
    commit(TOKEN_REQUEST);
    // send refresh token as token
    storage.set(STORAGE_TOKEN_KEY, storage.get(STORAGE_REFRESH_TOKEN_KEY));
    return AuthService.refresh({}).then((res) => {
      // console.log(res);
      commit(TOKEN_SUCCESS, res.data);
    }).catch((err) => {
      commit(TOKEN_FAILURE, err);
    });
  },

  // logout({ commit }) {
  //  commit(LOGOUT);
  // }

  logout({ commit }) {
    // commit(LOGOUT);
    AuthService.logout({}).then(() => {
      commit(LOGOUT);
    }).catch((err) => {
      commit(TOKEN_FAILURE, err);
    });
  }
};

// Export module
export default {
  namespaced: true,
  state: authState,
  getters: authGetters,
  mutations: authMutations,
  actions: authActions
};

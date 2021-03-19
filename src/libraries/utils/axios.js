/* eslint-disable max-len */
import axios from 'axios';
// import normalize from 'json-api-normalizer';
import storage from './storage';
import { STORAGE_TOKEN_KEY, STORAGE_REFRESH_TOKEN_KEY } from '../store/modules/auth';
// import { STORAGE_REQUEST_TOKEN_KEY } from '../store/modules/auth';
import router from '../router';

// Vue.prototype.$URL
axios.get('static/config.json').then((response) => {
  const API_BASE_URL = `${response.data.API_BASE_URL}/api/v1`;
  const API_BASE_WS_URL = `${response.data.API_BASE_WS_URL}`;
  storage.set('API_BASE_URL', API_BASE_URL);
  storage.set('API_BASE_WS_URL', API_BASE_WS_URL);
});


const instance = axios.create({
  // baseURL: process.env.API_BASE_URL || '',
  baseURL: storage.get('API_BASE_URL') || process.env.API_BASE_URL,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Redirect to '/login' if API returns 401
instance.interceptors.response.use((response) => {
  // console.log(response);
  // const res = response.config.url.includes('auth') || response.config.url.includes('users') || response.config.url.includes('me') || response.config.url.includes('abilities') || response.config.url.includes('groups') || response.config.url.includes('containers') || response.config.url.includes('requests') || response.config.url.includes('operations') || response.config.url.includes('resources') || response.config.url.includes('stats') || response.config.url.includes('lxdconfig') || response.config.url.includes('images') ? response : normalize(response.data, { camelizeKeys: false });
  // const res = response.config.url.includes('auth') ? response : normalize(response.data, { camelizeKeys: false });
  // const res = response.config.url.includes('auth') ? response : response.data;
  // console.log(res);
  const res = response;
  return res;
}, (err) => {
  console.log('[AXIOS:response:error]', err, err.response);

  if (err.response.status && err.response.status === 401) {
    console.log('⛔️  Unauthorized');

    storage.remove(STORAGE_TOKEN_KEY);
    storage.remove(STORAGE_REFRESH_TOKEN_KEY);

    // router.replace({ name: 'login', query: { redirect: router.currentRoute.fullPath } });
    router.replace({ name: 'login' });
  }

  return Promise.reject(err);
});

// Set 'Authorization' header
instance.interceptors.request.use((requestConfig) => {
  const token = storage.get(STORAGE_TOKEN_KEY);

  const config = requestConfig;
  const headers = requestConfig.headers || {};
  config.headers = headers;

  if (token !== null && token !== 'undefined' && typeof token !== 'undefined') {
    headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;

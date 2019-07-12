import axios from 'axios';
import normalize from 'json-api-normalizer';
import storage from './storage';
import { STORAGE_TOKEN_KEY } from '../store/modules/auth';
import router from '../router';

const instance = axios.create({
  baseURL: process.env.API_BASE_URL || '',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Redirect to '/login' if API returns 401
instance.interceptors.response.use((response) => {
  // console.log(response);
  // const res = response.config.url.includes('auth')
  // || response.config.url.includes('containers') ? response : normalize(response.data);
  const res = response.config.url.includes('auth') ? response : normalize(response.data, { camelizeKeys: false });
  // console.log(res);
  return res;
}, (err) => {
  console.log('[AXIOS:response:error]', err, err.response);

  if (err.response.status && err.response.status === 401) {
    console.log('⛔️  Unauthorized');

    storage.remove(STORAGE_TOKEN_KEY);

    router.replace({ name: 'login', query: { redirect: router.currentRoute.fullPath } });
    // router.replace({ name: 'login' });
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

/**
 * Me service
 */

import { axios } from '../utils';

class Me {
  constructor(base) {
    this.base = base;
  }

  get() { // eslint-disable-line class-methods-use-this
    return axios.get(`/${this.base}`);
  }

  put(options) {
    const url = `/${this.base}`;
    return axios.put(url, options);
  }

  otp() {
    return axios.post(`/${this.base}/otp`);
  }
}

export default new Me('lgw/me');

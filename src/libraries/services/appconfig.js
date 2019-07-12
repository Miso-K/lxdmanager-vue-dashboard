/**
 * AppConfig service
 */

import { axios } from '../utils';

class AppConfig {
  constructor(base) {
    this.base = base;
  }

  get() { // eslint-disable-line class-methods-use-this
    return axios.get(`/${this.base}/lxdconfig`);
  }

  post(options) {
    const url = `/${this.base}/lxdconfig`;
    return axios.post(url, options);
  }

  postcerts(options) {
    return axios.post(`/${this.base}/lxdcerts`, options);
  }

}

export default new AppConfig('lgw');

/**
 * Request service
 */

import { axios } from '../utils';

class Request {
  constructor(base) {
    this.base = base;
  }

  get() { // eslint-disable-line class-methods-use-this
    return axios.get(`/${this.base}`);
  }

  request(options) {
    // console.log(this.base);
    return axios.post(`/${this.base}`, options);
  }
}

export default new Request('lgw/request');

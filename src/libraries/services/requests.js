/**
 * Requests service
 */

import { axios } from '../utils';

class Requests {
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

  put(id, options) {
    const url = `/${this.base}/${id}`;
    return axios.put(url, options);
  }
}

export default new Requests('lgw/requests');

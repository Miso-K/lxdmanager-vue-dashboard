/**
 * Resource class
 */

import { axios } from '../utils';

class Resource {
  constructor(base) {
    this.base = base;
  }

  get(id, options) {
    let url = `/${this.base}`;
    let opts = options;

    if (typeof id === 'object') {
      opts = id;
    } else if (id !== undefined) {
      url += `/${id}`;
    }
    return axios.get(url, opts);
  }

  delete(id, options) {
    const url = `/${this.base}/${id}`;
    return axios.delete(url, options);
  }

  post(options) {
    const url = `/${this.base}`;
    return axios.post(url, options);
  }

  put(id, options) {
    const url = `/${this.base}/${id}`;
    return axios.put(url, options);
  }

  patch(id, options) {
    const url = `/${this.base}/${id}`;
    return axios.patch(url, options);
  }
}

export default Resource;

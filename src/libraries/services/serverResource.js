/**
 * Resource class
 */

import { axios } from '../utils';

class ServerResource {
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

  delete(server, id, options) {
    const url = `/${this.base}/${server}/${id}`;
    return axios.delete(url, options);
  }

  post(server, options) {
    const url = `/${this.base}/${server}`;
    return axios.post(url, options);
  }

  put(server, id, options) {
    const url = `/${this.base}/${server}/${id}`;
    return axios.put(url, options);
  }

  patch(server, id, options) {
    const url = `/${this.base}/${server}/${id}`;
    return axios.patch(url, options);
  }
}

export default ServerResource;

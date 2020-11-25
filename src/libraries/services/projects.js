/**
 * Projects service
 */

import { axios } from '../utils';

class Projects {
  constructor(base) {
    this.base = base;
  }

  get() { // eslint-disable-line class-methods-use-this
    return axios.get(`/${this.base}`);
  }

  delete(server, name, options) {
    const url = `/${this.base}/${server}/${name}`;
    return axios.delete(url, options);
  }

  post(options) {
    const url = `/${this.base}`;
    return axios.post(url, options);
  }

  put(server, name, options) {
    const url = `/${this.base}/${server}/${name}`;
    return axios.put(url, options);
  }

  patch(server, name, options) {
    const url = `/${this.base}/${server}/${name}`;
    return axios.patch(url, options);
  }
}

export default new Projects('lxc/projects');

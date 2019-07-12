/**
 * Host service
 */

import { axios } from '../utils';

class Host {
  constructor(base) {
    this.base = base;
  }

  get() { // eslint-disable-line class-methods-use-this
    return axios.get(`/${this.base}`);
  }

}

export default new Host('lxc/resources');

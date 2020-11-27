/**
 * Operations service
 */

import { axios } from '../utils';
import Resource from './resource';

class Images extends Resource {
  // constructor(base) {
  //   this.base = base;
  // }
  get(server, id) {
    const url = `/${this.base}/${server}/${id}`;
    return axios.get(url);
  }
}

export default new Images('lxc/operations');

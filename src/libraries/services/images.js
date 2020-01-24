/**
 * Images service
 */

import { axios } from '../utils';
import Resource from './resource';

class Images extends Resource {
  // constructor(base) {
  //   this.base = base;
  // }

  get() { // eslint-disable-line class-methods-use-this
    return axios.get(`/${this.base}`);
  }

  getRemote() { // eslint-disable-line class-methods-use-this
    // return axios.get('https://uk.images.linuxcontainers.org/1.0/images/aliases?recursion=1');
    return axios.get(`/${this.base}/remote`);
  }

  put(id, options) {
    const url = `/${this.base}/${id}`;
    return axios.put(url, options);
  }

  delete(fingerprint) {
    return axios.delete(`/${this.base}/${fingerprint}`);
  }

  aliasCreate(options) {
    return axios.post(`/${this.base}/aliases`, options);
  }

  aliasRename(alias, options) {
    return axios.post(`/${this.base}/aliases/${alias}`, options);
  }

  aliasPatch(alias, options) {
    return axios.patch(`/${this.base}/aliases/${alias}`, options);
  }
}

export default new Images('lxc/images');

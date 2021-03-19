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
    return axios.get('/lgw/images/remote');
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

  delete(server, fingerprint) {
    return axios.delete(`/${this.base}/${server}/${fingerprint}`);
  }

  aliasCreate(server, options) {
    return axios.post(`/${this.base}/aliases/${server}`, options);
  }

  aliasRename(server, alias, options) {
    return axios.post(`/${this.base}/aliases/${server}/${alias}`, options);
  }

  aliasPatch(server, alias, options) {
    return axios.patch(`/${this.base}/aliases/${server}/${alias}`, options);
  }
}

export default new Images('lxc/images');

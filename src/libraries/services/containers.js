/**
 * Containers service
 */

import { axios } from '../utils';
import Resource from './resource';

class ContainerResource extends Resource {
  start(id) {
    return axios.post(`/${this.base}/${id}/start`);
  }

  stop(id) {
    return axios.post(`/${this.base}/${id}/stop`);
  }

  freeze(id) {
    return axios.post(`/${this.base}/${id}/freeze`);
  }

  unfreeze(id) {
    return axios.post(`/${this.base}/${id}/unfreeze`);
  }

  stopforce(id) {
    return axios.post(`/${this.base}/${id}/stop`);
  }

  restart(id) {
    return axios.post(`/${this.base}/${id}/restart`);
  }

  terminal(id) {
    return axios.post(`/${this.base}/${id}/exec`);
  }

  fetch(id) { // eslint-disable-line class-methods-use-this
    return axios.get(`/${this.base}/${id}`);
  }
}

export default new ContainerResource('lxc/containers');

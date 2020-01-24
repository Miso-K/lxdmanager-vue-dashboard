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

  snapshots(id) { // eslint-disable-line class-methods-use-this
    return axios.get(`/${this.base}/${id}/snapshots`);
  }

  snapshot(id, name) { // eslint-disable-line class-methods-use-this
    return axios.get(`/${this.base}/${id}/snapshots/${name}`);
  }

  snapshotDelete(id, name) { // eslint-disable-line class-methods-use-this
    return axios.delete(`/${this.base}/${id}/snapshots/${name}`);
  }

  snapshotRestore(id, name) { // eslint-disable-line class-methods-use-this
    return axios.post(`/${this.base}/${id}/snapshots/${name}/restore`);
  }

  snapshotCreate(id, options) { // eslint-disable-line class-methods-use-this
    return axios.post(`/${this.base}/${id}/snapshots`, options);
  }

  operation(id) {
    console.log(this.base);
    return axios.get(`/lxc/operations/${id}`);
  }
}

export default new ContainerResource('lxc/containers');

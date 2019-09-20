import _map from 'lodash/map';
// import formatMemoryLimit from './memoryLimit';
// import formatCPUs from './cpus';
import { KMGBToB } from '../helpers';

export default function container(ct) {
  // console.log('format:');
  // console.log(ct);
  const status = ct.attributes.status.toUpperCase();

  let limitsMemoryRaw = null;
  if (ct.attributes.expanded_config['limits.memory']) {
    const value = ct.attributes.expanded_config['limits.memory'].match(/\d+/g)[0];
    const size = ct.attributes.expanded_config['limits.memory'].match(/[a-zA-Z]+/g)[0];
    limitsMemoryRaw = KMGBToB(value, size);
  }

  let limitsDiskRaw = null;
  if (ct.attributes.expanded_devices.root.size) {
    const value = ct.attributes.expanded_devices.root.size.match(/\d+/g)[0];
    const size = ct.attributes.expanded_devices.root.size.match(/[a-zA-Z]+/g)[0];
    limitsDiskRaw = KMGBToB(value, size);
  }
  let diskSize = null;
  if (ct.attributes.expanded_devices.root.size) {
    diskSize = ct.attributes.expanded_devices.root.size;
  }
  // console.log(ct.attributes.config['limits.memory'].match(/\d+/g)[0]);
  // console.log(ct.attributes.config['limits.memory'].match(/[a-zA-Z]+/g)[0]);
  // limitsMemoryRaw = ct.attributes.config['limits.memory']
  // ? ct.attributes.config['limits.memory'].match(/\d+/g)[0] : null;
  // const limitsDiskRaw = ct.attributes.config.limits_memory.match(/\d+/g);

  return {
    state: ct.attributes.state,
    status,
    id: ct.id,
    name: ct.attributes.name,
    created_at: ct.attributes.created_at,
    ips: ct.attributes.state.network && status !== 'STOPPED' ? ct.attributes.state.network.eth0.addresses : '',
    config: {
      image_description: ct.attributes.expanded_config['image.description'],
      image_architecture: ct.attributes.expanded_config['image.architecture'],
      image_release: ct.attributes.expanded_config['image.release'],
      image_os: ct.attributes.expanded_config['image.os'],
      image_version: ct.attributes.expanded_config['image.version'],
      limits_cpu: ct.attributes.expanded_config['limits.cpu'],
      limits_memory: ct.attributes.expanded_config['limits.memory'],
      limits_memory_raw: limitsMemoryRaw,
      limits_memory_mb: limitsMemoryRaw / (1024 ** 2),
// eslint-disable-next-line max-len,no-nested-ternary
      limits_disk: diskSize,
      limits_disk_raw: limitsDiskRaw,
      limits_disk_gb: limitsDiskRaw / (1024 ** 3)
    },
    groups: _map([], group => group)
  };
}

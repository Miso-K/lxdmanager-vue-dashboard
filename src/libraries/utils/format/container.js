// import _map from 'lodash/map';
// import formatMemoryLimit from './memoryLimit';
// import formatCPUs from './cpus';
import { KMGBToB } from '../helpers';

export default function container(ct) {
  const status = ct.status.toUpperCase();

  let limitsMemoryRaw = null;
  if (ct.expanded_config['limits.memory']) {
    const value = ct.expanded_config['limits.memory'].match(/\d+/g)[0];
    const size = ct.expanded_config['limits.memory'].match(/[a-zA-Z]+/g)[0];
    limitsMemoryRaw = KMGBToB(value, size);
  }

  let limitsDiskRaw = null;
  if (ct.expanded_devices.root.size) {
    const value = ct.expanded_devices.root.size.match(/\d+/g)[0];
    const size = ct.expanded_devices.root.size.match(/[a-zA-Z]+/g)[0];
    limitsDiskRaw = KMGBToB(value, size);
  }
  let diskSize = null;
  if (ct.expanded_devices.root.size) {
    diskSize = ct.expanded_devices.root.size;
  }
  // console.log(ct.attributes.config['limits.memory'].match(/\d+/g)[0]);
  // console.log(ct.attributes.config['limits.memory'].match(/[a-zA-Z]+/g)[0]);
  // limitsMemoryRaw = ct.attributes.config['limits.memory']
  // ? ct.attributes.config['limits.memory'].match(/\d+/g)[0] : null;
  // const limitsDiskRaw = ct.attributes.config.limits_memory.match(/\d+/g);

  let ips = '';
  if (ct.state.network) {
    ips = !ct.state.network.eth0 || status === 'STOPPED' ? '' : ct.state.network.eth0.addresses;
  }

  return {
    state: ct.state,
    status,
    id: ct.id,
    name: ct.name,
    type: ct.type,
    created_at: ct.created_at,
    ips,
    config: {
      image_description: ct.expanded_config['image.description'],
      image_architecture: ct.expanded_config['image.architecture'],
      image_release: ct.expanded_config['image.release'],
      image_os: ct.expanded_config['image.os'],
      image_version: ct.expanded_config['image.version'],
      limits_cpu: ct.expanded_config['limits.cpu'],
      limits_memory: ct.expanded_config['limits.memory'],
      limits_memory_raw: limitsMemoryRaw,
      limits_memory_mb: limitsMemoryRaw / (1024 ** 2),
      // eslint-disable-next-line max-len,no-nested-ternary
      limits_disk: diskSize,
      limits_disk_raw: limitsDiskRaw,
      limits_disk_gb: limitsDiskRaw / (1024 ** 3),
      user_price: ct.config['user.price']
    }
  };
}

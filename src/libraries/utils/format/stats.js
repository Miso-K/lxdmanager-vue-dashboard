// import _map from 'lodash/map';
// import formatMemoryLimit from './memoryLimit';
// import formatCPUs from './cpus';
// import { KMGBToB, BToGB, BToGiB, BToMB, BToMiB } from '../helpers';

export default function stats(instances) {
  // console.log(instances);
  const instancesTotal = (instances.length);

  const instancesRunning = instances.filter(word => word.status === 'RUNNING').length;
  // console.log(instancesRunning);

  function stringToFloat(x) {
    const parsed = parseFloat(x, 10);
    if (isNaN(parsed)) { return 0; }
    return parsed;
  }

  const cpuTotal = instances.reduce((prev, cur) => prev + stringToFloat(cur.config.limits_cpu), 0);
  // console.log(cpuTotal);

  const memoryTotalRaw = instances.reduce(
    (prev, cur) => prev + stringToFloat(cur.config.limits_memory_raw), 0);
  // console.log(memoryTotalRaw);

  const diskTotalRaw = instances.reduce(
    (prev, cur) => prev + stringToFloat(cur.config.limits_disk_raw), 0);
  // console.log(diskTotalRaw);

  const priceTotal = instances.reduce(
    (prev, cur) => prev + stringToFloat(cur.config.user_price), 0);
  // console.log(priceTotal);

  return {
    instancesTotal,
    instancesRunning,
    cpuTotal,
    memoryTotalRaw,
    diskTotalRaw,
    priceTotal
  };
}

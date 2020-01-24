const humanFileSize = (bytes) => {
  if (!bytes) return 0;

  const i = Math.floor(Math.log(bytes) / Math.log(1000));
  return `${((bytes / (1000 ** i)).toFixed(2) * 1)} ${['B', 'kB', 'MB', 'GB', 'TB', 'PB'][i]}`;
};

const BToMB = (bytes) => {
  if (!bytes) return null;

  return (bytes / 1000 / 1000).toFixed(2);
};

const MBToB = (bytes) => {
  if (!bytes) return null;

  return (bytes * 1000 * 1000);
};

const KMGBToB = (value, size) => {
  if (!value) return null;

  if (size === 'KB') {
    return value * 1000;
  }
  if (size === 'MB') {
    return value * 1000 * 1000;
  }
  if (size === 'GB') {
    return value * 1000 * 1000 * 1000;
  }
  if (size === 'KiB') {
    return value * 1024;
  }
  if (size === 'MiB') {
    return value * 1024 * 1024;
  }
  if (size === 'GiB') {
    return value * 1024 * 1024 * 1024;
  }
  return null;
};

export {
  BToMB,
  MBToB,
  KMGBToB,
  humanFileSize
};

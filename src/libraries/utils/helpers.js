const humanFileSize = (bytes) => {
  if (!bytes) return 0;

  const i = Math.floor(Math.log(bytes) / Math.log(1000));
  return `${((bytes / (1000 ** i)).toFixed(2) * 1)} ${['B', 'kB', 'MB', 'GB', 'TB', 'PB'][i]}`;
};

const hBinaryPrefix = (bytes, unit, show) => {
  if (!bytes) return 0;
  let i = 0;
  let value = 0;

  if (unit === 'MiB' || unit === 'GiB') {
    i = Math.floor(Math.log(bytes) / Math.log(1024));
    value = ((bytes / (1024 ** i)).toFixed(2) * 1);
  } else {
    i = Math.floor(Math.log(bytes) / Math.log(1000));
    value = ((bytes / (1000 ** i)).toFixed(2) * 1);
  }

  if (show === 'MiB' || show === 'GiB') {
    return [value, ['B', 'kiB', 'MiB', 'GiB', 'TiB', 'PiB'][i]];
  }
  return [value, ['B', 'kB', 'MB', 'GB', 'TB', 'PB'][i]];
};

const BToMB = (bytes) => {
  if (!bytes) return null;

  return `${(bytes / 1000 / 1000).toFixed(0)}`;
};

const BToMiB = (bytes) => {
  if (!bytes) return null;

  return `${(bytes / 1024 / 1024).toFixed(0)}`;
};

const BToGB = (bytes) => {
  if (!bytes) return null;

  return `${(bytes / 1000 / 1000 / 1000).toFixed(2)}`;
};

const BToGiB = (bytes) => {
  if (!bytes) return null;

  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)}`;
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

const updateInstanceState = (action) => {
  const data = {
    data: {
      action,
      timeout: 30,
      force: false
    }
  };
  return data;
};

export {
  BToMB,
  BToMiB,
  BToGB,
  BToGiB,
  KMGBToB,
  humanFileSize,
  hBinaryPrefix,
  updateInstanceState
};

export const ALL = 'ALL';
export const FROZEN = 'FROZEN';
export const FREEZING = 'FREEZING';
export const RESTARTING = 'RESTARTING';
export const RUNNING = 'RUNNING';
export const SHUTTING_DOWN = 'SHUTTING_DOWN';
export const STARTING = 'STARTING';
export const STOPPED = 'STOPPED';
export const STOPPING = 'STOPPING';
export const UNFREEZING = 'UNFREEZING';

const transitioning = (state) => { // eslint-disable-line arrow-body-style
  return state === FREEZING
    || state === RESTARTING
    || state === SHUTTING_DOWN
    || state === STOPPING
    || state === STARTING
    || state === UNFREEZING;
};

export {
  transitioning
};

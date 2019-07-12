import _map from 'lodash/map';
import build from 'redux-object';

const getUserContainers = (state, identity) => {
  const user = build(state, 'users', identity);

  let containers = [];

  if (user && user.containers && user.containers[0]) {
    containers = _map(user.containers, container => container.name);
  }

  return containers;
};

export default getUserContainers;

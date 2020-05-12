import store from './index';

export const changeTitle = ({ commit }, title) => {
  commit('CHANGE_SESSION', { title });
};

export const load = ({ commit }) => {
// eslint-disable-next-line max-len
  // const actions = ['fetchMe', 'fetchGroups', 'fetchAbilities'].map(action => store.dispatch(action));
  // eslint-disable-next-line max-len
  const actions = ['fetchMe', 'fetchGroups', 'fetchAbilities', 'fetchInstances', 'fetchImages', 'fetchAppConfig'].map(action => store.dispatch(action));

  return Promise.all(actions).then(() => {
    commit('APP_LOAD');
  }).catch((err) => {
    console.log('Failed to init app...', err);
  });
};

export const openDialog = ({ commit }, id) => {
  commit('OPEN_DIALOG', id);
};

export const closeDialog = ({ commit }, id) => {
  commit('CLOSE_DIALOG', id);
};

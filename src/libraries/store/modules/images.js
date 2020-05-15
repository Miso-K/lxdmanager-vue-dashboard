import _map from 'lodash/map';
import { ImagesService } from '../../services';
import formatImage from '../../utils/format/images';

export const IMAGES_REQUEST = 'IMAGES_REQUEST';
export const IMAGES_SUCCESS = 'IMAGES_SUCCESS';
export const IMAGES_FAILURE = 'IMAGES_FAILURE';
export const REMOTE_IMAGES_SUCCESS = 'REMOTE_IMAGES_SUCCESS';
export const IMAGE_SUCCESS = 'IMAGE_SUCCESS';

/**
 * Initial state
 * @type {Object}
 */
const imagesState = {
  images: {},
  remoteImages: {},
  loading: false
};

/**
 * Getters
 * @type {Object}
 */
const imagesGetters = {
  images: state => state.images,
  image: state => id => state.images[id],
  imagesTableData(state, getters) {
    if (Object.keys(getters.images).length === 0) return false;
    return _map(getters.images, image => formatImage(image)); // eslint-disable-line max-len
  },
  remoteImages: state => state.remoteImages
};

/**
 * Mutations
 * @type {Object}
 */
const imagesMutations = {
  [IMAGES_REQUEST]: (state) => {
    Object.assign(state, { loading: true });
  },
  [IMAGES_SUCCESS]: (state, images) => {
    Object.assign(state, { images, loading: false });
  },
  [REMOTE_IMAGES_SUCCESS]: (state, remoteImages) => {
    Object.assign(state, { remoteImages, loading: false });
  },
  [IMAGE_SUCCESS]: (state) => {
    Object.assign(state, { loading: false });
  },
  [IMAGES_FAILURE]: (state, err) => {
    console.log(IMAGES_FAILURE, err);
    Object.assign(state, { loading: false });
  }
};

/**
 * Actions
 * @type {Object}
 */
const imagesActions = {
  fetchImages({ commit }) {
    commit(IMAGES_REQUEST);

    return ImagesService.get().then((res) => {
      // console.log(res);
      commit(IMAGES_SUCCESS, res.data.data);
    }).catch((err) => {
      commit(IMAGES_FAILURE, err);
    });
  },

  fetchRemoteImages({ commit }) {
    commit(IMAGES_REQUEST);

    return ImagesService.getRemote().then((res) => {
      // console.log(res);
      commit(REMOTE_IMAGES_SUCCESS, res.data.data);
    }).catch((err) => {
      commit(IMAGES_FAILURE, err);
    });
  },

  createImage({ dispatch, commit }, data) {
    commit(IMAGES_REQUEST);
    // console.log('create log:');
    console.log(data);

    const obj = {
      data: {
        public: false,
        aliases: [
          {
            name: data.aliasName,
            description: data.aliasDescription
          }
        ],
        source: {
          type: 'image',
          mode: 'pull',
          server: 'https://uk.images.linuxcontainers.org',
          fingerprint: data.fingerprint
        }
      }
    };
    console.log(obj);
    return ImagesService.post(obj).then((res) => {
      // console.log(res.data);
      // dispatch('notify', { id: 0, message: 'Image was downloaded', color: '' });
      dispatch('fetchOperation', res.data.metadata.id);
      dispatch('fetchImages');
      commit(IMAGE_SUCCESS, res);
    }).catch((err) => {
      commit(IMAGES_FAILURE, err);
    });
  },

  createImageAlias({ commit }, data) {
    commit(IMAGES_REQUEST);
    const obj = {
      data: {
        name: data.new_name,
        description: data.alias_description,
        target: data.fingerprint
      }
    };
    // console.log(obj);
    return ImagesService.aliasCreate(obj).then((res) => {
      console.log(res);
      commit(IMAGE_SUCCESS, res.data);
    }).catch((err) => {
      commit(IMAGES_FAILURE, err);
    });
  },

  updateImageName({ commit }, data) {
    commit(IMAGES_REQUEST);
    const obj = {
      data: {
        name: data.new_name
      }
    };
    console.log(obj);
    return ImagesService.aliasRename(data.name, obj).then((res) => {
      console.log(res);
      commit(IMAGE_SUCCESS, res.data);
    }).catch((err) => {
      commit(IMAGES_FAILURE, err);
    });
  },

  updateImageDescription({ commit }, data) {
    commit(IMAGES_REQUEST);
    // console.log('update log:');
    // console.log(data);
    const obj = {
      data: {
        description: data.alias_description
      }
    };
    return ImagesService.aliasPatch(data.name, obj).then((res) => {
      // console.log(res);
      commit(IMAGE_SUCCESS, res.data);
    }).catch((err) => {
      commit(IMAGES_FAILURE, err);
    });
  },

  deleteImage({ commit }, fingerprint) {
    commit(IMAGES_REQUEST);
    ImagesService.delete(fingerprint).then((res) => {
      commit(IMAGE_SUCCESS, res);
    }).catch((err) => {
      commit(IMAGES_FAILURE, err);
    });
  }
};

// Export module
export default {
  state: imagesState,
  getters: imagesGetters,
  mutations: imagesMutations,
  actions: imagesActions
};

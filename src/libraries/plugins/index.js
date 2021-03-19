/**
 * My plugins
 */

import title from './title';
import auth from './auth';

export default {
  install(Vue) {
    title(Vue, { property: 'title', separator: ' — ' });
    auth(Vue);
  }
};

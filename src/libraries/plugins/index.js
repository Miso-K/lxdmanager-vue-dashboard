/**
 * My plugins
 */

import title from './title';
import auth from './auth';
import nprogress from './nprogress';

export default {
  install(Vue) {
    title(Vue, { property: 'title', separator: ' — ' });
    auth(Vue);
    nprogress(Vue);
  }
};

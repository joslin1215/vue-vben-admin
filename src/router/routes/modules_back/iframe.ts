import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const iframe: AppRouteModule = {
  path: '/iframe',
  name: 'Frame',
  component: LAYOUT,
  meta: {
    hideMenu: true,
    title: '',
  },

  children: [
    {
      path: 'index/:title/:base64Url',
      name: 'IFrameIndex',
      component: () => import('/@/views/sys/iframe/index.vue'),
      meta: {
        ignoreKeepAlive: false,
        title: 'iframe',
        frameSrc: '/',
        hideMenu: true,
        dynamicLevel: 99,
        realPath: '/iframe/index',
      },
    },
  ],
};

export default iframe;

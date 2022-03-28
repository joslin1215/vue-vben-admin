import { http } from '/@/utils/http/axios';
import { getMenuListResultModel, RouteItem } from './model/menuModel';
import { encryptByMd5 } from '/@/utils/cipher';
import { t } from '/@/hooks/web/useI18n';

enum Api {
  GetMenuList = '/sys/menu/list',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return new Promise<getMenuListResultModel>((resolve, reject) => {
    http
      .get<getMenuListResultModel>({ url: Api.GetMenuList })
      .then((res) => {
        /** 生成iframe模块路由*/
        {
          const defaultUrl = 'about:blank'; // 'https://www.baiud.com/';
          const time = new Date().getTime();
          const iframe: RouteItem = {
            path: '/module',
            name: 'FrameModule',
            component: 'LAYOUT',
            meta: {
              title: 'iframe',
              icon: '',
              hideMenu: true,
              hideBreadcrumb: true,
            },
            children: [],
          };
          for (let i = 0; i < 30; i++) {
            const md5Str = encryptByMd5(time + '' + i);
            const item: RouteItem = {
              path: md5Str,
              name: md5Str,
              component: 'IFRAME',
              meta: {
                title: '',
                hideMenu: true,
                hideBreadcrumb: true,
                frameSrc: defaultUrl,
              },
            };
            iframe.children?.push(item);
          }
          res.push(iframe);
        }

        /** 测试路由 */
        {
          const test: RouteItem = {
            path: '/test',
            name: 'test',
            component: 'LAYOUT',
            meta: {
              title: '测试',
              icon: '',
              hideMenu: false,
              hideBreadcrumb: false,
            },
            children: [
              {
                path: 'tabs',
                name: 'TabsDemo',
                component: 'demo/feat/tabs/index.vue',
                meta: {
                  title: t('routes.demo.feat.tabs'),
                  hideChildrenInMenu: true,
                },
              },
            ],
          };

          res.push(test);
        }
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

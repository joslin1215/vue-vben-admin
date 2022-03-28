import { useRouter } from 'vue-router';
import { encryptByMd5 } from '/@/utils/cipher';
import { useMultipleTabStore } from '/@/store/modules/multipleTab';
import { useMessage } from '/@/hooks/web/useMessage';
import { useGo } from '/@/hooks/web/usePage';
import { useGlobSetting } from '/@/hooks/setting';

export type EventDataWithPath = { path?: string; title?: string };
export type EventDataWithName = { name?: string; title?: string; params?: object };

export type EventData = EventDataWithPath & EventDataWithName & { moduleCode?: string };

export function useFrameRouter() {
  const router = useRouter();
  router.currentRoute.value;
  const go = useGo();
  const tabStore = useMultipleTabStore();
  const { createErrorModal } = useMessage();

  const topWindow = window.top || window;

  const dispatchEvent = (event: string, data?: EventData | string) => {
    let detail: EventData = {};
    if (typeof data === 'string') {
      detail['path'] = data;
    } else {
      detail = data as unknown as EventData;
    }

    const { moduleCode } = useGlobSetting();
    detail.moduleCode = moduleCode;

    topWindow.dispatchEvent(new CustomEvent(event, { detail: detail }));
  };

  function isFrame(): boolean {
    return window.self !== window.top;
  }
  function openTab(to: EventData | string) {
    dispatchEvent('openTab', to);
  }
  async function closeTab() {
    dispatchEvent('closeTab');
  }
  function refreshTab() {
    dispatchEvent('refreshTab');
  }
  function replaceTab(to: EventData | string) {
    dispatchEvent('replaceTab', to);
  }
  function backTab() {
    dispatchEvent('backTab');
  }
  function genFrameRoute(num: number) {
    return;

    if (num <= 0) return;
    const defaultUrl = 'about:blank';
    const time = new Date().getTime();
    for (let i = 0; i < num; i++) {
      const md5Str = encryptByMd5(time + '' + i);
      const newRoute = {
        path: '/' + md5Str,
        name: md5Str,
        component: () => import('/@/views/sys/iframe/FrameBlank.vue'),
        meta: {
          title: '',
          hideMenu: true,
          hideBreadcrumb: true,
          frameSrc: defaultUrl,
        },
      };
      router.addRoute(newRoute);
      tabStore.getDynamicFrameKeyMap.set(md5Str, '');
    }
  }

  async function goFrame(data: EventData) {
    console.log('useFrameRouter.goFrame', data);
    const { path: dPath, title, name, params: dParams, moduleCode } = data;
    const params = { ...dParams, title: title };
    if (name) {
      if (router.hasRoute(name)) {
        await router.push({ name: name, params: params || {} });
        return;
      }
    }

    let path = dPath || name;

    if (!path) {
      createErrorModal({
        title: '路径不能为空',
        content: '请检查路径是否正确',
      });
      return;
    }

    /** 处理本地路由的情况 */
    {
      const p = path.indexOf('?') > -1 ? path.substring(0, path.indexOf('?')) : path;
      const routes = router.getRoutes().filter((item) => item.path === p);
      const route = routes && routes.length > 0 ? routes[0] : null;
      if (route) {
        console.log('useFrameRouter.goFrame', '进入本地路由');
        await router.push(path);
        return;
      }
    }

    console.log('useFrameRouter.goFrame', '进入外部路由');
    const frameMap = tabStore.getDynamicFrameMap;
    const key = encryptByMd5(path + (params ? JSON.stringify(params) : ''));
    if (frameMap.has(key)) {
      // @ts-ignore
      await router.push(frameMap.get(key));
      return;
    }

    let goRoute;
    router.getRoutes().forEach((item) => {
      if (!goRoute && item.meta?.frameSrc === 'about:blank') {
        goRoute = item;
      }
    });

    let { iframeUrl = '' } = useGlobSetting();

    {
      if (!iframeUrl.endsWith('/')) {
        iframeUrl += '/';
      }
      if (!path.startsWith('/')) {
        path = '/' + path;
      }
    }

    goRoute.params = { ...goRoute.params, ...params };
    goRoute.meta.frameSrc = path.startsWith('http')
      ? path
      : iframeUrl + moduleCode + '/static/index.html#' + path;
    goRoute.meta.title = title;
    console.log('useFrameRouter.goFrame', '进入外部路由', goRoute);
    go(goRoute);
  }

  return { isFrame, openTab, closeTab, refreshTab, replaceTab, backTab, genFrameRoute, goFrame };
}

import { useRouter } from 'vue-router';
import { encryptByMd5 } from '/@/utils/cipher';
import { useMultipleTabStore } from '/@/store/modules/multipleTab';
import { useMessage } from '/@/hooks/web/useMessage';
import { useGo } from '/@/hooks/web/usePage';
import { useGlobSetting } from '/@/hooks/setting';
import { useTabs } from '/@/hooks/web/useTabs';

export type EventDataWithPath = { path?: string; title?: string };
export type EventDataWithName = { name?: string; title?: string; params?: object };

export type EventData = EventDataWithPath & EventDataWithName & { moduleCode?: string };

export function useFrameRouter() {
  const router = useRouter();
  const go = useGo();
  const tabStore = useMultipleTabStore();
  const { createErrorModal } = useMessage();

  const { refreshPage, closeCurrent } = useTabs(router);

  const topWindow = window.top || window;

  const dispatchEvent = (event: string, data?: EventData | string) => {
    console.log('dispatchEvent', event, data);
    topWindow.postMessage({ obj: 'router', act: event, detail: data }, '*');
  };

  function isFrame(): boolean {
    return window.self !== window.top;
  }

  function openTab(data: EventData | string) {
    let detail: EventData = {};
    if (typeof data === 'string') {
      detail['path'] = data;
    } else {
      detail = data as unknown as EventData;
    }

    /** 用name路由转为path */
    if (detail.name && router.hasRoute(detail.name)) {
      router.getRoutes().forEach((route) => {
        if (route.name === detail.name) {
          detail.path = route.path;
        }
      });
    }

    if (data) {
      detail.path = getPath(data);
      const { moduleCode } = useGlobSetting();
      detail.moduleCode = moduleCode;
    }

    dispatchEvent('openTab', data);
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

  function getPath(data: EventData | string | undefined): string | undefined {
    if (!data) return undefined;
    let path: string | undefined = undefined;
    if (typeof data === 'string') {
      path = data as string;
    } else if (data.path) {
      path = data.path;
    }

    if (!path) return undefined;

    console.info(window.location);

    if (!path.startsWith('http')) {
      if (!path.startsWith('http')) {
        if (window.location.href.startsWith('http://localhost:3')) {
          path =
            location.protocol +
            '//' +
            location.host +
            '/#' +
            (path.startsWith('/') ? '' : '/') +
            path;
        }
      }
    }

    return path;
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

    console.log('useFrameRouter.goFrame', '进入外部路由', path);
    const frameMap = tabStore.getDynamicFrameMap;
    const key = encryptByMd5(path + (params ? JSON.stringify(params) : ''));
    console.log(key);
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

    const { iframeUrl = '' } = useGlobSetting();

    if (!path.startsWith('http')) {
      if (!path.startsWith('/')) {
        path = '/' + path;
      }
    }

    let frameSrc = path.startsWith('http')
      ? path
      : iframeUrl + moduleCode + '/static/index.html#' + path;

    if (!frameSrc.startsWith('http') && !frameSrc.startsWith('/')) {
      frameSrc = '/' + frameSrc;
    }

    goRoute.params = { ...goRoute.params, ...params };
    goRoute.meta.frameSrc = frameSrc;

    goRoute.meta.title = title;
    console.log('useFrameRouter.goFrame', '进入外部路由', goRoute);
    frameMap.set(key, goRoute);
    go(goRoute);
  }

  async function handler(message: { obj: string; act: string; detail: EventData }) {
    console.log('useFrameRouter.handler', message);
    if (message.obj === 'router') {
      if (message.act === 'openTab') {
        await goFrame(message.detail);
      } else if (message.act === 'closeTab') {
        await closeCurrent();
      } else if (message.act === 'refreshTab') {
        await refreshPage();
      } else if (message.act === 'replaceTab') {
        console.error('replaceTab未实现');
      } else if (message.act === 'backTab') {
        router.back();
      } else if (message.act === 'goFrame') {
        await goFrame(message.detail);
      }
    }
  }

  return {
    isFrame,
    openTab,
    closeTab,
    refreshTab,
    replaceTab,
    backTab,
    genFrameRoute,
    goFrame,
    handler,
  };
}

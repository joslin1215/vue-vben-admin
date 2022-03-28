<template>
  <ConfigProvider :locale="getAntdLocale">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';

  import 'dayjs/locale/zh-cn';
  import { onMounted, onUnmounted } from 'vue';
  import { RouteRecordRaw, useRoute, useRouter } from 'vue-router';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useGo } from '/@/hooks/web/usePage';
  import { encryptByBase64, encryptByMd5 } from '/@/utils/cipher';
  import { useFrameKeepAlive } from '/@/layouts/iframe/useFrameKeepAlive';
  import { useMultipleTabStore } from '/@/store/modules/multipleTab';
  import { useFrameRouter } from '/@/hooks/web/useFrameRouter';
  // support Multi-language
  const { getAntdLocale } = useLocale();

  const route = useRoute();
  const router = useRouter();
  const go = useGo();
  const { close, refreshPage } = useTabs(router);
  const { getFramePages, getAllFramePages } = useFrameKeepAlive();
  const { goToPage } = useMultipleTabStore();

  const { genFrameRoute, goFrame } = useFrameRouter();

  const onMessage = function (message: any) {
    // console.log('onMessage', message);
    const data = message.data;
    if (data.action && data.action === 'openTab') {
      console.log('openTab', data, router.currentRoute.value);
      const routeName = data.url.split('.html')[0].replaceAll('/', '_').substring(1);
      const fullUrl = 'http://localhost:8080' + data.url;
      const r = {
        path: data.url,
        name: routeName,
        component: () => import('/@/layouts/iframe/index.vue'),
        meta: {
          title: data.title,
          ignoreKeepAlive: true,
          currentActiveMenu: route?.path,
          hideMenu: true,
          frameSrc: fullUrl,
        },
      };

      router.addRoute(r as unknown as RouteRecordRaw);
      router.push({ name: routeName });
    }
  };

  const openTab = async function (data) {
    goFrame(data.detail);
    return;
    // console.log('openTab', data);

    const urls = ['https://v2ex.com', 'https://1.121tongbu.com/tls.html', 'https://www.baidu.com/'];

    const url = urls[new Date().getTime() % urls.length] + '?_t=' + new Date().getTime();
    const base64Url = encryptByBase64(url);
    const title = '我是标题' + new Date().getTime();
    const newRoute = {
      path: '/' + encryptByMd5(url),
      name: encryptByMd5(url),
      params: {
        title,
        base64Url,
      },
      component: () => import('/@/views/sys/iframe/index.vue'),
      meta: {
        title: title,
        hideMenu: true,
        hideBreadcrumb: true,
        frameSrc: url,
      },
    };

    // if (!router.hasRoute(newRoute.name)) {
    //   router.addRoute(newRoute as unknown as RouteRecordRaw);
    // }

    // await router.push(newRoute);

    const params = {
      title,
      base64Url,
    };

    goFrame(data.detail);
    // await router.push({ name: 'IFrameIndex', params: params });
  };

  const closeTab = function () {
    close();
  };

  const refreshTab = function () {
    refreshPage();
  };

  const replaceTab = function (data) {
    router.replace(data.detail);
  };

  const backTab = function () {
    router.back();
  };

  function addWindowEventListener() {
    window.addEventListener('message', onMessage);

    window.addEventListener('openTab', openTab);

    window.addEventListener('closeTab', closeTab);

    window.addEventListener('refreshTab', refreshTab);

    window.addEventListener('replaceTab', replaceTab);

    window.addEventListener('backTab', backTab);
  }

  function removeWindowEventListener() {
    window.removeEventListener('message', onMessage);

    window.removeEventListener('openTab', openTab);

    window.removeEventListener('closeTab', closeTab);

    window.removeEventListener('refreshTab', refreshTab);

    window.removeEventListener('replaceTab', replaceTab);

    window.removeEventListener('backTab', backTab);
  }

  onMounted(() => {
    if (window.top === window.self) {
      addWindowEventListener();
    }
    genFrameRoute(30);

    // setInterval(() => {
    //   console.log('setInterval');
    //   openTab({});
    // }, 3000);
  });

  onUnmounted(() => {
    if (window.top === window.self) {
      removeWindowEventListener();
    }
  });

  // Listening to page changes and dynamically changing site titles
  useTitle();
</script>

<script lang="ts"></script>

<script lang="ts"></script>

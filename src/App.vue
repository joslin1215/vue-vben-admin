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

  // support Multi-language
  const { getAntdLocale } = useLocale();

  const router = useRouter();
  const route = useRoute();

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
      console.log(router.getRoutes());
      router.push({ name: routeName });
    }
  };

  onMounted(() => {
    window.addEventListener('message', onMessage);
    // const fpPromise = FingerprintJS.load();
    // (async () => {
    //   const fp = await fpPromise;
    //   const result = await fp.get();
    //   console.info('Fingerprint', result);
    //   setFingerprint(result.visitorId);
    //   console.log(getFingerprint());
    // })();
  });

  onUnmounted(() => {
    window.removeEventListener('message', onMessage);
  });

  // Listening to page changes and dynamically changing site titles
  useTitle();
</script>

<script lang="ts"></script>

<script lang="ts"></script>

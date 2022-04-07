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
  import { useFrameRouter } from '/@/hooks/web/useFrameRouter';
  // support Multi-language
  const { getAntdLocale } = useLocale();

  const { handler } = useFrameRouter();

  const onMessage = function (message: any) {
    console.log('onMessage', message);
    if (typeof message.data !== 'object') return;

    const data = message.data;

    if (!data['obj'] || !data['act']) return;

    if (data.obj === 'router') {
      handler(data);
      return;
    }
  };

  function addWindowEventListener() {
    window.addEventListener('message', onMessage);
  }

  function removeWindowEventListener() {
    window.removeEventListener('message', onMessage);
  }

  onMounted(() => {
    if (window.top === window.self) {
      addWindowEventListener();
    }
  });

  onUnmounted(() => {
    if (window.top === window.self) {
      removeWindowEventListener();
    }
  });

  // Listening to page changes and dynamically changing site titles
  useTitle();
</script>

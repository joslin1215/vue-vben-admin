<template>
  <div :class="prefixCls" :style="getWrapStyle">
    <Spin :spinning="loading" size="large" :style="getWrapStyle">
      <iframe
        :src="frameSrc"
        :class="`${prefixCls}__main`"
        ref="frameRef"
        @load="hideLoading"
      ></iframe>
    </Spin>
  </div>
</template>
<script lang="ts">
  import type { CSSProperties } from 'vue';
  import { ref, unref, computed, defineComponent, onMounted } from 'vue';
  import { Spin } from 'ant-design-vue';
  import { useWindowSizeFn } from '/@/hooks/event/useWindowSizeFn';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useLayoutHeight } from '/@/layouts/default/content/useContentViewHeight';
  import { useRoute, useRouter } from 'vue-router';
  import { decodeByBase64 } from '/@/utils/cipher';
  import { useTabs } from '/@/hooks/web/useTabs';

  export default defineComponent({
    name: 'IFrameIndex',
    components: { Spin },
    setup(props) {
      console.log('IFrameIndex', props);

      const { setTitle } = useTabs();
      const loading = ref(true);
      const topRef = ref(50);
      const heightRef = ref(window.innerHeight);
      const frameRef = ref<HTMLFrameElement>();
      const { headerHeightRef } = useLayoutHeight();

      const { prefixCls } = useDesign('iframe-page');
      useWindowSizeFn(calcHeight, 150, { immediate: true });

      const route = useRoute();

      console.log(route.params);

      const { title, base64Url } = route.params;

      const frameSrc = computed(() => decodeByBase64(base64Url));
      setTitle(title);

      const getWrapStyle = computed((): CSSProperties => {
        return {
          height: `${unref(heightRef)}px`,
        };
      });

      function calcHeight() {
        const iframe = unref(frameRef);
        if (!iframe) {
          return;
        }
        const top = headerHeightRef.value;
        topRef.value = top;
        heightRef.value = window.innerHeight - top;
        const clientHeight = document.documentElement.clientHeight - top;
        iframe.style.height = `${clientHeight}px`;
      }

      function hideLoading() {
        loading.value = false;
        calcHeight();
      }
      onMounted(() => {
        console.log('other mounted');
        calcHeight();
      });

      return {
        prefixCls,
        loading,
        frameSrc,
        getWrapStyle,
        frameRef,
        topRef,
        heightRef,
        hideLoading,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-iframe-page';

  .@{prefix-cls} {
    .ant-spin-nested-loading {
      position: relative;
      height: 100%;

      .ant-spin-container {
        width: 100%;
        height: 100%;
        padding: 10px;
      }
    }

    &__mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    &__main {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: @component-background;
      border: 0;
      box-sizing: border-box;
    }
  }
</style>

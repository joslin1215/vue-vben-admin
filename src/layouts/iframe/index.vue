<template>
  <div v-if="showFrame">
    <template v-for="frame in getFramePages" :key="frame.path">
      <FramePage
        v-if="frame.meta.frameSrc && hasRenderFrame(frame.name)"
        v-show="showIframe(frame)"
        :frameSrc="frame.meta.frameSrc"
        :title="frame.meta.title"
        :params="frame.params"
      />
    </template>
  </div>
</template>
<script lang="ts">
  import { defineComponent, unref, computed, onMounted } from 'vue';
  import FramePage from '/@/views/sys/iframe/index.vue';

  import { useFrameKeepAlive } from './useFrameKeepAlive';
  import { useRoute } from 'vue-router';

  export default defineComponent({
    name: 'FrameLayout',
    components: { FramePage },
    setup() {
      const { getFramePages, hasRenderFrame, showIframe } = useFrameKeepAlive();
      const route = useRoute();

      const showFrame = computed(() => {
        // console.log('layout/iframe/index: showFrame', unref(getFramePages));
        return unref(getFramePages).length > 0;
      });

      onMounted(() => {
        console.log('layout/iframe/index: onMounted', route);
      });
      return { getFramePages, hasRenderFrame, showIframe, showFrame };
    },
  });
</script>

<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
      title="部门列表"
      :defaultExpandAll="true"
      toolbar
      search
      :setSelectedKeys="setSelectedKeys"
      @reload="handleReload"
      :clickRowToExpand="false"
      :selectedKeys="selectedKeys"
      :treeData="treeData"
      :fieldNames="{ key: 'id', title: 'name' }"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, onUnmounted, ref } from 'vue';

  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { DeptParams, getDeptList } from '/@/api/system/dept/Api';
  import bus from '/@/utils/bus';

  export default defineComponent({
    name: 'DeptTree',
    components: { BasicTree },

    emits: ['select'],
    setup(_, { emit }) {
      const selectedKeys = ref<string[]>([]);
      bus.on('reloadDeptTree', async () => {
        await handleReload();
      });

      bus.on('reset-user-table-search', async () => {
        selectedKeys.value = [];
      });

      const treeData = ref<TreeItem[]>([]);

      async function fetch() {
        treeData.value = (await getDeptList({
          status: 1,
        } as unknown as DeptParams)) as unknown as TreeItem[];
      }

      function handleSelect(keys) {
        emit('select', keys[0]);
      }

      async function handleReload() {
        await fetch();
      }

      onMounted(() => {
        fetch();
      });

      onUnmounted(() => {
        bus.off('reloadDeptTree');
        bus.off('reset-user-table-search');
      });

      return { treeData, selectedKeys, handleSelect, handleReload };
    },
  });
</script>

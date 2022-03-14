<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTree
      title="部门列表"
      :defaultExpandAll="true"
      toolbar
      search
      @reload="handleReload"
      :clickRowToExpand="false"
      :treeData="treeData"
      :fieldNames="{ key: 'id', title: 'name' }"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick, onMounted, ref } from 'vue';

  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { getDeptList } from '/@/api/system/system';
  import { DeptParams } from '/@/api/system/model/systemModel';
  import bus from '/@/utils/bus';

  export default defineComponent({
    name: 'DeptTree',
    components: { BasicTree },

    emits: ['select'],
    setup(_, { emit }) {
      bus.on('reloadDeptTree', async () => {
        await handleReload();
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
      return { treeData, handleSelect, handleReload };
    },
  });
</script>

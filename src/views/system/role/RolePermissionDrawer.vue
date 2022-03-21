<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicTree
      v-if="treeData.length"
      title=""
      defaultExpandAll
      checkable
      :selectable="false"
      @check="handleCheck"
      :treeData="treeData"
      :checkedKeys="checkedKeys"
      :fieldNames="{ key: 'id', title: 'name' }"
    />
  </BasicDrawer>
</template>
<script lang="ts">
  import { computed, defineComponent, ref, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';

  import { assignPermission, getPermissionTree } from '/@/api/system/role/Api';

  export default defineComponent({
    name: 'RolePermissionDrawer',
    components: { BasicDrawer, BasicTree },
    emits: ['success', 'register'],
    setup(_) {
      const roleId = ref('');
      const treeData = ref<TreeItem[]>([]);
      const checkedKeys = ref({ checked: [], halfChecked: [] });
      const permissions = ref<string[]>([]);

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        setDrawerProps({ confirmLoading: false });

        roleId.value = data.record?.id;

        const rst = await getPermissionTree({ roleId: unref(roleId) });
        treeData.value = rst['menus'] as any as TreeItem[];
        permissions.value = rst['permissions'] as any as string[];
        checkedKeys.value = {
          checked: rst['checked'],
          halfChecked: rst['halfChecked'],
        };

        console.log(unref(checkedKeys));
      });

      const getTitle = computed(() => '分配权限');

      function handleCheck(keys, e) {
        permissions.value = [].concat(keys).concat(e.halfCheckedKeys);
      }

      async function handleSubmit() {
        try {
          setDrawerProps({ confirmLoading: true });

          await assignPermission({ roleId: unref(roleId), permissions: unref(permissions) });

          closeDrawer();
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        registerDrawer,
        getTitle,
        handleSubmit,
        treeData,
        checkedKeys,
        handleCheck,
      };
    },
  });
</script>

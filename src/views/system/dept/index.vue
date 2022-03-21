<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="handleFetchSuccess">
      <template #toolbar>
        <a-button type="primary" @click="handleAdd"> 新增部门</a-button>
        <a-button type="primary" @click="expandAll"> 展开所有</a-button>
        <a-button type="primary" @click="collapseAll"> 收起所有</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:add-line',
              onClick: handleAdd.bind(null, record),
            },
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '删除后，该部门的下级部门将同步删除，请确认是否继续？',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <DeptDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick } from 'vue';

  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import DeptDrawer from './DeptDrawer.vue';

  import { columns, searchFormSchema } from './dept.data';

  import { getDeptList, removeDept } from '/@/api/system/dept/Api';

  export default defineComponent({
    name: 'DeptManagement',
    components: { BasicTable, DeptDrawer, TableAction },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload, expandAll, collapseAll }] = useTable({
        title: '部门列表',
        api: getDeptList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        isTreeTable: true,
        pagination: false,
        striped: false,
        useSearchForm: false,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        canResize: false,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: undefined,
        },
      });

      function handleAdd(record: Recordable) {
        openDrawer(true, {
          record: {
            parentCode: record?.rawData?.id,
          },
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record: record.rawData,
          isUpdate: true,
        });
      }

      async function handleDelete(record: Recordable) {
        await removeDept(record.rawData.id);
        handleSuccess();
      }

      function handleSuccess() {
        reload();
      }

      function handleFetchSuccess() {
        nextTick(expandAll);
      }

      return {
        registerTable,
        registerDrawer,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleAdd,
        expandAll,
        collapseAll,
        handleFetchSuccess,
      };
    },
  });
</script>

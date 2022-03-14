<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="handleFetchSuccess">
      <template #toolbar>
        <a-button type="primary" @click="handleAdd"> 新增区域 </a-button>
        <a-button type="primary" @click="expandAll"> 展开所有 </a-button>
        <a-button type="primary" @click="collapseAll"> 收起所有 </a-button>
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
                title: '删除后，该区域的下级区域将同步删除，请确认是否继续？',
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

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getRegionTree } from '/@/api/system/system';

  import { useDrawer } from '/@/components/Drawer';
  import RegionDrawer from './RegionDrawer.vue';

  import { columns, searchFormSchema } from './region.data';
  import { removeRegion } from '/@/api/system/region/Api';

  export default defineComponent({
    name: 'RegionManagement',
    components: { BasicTable, DeptDrawer: RegionDrawer, TableAction },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload, expandAll, collapseAll }] = useTable({
        title: '区域列表',
        api: getRegionTree,
        isTreeTable: true,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        pagination: false,
        striped: false,
        useSearchForm: false,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        canResize: false,
        defaultExpandAllRows: true,
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: undefined,
        },
        rowKey: 'id',
      });

      function handleAdd(record: Recordable) {
        openDrawer(true, {
          record: {
            parentCode: record.rawData?.id,
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
        await removeRegion(record.rawData.id);
        await handleSuccess();
      }

      async function handleSuccess() {
        await reload();
        expandAll();
      }

      function handleFetchSuccess() {
        nextTick(expandAll);
      }

      return {
        registerTable,
        registerDrawer,
        expandAll,
        collapseAll,
        handleEdit,
        handleAdd,
        handleDelete,
        handleSuccess,
        handleFetchSuccess,
      };
    },
  });
</script>

<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">新增账号</a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑用户资料',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:lock-outline',
              tooltip: '修改密码',
              onClick: handleChangePwd.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除此账号',
              popConfirm: {
                title: '是否确认删除?',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <!--    <AccountModal @register="registerModal" @success="handleSuccess" />-->
    <AccountDrawer @register="registerModal" @success="handleSuccess" />
    <ChangePwdDrawer @register="registerChangePwd" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getUserList } from '/@/api/system/account/Api';
  import { PageWrapper } from '/@/components/Page';
  import DeptTree from './DeptTree.vue';

  // import { useModal } from '/@/components/Modal';
  // import AccountModal from './AccountModal.vue';

  import { useDrawer } from '/@/components/Drawer';
  import AccountDrawer from './AccountDrawer.vue';

  import { columns, searchFormSchema } from './account.data';
  import { useGo } from '/@/hooks/web/usePage';
  import { removeUser } from '/@/api/system/account/Api';
  import ChangePwdDrawer from '/@/views/system/account/ChangePwdDrawer.vue';

  export default defineComponent({
    name: 'AccountManagement',
    components: { ChangePwdDrawer, BasicTable, PageWrapper, DeptTree, AccountDrawer, TableAction },
    setup() {
      const go = useGo();
      const [registerModal, { openDrawer }] = useDrawer();
      const [registerChangePwd, { openDrawer: openChangePwd }] = useDrawer();
      const searchInfo = reactive<Recordable>({});
      const [registerTable, { reload }] = useTable({
        title: '账号列表',
        api: getUserList,
        rowKey: 'id',
        columns,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
          actionColOptions: {
            span: 4,
          },
          submitOnChange: true,
        },
        fetchSetting: {
          listField: 'rows',
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        handleSearchInfoFn(info) {
          return info;
        },
        actionColumn: {
          width: 120,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      function handleChangePwd(record: Recordable) {
        openChangePwd(true, {
          record,
        });
      }

      async function handleDelete(record: Recordable) {
        await removeUser(record.id);
        handleSuccess();
      }

      function handleSuccess() {
        reload();
      }

      function handleSelect(deptId = '0') {
        searchInfo.organizationId = deptId;
        reload();
      }

      function handleView(record: Recordable) {
        go('/system/account_detail/' + record.id);
      }

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleSelect,
        handleView,
        searchInfo,
        registerChangePwd,
        handleChangePwd,
      };
    },
  });
</script>

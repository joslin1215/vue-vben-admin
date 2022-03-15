<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    width="50%"
    :showFooter="true"
  >
    <BasicForm @register="registerForm" />
    <template v-if="!isUpdate" #appendFooter>
      <a-button type="primary" @click="handleSubmit(false)">保存并添加</a-button>
    </template>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema } from './account.data';
  import { checkUserExists, saveUser } from '/@/api/system/account/Api';
  import { getDeptList } from '/@/api/system/dept/Api';

  export default defineComponent({
    name: 'AccountDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref('');

      const [
        registerForm,
        { setFieldsValue, updateSchema, resetFields, validate, getFieldsValue },
      ] = useForm({
        labelWidth: 100,
        schemas: accountFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false, maskClosable: false });
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          rowId.value = data.record.id;

          if (data.record.organizationObjs && data.record.organizationObjs.length > 0) {
            data.record['organizationId'] = data.record.organizationObjs[0].id;
          }

          if (data.record.roleObjs && data.record.roleObjs.length > 0) {
            data.record['roleId'] = data.record.roleObjs[0].id;
          }

          setFieldsValue({
            ...data.record,
          });
        }

        const depts = await getDeptList({ status: 1 });

        updateSchema([
          {
            field: 'organizationId',
            componentProps: {
              treeData: depts,
            },
          },
          {
            field: 'employeeId',
            dynamicDisabled: unref(isUpdate),
            dynamicRules: ({ schema }) => {
              return unref(isUpdate) ? [] : schema.rules || [];
            },
          },
          {
            field: 'account',
            dynamicDisabled: unref(isUpdate),
            dynamicRules: ({ schema }) => {
              return unref(isUpdate) ? [] : schema.rules || [];
            },
          },
          {
            field: 'name',
            dynamicRules: ({ values }) => {
              return [
                { required: true, message: '请输入姓名' },
                {
                  validator: (_, value) => {
                    return new Promise((resolve, reject) => {
                      if (!value) {
                        resolve();
                      }
                      const params = {};
                      params['name'] = value;
                      params['id'] = values['id'];
                      checkUserExists(params)
                        .then(() => resolve())
                        .catch(() => {
                          reject('姓名已被使用');
                        });
                    });
                  },
                },
              ];
            },
          },
          {
            field: 'password',
            show: !unref(isUpdate),
            dynamicRules: () => {
              return !unref(isUpdate) ? [{ required: true, message: '请输入密码' }] : [];
            },
          },
          {
            field: 'password1',
            show: !unref(isUpdate),
            rules: [
              {
                required: !unref(isUpdate),
              },
              {
                validator: (_, value) => {
                  return new Promise((resolve, reject) => {
                    if (value === getFieldsValue()['password']) {
                      resolve();
                    } else {
                      reject('两次输入的密码不一致');
                    }
                  });
                },
              },
            ],
          },
        ]);
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增账号' : '编辑账号'));

      async function handleSubmit(close = true) {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });

          values['organizationObjs'] = [{ id: values['organizationId'] }];
          values['roleObjs'] = [{ id: values['roleId'] }];
          await saveUser(values);
          if (close) {
            closeDrawer();
          } else {
            await resetFields();
          }
          emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit, isUpdate };
    },
  });
</script>

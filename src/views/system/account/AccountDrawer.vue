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
  import { computed, defineComponent, ref, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, RenderCallbackParams, Rule, useForm } from '/@/components/Form/index';
  import { accountFormSchema } from './account.data';
  import { CheckUserExistParam, checkUserExists, saveUser } from '/@/api/system/account/Api';

  export default defineComponent({
    name: 'AccountDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref<string>('');

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
        await resetFields();
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
        }

        await setFieldsValue({
          ...data.record,
        });

        await updateSchema([
          {
            field: 'employeeId',
            dynamicDisabled: unref(isUpdate),
            dynamicRules: dynamicRulesWithCheckUserExists,
          },
          {
            field: 'account',
            dynamicDisabled: unref(isUpdate),
            dynamicRules: dynamicRulesWithCheckUserExists,
          },
          {
            field: 'name',
            dynamicRules: dynamicRulesWithCheckUserExists,
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

      function dynamicRulesWithCheckUserExists(renderCallbackParams: RenderCallbackParams): Rule[] {
        const { schema } = renderCallbackParams;
        const { field, rules } = schema;
        const oldRules = rules || [];
        const dynaRules = [
          ...oldRules,
          {
            validator: (_, value) => {
              return new Promise<void>((resolve, reject) => {
                if (!value) {
                  resolve();
                }

                const params: CheckUserExistParam = {};
                params[field] = value;
                params['id'] = unref(rowId);
                checkUserExists(params)
                  .then(() => resolve())
                  .catch(() => {
                    reject(schema.label + '已被使用');
                  });
              });
            },
          },
        ];
        return dynaRules;
      }

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

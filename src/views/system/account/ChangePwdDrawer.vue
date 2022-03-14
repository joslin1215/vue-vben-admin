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
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { changePassword } from '/@/api/system/account/Api';
  import { changePwdFormSchema } from '/@/views/system/account/account.data';

  export default defineComponent({
    name: 'ChangePwdDrawer',
    components: { BasicDrawer, BasicForm },
    setup(_) {
      const rowId = ref('');

      const [
        registerForm,
        { setFieldsValue, resetFields, validate, updateSchema, getFieldsValue },
      ] = useForm({
        labelWidth: 100,
        schemas: changePwdFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false, maskClosable: false });
        rowId.value = data.record.id;

        setFieldsValue({
          ...data.record,
        });

        updateSchema([
          {
            field: 'password1',
            rules: [
              {
                required: true,
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

      const getTitle = '修改密码';

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });

          await changePassword({
            id: rowId.value,
            rawPassword: values['password'],
          });
          await closeDrawer();
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>

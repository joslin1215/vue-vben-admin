<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    showFooter
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
    <template v-if="!isUpdate" #appendFooter>
      <a-button type="primary" @click="handleSubmit(false)">保存并添加</a-button>
    </template>
  </BasicDrawer>
</template>
<script lang="ts">
  import { computed, defineComponent, ref, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './region.data';

  import { saveRegion } from '/@/api/system/region/Api';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  export default defineComponent({
    name: 'RegionDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);

      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        await resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (data.record.parentCode === '0') {
          data.record.parentCode = null;
        }

        // if (unref(isUpdate)) {
        await setFieldsValue({
          ...data.record,
        });
        // }

        await doUpdateSchema(data);
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增区域' : '编辑区域'));

      async function doUpdateSchema(data) {
        await updateSchema({
          field: 'parentCode',
          show: data?.record?.parentCode !== 'root',
        });
      }

      async function handleSubmit(close = true) {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          await saveRegion(values);
          if (close) {
            closeDrawer();
          } else {
            await resetFields();
            await doUpdateSchema(null);
          }
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return { registerDrawer, registerForm, getTitle, handleSubmit, isUpdate };
    },
  });
</script>

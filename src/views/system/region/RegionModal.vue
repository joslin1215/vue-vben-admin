<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
    <template v-if="!isUpdate" #appendFooter>
      <a-button type="primary" @click="handleSubmit(false)">保存并添加</a-button>
    </template>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './region.data';

  import { saveRegion } from '/@/api/system/region/Api';
  import { getRegionTree } from '/@/api/system/system';

  export default defineComponent({
    name: 'RegionModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);

      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await resetFields();
        setModalProps({ confirmLoading: false });
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
        const treeData = await getRegionTree({ status: 1 });
        await updateSchema({
          field: 'parentCode',
          componentProps: { treeData },
          show: data?.record?.parentCode !== 'root',
        });
      }

      async function handleSubmit(close = true) {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          await saveRegion(values);
          if (close) {
            closeModal();
          } else {
            await resetFields();
            await doUpdateSchema(null);
          }
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit, isUpdate };
    },
  });
</script>

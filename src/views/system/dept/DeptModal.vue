<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './dept.data';

  import { getDeptList, getRegionTree } from '/@/api/system/system';
  import { DeptParams, RegionParams } from '/@/api/system/model/systemModel';
  import { deptSave } from '/@/api/system/dept/Api';
  export default defineComponent({
    name: 'DeptModal',
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
        resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (data.record.parentCode === '0') {
          data.record.parentCode = null;
        }

        // if (unref(isUpdate)) {
        setFieldsValue({
          ...data.record,
        });
        // }
        const deptTree = await getDeptList({ status: 1 } as unknown as DeptParams);
        const regionTree = await getRegionTree({ status: 1 } as unknown as RegionParams);
        updateSchema([
          {
            field: 'parentCode',
            componentProps: { treeData: deptTree },
          },
          {
            field: 'regionId',
            componentProps: { treeData: regionTree },
          },
        ]);
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增部门' : '编辑部门'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          await deptSave(values);
          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>

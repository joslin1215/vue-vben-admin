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
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './dept.data';

  import { getDeptList, DeptParams } from '/@/api/system/dept/Api';
  import { RegionParams, getRegionTree } from '/@/api/system/region/Api';
  import { deptSave } from '/@/api/system/dept/Api';
  import bus from '/@/utils/bus';
  export default defineComponent({
    name: 'DeptDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);

      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema(),
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

        await doUpdateSchema();
      });

      async function doUpdateSchema() {
        const deptTree = await getDeptList({ status: 1, thin: true } as unknown as DeptParams);
        const regionTree = await getRegionTree({
          status: 1,
          thin: true,
        } as unknown as RegionParams);
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
      }

      const getTitle = computed(() => (!unref(isUpdate) ? '新增部门' : '编辑部门'));

      async function handleSubmit(close = true) {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          await deptSave(values);
          bus.emit('reloadDeptTree');
          if (close) {
            closeDrawer();
          } else {
            await resetFields();
            await doUpdateSchema();
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

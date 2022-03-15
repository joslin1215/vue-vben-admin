import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h, ref } from 'vue';
import { Tag } from 'ant-design-vue';
import { TreeActionType } from '/@/components/Tree';

export const columns: BasicColumn[] = [
  {
    title: '部门名称',
    dataIndex: ['rawData', 'name'],
    align: 'left',
  },
  {
    title: '排序',
    dataIndex: ['rawData', 'treeSort'],
    width: 50,
  },
  {
    title: '状态',
    width: 80,
    customRender: ({ record }) => {
      // @ts-ignore
      const status = record.rawData.status;
      const enable = status === 1;
      const color = enable ? 'green' : 'red';
      const text = enable ? '启用' : '停用';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '负责区域',
    dataIndex: ['extData', 'regionNames'],
    width: 300,
    align: 'left',
  },
  {
    title: '备注',
    dataIndex: ['rawData', 'remark'],
    width: 200,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '部门名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '停用', value: 0 },
      ],
    },
    colProps: { span: 8 },
  },
];

export const formSchema = (): FormSchema[] => {
  const asyncExpandTreeRef = ref<Nullable<TreeActionType>>(null);
  return [
    {
      field: 'id',
      label: '部门ID',
      component: 'Input',
      show: false,
    },
    {
      field: 'name',
      label: '部门名称',
      component: 'Input',
      required: true,
      rules: [
        {
          required: true,
        },
        {
          validator: (_, value) => {
            return new Promise((resolve, reject) => {
              if (!value) {
                resolve();
              }
              if (value.indexOf(',') > -1) {
                reject('不能包含【,】字符');
              }
              resolve();
            });
          },
        },
      ],
    },
    {
      field: 'parentCode',
      label: '上级部门',
      component: 'TreeSelect',
      componentProps: {
        defaultExpandAll: true,
        // api: getDeptList,
        // params: {
        //   status: 1,
        // },
        fieldNames: {
          label: 'name',
          key: 'id',
          value: 'id',
        },
        ref: asyncExpandTreeRef,
        onOptionsChange: () => {},
        getPopupContainer: () => document.body,
      },
      // required: true,
    },
    {
      field: 'regionId',
      label: '负责区域',
      component: 'TreeSelect',
      required: true,
      componentProps: {
        defaultExpandAll: true,
        fieldNames: {
          label: 'name',
          key: 'id',
          value: 'id',
        },
        getPopupContainer: () => document.body,
      },
    },
    {
      field: 'treeSort',
      label: '排序',
      component: 'InputNumber',
      defaultValue: 50,
      required: true,
    },
    {
      field: 'status',
      label: '状态',
      component: 'RadioButtonGroup',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '启用', value: 1 },
          { label: '停用', value: 0 },
        ],
      },
      required: true,
    },
    {
      label: '备注',
      field: 'remark',
      component: 'InputTextArea',
    },
  ];
};

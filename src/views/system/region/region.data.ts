import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

export const columns: BasicColumn[] = [
  {
    title: '区域名称',
    dataIndex: 'name',
    // width: 300,
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
    title: '创建时间',
    dataIndex: ['rawData', 'createdDate'],
    width: 180,
  },
  {
    title: '备注',
    dataIndex: ['rawData', 'remark'],
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '区域名称',
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

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: '区域ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'name',
    label: '区域名称',
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
    label: '上级区域',
    component: 'TreeSelect',
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

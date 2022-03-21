import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { getDeptList } from '/@/api/system/dept/Api';
import { getRegionTree } from '/@/api/system/region/Api';

/**
 * 部门列表列配置
 */
export const columns: BasicColumn[] = [
  {
    title: '部门名称',
    dataIndex: ['rawData', 'name'],
    align: 'left',
  },
  {
    title: '排序',
    dataIndex: ['rawData', 'treeSort'],
    ifShow: false,
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

/**
 * 部门列表搜索表单配置
 */
export const searchFormSchema: FormSchema[] = [
  {
    label: '部门名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    label: '状态',
    field: 'status',
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

/**
 * 添加、编辑部门表单配置
 */
export const formSchema: FormSchema[] = [
  {
    label: '部门ID',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '部门名称',
    field: 'name',
    component: 'Input',
    required: true,
    rules: [
      {
        required: true,
        message: '请输入部门名称',
      },
      {
        max: 128,
        message: '请输入正确的部门名称',
      },
      {
        whitespace: true,
        message: '请输入正确的部门名称',
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
    label: '上级部门',
    field: 'parentCode',
    component: 'ApiTreeSelect',
    componentProps: {
      defaultExpandAll: true,
      treeDefaultExpandAll: true,
      api: getDeptList,
      params: {
        status: 1,
        thin: true,
      },
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    // required: true,
  },
  {
    label: '负责区域',
    field: 'regionId',
    component: 'ApiTreeSelect',
    required: true,
    componentProps: {
      defaultExpandAll: true,
      treeDefaultExpandAll: true,
      api: getRegionTree,
      params: {
        status: 1,
        thin: true,
      },
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
  },
  {
    label: '排序',
    field: 'treeSort',
    component: 'InputNumber',
    defaultValue: 50,
    required: true,
    show: false,
  },
  {
    label: '状态',
    field: 'status',
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
export const getFormSchema = (): FormSchema[] => {
  return formSchema;
};

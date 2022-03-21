import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { getRegionTree } from '/@/api/system/region/Api';

/**
 * 区域列表列配置
 */
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
    title: '创建时间',
    dataIndex: ['rawData', 'createdDate'],
    width: 180,
  },
  {
    title: '备注',
    dataIndex: ['rawData', 'remark'],
  },
];

/**
 * 区域列表搜索条件表单配置
 */
export const searchFormSchema: FormSchema[] = [
  {
    label: '区域名称',
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
 * 添加、编辑区域表单配置
 */
export const formSchema: FormSchema[] = [
  {
    label: '区域ID',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '区域名称',
    field: 'name',
    component: 'Input',
    required: true,
    rules: [
      {
        required: true,
        message: '请输入区域名称',
      },
      {
        max: 128,
        message: '请输入正确的区域名称',
      },
      {
        whitespace: true,
        message: '请输入正确的区域名称',
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
    label: '上级区域',
    field: 'parentCode',
    component: 'ApiTreeSelect',
    componentProps: {
      api: getRegionTree,
      params: {
        status: 1,
        thin: true,
      },
      treeDefaultExpandAll: true,
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
      onDropdownVisibleChange: (visible: boolean, b) => {
        console.info('visible', visible, b);
        if (visible) {
        }
      },
      // getPopupContainer: () => document.body,
    },
  },
  {
    label: '排序',
    field: 'treeSort',
    component: 'InputNumber',
    defaultValue: 50,
    show: false,
    required: true,
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

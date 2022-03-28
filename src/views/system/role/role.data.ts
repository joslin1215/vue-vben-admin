import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { setRoleStatus } from '/@/api/system/role/Api';
import { useMessage } from '/@/hooks/web/useMessage';

const colProps = {
  span: 24,
};

export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    customRender: ({ record }) => {
      if (!Reflect.has(record, 'pendingStatus')) {
        record.pendingStatus = false;
      }

      return record.id === 'admin'
        ? record.status === 1
          ? '已启用'
          : '已禁用'
        : h(Switch, {
            checked: record.status === 1,
            checkedChildren: '已启用',
            unCheckedChildren: '已禁用',
            loading: record.pendingStatus,
            onChange(checked: boolean) {
              record.pendingStatus = true;
              const newStatus = checked ? 1 : 0;
              const { createMessage } = useMessage();
              setRoleStatus(record.id, newStatus)
                .then(() => {
                  record.status = newStatus;
                  createMessage.success(`已成功修改角色状态`);
                })
                .catch(() => {
                  createMessage.error('修改角色状态失败');
                })
                .finally(() => {
                  record.pendingStatus = false;
                });
            },
          });
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdDate',
    width: 180,
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 6 },
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
    colProps: { span: 3 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: '编码',
    colProps,
    component: 'Input',
    show: false,
  },
  {
    field: 'name',
    label: '角色名称',
    required: true,
    colProps,
    component: 'Input',
    rules: [
      {
        required: true,
        message: '请输入角色名称',
      },
      {
        max: 128,
        message: '请输入正确的角色名称',
      },
      {
        whitespace: true,
        message: '请输入正确的角色名称',
      },
    ],
  },
  {
    field: 'status',
    label: '状态',
    colProps,
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '停用', value: 0 },
      ],
    },
  },
  {
    label: '备注',
    field: 'remark',
    colProps,
    component: 'InputTextArea',
    rules: [
      {
        max: 256,
        message: '请输入正确的备注',
      },
      {
        whitespace: true,
        message: '请输入正确的备注',
      },
    ],
  },
];

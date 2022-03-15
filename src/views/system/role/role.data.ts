import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Switch } from 'ant-design-vue';
import { setRoleStatus } from '/@/api/system/role/Api';
import { useMessage } from '/@/hooks/web/useMessage';

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
    component: 'Input',
    show: false,
  },
  {
    field: 'name',
    label: '角色名称',
    required: true,
    component: 'Input',
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
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];

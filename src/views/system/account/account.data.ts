import { getAllRoleList } from '/@/api/system/role/Api';
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { checkUserExists } from '/@/api/system/account/Api';

export const columns: BasicColumn[] = [
  {
    title: '账号',
    dataIndex: 'account',
    width: 120,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '联系电话',
    dataIndex: 'mobilePhone',
    width: 120,
  },
  {
    title: '角色',
    dataIndex: 'userRole',
    width: 200,
  },
  {
    title: '部门',
    dataIndex: 'organizations',
    align: 'left',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'account',
    label: '账号',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    field: 'name',
    label: '姓名',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    field: 'mobilePhone',
    label: '手机号',
    component: 'Input',
    colProps: { span: 4 },
  },
  {
    label: '角色',
    field: 'roleId',
    component: 'ApiSelect',
    colProps: { span: 4 },
    componentProps: {
      api: getAllRoleList,
      params: { status: 1 },
      resultField: 'rows',
      labelField: 'name',
      valueField: 'id',
    },
  },
];

export const accountFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
    dynamicDisabled: true,
  },
  {
    field: 'employeeId',
    label: '工号',
    component: 'Input',
    colProps: { span: 11 },
    rules: [
      {
        required: true,
        message: '请输入工号',
      },
      {
        validator(_, value) {
          return new Promise((resolve, reject) => {
            if (!value) {
              resolve();
            }
            const params = {};
            params[_['field']] = value;
            checkUserExists(params)
              .then(() => resolve())
              .catch(() => {
                reject('工号已被使用');
              });
          });
        },
      },
    ],
  },
  {
    field: 'organizationId',
    label: '部门',
    colProps: { span: 11 },
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
    required: true,
  },
  {
    field: 'name',
    label: '姓名',
    colProps: { span: 11 },
    component: 'Input',
    rules: [
      {
        required: true,
        message: '请输入姓名',
      },
      {
        validator(_, value) {
          return new Promise((resolve, reject) => {
            if (!value) {
              resolve();
            }
            const params = {};
            params[_['field']] = value;
            checkUserExists(params)
              .then(() => resolve())
              .catch(() => {
                reject('姓名已被使用');
              });
          });
        },
      },
    ],
  },
  {
    field: 'mobilePhone',
    label: '联系电话',
    component: 'Input',
    colProps: { span: 11 },
    required: true,
  },
  {
    label: '角色',
    field: 'roleId',
    component: 'ApiSelect',
    colProps: { span: 11 },
    componentProps: {
      api: getAllRoleList,
      params: { status: 1 },
      resultField: 'rows',
      labelField: 'name',
      valueField: 'id',
    },
    required: true,
  },
  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
    colProps: { span: 11 },
    rules: [
      {
        required: true,
        type: 'email',
      },
    ],
  },
  {
    field: 'account',
    label: '登录账号',
    component: 'Input',
    colProps: { span: 11 },
    rules: [
      {
        required: true,
      },
      {
        validator(_, value) {
          return new Promise((resolve, reject) => {
            if (!value) {
              resolve();
            }
            const params = {};
            params[_['field']] = value;
            checkUserExists(params)
              .then(() => resolve())
              .catch(() => {
                reject('登录账号已被使用');
              });
          });
        },
      },
    ],
  },
  {
    field: 'password',
    label: '密码',
    colProps: { span: 11 },
    component: 'InputPassword',
    required: true,
  },

  {
    field: 'password1',
    label: '确认密码',
    colProps: { span: 11 },
    component: 'InputPassword',
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 22 },
  },
];

export const changePwdFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
    dynamicDisabled: true,
  },
  {
    field: 'account',
    label: '登录账号',
    component: 'Input',
    colProps: { span: 11 },
    dynamicDisabled: true,
  },
  {
    field: 'name',
    label: '姓名',
    colProps: { span: 11 },
    component: 'Input',
    dynamicDisabled: true,
  },

  {
    field: 'password',
    label: '新密码',
    colProps: { span: 11 },
    component: 'InputPassword',
    required: true,
  },

  {
    field: 'password1',
    label: '确认密码',
    colProps: { span: 11 },
    component: 'InputPassword',
  },
];

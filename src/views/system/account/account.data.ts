import { BasicColumn, FormSchema } from '/@/components/Table';
import { getAllRoleList } from '/@/api/system/role/Api';
import { getDeptList } from '/@/api/system/dept/Api';

/**
 * 用户列表列配置
 */
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

/**
 * 用户列表搜索表单配置
 */
export const searchFormSchema: FormSchema[] = [
  {
    label: '账号',
    field: 'account',
    component: 'Input',
    colProps: { span: 5 },
  },
  {
    label: '姓名',
    field: 'name',
    component: 'Input',
    colProps: { span: 5 },
  },
  {
    label: '手机号',
    field: 'mobilePhone',
    component: 'Input',
    colProps: { span: 5 },
  },
  {
    label: '角色',
    field: 'roleId',
    component: 'ApiSelect',
    colProps: { span: 5 },
    componentProps: {
      api: getAllRoleList,
      params: { status: 1 },
      resultField: 'rows',
      labelField: 'name',
      valueField: 'id',
    },
  },
];

/**
 * 添加、编辑用户表单配置，动态校验规则在页面实现
 */
export const accountFormSchema: FormSchema[] = [
  {
    label: 'ID',
    field: 'id',
    component: 'Input',
    show: false,
    dynamicDisabled: true,
  },
  {
    label: '工号',
    field: 'employeeId',
    component: 'Input',
    colProps: { span: 11 },
    rules: [
      {
        required: true,
        message: '请输入工号',
      },
      {
        max: 16,
        message: '请输入正确的工号',
      },
      {
        whitespace: true,
        message: '请输入正确的工号',
      },
    ],
  },
  {
    label: '部门',
    field: 'organizationId',
    colProps: { span: 11 },
    component: 'ApiTreeSelect',
    componentProps: {
      defaultExpandAll: true,
      treeDefaultExpandAll: true,
      api: getDeptList,
      params: { status: 1, thin: true },
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
    label: '姓名',
    field: 'name',
    colProps: { span: 11 },
    component: 'Input',
    rules: [
      {
        required: true,
        message: '请输入姓名',
      },
      {
        max: 32,
        message: '请输入正确的姓名',
      },
      {
        whitespace: true,
        message: '请输入正确的姓名',
      },
    ],
  },
  {
    label: '联系电话',
    field: 'mobilePhone',
    component: 'Input',
    colProps: { span: 11 },
    required: true,
    rules: [
      {
        required: true,
        message: '请输入联系电话',
      },
      {
        whitespace: true,
        message: '请输入正确的联系电话',
      },
      {
        max: 16,
        message: '请输入正确的联系电话',
      },
    ],
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
      {
        max: 32,
        message: '请输入正确的邮箱',
      },
      {
        whitespace: true,
        message: '请输入正确的邮箱',
      },
    ],
  },
  {
    label: '登录账号',
    field: 'account',
    component: 'Input',
    colProps: { span: 11 },
    rules: [
      {
        required: true,
        message: '请输入登录账号',
      },
      {
        max: 32,
        message: '请输入正确的登录名',
      },
      {
        whitespace: true,
        message: '请输入正确的登录名',
      },
    ],
  },
  {
    label: '密码',
    field: 'password',
    colProps: { span: 11 },
    component: 'InputPassword',
    required: true,
    rules: [
      {
        required: true,
        message: '请输入密码',
      },
      {
        pattern: new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,16}$/),
        message: '请保证密码含字母（大小写）、数字及符号组合8~16位',
      },
    ],
  },
  {
    label: '确认密码',
    field: 'password1',
    colProps: { span: 11 },
    component: 'InputPassword',
    rules: [
      {
        required: true,
        message: '请输入确认密码',
      },
      {
        pattern: new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,16}$/),
        message: '请保证密码含字母（大小写）、数字及符号组合8~16位',
      },
    ],
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 22 },
    rules: [
      {
        max: 1024,
        message: '请输入正确的备注',
      },
    ],
  },
];

/**
 * 修改密码表单配置
 */
export const changePwdFormSchema: FormSchema[] = [
  {
    label: 'ID',
    field: 'id',
    component: 'Input',
    show: false,
    dynamicDisabled: true,
  },
  {
    label: '登录账号',
    field: 'account',
    component: 'Input',
    colProps: { span: 11 },
    dynamicDisabled: true,
  },
  {
    label: '姓名',
    field: 'name',
    colProps: { span: 11 },
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '新密码',
    field: 'password',
    colProps: { span: 11 },
    component: 'InputPassword',
    required: true,
    rules: [
      {
        required: true,
        message: '请输入密码',
      },
      {
        pattern: new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,16}$/),
        message: '请保证密码含字母（大小写）、数字及符号组合8~16位',
      },
    ],
  },
  {
    label: '确认密码',
    field: 'password1',
    colProps: { span: 11 },
    component: 'InputPassword',
    rules: [
      {
        required: true,
        message: '请输入确认密码',
      },
      {
        pattern: new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,16}$/),
        message: '请保证密码含字母（大小写）、数字及符号组合8~16位',
      },
    ],
  },
];

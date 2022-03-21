/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RoleModel {
  id: string;
  name: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleModel;
}

export interface OrganizationModel {
  id: string | number;
  name: string;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roleIds: string[] | number[];
  userRole: string;
  organizations: string;
  organizationObjs: OrganizationModel[];
  roleObjs: RoleModel[];
  // 用户id
  id: string | number;
  // 用户名
  account: string;
  // 真实名字
  name: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}

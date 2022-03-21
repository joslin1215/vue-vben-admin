import { http } from '/@/utils/http/axios';
import { BasicFetchResult, BasicPageParams } from '/@/api/model/baseModel';

enum Api {
  SaveUserUrl = '/sys/user/save',
  RemoveUserUrl = '/sys/user/remove/',
  CheckUserExistsUrl = '/sys/user/check-exist',
  ChangePasswordUrl = '/sys/user/change-password',
  GetUserListUrl = '/sys/user/list',
  GetPermissionsUrl = '/sys/user/permissions',
}

export type GetPermissionParam = {
  userId?: string;
};

export type UserSaveParam = {
  id: string;
  account: string;
  name: string;
  password: string;
  email: string;
  mobilePhone: string;
  roleId: string;
  organizationId: string;
  status: number | string;
  remark: string;
};

export type UserChangePwdParam = {
  id: string;
  rawPassword: string;
};

export type CheckUserExistParam = {
  employeeId?: string;
  account?: string;
  name?: string;
};

export type GetUserListParam = BasicPageParams & {
  account?: string;
  name?: string;
  organizationId?: string;
  roleId: string;
  mobilePhone?: string;
};

export interface GetUserListItem {
  id: string;
  account: string;
  email: string;
  nickname: string;
  role: number;
  createTime: string;
  remark: string;
  status: number;
}

export type UserListGetResultModel = BasicFetchResult<GetUserListItem>;

export type UserPermissionsGetResultModel = BasicFetchResult<string[]>;

export const getUserList = (params: GetUserListParam) =>
  http.get<UserListGetResultModel>({ url: Api.GetUserListUrl, params });

export const saveUser = (params?: UserSaveParam) =>
  http.post<any>({ url: Api.SaveUserUrl, params });

export const removeUser = (id: string) => http.delete<any>({ url: Api.RemoveUserUrl + id });

export const checkUserExists = (params: CheckUserExistParam) =>
  http.get({ url: Api.CheckUserExistsUrl, params }, { errorMessageMode: 'none' });

export const changePassword = (params: UserChangePwdParam) =>
  http.put<any>({ url: Api.ChangePasswordUrl, params });

export const getPermissions = (params: GetPermissionParam) =>
  http.get<UserPermissionsGetResultModel>({ url: Api.GetPermissionsUrl, params });

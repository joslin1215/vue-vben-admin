import { http } from '/@/utils/http/axios';
import { BasicFetchResult, BasicPageParams } from '/@/api/model/baseModel';

enum Api {
  SaveRoletUrl = '/sys/role/save',
  RemoveRoleUrl = '/sys/role/remove/',
  ChangeRoleStatusUrl = '/sys/role/change-status',
  GetRoleListUrl = '/sys/role/listByPage',
  GetPermissionsUrl = '/sys/role/permissions',
  GetPermissionTreeUrl = '/sys/role/permission-tree-vue',
  AssignPermissionUrl = '/sys/role/assign-permission',
}

export type RoleSaveParam = {
  name: string;
  status: number | string;
  remark: string;
};

export type RoleParams = {
  name?: string;
  status?: number | string;
};

export type GetPermissionParam = {
  userId?: string;
};

export type AssignPermissionParam = {
  roleId: string;
  permissions: string[];
};

export type RolePageParams = BasicPageParams & RoleParams;

export interface RoleListItem {
  id: string;
  name: string;
  roleName: string;
  roleValue: string;
  status: number;
  orderNo: string;
  remark: string;
  createTime: string;
}

export type RolePageListGetResultModel = BasicFetchResult<RoleListItem>;

export type RoleListGetResultModel = RoleListItem[];

export type RolePermissionsGetResultModel = BasicFetchResult<string[]>;

export const saveRole = (params?: RoleSaveParam) =>
  http.post<any>({ url: Api.SaveRoletUrl, params });

export const removeRole = (id: string) => http.delete<any>({ url: Api.RemoveRoleUrl + id });

export const getRoleListByPage = (params?: RolePageParams) =>
  http.get<RolePageListGetResultModel>({ url: Api.GetRoleListUrl, params });

export const getAllRoleList = (params?: RoleParams) =>
  http.get<RoleListGetResultModel>({ url: Api.GetRoleListUrl, params });

export const setRoleStatus = (id: number, status: number | string) =>
  http.put({ url: Api.ChangeRoleStatusUrl, params: { id, status } });

export const getPermissions = (params: GetPermissionParam) =>
  http.get<RolePermissionsGetResultModel>({ url: Api.GetPermissionsUrl, params });

export const getPermissionTree = (params) =>
  http.get<any>({ url: Api.GetPermissionTreeUrl, params });

export const assignPermission = (params: AssignPermissionParam) =>
  http.put<any>({ url: Api.AssignPermissionUrl, params });

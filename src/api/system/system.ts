import {
  AccountParams,
  MenuParams,
  RoleParams,
  RolePageParams,
  MenuListGetResultModel,
  DeptListGetResultModel,
  AccountListGetResultModel,
  RolePageListGetResultModel,
  RoleListGetResultModel,
  RegionListGetResultModel,
  RegionParams,
  DeptParams,
} from '/@/api/system/model/systemModel';
import { defHttp, http } from '/@/utils/http/axios';

enum Api {
  AccountList = '/sys/user/list',
  DeptList = '/sys/organization/tree',
  setRoleStatus = '/sys/role/status',
  MenuList = '/system/getMenuList',
  RolePageList = '/sys/role/listByPage',
  RegionTree = '/sys/region/tree',
}

export const getAccountList = (params: AccountParams) =>
  http.get<AccountListGetResultModel>({ url: Api.AccountList, params });

export const getDeptList = (params?: DeptParams) =>
  http.get<DeptListGetResultModel>({ url: Api.DeptList, params });

export const getRegionTree = (params?: RegionParams) =>
  http.get<RegionListGetResultModel>({ url: Api.RegionTree, params });

export const getMenuList = (params?: MenuParams) =>
  defHttp.get<MenuListGetResultModel>({ url: Api.MenuList, params });

export const getRoleListByPage = (params?: RolePageParams) =>
  http.get<RolePageListGetResultModel>({ url: Api.RolePageList, params });

export const getAllRoleList = (params?: RoleParams) =>
  http.get<RoleListGetResultModel>({ url: Api.RolePageList, params });

export const setRoleStatus = (id: number, status: string) =>
  defHttp.post({ url: Api.setRoleStatus, params: { id, status } });

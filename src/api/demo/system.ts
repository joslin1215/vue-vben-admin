import { MenuParams, MenuListGetResultModel } from './model/systemModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  AccountList = '/sys/user/list',
  IsAccountExist = '/system/accountExist',
  DeptList = '/sys/organization/tree',
  setRoleStatus = '/sys/role/status',
  MenuList = '/system/getMenuList',
  RolePageList = '/sys/role/listByPage',
  RegionTree = '/sys/region/tree',
}

export const getMenuList = (params?: MenuParams) =>
  defHttp.get<MenuListGetResultModel>({ url: Api.MenuList, params });

export const setRoleStatus = (id: number, status: string) =>
  defHttp.post({ url: Api.setRoleStatus, params: { id, status } });

export const isAccountExist = (account: string) =>
  defHttp.post({ url: Api.IsAccountExist, params: { account } }, { errorMessageMode: 'none' });

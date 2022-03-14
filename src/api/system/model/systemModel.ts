import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type AccountParams = BasicPageParams & {
  account?: string;
  nickname?: string;
};

export type RoleParams = {
  name?: string;
  status?: number | string;
};

export type RolePageParams = BasicPageParams & RoleParams;

export type DeptParams = {
  name?: string;
  status?: number | string;
  parentCode?: string;
};

export type RegionParams = {
  name?: string;
  status?: number | string;
  parentCode?: string;
};

export type MenuParams = {
  menuName?: string;
  status?: string;
};

export interface AccountListItem {
  id: string;
  account: string;
  email: string;
  nickname: string;
  role: number;
  createTime: string;
  remark: string;
  status: number;
}

export interface RegionListItem {
  id: string;
  name: string;
  opened: boolean;
  checked: boolean;
  disabled: boolean;
  remark: string;
  status: number;
  rawData: object;
  extData: object;
}

export interface DeptListItem {
  id: string;
  name: string;
  opened: boolean;
  checked: boolean;
  disabled: boolean;
  remark: string;
  status: number;
  rawData: object;
  extData: object;
}

export interface MenuListItem {
  id: string;
  orderNo: string;
  createTime: string;
  status: number;
  icon: string;
  component: string;
  permission: string;
}

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

/**
 * @description: Request list return value
 */
export type AccountListGetResultModel = BasicFetchResult<AccountListItem>;

export type DeptListGetResultModel = BasicFetchResult<DeptListItem>;

export type RegionListGetResultModel = BasicFetchResult<RegionListItem>;

export type MenuListGetResultModel = BasicFetchResult<MenuListItem>;

export type RolePageListGetResultModel = BasicFetchResult<RoleListItem>;

export type RoleListGetResultModel = RoleListItem[];

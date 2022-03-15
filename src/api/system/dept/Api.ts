import { http } from '/@/utils/http/axios';
import { BasicFetchResult } from '/@/api/model/baseModel';
enum Api {
  SaveDeptUrl = '/sys/organization/save',
  RemoveDeptUrl = '/sys/organization/remove/',
  GetDeptListUrl = '/sys/organization/tree',
}

export type DeptParams = {
  name?: string;
  status?: number | string;
  parentCode?: string;
  thin?: boolean;
};

export type DeptSaveParam = {
  id: string | number;
  name: string;
  parentCode: string | number;
  regionId: string | number;
  status: number | string;
  remark: string;
  treeSort: number | string;
};

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

export type DeptListGetResultModel = BasicFetchResult<DeptListItem>;

export const getDeptList = (params?: DeptParams) =>
  http.get<DeptListGetResultModel>({ url: Api.GetDeptListUrl, params });

export const deptSave = (params?: DeptSaveParam) =>
  http.post<any>({ url: Api.SaveDeptUrl, params });

export const removeDept = (id: string) => http.delete<any>({ url: Api.RemoveDeptUrl + id });

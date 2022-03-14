import { http } from '/@/utils/http/axios';

enum Api {
  SaveDeptUrl = '/sys/organization/save',
  RemoveDeptUrl = '/sys/organization/remove/',
}

export type DeptSaveParam = {
  id: string | number;
  name: string;
  parentCode: string | number;
  regionId: string | number;
  status: number | string;
  remark: string;
  treeSort: number | string;
};

export const deptSave = (params?: DeptSaveParam) =>
  http.post<any>({ url: Api.SaveDeptUrl, params });

export const removeDept = (id: string) => http.delete<any>({ url: Api.RemoveDeptUrl + id });

import { http } from '/@/utils/http/axios';

enum Api {
  SaveRoletUrl = '/sys/role/save',
  RemoveRoleUrl = '/sys/role/remove/',
}

export type RoleSaveParam = {
  name: string;
  status: number | string;
  remark: string;
};

export const saveRole = (params?: RoleSaveParam) =>
  http.post<any>({ url: Api.SaveRoletUrl, params });

export const removeRole = (id: string) => http.delete<any>({ url: Api.RemoveRoleUrl + id });

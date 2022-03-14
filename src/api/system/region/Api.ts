import { http } from '/@/utils/http/axios';

enum Api {
  SaveRegionUrl = '/sys/region/save',
  RemoveRegionUrl = '/sys/region/remove/',
}

export type SaveRegionParam = {
  id: string | number;
  name: string;
  parentCode: string | number;
  status: number | string;
  remark: string;
  treeSort: number | string;
};
export const saveRegion = (params?: SaveRegionParam) =>
  http.post<any>({ url: Api.SaveRegionUrl, params });

export const removeRegion = (id: string) => http.delete<any>({ url: Api.RemoveRegionUrl + id });

import { http } from '/@/utils/http/axios';
import { BasicFetchResult } from '/@/api/model/baseModel';

enum Api {
  SaveRegionUrl = '/sys/region/save',
  RemoveRegionUrl = '/sys/region/remove/',
  GetRegionTreeUrl = '/sys/region/tree',
}

export type RegionParams = {
  name?: string;
  status?: number | string;
  parentCode?: string;
  thin?: boolean;
};

export type SaveRegionParam = {
  id: string | number;
  name: string;
  parentCode: string | number;
  status: number | string;
  remark: string;
  treeSort: number | string;
};

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

export type RegionListGetResultModel = BasicFetchResult<RegionListItem>;

export const saveRegion = (params?: SaveRegionParam) =>
  http.post<any>({ url: Api.SaveRegionUrl, params });

export const removeRegion = (id: string) => http.delete<any>({ url: Api.RemoveRegionUrl + id });

export const getRegionTree = (params?: RegionParams) =>
  http.get<RegionListGetResultModel>({ url: Api.GetRegionTreeUrl, params });

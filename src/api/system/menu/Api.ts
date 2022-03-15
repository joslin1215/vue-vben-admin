import { BasicFetchResult } from '/@/api/model/baseModel';
import { http } from '/@/utils/http/axios';

enum Api {
  GetAllMenuUrl = '/sys/menu/all',
  GetMenuUrl = '/sys/menu/list',
}

export type MenuParams = {
  name?: string;
  status?: string;
};

export interface MenuListItem {
  id: string;
  orderNo: string;
  createTime: string;
  status: number;
  icon: string;
  component: string;
  permission: string;
}

export type getAllMenuResultModel = BasicFetchResult<MenuListItem>;

export const getMenuList = () => http.get<getAllMenuResultModel>({ url: Api.GetMenuUrl });

export const getAllMenuList = (params?: MenuParams) =>
  http.get<getAllMenuResultModel>({ url: Api.GetAllMenuUrl, params });

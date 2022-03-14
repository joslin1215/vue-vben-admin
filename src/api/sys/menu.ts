import { http } from '/@/utils/http/axios';
import { getMenuListResultModel } from './model/menuModel';

enum Api {
  GetMenuList = '/sys/menu/list',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return http.get<getMenuListResultModel>({ url: Api.GetMenuList });
};

import { http } from '/@/utils/http/axios';
import { IsAccountExistParams } from '/@/api/system/model/systemModel';

enum Api {
  SaveUsertUrl = '/sys/user/save',
  RemoveUserUrl = '/sys/user/remove/',
  IsUserExist = '/sys/user/checkExist',
  ChangePasswordUrl = '/sys/user/change-password',
}

export type UserSaveParam = {
  id: string;
  account: string;
  name: string;
  password: string;
  email: string;
  mobilePhone: string;
  roleId: string;
  organizationId: string;
  status: number | string;
  remark: string;
};

export type UserChangePwdParam = {
  id: string;
  rawPassword: string;
};

export type IsUserExistParams = {
  employeeId?: string;
  account?: string;
  name?: string;
};

export const saveUser = (params?: UserSaveParam) =>
  http.post<any>({ url: Api.SaveUsertUrl, params });

export const removeUser = (id: string) => http.delete<any>({ url: Api.RemoveUserUrl + id });

export const isUserExist = (params: IsAccountExistParams) =>
  http.get({ url: Api.IsUserExist, params }, { errorMessageMode: 'none' });

export const changePassword = (params: UserChangePwdParam) =>
  http.put<any>({ url: Api.ChangePasswordUrl, params });

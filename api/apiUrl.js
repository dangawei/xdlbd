let app = getApp()
import {wxRequest} from './request.js'
export const isTest = true//是否是测试环境登录

const httpUrl = isTest ? '1' : '2';

export const login = (data) => {//账号登录
  const params = { url: httpUrl+'', data: JSON.stringify(data) }
  return wxRequest(params);
};
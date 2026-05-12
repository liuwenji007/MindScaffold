/**
 * 登录认证服务
 * 管理 JWT token 的存储和生命周期
 */
import Taro from '@tarojs/taro';
import { API } from '@/config/api';
import { post } from './api';

const TOKEN_KEY = 'ms_jwt_token';
const USER_KEY = 'ms_user_info';

export interface UserInfo {
  id: string;
  nickname: string;
  avatar_url?: string;
  platform?: string;
}

/** 获取存储的 token */
export function getToken(): string | null {
  try {
    return Taro.getStorageSync(TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

/** 保存 token */
function saveToken(token: string): void {
  Taro.setStorageSync(TOKEN_KEY, token);
}

/** 获取存储的用户信息 */
export function getUserInfo(): UserInfo | null {
  try {
    const raw = Taro.getStorageSync(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** 保存用户信息 */
function saveUserInfo(user: UserInfo): void {
  Taro.setStorageSync(USER_KEY, JSON.stringify(user));
}

/** 清除登录态 */
export function clearAuth(): void {
  try {
    Taro.removeStorageSync(TOKEN_KEY);
    Taro.removeStorageSync(USER_KEY);
  } catch {
    // ignore
  }
}

/** 检查是否已登录 */
export function isLoggedIn(): boolean {
  return !!getToken();
}

/** 发送验证码 */
export async function sendVerificationCode(phone: string): Promise<boolean> {
  const res = await post('/auth/send-code', { phone });
  return !!res.success;
}

/** 验证码登录 */
export async function verifyCode(phone: string, code: string): Promise<UserInfo | null> {
  const res = await post<{ token: string; user: UserInfo }>('/auth/verify', { phone, code });

  if (res.error || !res.data?.token) {
    return null;
  }

  saveToken(res.data.token);
  saveUserInfo(res.data.user);
  return res.data.user;
}

/** 密码登录 */
export async function passwordLogin(phone: string, password: string): Promise<UserInfo | null> {
  const res = await post<{ token: string; user: UserInfo }>('/auth/password-login', { phone, password });

  if (res.error || !res.data?.token) {
    return null;
  }

  saveToken(res.data.token);
  saveUserInfo(res.data.user);
  return res.data.user;
}

/** 刷新 token */
export async function refreshToken(): Promise<boolean> {
  const res = await post<{ token: string }>('/auth/refresh');
  if (res.data?.token) {
    saveToken(res.data.token);
    return true;
  }
  return false;
}

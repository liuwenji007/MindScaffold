/**
 * 登录认证服务
 * 管理 JWT token 的存储和生命周期
 */
import Taro from '@tarojs/taro';
import { post } from './api';

const TOKEN_KEY = 'ms_jwt_token';
const USER_KEY = 'ms_user_info';

export interface UserInfo {
  id: string;
  nickname: string;
  avatar_url?: string;
  platform?: string;
  open_id?: string;
  is_admin?: boolean;
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

function pickLoginPayload(res: Record<string, unknown>): { token: string; user: UserInfo } | null {
  if (typeof res.error === 'string' && res.error !== '') {
    return null;
  }

  const data = res.data as Record<string, unknown> | undefined;
  const tokenRaw = res.token ?? data?.token;
  const token = typeof tokenRaw === 'string' && tokenRaw !== '' ? tokenRaw : null;
  if (!token) return null;

  const userRaw = res.user ?? data?.user;
  if (!userRaw || typeof userRaw !== 'object') return null;
  const u = userRaw as Record<string, unknown>;
  if (typeof u.id !== 'string' || u.id === '') return null;

  const user: UserInfo = {
    id: u.id,
    nickname: typeof u.nickname === 'string' ? u.nickname : '',
    ...(typeof u.avatar_url === 'string' && { avatar_url: u.avatar_url }),
    ...(typeof u.platform === 'string' && { platform: u.platform }),
    ...(typeof u.open_id === 'string' && { open_id: u.open_id }),
    ...(typeof u.is_admin === 'boolean' && { is_admin: u.is_admin }),
  };

  return { token, user };
}

/** 发送验证码 */
export async function sendVerificationCode(phone: string): Promise<boolean> {
  const res = await post('/auth/send-code', { phone });
  return res.code === 0;
}

/** 验证码登录 */
export async function verifyCode(phone: string, code: string): Promise<UserInfo | null> {
  const res = (await post('/auth/verify', { phone, code })) as Record<string, unknown>;
  const payload = pickLoginPayload(res);
  if (!payload) return null;

  saveToken(payload.token);
  saveUserInfo(payload.user);
  return payload.user;
}

/** 密码登录：account 为账号或手机号（与后端 users.openid 一致） */
export async function passwordLogin(account: string, password: string): Promise<UserInfo | null> {
  const res = (await post('/auth/password-login', { account, password })) as Record<string, unknown>;
  const payload = pickLoginPayload(res);
  if (!payload) return null;

  saveToken(payload.token);
  saveUserInfo(payload.user);
  return payload.user;
}

/** 刷新 token */
export async function refreshToken(): Promise<boolean> {
  const res = (await post('/auth/refresh')) as Record<string, unknown>;
  const data = res.data as Record<string, unknown> | undefined;
  const tokenRaw = res.token ?? data?.token;
  const token = typeof tokenRaw === 'string' && tokenRaw !== '' ? tokenRaw : null;
  if (!token) return false;

  saveToken(token);
  return true;
}

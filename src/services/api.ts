/**
 * 统一 API 客户端
 * 基于 Taro.request 封装，自动携带 JWT token
 */
import Taro from '@tarojs/taro';
import { API } from '@/config/api';
import { getToken, clearAuth } from './auth';

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success?: boolean;
  [key: string]: unknown;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  data?: Record<string, unknown>;
  params?: Record<string, string>;
  skipAuth?: boolean;
}

async function request<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', data, params, skipAuth = false } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (!skipAuth) {
    const token = await getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Build URL with query params
  let url = `${API.V1}${path}`;
  if (params && Object.keys(params).length > 0) {
    const search = new URLSearchParams(params).toString();
    url = `${url}?${search}`;
  }

  try {
    const res = await Taro.request({
      url,
      method,
      data: method !== 'GET' ? data : undefined,
      header: headers,
      timeout: 30000,
    });

    const body = res.data as ApiResponse<T>;

    if (res.statusCode === 401) {
      const msg =
        typeof body?.error === 'string' && body.error
          ? body.error
          : '登录已过期，请重新登录';
      // 登录/注册接口的 401 表示验证码或密码错误，不应整页重定向以免丢失表单
      const isCredentialLogin =
        path === '/auth/verify' || path === '/auth/password-login';

      clearAuth();
      if (!isCredentialLogin) {
        Taro.reLaunch({ url: '/pages/login/index' });
      }
      return { error: msg, ...body };
    }

    return body;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '网络请求失败';
    return { error: message };
  }
}

// —— 便捷方法 ——

export function get<T = unknown>(path: string, params?: Record<string, string>) {
  return request<T>(path, { method: 'GET', params });
}

export function post<T = unknown>(path: string, data?: Record<string, unknown>) {
  return request<T>(path, { method: 'POST', data });
}

export function patch<T = unknown>(path: string, data?: Record<string, unknown>) {
  return request<T>(path, { method: 'PATCH', data });
}

export function del<T = unknown>(path: string) {
  return request<T>(path, { method: 'DELETE' });
}

export default request;

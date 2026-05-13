/**
 * 请求拦截器 / 响应拦截器
 * 统一管理：Token 注入、401 处理、业务错误提示、Loading 状态
 */
import Taro from '@tarojs/taro';
import { getToken, clearAuth } from './auth';
import { API } from '@/config/api';

// —— 类型 ——
export interface StdResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface InterceptedResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  error?: string;  // 兼容旧代码：错误时映射自 message
}

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  data?: Record<string, unknown>;
  params?: Record<string, string>;
  header?: Record<string, string>;
  skipAuth?: boolean;
  skipErrorToast?: boolean;   // 静默失败，不弹 toast
  showLoading?: boolean;       // 显示 loading
}

// —— 全局 loading 计数 ——
let loadingCount = 0;
function showLoading() {
  loadingCount++;
  Taro.showLoading({ title: '加载中...', mask: true }).catch(() => {});
}
function hideLoading() {
  loadingCount--;
  if (loadingCount <= 0) {
    loadingCount = 0;
    Taro.hideLoading().catch(() => {});
  }
}

// —— 核心请求方法 ——
export async function request<T = unknown>(
  path: string,
  config: RequestConfig = {}
): Promise<InterceptedResponse<T>> {
  const {
    method = 'GET',
    data,
    params,
    header = {},
    skipAuth = false,
    skipErrorToast = false,
    showLoading: shouldLoad = false,
  } = config;

  if (shouldLoad) showLoading();

  // 1. 请求拦截器：自动注入 Token
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...header,
  };
  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // 2. 拼接 URL
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

    const body = res.data as StdResponse<T>;

    // 3. 响应拦截器：统一处理业务错误
    if (body.code !== 0) {
      // 401 / token 过期 → 清登录态、跳转
      if (body.code === 2001 || body.code === 2002) {
        clearAuth();
        const isCredentialLogin =
          path === '/auth/verify' || path === '/auth/password-login';
        if (!isCredentialLogin && !skipErrorToast) {
          Taro.showToast({ title: body.message, icon: 'none' });
        }
        Taro.reLaunch({ url: '/pages/login/index' });
        return { code: body.code, message: body.message, data: null as T, error: body.message };
      }

      // 其他业务错误 → toast 提示（可跳过）
      if (!skipErrorToast && body.message) {
        Taro.showToast({ title: body.message, icon: 'none', duration: 2000 });
      }

      return { code: body.code, message: body.message, data: null as T, error: body.message };
    }

    // 4. 成功 → 展开 data
    return { code: 0, message: 'ok', data: body.data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : '网络请求失败';
    if (!skipErrorToast) {
      Taro.showToast({ title: message, icon: 'none', duration: 2000 });
    }
    return { code: -1, message, data: null as T };
  } finally {
    if (shouldLoad) hideLoading();
  }
}

// —— 便捷方法 ——
export function get<T = unknown>(path: string, params?: Record<string, string>, config?: RequestConfig) {
  return request<T>(path, { ...config, method: 'GET', params });
}

export function post<T = unknown>(path: string, data?: Record<string, unknown>, config?: RequestConfig) {
  return request<T>(path, { ...config, method: 'POST', data });
}

export function patch<T = unknown>(path: string, data?: Record<string, unknown>, config?: RequestConfig) {
  return request<T>(path, { ...config, method: 'PATCH', data });
}

export function del<T = unknown>(path: string, config?: RequestConfig) {
  return request<T>(path, { ...config, method: 'DELETE' });
}

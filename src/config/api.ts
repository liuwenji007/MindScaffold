/**
 * API 基础配置
 */
export const API_BASE_URL = process.env.TARO_APP_API_URL || 'http://localhost:8080';

export const API = {
  BASE: API_BASE_URL,
  V1: `${API_BASE_URL}/api/v1`,
} as const;

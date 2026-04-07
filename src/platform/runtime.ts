// 运行时平台检测
export const Platform = {
  isH5: typeof window !== 'undefined' && !('wx' in window) && !('plus' in window),
  isWeapp: typeof window !== 'undefined' && 'wx' in window,
  isHybrid: typeof window !== 'undefined' && 'plus' in window,
};

// 能力检测
export const Capability = {
  hasBridge: (): boolean => {
    return typeof window !== 'undefined' && 'plus' in window;
  },
  hasNativeStorage: (): boolean => {
    return typeof window !== 'undefined' && 'plus' in window;
  },
};

// 获取安全区域
export const getSafeArea = () => {
  if (typeof window === 'undefined') return { top: 20, bottom: 34 };

  const safeArea = {
    top: 20,
    bottom: 34,
  };

  // iOS 安全区域
  if ('CSS' in window && CSS.supports && CSS.supports('padding-top: env(safe-area-inset-top)')) {
    safeArea.top = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top') || '20', 10);
    safeArea.bottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom') || '34', 10);
  }

  return safeArea;
};
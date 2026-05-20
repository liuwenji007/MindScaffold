/**
 * TabBar 图标资源入口
 *
 * 【临时方案】当前使用根目录 PNG，图稿仍会调整。
 * 定稿后请按 src/assets/icons/README.md 做分端资源（png/webp、按 TARO_ENV 分支），
 * 只改本文件与资源目录，无需动 TabBar 布局组件。
 */
// —— 临时：全端共用 PNG（图稿定稿后改为分目录 import）——
import homeIcon from '@/assets/icons/home.png';
import historyIcon from '@/assets/icons/history.png';
import treeIcon from '@/assets/icons/tree.png';
import myIcon from '@/assets/icons/my.png';

export type TabIconKey = 'index' | 'history' | 'tree' | 'profile';

const ICONS_COMMON: Record<TabIconKey, string> = {
  index: homeIcon,
  history: historyIcon,
  tree: treeIcon,
  profile: myIcon,
};

/**
 * 按端解析 Tab 图标 URL。
 * 图稿定稿后示例：
 *
 *   const env = process.env.TARO_ENV;
 *   if (env === 'h5') return ICONS_WEBP[key];
 *   return ICONS_PNG[key];
 */
export function resolveTabIcon(key: TabIconKey): string {
  const env = process.env.TARO_ENV;

  // TODO(assets): 图稿定稿后在此按 env 返回分端资源，参见 src/assets/icons/README.md
  void env;
  return ICONS_COMMON[key];
}

export const TAB_ICON_META: { key: TabIconKey; title: string; path: string }[] = [
  { key: 'index', title: '首页', path: '/pages/index/index' },
  { key: 'history', title: '历史', path: '/pages/history/index' },
  { key: 'tree', title: '大树', path: '/pages/tree/index' },
  { key: 'profile', title: '我的', path: '/pages/profile/index' },
];

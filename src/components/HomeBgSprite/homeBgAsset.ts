import homeBgPng from '@/assets/sprite/homeBg.png';
import homeBgWebp from '@/assets/sprite/homeBg.webp';

/** H5 用 WebP；小程序等端用 PNG（与 Tab 图标分端策略一致） */
export function resolveHomeBgSprite(): string {
  return process.env.TARO_ENV === 'h5' ? homeBgWebp : homeBgPng;
}

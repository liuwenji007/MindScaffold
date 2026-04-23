export type AppIconName =
  | 'home'
  | 'history'
  | 'leaf'
  | 'user'
  | 'settings'
  | 'shop'
  | 'chevronLeft'
  | 'check'
  | 'wind'
  | 'arrowRight'
  | 'sparkles';

export type AppIconProps = {
  name: AppIconName;
  size?: number;
  color?: string;
  className?: string;
};

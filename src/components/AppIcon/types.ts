export type AppIconName =
  | 'home'
  | 'history'
  | 'user'
  | 'wind'
  | 'arrowRight'
  | 'sparkles';

export type AppIconProps = {
  name: AppIconName;
  size?: number;
  color?: string;
  className?: string;
};

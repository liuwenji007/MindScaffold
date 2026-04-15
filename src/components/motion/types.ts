import type { PropsWithChildren } from 'react';

export type FadeInVariant = 'fadeIn' | 'fadeInDelay';

export type FadeInProps = PropsWithChildren<{
  className?: string;
  variant?: FadeInVariant;
}>;

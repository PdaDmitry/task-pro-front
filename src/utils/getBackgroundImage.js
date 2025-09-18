import { backgrounds } from '../data/backgrounds';

export const getBackgroundImage = (bgKey, width) => {
  const bg = backgrounds.find(item => item.id === bgKey);
  if (!bg) return null;

  if (width < 768) return bg.mobile;
  if (width < 1440) return bg.tablet || bg.mobile;
  return bg.desktop || bg.tablet || bg.mobile;
};

export const getBackgroundUrl = (bg, theme) => {
  if (typeof bg.url === 'string') {
    return bg.url;
  }

  return bg.url[theme] || bg.url.light;
};

export const getOffset = (element, scroll = 0) => {
  const box = element.getBoundingClientRect();

  return {
    bottom: box.bottom,
    height: box.height,
    left: box.left,
    top: box.top + scroll,
    width: box.width,
  };
};

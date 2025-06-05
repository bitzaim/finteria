type Size = {
  width: number;
  height: number;
};

export const iconAttributes = (size: Size) => {
  const { width, height } = size;

  return {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "currentColor",
    stroke: "none",
    viewBox: `0 0 ${width} ${height}`,
    // height: "1em",
    height: `${height}px`,
    // width: `${width / height}em`,
    width: `${width}px`,
    style: { pointerEvents: "none" },
  };
};

export default {
  iconAttributes,
};

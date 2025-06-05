import { Picture } from "@/types/image.type";

export const getWebpSource = (image: Picture | string): string => {
  if (typeof image === "object") {
    if (typeof image.webp === "object") {
      return `${image.webp.dpr1}, ${image.webp.dpr2} 2x`;
    }

    return image.webp;
  }

  return "";
};

export const getAvifSource = (image: Picture | string): string => {
  if (typeof image === "object") {
    if (typeof image.avif === "object") {
      return `${image.avif.dpr1}, ${image.avif.dpr2} 2x`;
    } else if (image.avif) {
      return image.avif;
    }
  }

  return "";
};

export const getOriginalSource = (image: Picture | string): string => {
  if (typeof image === "object") {
    if (typeof image.original === "object") {
      return image.original.dpr1;
    }

    return image.original;
  }

  return image;
};

export const getOriginalSourceSet = (image: Picture | string): string | undefined => {
  if (typeof image === "object" && typeof image.original === "object") {
    return `${image.original.dpr2} 2x`;
  }
};

export type ImageDPR = {
  dpr1: string;
  dpr2: string;
};

export type Picture = {
  original: ImageDPR | string;
  webp: ImageDPR | string;
  avif?: ImageDPR | string;
};

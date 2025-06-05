import { useGlobals } from "./../stores/globals";
export const getHashKeyByTitleAndIndex = (title: string, idx: number): number => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
    hash |= 0;
  }

  return hash + idx;
};

export const replaceWithCurrentTld = (url: string): string => {
  const lastDotIndex = url.lastIndexOf(".");
  if (lastDotIndex === -1) {
    console.warn("CUSTOM WARNING: if you are in localhost ignore this warning");
    return url;
  }
  const globals = useGlobals();

  const output = url.slice(0, lastDotIndex + 1) + globals.tld + "/";
  return output;
};

export const getFileExtension = (name: string): string => {
  const [extension] = name.split(".").reverse();
  return extension?.toLowerCase() || "";
};

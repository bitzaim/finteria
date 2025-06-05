export const debounce = (fn: (...args: any[]) => any, delay = 500) => {
  let timeout: NodeJS.Timeout;

  return (...args: any[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export function throttle(callback: (...args: any[]) => any, delay = 1000) {
  let shouldWait = false;

  return (...args: any[]) => {
    if (shouldWait) return;

    callback(...args);
    shouldWait = true;
    setTimeout(() => {
      shouldWait = false;
    }, delay);
  };
}

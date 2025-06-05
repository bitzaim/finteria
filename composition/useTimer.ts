export const useTimer = () => {
  const intervalId = ref<NodeJS.Timeout | string | number | undefined>(undefined);
  const resendIsDisabled = ref<boolean>(false);
  const second = ref<number>(0);

  const timerFunction = () => {
    if (second.value > 0) {
      return second.value--;
    }
    resendIsDisabled.value = false;
    clearInterval(intervalId.value);
    intervalId.value = undefined;
  };

  const resendTimer = (timer: number) => {
    if (intervalId.value) {
      clearInterval(intervalId.value);
      intervalId.value = undefined;
    }

    second.value = timer;
    resendIsDisabled.value = true;
    intervalId.value = setInterval(() => timerFunction(), 1000);
  };

  return { resendTimer, resendIsDisabled, second };
};

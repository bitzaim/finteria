import { ref } from "vue";
import standardizeDate, { correctUtcFormat } from "@/utils/standardizeDate";

export const useTimerUtil = () => {
  const timerCount = ref<number>(0);
  const timerInterval = ref<NodeJS.Timeout | string | number | undefined>(undefined);

  function getUtcDateNow(date_expire_at: string) {
    const formattedUtcDate = correctUtcFormat();
    const processed_expire_at = standardizeDate(date_expire_at);
    return {
      date_expire: new Date(processed_expire_at),
      date_now: new Date(formattedUtcDate),
    };
  }

  const timerStop = () => {
    clearInterval(timerInterval.value);
    timerCount.value = 0;
  };

  const timerInit = (seconds_counter: number, expire_at: string, fetchFunction: () => void) => {
    const { date_expire, date_now } = getUtcDateNow(expire_at);
    seconds_counter = (date_expire.getTime() - date_now.getTime()) / 1000;
    timerCount.value = seconds_counter;
    timerInterval.value = setInterval(() => {
      if (timerCount.value > 0) {
        timerCount.value = seconds_counter - 1;
        seconds_counter = seconds_counter - 1;
      } else {
        timerStop();
        fetchFunction();
      }
    }, 1000);
  };

  return {
    timerCount,
    timerInterval,
    getUtcDateNow,
    timerStop,
    timerInit,
  };
};

// simply adding 'T' between Date and Time parts
export default function standardizeDate(date: string): string {
  return date.replace(/ /g, "T");
}

interface UtcFormat {
  year: number | string;
  month: number | string;
  day: number | string;
  hour: number | string;
  min: number | string;
  sec: number | string;
}

export function correctUtcFormat(arg?: UtcFormat): string {
  if (!arg) {
    arg = {
      year: new Date().getUTCFullYear(),
      month: new Date().getUTCMonth() + 1,
      day: new Date().getUTCDate(),
      hour: new Date().getUTCHours(),
      min: new Date().getUTCMinutes(),
      sec: new Date().getUTCSeconds(),
    };
  }
  let { year, month, day, hour, min, sec } = arg;

  if (String(month).length === 1) {
    month = `0${month}`;
  }
  if (String(day).length === 1) {
    day = `0${day}`;
  }
  if (String(hour).length === 1) {
    hour = `0${hour}`;
  }
  if (String(min).length === 1) {
    min = `0${min}`;
  }
  if (String(sec).length === 1) {
    sec = `0${sec}`;
  }

  return `${year}-${month}-${day}T${hour}:${min}:${sec}`;
}

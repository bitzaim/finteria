export default function convertQueryParams(obj: { [key: string]: any }) {
  const str = [];
  for (const p in obj)
    if (obj.hasOwnProperty(p) && obj[p]) {
      str.push(p + "=" + encodeURIComponent(obj[p.replace(/ /g, "%20")]));
    }
  const a = str.join("&");

  return a;
}

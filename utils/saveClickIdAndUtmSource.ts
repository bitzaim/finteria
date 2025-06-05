import { onMounted } from "vue";
import { setCookie } from "./utilsCookies";

export function saveClickId() {
  onMounted(() => {
    const route = useRoute();
    const clickid = route.query.clickid;
    if (!clickid) {
      return;
    }

    setCookie("clickid", String(clickid), { "max-age": 2592000 });
  });
}

export function saveUtmSource() {
  onMounted(() => {
    const route = useRoute();
    if (route.query?.hasOwnProperty("utm_source")) {
      setCookie("utm_source", "True", { "max-age": 2592000 });
    }
  });
}

import { setCookie } from "./utilsCookies";

export default function savePromocode(): any {
  const route = useRoute();

  onMounted(() => {
    if (route.query?.promocode) {
      setCookie(
        "promocodeUntilRegistration",
        String(route.query.promocode),
        {
          "max-age": 2592000,
        }
      );
    }
  });
}

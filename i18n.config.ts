import en from "./locales/en.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import tr from "./locales/tr.json";
import pt from "./locales/pt_BR.json";
import it from "./locales/it.json";
import pl from "./locales/pl.json";
import zh from "./locales/zh_Hans.json";
import ja from "./locales/ja.json";
import ru from "./locales/ru.json";
import uk from "./locales/uk.json";

export default defineI18nConfig(() => ({
  fallbackLocale: "en",
  messages: { en, fr, es, it, pt, pl, tr, zh, ja, ru, uk },
}));

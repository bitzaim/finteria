import * as pkg from "~~/package.json";
import * as Sentry from "@sentry/vue";

export default defineNuxtPlugin((nuxtApp) => {
  const release = `finteria-landing-frontend@${pkg.version}`;
  const environment = nuxtApp.$config.public.SENTRY_ENV;
  const { vueApp } = nuxtApp;
  const router = useRouter()

  Sentry.init({
    enabled: environment != "local",
    app: vueApp,
    dsn: nuxtApp.$config.public.SENTRY_DSN,
    release,
    environment,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      }),
      new Sentry.Replay()
    ],
    sampleRate: 1,
    tracesSampleRate: 1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    attachStacktrace: true,
    maxBreadcrumbs: 25,
  });
});

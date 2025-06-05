import { useUserStore } from "@/stores/userStore";
import { onUnmounted } from "vue";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { CookieMetaKeys, cookieMeta } from "@/utils/constants";
import services from "@/services/auth";

declare global {
  interface Window {
    Pusher: any;
    Echo: any;
  }
}

type EventsFromServer =
  | ".UserUpdated"
  | ".WalletUpdated"
  | ".TraderAccountUpdated"
  | ".TraderInvoiceUpdated"
  | ".TraderAccountCreated";

interface Listeners {
  name: EventsFromServer;
  callback: (arg: any) => any;
}

export const useWebsockets = (listeners: [Listeners]) => {
  const config = useRuntimeConfig();
  const sentryEnv = config.public.SENTRY_ENV as CookieMetaKeys;
  const tokenName = cookieMeta[sentryEnv].name;
  const BearerToken = useCookie(tokenName).value;
  const userStore = useUserStore();
  onMounted(() => {
    if (!BearerToken || !userStore.isAuth) {
      return;
    }

    if (!userStore.isConnected) {
      window.Pusher = Pusher;

      window.Echo = new Echo({
        broadcaster: "pusher",
        cluster: config.public.LARAVEL_ECHO_CLUSTER,
        wsHost: config.public.LARAVEL_ECHO_HOST,
        encrypted: true,
        key: config.public.LARAVEL_ECHO_KEY,
        disableStats: true,
        authorizer: (channel, options) => {
          return {
            authorize: async (socketId, callback) => {
              services
                .broadcastAuth(socketId, channel)
                .then((response) => {
                  callback(false, response);
                })
                .catch((error) => {
                  callback(true, error);
                });
            },
          };
        },
      });

      window.Echo.private(`User.${userStore.user.id}`);
      userStore.SET_CONNECTED(true);
    }
    const privateEcho = Object.values(window.Echo.connector.channels)[0];

    if (!privateEcho) {
      throw new Error("can't find the channel");
    }
    listeners.forEach((listener) => {
      privateEcho.listen(listener.name, listener.callback);
    });

    // privateEcho.listen(".TraderAccountCreated", (e) => {
    //   // console.log("TraderAccountCreated", JSON.parse(JSON.stringify(e.model)));
    // });
  });
  onUnmounted(() => {
    if (!BearerToken || !userStore.isAuth) {
      return;
    }

    const privateEcho = Object.values(window.Echo.connector.channels)[0];
    listeners.forEach((listener) => {
      privateEcho.stopListening(listener.name);
    });
  });

  return function disconnect() {
    window.Echo?.disconnect();
    userStore.SET_CONNECTED(false);
  };
};

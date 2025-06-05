import axios from "axios";
import { cookieMeta, CookieMetaKeys } from "@/utils/constants";

export const api = () => {
  const { $config } = useNuxtApp();
  const axiosInstance = axios.create({
    baseURL: $config.public.API_BASE_URL,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status === 503) {
        console.log("if works");
        showError({ fatal: true, statusCode: 503, statusMessage: "Maintenance Works" });
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const accountApi = async (path: string, options?: any) => {
  const { $config } = useNuxtApp();
  const sentryEnv = $config.public.SENTRY_ENV as CookieMetaKeys;
  const tokenName = cookieMeta[sentryEnv].name;
  const BearerToken = useCookie(tokenName).value;
  const request = $fetch(`${$config.public.API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${BearerToken}`,
      ...options.headers,
    },
  });
  request.catch((error) => {
    if (error?.response?.status === 503) {
      showError({ fatal: true, statusCode: 503, statusMessage: "Maintenance Works" });
    }
  });
  const response = await request;
  return response;
};

export const mediaApi = () => {
  const { $config } = useNuxtApp();
  const axiosInstance = axios.create({
    baseURL: $config.public.API_MEDIA_URL,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status === 503) {
        console.log("if works");
        showError({ fatal: true, statusCode: 503, statusMessage: "Maintenance Works" });
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const optionsApi = () => {
  const { $config } = useNuxtApp();
  const axiosInstance = axios.create({
    baseURL: $config.public.API_OPTIONS_URL,
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status === 503) {
        console.log("if works");
        showError({ fatal: true, statusCode: 503, statusMessage: "Maintenance Works" });
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const getServerRequest = async (path: string, options?: any) => {
  const { $config } = useNuxtApp();
  const sentryEnv = $config.public.SENTRY_ENV as CookieMetaKeys;
  const tokenName = cookieMeta[sentryEnv].name;
  const BearerToken = useCookie(tokenName).value;
  return await useFetch(() => `${$config.public.API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${BearerToken}`,
      ...(options && options.headers),
    },
  });
};

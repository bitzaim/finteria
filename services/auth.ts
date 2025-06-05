import { api, accountApi } from "./axios";

const middlewareLoginUser = (): Promise<any> =>
  // @ts-ignore
  accountApi("/profile", { method: "GET" }).then((response) => response.data);

const logoutUser = () => {
  accountApi("/auth/logout", { method: "POST" });
};

const postUserLoginData = (userData) =>
  api()
    .post("/auth/login", userData)
    .then((response) => response.data);

const postRegisterUser = (registerData) =>
  api()
    .post("/auth/register", registerData)
    .then((response) => response.data);

const resetPassword = (resetEmail) => accountApi("/auth/password-reset", { method: "POST", body: resetEmail });

const resetPasswordNewData = (newPasswordData) =>
  accountApi("/auth/password-reset", {
    method: "PATCH",
    body: newPasswordData,
  });

const broadcastAuth = (socketId, channel) =>
  accountApi("/broadcasting/auth", {
    method: "POST",
    body: {
      socket_id: socketId,
      channel_name: channel.name,
    },
  });
export default {
  middlewareLoginUser,
  logoutUser,
  postUserLoginData,
  postRegisterUser,
  resetPassword,
  resetPasswordNewData,
  broadcastAuth,
};

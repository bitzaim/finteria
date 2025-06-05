import { accountApi, getServerRequest } from "./axios";

const getAgreementDocument = () =>
  accountApi("/agreement", {
    method: "GET",
  });

const sendUserSignature = (image) =>
  accountApi("/agreement", {
    method: "POST",
    body: image,
    headers: { Accept: "application/json" },
  });

const updatePersonalData = (personalData) =>
  accountApi("/agreement/personal-data", {
    method: "POST",
    body: personalData,
  }).then((response) => response.data);

const verificationUser = (verifyData) =>
  accountApi("/kyc/verification", {
    method: "POST",
    body: verifyData,
    headers: { Accept: "application/json" },
  });

const getVerificationRequestServer = (): Promise<any> =>
  getServerRequest("/kyc/verification", { method: "GET", key: "getKycData" });

const getVerificationRequest = () =>
  accountApi("/kyc/verification", {
    method: "GET",
  });

export default {
  getAgreementDocument,
  sendUserSignature,
  updatePersonalData,
  verificationUser,
  getVerificationRequest,
  getVerificationRequestServer,
};

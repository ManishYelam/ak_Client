import axiosInstance from "./axiosInstance";

export const createPaymentOrder = (data) => axiosInstance.post("/payment/create-order", data);

export const verifyPayment = (data) => axiosInstance.post("/payment/verify-payment", data);

import axiosInstance from "./axiosInstance";

export const loginService = (data) => axiosInstance.post(`/login`, data);

export const signupService = (data) => axiosInstance.post(`/users`, data);

export const verifyEmailService = (userId, otp) => axiosInstance.post(`/users/verify?userId=${userId}&otp=${otp}`);

export const resendVerification = (userId) => axiosInstance.post(`/users/resend-verification?userId=${userId}`);

export const forgetPasswordService = (email) => axiosInstance.post(`/forget-password/${email}`);

export const oldChangePasswordService = (data) => axiosInstance.post(`/change-password`, data);

export const changePasswordWithOtp = (data) => axiosInstance.post(`/change-password-otp`, data);

export const otpChangePasswordService = (email,data) => axiosInstance.post(`/reset-password/${email}`,data);

export const logoutService = () => axiosInstance.post(`/logout`);

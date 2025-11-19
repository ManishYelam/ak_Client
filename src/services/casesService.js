import axiosInstance from "./axiosInstance";

export const getAllCases = (data) => axiosInstance.post(`/case/`, data);

export const getCaseById = (id) => axiosInstance.get(`/case/${id}`);

export const getDocumentByCaseId = (url) => {
  const normalizedPath = url.replace(/\\/g, '/');
  return axiosInstance.get(`/${normalizedPath}`, { responseType: 'blob' });
};

export const createCase = (data) => axiosInstance.post("/cases", data);

export const updateCase = (id, data) => axiosInstance.put(`/cases/${id}`, data);

export const deleteCase = (id) => axiosInstance.delete(`/case/${id}`);

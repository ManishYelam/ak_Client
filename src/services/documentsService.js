import axiosInstance from "./axiosInstance";

export const getAllDocuments = () => axiosInstance.get("/documents");

export const uploadDocument = (formData) => axiosInstance.post("/documents", formData, { headers: { "Content-Type": "multipart/form-data" }, });

export const deleteDocument = (id) => axiosInstance.delete(`/documents/${id}`);

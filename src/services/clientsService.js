import axiosInstance from "./axiosInstance";

export const getAllClients = () => axiosInstance.get("/clients");

export const getClientById = (id) => axiosInstance.get(`/clients/${id}`);

export const createClient = (data) => axiosInstance.post("/clients", data);

export const updateClient = (id, data) => axiosInstance.put(`/clients/${id}`, data);

export const deleteClient = (id) => axiosInstance.delete(`/clients/${id}`);

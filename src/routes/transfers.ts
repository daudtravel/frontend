import { TransferFormData } from "../app/[locale]/admin/_components/transfers/createTransfer/CreateTransferValidator";
import { axiosInstance } from "../utlis/axiosInstance";

export const transfersAPI = {
  get: async () => {
    const response = await axiosInstance.get(`/transfers`);
    return response.data;
  },
  getById: async (id: string,) => {
    const response = await axiosInstance.get(`/transfers/${id}`);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/transfers/${id}`);
    return response.data;
  },
  post: async (data: TransferFormData) => {
    const response = await axiosInstance.post(`/create_transfers`, data);
    return response.data;
  },
  put: async (id: string, data: TransferFormData) => {
    const response = await axiosInstance.put(`/update_transfers/${id}`, data);
    return response.data;
  }
};

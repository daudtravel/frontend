 
import { CreateTransferFormData } from "../app/[locale]/admin/_components/transfers/createTransfer/CreateTransferValidator";
import { TransferFormData } from "../app/[locale]/admin/_components/transfers/editTransfer/EditTransferValidator";
import { axiosInstance } from "../utlis/axiosInstance";

export const transfersAPI = {
  get: async (locale: string) => {
    const response = await axiosInstance.get(`/transfers`, {
      params: { locale }
    });
    return response.data;
  },
  getById: async (id: string, locale: string) => {
    const response = await axiosInstance.get(`/transfers/${id}`,  {
      params: { locale }
    });
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/delete_transfer/${id}`);
    return response.data;
  },
  post: async (data: CreateTransferFormData) => {
    const response = await axiosInstance.post(`/create_transfers`, data);
    return response.data;
  },
  put: async (id: string, data: TransferFormData) => {
    const response = await axiosInstance.put(`/update_transfers/${id}`, data);
    return response.data;
  }
};

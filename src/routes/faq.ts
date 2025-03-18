 

import { editFAQ, FAQ } from "../types/faq";
import { axiosInstance } from "../utlis/axiosInstance";

export const faqApi = {
  get: async (locale: string) => {
    const response = await axiosInstance.get(`/faq`, {
      params: { locale }
    });
    return response.data;
  },
  getById: async (id: string, locale: string) => {
    const response = await axiosInstance.get(`/faq/${id}`, {
      params: { locale }
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/delete_faq/${id}`);
    return response.data;
  },
  post: async (data: FAQ) => {
    const response = await axiosInstance.post(`/create_faq`, data);
    return response.data;
  },
  put: async (id: string, data: editFAQ) => {
    const response = await axiosInstance.put(`/update_faq/${id}`, data);
    return response.data;
  }
};

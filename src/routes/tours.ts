import { axiosInstance } from "../utlis/axiosInstance";

export const toursAPI = {
    get: async (locale: string) => {
        const response = await axiosInstance.get(`/toursAll`, {
            params: { locale }
          });
          
      return response.data;
    },
    getById: async (id: string, locale: string) => {
      const response = await axiosInstance.get(`/tours/${id}`, {
        params: { locale }
      });
      return response.data;
    },
    delete: async (id: string) => {
        const response = await axiosInstance.delete(`/tours/${id}`);
        return response.data;
      },
  };



 
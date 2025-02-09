import { axiosInstance } from "../utlis/axiosInstance";

export const toursAPI = {
    post: async (submitData: object) => {
      const response = await axiosInstance.post(`/create_tour`, submitData);
      return response.data;
    },
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
    getByIdAllLocales: async (id: string) => {
      const response = await axiosInstance.get(`/tours/${id}`
    );
      return response.data;
    },
    put: async (id: string, submitData: object) => {
      const response = await axiosInstance.put(`/tours/${id}`, submitData);
      return response.data;
    },
    delete: async (id: string) => {
        const response = await axiosInstance.delete(`/tours/${id}`);
        return response.data;
      },
  };



 
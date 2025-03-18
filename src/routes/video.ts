 

 
import { Video } from "../types/video";
import { axiosInstance } from "../utlis/axiosInstance";

export const videoApi = {
  get: async () => {
    const response = await axiosInstance.get(`/video`);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/delete_video/${id}`);
    return response.data;
  },
  post: async (data: Video) => {
    const response = await axiosInstance.post(`/create_video`, data);
    return response.data;
  },
  
};

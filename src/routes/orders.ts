import { axiosInstance } from "../utlis/axiosInstance";

export const ordersAPI = {
  get: async () => {
    const response = await axiosInstance.get("/orders");
    return response.data;
  },

  deleteFailedOrders: async () => {
    const response = await axiosInstance.delete("/orders/failed");
    return response.data;
  },
};

import { axiosInstance } from "../utlis/axiosInstance";

export const ordersAPI = {
  get: async (page: number = 1, limit: number = 6) => {
    const response = await axiosInstance.get("/orders", {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  },

  deleteFailedOrders: async () => {
    const response = await axiosInstance.delete("/orders/failed");
    return response.data;
  },
};

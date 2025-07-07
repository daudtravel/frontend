// src/api/ordersAPI.ts

import { axiosInstance } from "../utlis/axiosInstance";

export const ordersAPI = {
  get: async () => {
    const response = await axiosInstance.get("/orders");
    return response.data;
  },
};

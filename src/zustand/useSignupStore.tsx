import { create } from "zustand";

type useSignupStore = {
  userInfo: {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  setUserInfo: (userInfo: Partial<useSignupStore["userInfo"]>) => void;
};

export const useSignupStore = create<useSignupStore>((set) => ({
  userInfo: {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  setUserInfo: (userInfo) =>
    set((state) => ({
      userInfo: { ...state.userInfo, ...userInfo },
    })),
}));

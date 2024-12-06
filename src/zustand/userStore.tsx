import { create } from "zustand";

type UserStore = {
  userInfo: {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  setUserInfo: (userInfo: Partial<UserStore["userInfo"]>) => void;
};

export const userStore = create<UserStore>((set) => ({
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

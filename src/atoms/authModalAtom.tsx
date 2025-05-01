import { atom } from "recoil";

type AuthModalState = {
  isOpen: boolean;
  type: "login" | "register" | "forgotPassword";
  redirectPath: string | null,
};

const initialAuthModalState :AuthModalState = {
  isOpen: false,
  type: "login",
  redirectPath: null,
};

export const authModalState = atom<AuthModalState>({
  key: "authModalState",
  default: initialAuthModalState,
});


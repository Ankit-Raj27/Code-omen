import React, { useCallback, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import Login from "./Login";
import Signup from "./Signup";
import ResetPassword from "./ResetPassword";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";

type AuthModalsProps = {};

const AuthModals: React.FC<AuthModalsProps> = () => {
  const authModal = useRecoilValue(authModalState);
  const closeModal = useCloseModal();

  useEffect(() => {
    // Prevent background scrolling when modal is open
    if (authModal.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [authModal.isOpen]);

  if (!authModal.isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-40"
        onClick={closeModal}
      ></div>

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full sm:w-[450px] flex justify-center items-center"
      >
        <div className="relative w-full mx-6">
          <div className="bg-white rounded-lg shadow bg-gradient-to-b from-gray-600 to-black">
            <div className="flex justify-end p-2">
              <button
                type="button"
                className="bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800 hover:text-white text-white"
                onClick={closeModal}
              >
                <IoCloseSharp className="h-5 w-5" />
              </button>
            </div>
            {authModal.type === "login" ? (
              <Login />
            ) : authModal.type === "register" ? (
              <Signup />
            ) : (
              <ResetPassword />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModals;

// Hook to handle modal close logic
function useCloseModal() {
  const setAuthModal = useSetRecoilState(authModalState);
  const closeModal = useCallback(() => {
    setAuthModal((prev) => ({ ...prev, isOpen: false, type: "login" }));
  }, [setAuthModal]);

  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    },
    [closeModal]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleEsc]);

  return closeModal;
}

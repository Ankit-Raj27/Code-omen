import React from "react";
import Link from "next/link";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { EmptyState, btnPrimary } from "./ui";

/** Shown in place of signed-in-only content. */
const RequireSignIn: React.FC<{ what: string }> = ({ what }) => {
  const setAuthModal = useSetRecoilState(authModalState);
  return (
    <EmptyState
      action={
        <Link href="/auth" className={btnPrimary}
          onClick={() => setAuthModal((s) => ({ ...s, isOpen: true, type: "login" }))}>
          Sign in
        </Link>
      }>
      Sign in to {what}.
    </EmptyState>
  );
};

export default RequireSignIn;

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/Firebase/firebase";
import PublicHome from "@/components/home/PublicHome";
import PageLoader from "@/components/layout/PageLoader";

/** Sign-in entry point: signed-in users go to Today. */
const AuthPage: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  if (loading || user) return <PageLoader />;
  if (error) return <div>Error: {error.message}</div>;
  return <PublicHome />;
};

export default AuthPage;

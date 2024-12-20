import { useEffect } from "react";
import { useAuth } from "./authProvider";
import { useRouter } from "next/navigation";

export const withAuth = (Component: React.ComponentType) => {
  return function ProtectedRoute() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push("/?signin");
      }
    }, [isLoading, isAuthenticated, router]);

    // If loading or not authenticated, do not render the component
    if (isLoading || !isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 ">
            Loading...
          </div>
        </div>
      );
    }

    // If authenticated, render the component
    return <Component />;
  };
};

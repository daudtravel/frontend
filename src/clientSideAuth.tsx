"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

const checkClientAuth = (WrappedComponent: React.ComponentType<any>) => {
  const ComponentWithAuth = (props: any) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isValidating, setIsValidating] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      async function checkAuth() {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/auth/status`,
            {
              withCredentials: true,
            }
          );
          setIsAuthenticated(response.data.isAuthenticated);
        } catch (error) {
          console.error("Authentication check failed:", error);
          setIsAuthenticated(false);
        } finally {
          setIsValidating(false);
        }
      }

      checkAuth();
    }, []);

    useEffect(() => {
      const protectedPaths = ["/profile", "/test"];

      const matchesProtectedPath = protectedPaths.some((path) =>
        pathname.includes(path)
      );

      if (!isValidating) {
        if (matchesProtectedPath && !isAuthenticated) {
          router.replace("/");
        }
      }
    }, [isAuthenticated, pathname, router, isValidating]);

    if (isValidating) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuth;
};

export default checkClientAuth;

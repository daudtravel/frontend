"use client";

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
            "http://localhost:3000/api/auth/status",
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
      const protectedPaths = ["/profile"];

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

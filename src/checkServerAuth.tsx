import axios from "axios";
import { cookies } from "next/headers";

export async function checkServerAuth() {
  try {
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get("connect.sid")?.value;

    if (!sessionToken) {
      return { isAuthenticated: false };
    }

    const apiClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      withCredentials: true,
    });

    let response;

    try {
      response = await apiClient.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/status`,
        {
          headers: {
            Cookie: `connect.sid=${sessionToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error fetching auth status:", error);
      return { isAuthenticated: false };
    }
    if (!response.data) {
      return { isAuthenticated: false };
    }

    return {
      isAuthenticated: response.data.isAuthenticated,
      user: response.data.user,
    };
  } catch (error) {
    console.error("Server-side authentication check failed:", error);
    return { isAuthenticated: false };
  }
}

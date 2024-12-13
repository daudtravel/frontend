import { checkServerAuth } from "@/src/checkServerAuth";
import { redirect } from "next/navigation"; // Use next/navigation for redirects

export default async function Page() {
  const { isAuthenticated, user } = await checkServerAuth();
  if (!isAuthenticated) {
    redirect("/");
  }

  return (
    <div>
      <h1>Welcome to the Page</h1>
      <p>Hello, {user.email}</p>
    </div>
  );
}

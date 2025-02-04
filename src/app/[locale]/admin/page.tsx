"use client";

import { withAuth } from "@/src/auth/isAuth";
import ClientWrapper from "./_components/ClientWrapper";

function page() {
  return <ClientWrapper />;
}

export default withAuth(page);

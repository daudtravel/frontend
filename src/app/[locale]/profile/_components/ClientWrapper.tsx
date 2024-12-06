"use client";

import withAuth from "@/src/clientSideAuth";

function ClientWrapper() {
  return <div>page</div>;
}

export default withAuth(ClientWrapper);

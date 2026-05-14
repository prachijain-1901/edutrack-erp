"use client";

import { useEffect } from "react";
import { socketClient } from "@/lib/socket-client";
import { useAuthStore } from "@/store/auth.store";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (token) {
      socketClient.connect(token);
    } else {
      socketClient.disconnect();
    }

    return () => {
      socketClient.disconnect();
    };
  }, [token]);

  return <>{children}</>;
}

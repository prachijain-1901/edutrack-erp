import { io, Socket } from "socket.io-client";
import { useSocketStore } from "@/store/socket.store";
import { toast } from "sonner";

class SocketClient {
  private socket: Socket | null = null;
  private url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(this.url, {
      auth: { token },
      transports: ["websocket"], // Force websocket for performance
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
    });

    this.socket.on("connect", () => {
      console.log("Socket connected");
      useSocketStore.getState().setConnected(true);
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
      useSocketStore.getState().setConnected(false);
    });

    this.socket.on("dashboard_update", (data) => {
      console.log("Dashboard update:", data);
      useSocketStore.getState().setLastEvent(data);
      // Custom event for global consumption
      window.dispatchEvent(new CustomEvent("erp:dashboard_update", { detail: data }));
    });

    this.socket.on("new_notification", (data) => {
      toast(data.title, {
        description: data.message,
        action: {
          label: "View",
          onClick: () => (window.location.href = "/dashboard/notifications"),
        },
      });
      window.dispatchEvent(new CustomEvent("erp:new_notification", { detail: data }));
    });

    this.socket.on("payment_received", (data) => {
      toast.success("Payment Received!", {
        description: `₹${data.amount} received for receipt ${data.receiptNumber}`,
      });
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  getSocket() {
    return this.socket;
  }
}

export const socketClient = new SocketClient();

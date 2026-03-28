import { useAuthStore } from "@/entities/auth";

function useAuthResolver() {
  return { status: useAuthStore.use.status() };
}

export { useAuthResolver };

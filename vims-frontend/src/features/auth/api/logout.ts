import { http } from "@/shared/api/http";

export const logout = async (): Promise<void> => {
  await http.post("/auth/logout");
};
import { http } from "@/shared/api/http";
import type { MeResponse } from "../types/Auth.types";

export const getMe = async (): Promise<MeResponse> => {
  const { data } = await http.get<MeResponse>("/auth/me");
  return data;
};
import { http } from "@/shared/api/http";
import type { POFilter, POListResponse } from "../types/po.types";

export const getPOOnProcess = async (
  filter: Omit<POFilter, "tab">
): Promise<POListResponse> => {
  const { data } = await http.post<POListResponse>("/purchase-orders/list", {
    ...filter,
    tab: "on_process",
  });
  return data;
};
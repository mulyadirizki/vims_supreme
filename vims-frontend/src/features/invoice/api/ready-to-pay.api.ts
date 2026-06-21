import { http } from "@/shared/api/http";
import type { ReadyToPayFilter, ReadyToPayListResponse } from "../types/invoice.types";

export const getReadyToPayList = async (
  filter: ReadyToPayFilter
): Promise<ReadyToPayListResponse> => {
  const { data } = await http.post<ReadyToPayListResponse>("/invoices/ready-to-pay/list", filter);
  return data;
};
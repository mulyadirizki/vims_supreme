import { http } from "@/shared/api/http";
import type { PODetail } from "../types/po.types";

interface PODetailResponse {
  data: PODetail;
}

export const getPODetail = async (poNo: string): Promise<PODetail> => {
  const { data } = await http.get<PODetailResponse>(`/purchase-orders/detail/${poNo}`);
  return data.data;
};
import { useQuery } from "@tanstack/react-query";
import { getPODetail } from "../api/po-detail";

export const usePODetail = (poNo: string | undefined) => {
  return useQuery({
    queryKey: ["purchase-order", "detail", poNo],
    queryFn: () => getPODetail(poNo as string),
    enabled: !!poNo,
  });
};
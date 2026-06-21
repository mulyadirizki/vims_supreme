import { useQuery } from "@tanstack/react-query";
import { getGoodsReceiveOverview } from "../api/invoice-receipt.api";

export const useGoodsReceiveOverview = (grNo: string) => {
  return useQuery({
    queryKey: ["goods-receive-overview", grNo],
    queryFn: () => getGoodsReceiveOverview(grNo),
    enabled: !!grNo,
  });
};
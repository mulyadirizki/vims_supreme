import { useQuery } from "@tanstack/react-query";
import { getReadyToPayList } from "../api/ready-to-pay.api";
import type { ReadyToPayFilter } from "../types/invoice.types";

export const useReadyToPayList = (filter: ReadyToPayFilter) => {
  return useQuery({
    queryKey: ["ready-to-pay", filter],
    queryFn: () => getReadyToPayList(filter),
  });
};
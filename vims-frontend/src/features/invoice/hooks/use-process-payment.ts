import { useMutation, useQueryClient } from "@tanstack/react-query";
import { processPayment } from "../api/ready-to-pay.api";
import type { ProcessPaymentPayload } from "../types/invoice.types";

export const useProcessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProcessPaymentPayload) => processPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ready-to-pay"] });
    },
  });
};
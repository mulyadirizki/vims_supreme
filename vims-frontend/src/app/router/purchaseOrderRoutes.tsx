import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const POOnProcess = lazy(() => import("@/features/purchase-order/pages/POOnProcessPage"));
const HistoryPO   = lazy(() => import("@/features/purchase-order/pages/HistoryPOPage"));
const PODetail    = lazy(() => import("@/features/purchase-order/pages/PODetailPage"));

export const purchaseOrderRoutes: RouteObject[] = [
  {
    path: "400401",
    element: <POOnProcess />,
  },
  {
    path: "401302",
    element: <HistoryPO />,
  },
  {
    path: "400401/:poNo",
    element: <PODetail />,
  },
];
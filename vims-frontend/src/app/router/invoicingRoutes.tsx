import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const ReadyToinvoice = lazy(() => import("@/features/invoice/pages/ReadyToInvoicePage"));
const InvoiceUploadPage = lazy(() => import("@/features/invoice/pages/InvoiceUploadPage"));
const InvoiceOnProcessPage = lazy(() => import("@/features/invoice/pages/InvoiceOnProcessPage"));
const InvoiceOnProcessDetailPage = lazy(() => import("@/features/invoice/pages/InvoiceOnProcessDetailPage"));
const ReadyToPayPage = lazy(() => import("@/features/invoice/pages/ReadyToPayPage"));
const InvoiceHistoryPage = lazy(() => import("@/features/invoice/pages/InvoiceHistoryPage"));

export const invoicingRoutes: RouteObject[] = [
  {
    path: "400407",
    element: <ReadyToinvoice />,
  },
  {
    path: "invoice/proses/:grNo",
    element: <InvoiceUploadPage />,
  },
  {
    path: "400408",
    element: <InvoiceOnProcessPage />
  },
  {
    path: "invoice/on-process/:invoiceReceiptNo",
    element: <InvoiceOnProcessDetailPage />,
  },
  {
    path: "400409",
    element: <ReadyToPayPage />,
  },
  {
    path: "400410",
    element: <InvoiceHistoryPage />,
  },
];
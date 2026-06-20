import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom";
import { Suspense } from 'react';

import { GuestGuard }  from "@/shared/components/guards/GuestGuard";
import { AuthGuard }   from "@/shared/components/guards/AuthGuard";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

import Page404      from "@/features/pages/Page404";
import LoginPage    from "@/features/auth/pages/LoginPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";

// ── Module routes ─────────────────────────────────────────────────────────────
// import { systemAdminRoutes }   from "./systemAdminRoutes";
import { purchaseOrderRoutes } from "./purchaseOrderRoutes";
// import { invoicingRoutes }     from "./invoicingRoutes";
// import { goodsReturnRoutes }   from "./goodsReturnRoutes";
// import { rebateRoutes }        from "./rebateRoutes";
// import { paymentRoutes }       from "./paymentRoutes";
// import { monitoringRoutes }    from "./monitoringRoutes";
// import { reportRoutes }        from "./reportRoutes";

// Loading fallback for lazy-loaded pages
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[300px]">
      <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // ── Guest only — sudah login tidak bisa masuk ────────────────────────────
  {
    element: <GuestGuard />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },

  // ── Protected — belum login tidak bisa masuk ─────────────────────────────
  {
    element: <AuthGuard />,
    children: [
      {
        path: "/portal",
        element: <MainLayout />,
        children: [
          // Default redirect ke dashboard
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },

          // ── Semua modul dari sidebar (lazy-loaded) ───────────────────────
          ...wrapSuspense([
            // ...systemAdminRoutes,
            ...purchaseOrderRoutes,
            // ...invoicingRoutes,
            // ...goodsReturnRoutes,
            // ...rebateRoutes,
            // ...paymentRoutes,
            // ...monitoringRoutes,
            // ...reportRoutes,
          ]),
        ],
      },
    ],
  },

  // ── 404 — harus paling bawah ─────────────────────────────────────────────
  {
    path: "*",
    element: <Page404 />,
  },
]);

/**
 * Membungkus array route dengan <Suspense> agar lazy import tidak crash.
 * Setiap route.element dibungkus satu per satu supaya fallback per-halaman.
 */
function wrapSuspense(routes: RouteObject[]) {
  return routes.map((route) => ({
    ...route,
    element: (
      <Suspense fallback={<PageLoader />}>
        {route.element}
      </Suspense>
    ),
  }));
}
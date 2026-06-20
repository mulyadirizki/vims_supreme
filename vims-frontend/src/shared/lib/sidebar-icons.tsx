import {
  Settings,
  ShoppingCart,
  FileText,
  RotateCcw,
  CreditCard,
  Wallet,
  BarChart2,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

// Map berdasarkan id group menu dari backend
const GROUP_ICONS: Record<string, LucideIcon> = {
  "1":  Settings,      // SYSTEM ADMINISTRATOR
  "13": ShoppingCart,  // PURCHASE ORDER
  "4":  FileText,      // INVOICING PROCESS
  "5":  RotateCcw,     // GOODS RETURN
  "6":  CreditCard,    // REBATE / DEBIT NOTE
  "7":  Wallet,        // PAYMENT
  "8":  BarChart2,     // MONITORING & TRACKING
  "9":  BarChart2,     // REPORT
};

export function getMenuIcon(id: string): LucideIcon {
  return GROUP_ICONS[id] ?? LayoutDashboard;
}
import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  LogOut,
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import logo from "@/assets/icons/logo-supreme-small.png";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { getMenuIcon } from "@/shared/lib/sidebar-icons";
import type { SidebarMenu } from "@/features/auth/types/Auth.types";

function getInitials(name: string | null | undefined) {
  if (!name) return "U";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function toPath(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/* ── Single expandable menu group ── */
function NavGroup({
  menu,
  collapsed,
}: {
  menu: SidebarMenu;
  collapsed: boolean;
}) {
  const { pathname } = useLocation();
  const Icon = getMenuIcon(menu.id);
  const isGroupActive = menu.submenus.some(
    (s) => pathname === `/portal/${s.id}`
  );
  const [open, setOpen] = useState(isGroupActive);

  // tambahkan useEffect di bawahnya
  useEffect(() => {
    if (!isGroupActive) setOpen(false);
  }, [isGroupActive]);

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={`flex items-center justify-center w-full p-2 rounded-lg transition-colors ${
              isGroupActive
                ? "bg-blue-600 text-white"
                : "text-white/50 hover:text-white hover:bg-white/[0.07]"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          <p className="font-semibold mb-1">{menu.name}</p>
          {menu.submenus.map((s) => (
            <p key={s.id}>{s.name}</p>
          ))}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2.5 w-full px-2.5 py-[7px] rounded-lg text-[10px] font-medium transition-colors ${
          isGroupActive
            ? "text-white"
            : "text-white/50 hover:text-white hover:bg-white/[0.07]"
        }`}
      >
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span className="flex-1 text-left">{menu.name}</span>
        {open
          ? <ChevronDown className="w-3 h-3 shrink-0" />
          : <ChevronRight className="w-3 h-3 shrink-0" />
        }
      </button>

      {open && (
        <div className="ml-6 mt-0.5 space-y-0.5 border-l border-white/[0.08] pl-3">
          {menu.submenus.map((sub) => (
            <NavLink
              key={sub.id}
              to={`/portal/${sub.id}`}
              className={({ isActive }) =>
                `block px-2 py-[6px] rounded-lg text-[12px] transition-colors ${
                  isActive
                    ? "text-blue-400 font-medium"
                    : "text-white/40 hover:text-white"
                }`
              }
            >
              {sub.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Sidebar content ── */
function SidebarContent({
  collapsed = false,
  onSignOut,
  isPending,
}: {
  collapsed?: boolean;
  onSignOut: () => void;
  isPending: boolean;
}) {
  const { sidebar } = useAuthStore();

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-col h-full" style={{ background: "#0d1f3c" }}>

        <div
          className={`flex items-center border-b border-white/[0.06] shrink-0 transition-all duration-200 ${
            collapsed ? "justify-center px-3 py-[13px]" : "px-4 py-[13px]"
          }`}
        >
          <img src={logo} alt="Supreme Energy" className="w-auto object-contain shrink-0" />
        </div>

        {!collapsed && (
          <div className="px-4 py-2.5 border-b border-white/[0.06]">
            <p className="text-blue-400 text-[8px] font-semibold tracking-[0.18em] uppercase leading-relaxed">
              Vendor Invoice Management System
            </p>
          </div>
        )}

        <ScrollArea className="flex-1 min-h-0 px-1 py-3">
          <div className="space-y-0.5">
            {sidebar.map((menu) => (
              <NavGroup key={menu.id} menu={menu} collapsed={collapsed} />
            ))}
          </div>
        </ScrollArea>

        <div className="shrink-0 p-2 border-t border-white/[0.06]">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onSignOut}
                  disabled={isPending}
                  className="flex items-center justify-center w-full p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.07] transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">Sign out</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={onSignOut}
              disabled={isPending}
              className="flex items-center gap-2.5 w-full px-2.5 py-[7px] rounded-lg text-[12px] font-medium text-white/40 hover:text-white hover:bg-white/[0.07] transition-colors disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              {isPending ? "Signing out..." : "Sign out"}
            </button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

/* ── Page title from current path ── */
function PageTitle() {
  const { pathname } = useLocation();
  const { sidebar } = useAuthStore();
  const allSubmenus = sidebar.flatMap((m) => m.submenus);
  const id = pathname.split("/portal/")[1];
  const match = allSubmenus.find((s) => s.id === id);
  return (
    <span className="text-gray-800 text-[13px] font-semibold">
      {match?.name ?? "Dashboard"}
    </span>
  );
}

/* ── Main layout ── */
export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user } = useAuthStore();
  const { mutate: signOut, isPending } = useLogout();

  const initials = getInitials(user?.fullname ?? user?.username);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      <aside
        className={`hidden md:flex flex-col shrink-0 h-screen overflow-hidden transition-all duration-200 ${
          collapsed ? "w-[52px]" : "w-56"
        }`}
        style={{ background: "#0d1f3c" }}
      >
        <SidebarContent
          collapsed={collapsed}
          onSignOut={() => signOut()}
          isPending={isPending}
        />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-56 border-0" style={{ background: "#0d1f3c" }}>
          <SidebarContent
            collapsed={false}
            onSignOut={() => signOut()}
            isPending={isPending}
          />
        </SheetContent>
      </Sheet>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        <header className="flex items-center justify-between h-12 px-3 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-7 w-7 text-gray-400 hover:text-gray-600"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex h-7 w-7 text-gray-400 hover:text-gray-600"
              onClick={() => setCollapsed((v) => !v)}
            >
              {collapsed
                ? <PanelLeftOpen className="w-4 h-4" />
                : <PanelLeftClose className="w-4 h-4" />
              }
            </Button>

            <div className="h-4 w-px bg-gray-200 mx-0.5" />
            <PageTitle />
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="relative h-8 w-8 text-gray-400 hover:text-gray-600">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-8 px-2 hover:bg-gray-50">
                  <div className="w-6 h-6 rounded-full bg-[#0d1f3c] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {initials}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-gray-800 text-[11px] font-semibold leading-none">
                      {user?.fullname ?? user?.username ?? "-"}
                    </p>
                    <p className="text-gray-400 text-[10px] leading-none mt-0.5">
                      {user?.user_type ?? "-"}
                    </p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="py-1.5">
                  <p className="text-[11px] font-semibold text-gray-800 leading-none">
                    {user?.fullname ?? user?.username ?? "-"}
                  </p>
                  <p className="text-[10px] text-gray-400 leading-none mt-0.5 font-normal">
                    {user?.email ?? "-"}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-[11px] gap-2 cursor-pointer">
                  <Settings className="w-3 h-3" /> Account settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  disabled={isPending}
                  className="text-[11px] gap-2 text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  {isPending ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <main className="p-5 h-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
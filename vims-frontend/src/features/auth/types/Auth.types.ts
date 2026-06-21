export interface LoginRequest {
  username: string;
  password: string;
}

export interface SidebarSubmenu {
  id: string;
  name: string;
  logo: string | null;
}

export interface SidebarMenu {
  id: string;
  name: string;
  logo: string | null;
  submenus: SidebarSubmenu[];
}

export interface User {
  id: string;
  username: string;
  fullname: string | null;
  email: string;
  group: string;
  user_type: string;
}

export interface MeResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    sidebar: SidebarMenu[];
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    sidebar: SidebarMenu[];
  };
}

export interface User {
  id: string;
  username: string;
  fullname: string | null;
  email: string;
  group: string;
  group_id: number; // ← tambahan
  user_type: string;
}
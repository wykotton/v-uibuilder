import { RoleInfo } from "@/api/sys/model/userModel";
import { ErrorTypeEnum } from "@/enums/exceptionEnum";
import { MenuModeEnum, MenuTypeEnum } from "@/enums/menuEnum";

// Lock screen information
export interface LockInfo {
  // Password required
  pwd?: string | undefined;
  // Is it locked?
  isLock?: boolean;
}

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum;
  // Error file
  file: string;
  // Error name
  name?: string;
  // Error message
  message: string;
  // Error stack
  stack?: string;
  // Error detail
  detail: string;
  // Error url
  url: string;
  // Error time
  time?: string;
}

export interface UserInfo {
  userId: string | number;
  username: string;
  realName: string;
  avatar: string;
  desc?: string;
  homePath?: string;
  roles: RoleInfo[];
}

export interface UibUserInfo {
  id: number;
  username: string;
  id_card?: string;
  nick_name?: string;
  address?: string;
  phone?: string;
  last_login: string;
  role_id?: string;
  age?: string;
  permission?: string;
  user_status?: string;
  update_time?: string;
  create_time?: string;
  theme?: string;
  is_deleted: number;
  is_sso: number;
  sso_user_id: string;
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}

export interface BreadcrumbInfo {
  id: string;
  name: string;
}

export interface SettingMenuItem {
  key: string;
  name: string;
  checked?: boolean;
}

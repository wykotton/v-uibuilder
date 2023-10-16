import { Persistent, BasicKeys } from "@/utils/cache/persistent";
import { CacheTypeEnum } from "@/enums/cacheEnum";
import { UIB_TOKEN_KEY } from "@/enums/cacheEnum";

const isLocal = 1 === CacheTypeEnum.LOCAL;

export function getToken() {
  return getAuthCache(UIB_TOKEN_KEY);
}

export function getAuthCache<T>(key: any) {
  const fn = isLocal ? Persistent.getLocal : Persistent.getSession;
  return fn(key) as T;
}

export function setAuthCache(key: any, value: any) {
  const fn = isLocal ? Persistent.setLocal : Persistent.setSession;
  return fn(key, value, true);
}

export function removeAuthCache(key: any) {
  const fn = isLocal ? Persistent.removeLocal : Persistent.removeSession;
  return fn(key, true);
}

export function clearAuthCache(immediate = true) {
  const fn = isLocal ? Persistent.clearLocal : Persistent.clearSession;
  return fn(immediate);
}

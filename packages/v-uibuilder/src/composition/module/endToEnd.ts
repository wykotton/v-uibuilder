import { getSSOUserInfoApi, loginApi } from "@/api/sys/user";
import { getConfigInfoApi } from "@/api/uibuilder/setting";
import { LoginTypeEnum } from "@/enums/settingEnum";
import { useWorkspaceStoreWithOut } from "@/store/modules/workspace";
import { useUserStoreWithOut } from "@/store/modules/user";
import { cloneDeep } from "lodash-es";

const useUserStore = useUserStoreWithOut();
const useWorkspaceStore = useWorkspaceStoreWithOut();

/**
 * 通过配置项处理函数对端到端数据进行处理
 * @returns
 */
export async function handleEndToEndMethod() {
  const info = cloneDeep(useWorkspaceStore.endToEndInfo);
  await getConfigInfoApi({}).then((res) => {
    try {
      if (res?.data?.end_to_end) {
        const methods = res.data.end_to_end;
        const item = methods.find(
          (item: { name: string; type: string; method: string }) => item.name === info.name && item.type === info.type
        );
        if (item?.method) {
          const dataScript = new Function(`return ${item.method}`)();
          const newQuery = dataScript(info);
          useWorkspaceStore.setEndToEndInfo(newQuery);
          return;
        }
      }
    } catch (error) {}
  });
}

/**
 * 校验跳转用户和当前登录用户是否一致
 * @returns
 */
export async function checkUser() {
  if (!useWorkspaceStore.endToEndInfo?.login) return false;
  const query = cloneDeep(useWorkspaceStore.endToEndInfo);
  let userId = null;
  let userIdCache = null;
  switch (query.login) {
    case LoginTypeEnum.UIB:
      if (query.user && query.pass) {
        const request = await loginApi({ password: query.pass, username: query.user, isSSO: 0, ssoUserId: "" }, "none");
        userId = request.data.results?.id;
        const userInfoCache = useUserStore.getUibUserInfo;
        userIdCache = userInfoCache?.id;
      }
      break;
    case LoginTypeEnum.EMEI:
      if (query.token) {
        const userInfo = await getSSOUserInfoApi({ access_token: query.token });
        userId = userInfo?.userId;
        const userInfoCache = useUserStore.getUserInfo;
        userIdCache = userInfoCache?.userId;
      }
      break;
  }
  if (userId && userIdCache && userId !== userIdCache) {
    return true;
  }
  return false;
}

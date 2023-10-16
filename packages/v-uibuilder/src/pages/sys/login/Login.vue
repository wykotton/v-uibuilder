<template>
  <Spin :loading="loading" :title="'自动登录中......'">
    <div class="relative w-full h-100vh overflow-hidden">
      <div class="fixed top-32px left-32px z-10 text-white flex">
        <img src="../../../assets/svg/logo.svg" class="h-30px w-30px" />
        <div class="flex items-center"><h2 class="text-white mb-0 ml-10px">UIBuilder</h2></div>
      </div>

      <img src="../../../assets/resource/login-bg-5.jpg" class="w-full h-100vh absolute" />
      <div class="flex items-center absolute right-4 top-4"></div>

      <span class="-enter-x xl:hidden"></span>

      <div class="container relative h-full py-2 mx-auto sm:px-10">
        <div class="flex h-full">
          <div class="hidden min-h-full pl-4 mr-4 xl:flex xl:flex-col xl:w-8/12">
            <div class="my-auto">
              <div>
                <p class="q-page-tip text-white">在同一个地方，构思、设计、 发布，让你的工作更加高效</p>
              </div>
              <div class="mt-10 font-medium text-white -enter-x">
                <span class="inline-block mt-4 text-3xl">开箱即用的可视化低代码平台</span>
              </div>
              <div class="mt-5 font-normal text-white dark:text-gray-500 -enter-x">输入您的个人详细信息开始使用！</div>
            </div>
          </div>
          <div class="flex w-full h-full py-5">
            <div class="h-500px w-420px bg-white rounded-20px q-login-form mx-auto my-auto">
              <div class="relative w-full p-10 mx-auto my-auto rounded-md shadow-mdenter-x">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="q-login-footer">
        <span>© 2022 ZZJZ Inc. All rights reserved.</span>
        <a-divider type="vertical" />
        <span data-type="button">服务条款</span>
        <a-divider type="vertical" />
        <span data-type="button">隐私协议</span>
      </div>
    </div>
  </Spin>
</template>
<script lang="ts" setup>
import { useUserStoreWithOut } from "@/store/modules/user";
import { useWorkspaceStoreWithOut } from "@/store/modules/workspace";
import { getSSOUserInfoApi } from "@/api/sys/user";
import { message } from "ant-design-vue";
import { login, ssoLogin } from "@/composition/index";
import LoginForm from "./LoginForm.vue";
import Spin from "@/pages/uibuilder/edit/components/spin.vue";
import { LoginTypeEnum } from "@/enums/settingEnum";

// pinia
const useUserStore = useUserStoreWithOut();
const useWorkspaceStore = useWorkspaceStoreWithOut();

defineProps({
  sessionTimeout: {
    type: Boolean,
  },
});

const loading = ref(false);

/**
 * 端到端自动登录
 */
async function aiwAutoLogin() {
  if (!useWorkspaceStore.endToEndInfo?.login) return;
  switch (useWorkspaceStore.endToEndInfo.login) {
    case LoginTypeEnum.UIB:
      if (!useWorkspaceStore.endToEndInfo.user || !useWorkspaceStore.endToEndInfo.pass) return;
      loading.value = true;
      await login({
        password: useWorkspaceStore.endToEndInfo.pass,
        username: useWorkspaceStore.endToEndInfo.user,
        isSSO: 0,
        ssoUserId: "",
        mode: "none",
      });
      loading.value = false;
      break;
    case LoginTypeEnum.EMEI:
      if (!useWorkspaceStore.endToEndInfo.token) return;
      loading.value = true;
      const userInfo = await getSSOUserInfoApi({
        access_token: useWorkspaceStore.endToEndInfo.token,
        isTokenInfo: true,
      });
      const { tokenInfo = {} } = userInfo;
      if (!userInfo || !Object.keys(userInfo).length || !Object.keys(tokenInfo).length) {
        message.destroy();
        message.error("SSO自动登录失败, 请尝试进行手动登录!");
      }
      const { access_token = null, refresh_token = "", expires_in = "" } = tokenInfo;
      refresh_token ? useUserStore.setRefreshToken(refresh_token) : void 0;
      expires_in ? useUserStore.setExpiresIn(expires_in) : void 0;
      await ssoLogin(access_token);
      loading.value = false;
      break;
  }
}

onMounted(() => {
  aiwAutoLogin();
});
</script>
<style scoped>
.q-page-tip {
  font-size: 2.571rem;
  font-weight: 500;
  margin-bottom: 24px;
  line-height: 1.4;
}
.q-login-form {
  box-shadow: rgba(23, 25, 29, 0.2) 0px 16px 16px -16px, rgba(23, 25, 29, 0.03) 0px 14px 20px 0px,
    rgba(23, 25, 29, 0.04) 0px 0px 0px 1px;
}
.q-login-footer {
  font-size: var(--spacing-12);
  display: flex;
  opacity: 0.5;
  position: fixed;
  left: 32px;
  bottom: 32px;
  color: rgb(255, 255, 255);
}
</style>

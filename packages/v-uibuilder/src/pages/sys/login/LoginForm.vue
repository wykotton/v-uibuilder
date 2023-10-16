<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <a-form
    class="p-4 enter-x !pt-25px"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <a-form-item name="account" class="enter-x">
      <a-input size="large" v-model:value="formData.account" placeholder="用户名" class="fix-auto-fill" />
    </a-form-item>
    <a-form-item name="password" class="enter-x">
      <a-input-password size="large" v-model:value="formData.password" placeholder="密码" />
    </a-form-item>

    <a-row class="enter-x">
      <a-col :span="12">
        <a-form-item>
          <!-- No logic, you need to deal with it yourself -->
          <a-checkbox v-model:checked="rememberMe" size="small">记住密码</a-checkbox>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item :style="{ 'text-align': 'right' }">
          <!-- No logic, you need to deal with it yourself -->
          <!-- <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">重置密码</Button> -->
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item class="enter-x">
      <a-button type="primary" size="large" block @click="handleLogin" :loading="loading">登录</a-button>
    </a-form-item>
    <a-divider>
      <span class="text-12px text-gray-300">其他方式</span>
    </a-divider>
    <div class="flex justify-evenly enter-x">
      <ShareAltOutlined title="峨眉SSO" class="cursor-pointer" @click="handleSSO" />
    </div>
  </a-form>
</template>
<script lang="ts" setup>
import { getPermCode } from "@/api/sys/user";
import { login, ssoLogin } from "@/composition/index";
import { useMessage } from "@/hooks/web/useMessage";
import { useUserStoreWithOut } from "@/store/modules/user";
import { ShareAltOutlined } from "@ant-design/icons-vue";
import { Col, Row } from "ant-design-vue";
import { isString } from "lodash-es";
import qs from "qs";
import { computed, reactive, ref, unref } from "vue";
import LoginFormTitle from "./LoginFormTitle.vue";
import { LoginStateEnum, useFormRules, useFormValid, useLoginState } from "./useLogin";

// import { useUserApp }
//import { onKeyStroke } from '@vueuse/core';

// pinia
const useUserStore = useUserStoreWithOut();

const ACol = Col;
const ARow = Row;
const { notification } = useMessage();

const { getLoginState } = useLoginState();
const { getFormRules } = useFormRules();

const formRef = ref();
const loading = ref(false);
const rememberMe = ref(false);

const formData = reactive({
  account: "UIBuilder",
  password: "123456",
});

const { validForm } = useFormValid(formRef);

//onKeyStroke('Enter', handleLogin);

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

async function handleLogin() {
  const data = await validForm();
  if (!data) return;
  try {
    loading.value = true;
    const userInfo = await login({
      password: data.password,
      username: data.account,
      isSSO: 0,
      ssoUserId: "",
      mode: "none", //不要默认的错误提示
    });

    if (userInfo?.id) {
      notification.success({
        message: "登录成功",
        description: `欢迎回来: ${userInfo.username}`,
        duration: 3,
      });
    }
  } catch (error) {
    notification.error({
      message: "登录失败，请稍后重试！",
      duration: 3,
    });
    console.log(error);
  } finally {
    loading.value = false;
  }
}

function handleSSO(autoLogin?: string) {
  const iWidth = 500;
  const iHeight = 600;

  //获得窗口的垂直位置
  const iTop = (window.screen.availHeight - 30 - iHeight) / 2;
  //获得窗口的水平位置
  const iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
  const redirect_uri = location.origin + "/#/login";
  const url = `${
    window.location.origin
  }/rest/sso/oauth2/authorize?client_id=UIB&response_type=code&redirect_uri=${encodeURIComponent(redirect_uri)}`;
  const openUrl = autoLogin && isString(autoLogin) ? autoLogin : url;
  const win = window.open(
    openUrl,
    "峨眉SSO授权登录",
    `width=${iWidth},height=${iHeight},top=${iTop},left=${iLeft},menubar=no,toolbar=no, status=no,scrollbars=yes`
  );
  if (!win) return;

  const loop = setInterval(async () => {
    if (win && win.closed) {
      await monitorSSOCode();
      clearInterval(loop);
    }
  }, 500);
}

async function monitorSSOCode() {
  const index = location.href.indexOf("?") + 1;
  const { code } = qs.parse(location.href.substring(index));
  const redirect_uri = location.origin + "/#/login";
  if (!code) return;

  const token: any = await getPermCode({
    grant_type: "authorization_code", // 必填 授权类型，在本步骤中，此值固定为“authorization_code”
    code: code as string, // 必填 返回的授权码
    redirect_uri, // 必填 重定向地址，必须与url上的redirect_uri地址一致，但此处无需encode
    client_id: "UIB", // 必填 分配给接入客户端的id标识
    client_secret: "123", // 必填 分配给接入客户端密码
  });
  const { access_token = null, refresh_token = "", expires_in = "" } = token;
  refresh_token ? useUserStore.setRefreshToken(refresh_token) : void 0;
  expires_in ? useUserStore.setExpiresIn(expires_in) : void 0;
  ssoLogin(access_token);
}
</script>

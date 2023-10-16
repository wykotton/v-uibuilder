<template>
  <a-dropdown placement="bottomLeft" class="user-dropdown">
    <span class="flex hover:opacity-80 items-center">
      <img :src="getUserInfo.avatar" @error="setErrorImg" class="h-35px w-35px rounded-50px cursor-pointer" />
      <span class="md:block leading-43px text-white ml-10px">
        <span class="truncate cursor-pointer">
          {{ getUserInfo.username }}
        </span>
      </span>
    </span>
    <template #overlay>
      <a-menu @click="handleMenuClick">
        <a-menu-item key="setting">
          <a-space>
            <SettingOutlined></SettingOutlined>
            <span>全局配置</span>
          </a-space>
        </a-menu-item>
        <a-menu-item key="workspace">
          <a-space>
            <FormOutlined></FormOutlined>
            <span>个人工作台</span>
          </a-space>
        </a-menu-item>
        <a-menu-item key="about">
          <a-space>
            <QuestionCircleOutlined></QuestionCircleOutlined>
            <span>关于</span>
          </a-space>
        </a-menu-item>
        <a-menu-item key="logout">
          <a-space>
            <LoginOutlined></LoginOutlined>
            <span>退出</span>
          </a-space>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script lang="ts">
import { Dropdown, Menu } from "ant-design-vue";
import type { MenuInfo } from "ant-design-vue/lib/menu/src/interface";
import { computed, defineComponent } from "vue";
import headerImg from "@/assets/images/header.jpg";
import { useHeaderSetting } from "@/hooks/setting/useHeaderSetting";
import { useUserStore } from "@/store/modules/user";
import { LoginOutlined, QuestionCircleOutlined, SettingOutlined, FormOutlined } from "@ant-design/icons-vue";
import { PageEnum } from "@/enums/pageEnum";
import { confirmLoginOut } from "@/composition/index";
import netError from "@/assets/svg/logo.svg";
import { getAppEnvConfig } from "@/utils/env";
type MenuEvent = "setting" | "logout" | "doc" | "lock" | "workspace" | "about";

const { VITE_GLOB_DOCS_ADDRESS = "" } = getAppEnvConfig();

export default defineComponent({
  name: "UserDropdown",
  components: {
    Dropdown,
    Menu,
    MenuDivider: Menu.Divider,
    LoginOutlined,
    QuestionCircleOutlined,
    SettingOutlined,
    FormOutlined,
  },
  setup() {
    const { getShowDoc, getUseLockPage } = useHeaderSetting();
    const userStore = useUserStore();
    const { push } = useRouter();

    const getUserInfo = computed(() => {
      const { username = "" } = userStore.getUibUserInfo || {};
      return { username, avatar: headerImg };
    });

    //  login out
    function handleLoginOut() {
      confirmLoginOut();
    }

    function handleMenuClick(e: MenuInfo) {
      switch (e.key as MenuEvent) {
        case "setting": {
          push(PageEnum.SETTING);
          break;
        }
        case "workspace": {
          push(PageEnum.WORKSPACE);
          break;
        }
        case "about": {
          window.open(`${VITE_GLOB_DOCS_ADDRESS}/guide/what-is-uibuilder.html`);
          break;
        }
        case "logout":
          handleLoginOut();
          break;
      }
    }

    function setErrorImg(e: Event) {
      if (!e.target) return;
      const tempNode = e.target as HTMLImageElement;
      tempNode.src = netError;
    }

    return {
      getUserInfo,
      handleMenuClick,
      getShowDoc,
      getUseLockPage,
      setErrorImg,
    };
  },
});
</script>
<style lang="scss" scoped>
::v-deep(.ant-space-item) {
  display: flex;
}
</style>

<template>
  <a-layout class="layout">
    <a-layout-header
      class="header"
      :style="{ backgroundColor: website.theme === themeColorEnum.DARK ? '#001529' : '#fff' }"
    >
      <div v-if="website.logo" class="logo">
        <img :src="website.logo" class="w-full h-full" />
      </div>
      <div class="title">
        <div
          :class="{ 'main-title': true, 'omit-display': !website.fullDisplayTitle }"
          :style="{ color: website.theme === themeColorEnum.DARK ? '#fff' : '#000' }"
          :title="website.mainTitle"
        >
          {{ website.mainTitle }}
        </div>
        <div
          v-if="website.showSubheading && website.subheading"
          :class="{ 'sub-heading': true, 'omit-display': !website.fullDisplayTitle }"
          :style="{ color: website.theme === themeColorEnum.DARK ? '#b9b9b9' : '#3E4760' }"
          :title="website.subheading"
        >
          {{ website.subheading }}
        </div>
      </div>
      <div class="menu">
        <a-menu
          v-model:selectedKeys="mainSelectedKeys"
          mode="horizontal"
          :theme="website.theme"
          @click="mainClick"
          :style="{ height: '58px', border: '0' }"
        >
          <a-menu-item v-for="item in website.treeData" :key="item.key">{{ item.title }}</a-menu-item>
        </a-menu>
      </div>
    </a-layout-header>
    <a-layout class="left-layout">
      <a-layout-sider v-if="leftMenu.length" collapsible :theme="website.theme" width="200" class="layout-sider">
        <a-menu
          v-model:selectedKeys="leftSelectedKeys"
          v-model:openKeys="openKeys"
          mode="inline"
          :theme="website.theme"
          :style="{ height: '100%', border: '0' }"
          @click="leftClick"
        >
          <template v-for="item in leftMenu" :key="item.key">
            <Submenu v-if="item.children.length" :treeData="item"></Submenu>
            <a-menu-item v-else :key="item.key">{{ item.title }}</a-menu-item>
          </template>
        </a-menu>
      </a-layout-sider>
      <a-layout class="content-layout">
        <a-breadcrumb v-if="false" class="breadcrumb">
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item>List</a-breadcrumb-item>
          <a-breadcrumb-item>App</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content>
          <div ref="iframeContent" class="iframe-content"></div>
        </a-layout-content>
        <a-layout-footer
          v-if="website.showFooter && website.footerText"
          class="footer"
          :style="{
            backgroundColor: website.theme === themeColorEnum.DARK ? '#4d566c' : '#fafafa',
            color: website.theme === themeColorEnum.DARK ? '#fff' : '#000',
          }"
        >
          {{ website.footerText }}
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script setup lang="ts">
import { websiteOptions, treeDataOptions } from "@/types/website";
import { getTreeInfo, iframeRender, getTreeLevel } from "@/composition/index";
import { themeColorEnum } from "@/enums/websiteEnum";
import { cloneDeep } from "lodash-es";
import Submenu from "../components/submenu.vue";

// 路由对象
const route = useRoute();
const router = useRouter();

const props = defineProps<{
  website: websiteOptions;
}>();
watch(
  () => props.website.treeData,
  () => {
    getHashMenu();
    if (mainSelectedKeys.value.length) {
      mainClick({ key: mainSelectedKeys.value[0] });
    }
  },
  { deep: true }
);

const iframeContent = ref();
const mainSelectedKeys = ref<string[]>([]);
const leftSelectedKeys = ref<string[]>([]);
const openKeys = ref<string[]>([]);
const leftMenu = ref<treeDataOptions[]>([]);

// 内|部变更nav导航数据
const selfChange = ref(false);

/**
 * 临时hash数据
 * 用于动态变更左侧菜单
 */
const menuList: any = {};
function getHashMenu() {
  props.website.treeData.forEach((item) => {
    menuList[item.key] = cloneDeep(item);
  });
}
getHashMenu();

/**
 * 设置query的nav参数
 * 标识当前选中页
 * @param key
 */
function setQueryNav(key: string) {
  if (!key) return;
  selfChange.value = true;
  const query = JSON.parse(JSON.stringify(route.query));
  query.nav = key;
  router.replace({ path: route.path, query });
}

/**
 * 顶部菜单切换
 * 变更左侧菜单或者渲染页面
 */
function mainClick(e: any) {
  if (!menuList[e.key] || !iframeContent.value) return;
  if (menuList[e.key]?.isNull) {
    leftMenu.value = menuList[e.key].children || [];
  } else {
    leftMenu.value = [];
    leftSelectedKeys.value = [];
    setQueryNav(menuList[e.key].key);
    iframeRender(iframeContent.value, props.website.menuCache, menuList[e.key]);
  }
}

/**
 * 左侧菜单切换
 */
function leftClick(e: any) {
  const info = getTreeInfo(leftMenu.value, e.key) as treeDataOptions;
  if (!info || !Object.keys(info).length || info.isNull || !iframeContent.value) return;
  setQueryNav(info.key);
  iframeRender(iframeContent.value, props.website.menuCache, info);
}

/**
 * 初始化主页和菜单
 */
function initHomePage() {
  const { nav = "" } = route.query;
  let homePage = "";
  if (nav) {
    // 有query导航加载url导航地址
    homePage = String(nav);
  } else {
    // 没有query导航就加载配置的站点主页
    homePage = props?.website?.homePage;
  }
  const treeData = props?.website?.treeData;
  if (!homePage || !treeData?.length || leftSelectedKeys.value.length) return;
  const result = getTreeLevel(cloneDeep(treeData), homePage);
  const { path } = result;
  if (path.length) {
    mainSelectedKeys.value = [path[0]];
    if (path[0] === homePage) {
      // 顶级菜单是主页
      mainClick({ key: homePage });
    } else {
      // 子菜单是主页
      path.splice(0, 1);
      leftSelectedKeys.value = [cloneDeep(homePage)];
      openKeys.value = path;
      leftMenu.value = menuList[mainSelectedKeys.value[0]]?.children || [];
      leftClick({ key: homePage });
    }
  }
}
onMounted(() => {
  initHomePage();
});

/**
 * 监听路由变更，处理页面更新
 */
router.afterEach((to, from) => {
  if (selfChange.value) {
    selfChange.value = false;
    return;
  }
  if (!to.query.nav) return;
  if (to.query.nav !== from.query.nav) {
    initHomePage();
  }
});
</script>
<style scoped lang="scss">
.layout {
  width: 100%;
  height: 100%;
}

.header {
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  padding-left: 20px;
  overflow: auto;
  .logo {
    width: 150px;
    min-width: 150px;
    height: 30px;
  }
  .title {
    color: #fff;
    padding: 0 15px;
    .main-title {
      height: 20px;
      line-height: 20px;
    }
    .sub-heading {
      height: 20px;
      line-height: 20px;
      font-size: 12px;
    }
    .omit-display {
      max-width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .menu {
    flex: 1;
    height: 60px;
    overflow: hidden;
  }
}

.left-layout {
  .layout-sider {
    padding-bottom: 40px;
    ::v-deep(.ant-layout-sider-trigger) {
      height: 40px;
      line-height: 40px;
    }
    ::v-deep(.sub-menu) {
      background-color: #252834;
      color: #fff;
    }
  }
}

.content-layout {
  .breadcrumb {
    padding: 4px 6px;
  }
  .iframe-content {
    width: 100%;
    height: 100%;
  }
  .footer {
    height: 40px;
    line-height: 40px;
    text-align: center;
    padding: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

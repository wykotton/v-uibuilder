<template>
  <a-layout class="layout">
    <a-layout-sider collapsible :theme="website.theme" class="layout-sider">
      <div v-if="website.logo" class="mr-15px logo">
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
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        mode="inline"
        :theme="website.theme"
        :style="{ border: '0' }"
        @click="leftClick"
      >
        <template v-for="item in website.treeData" :key="item.key">
          <Submenu v-if="item.children.length" :treeData="item"></Submenu>
          <a-menu-item v-else :key="item.key">{{ item.title }}</a-menu-item>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout class="content-layout">
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
</template>
<script setup lang="ts">
import { websiteOptions, treeDataOptions } from "@/types/website";
import { getTreeInfo, getTreeLevel, iframeRender } from "@/composition/index";
import { themeColorEnum } from "@/enums/websiteEnum";
import { cloneDeep } from "lodash-es";
import Submenu from "../components/submenu.vue";

// 路由对象
const route = useRoute();
const router = useRouter();

const props = defineProps<{
  website: websiteOptions;
}>();

const iframeContent = ref();
const selectedKeys = ref<string[]>([]);
const openKeys = ref<string[]>([]);
// 内|部变更nav导航数据
const selfChange = ref(false);

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
 * 左侧菜单切换
 */
function leftClick(e: any) {
  const info = getTreeInfo(props.website.treeData, e.key) as treeDataOptions;
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
  if (!homePage || !treeData?.length || selectedKeys.value.length) return;
  const result = getTreeLevel(cloneDeep(treeData), homePage);
  const { path } = result;
  if (path.length) {
    selectedKeys.value = [cloneDeep(homePage)];
    openKeys.value = path;
    leftClick({ key: homePage });
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
  .layout-sider {
    padding-bottom: 40px;
    overflow: auto;
    ::v-deep(.ant-layout-sider-trigger) {
      height: 40px;
      line-height: 40px;
    }
    .logo {
      width: 150px;
      height: 30px;
      margin: 6px auto;
    }
    .title {
      padding: 10px;
      color: #fff;
      word-break: break-all;
      .sub-heading {
        font-size: 12px;
        color: #b9b9b9;
      }
      .omit-display {
        max-width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
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
  }
}
</style>

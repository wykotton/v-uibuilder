<template>
  <a-layout class="layout">
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
    <div v-show="showMask" class="move-mask"></div>
    <FloatMenu ref="floatMenu" :website="website" @click="menuClick" @move="menuMove"></FloatMenu>
  </a-layout>
</template>
<script setup lang="ts">
import { websiteOptions, treeDataOptions } from "@/types/website";
import { getTreeInfo, iframeRender } from "@/composition/index";
import { themeColorEnum } from "@/enums/websiteEnum";
import FloatMenu from "../components/floatMenu.vue";

// 路由对象
const route = useRoute();
const router = useRouter();

const props = defineProps<{
  website: websiteOptions;
}>();

const iframeContent = ref();
const showMask = ref(false);
const floatMenu = ref();
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
 * 悬浮菜单切换
 */
function menuClick(e: any) {
  const info = getTreeInfo(props.website.treeData, e.key) as treeDataOptions;
  if (!info || !Object.keys(info).length || info.isNull || !iframeContent.value) return;
  setQueryNav(info.key);
  iframeRender(iframeContent.value, props.website.menuCache, info);
}

/**
 * 菜单拖动
 * 添加/去除遮罩层
 * @param move
 */
function menuMove(move: boolean) {
  showMask.value = move;
}

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
    showMask.value = false;
    floatMenu.value?.initHomePage();
  }
});
</script>
<style scoped lang="scss">
.layout {
  width: 100%;
  height: 100%;
  position: relative;
}

.header {
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  padding-left: 20px;
  .logo {
    width: 150px;
    height: 30px;
  }
  .title {
    color: #fff;
    .main-title {
      height: 20px;
      line-height: 20px;
    }
    .sub-heading {
      height: 20px;
      line-height: 20px;
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
  .menu {
    flex: 1;
    margin-left: 15px;
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

.move-mask {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
}
</style>

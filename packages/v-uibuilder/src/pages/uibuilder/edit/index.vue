<template>
  <Spin :loading="useAppStore.homeLoading" :title="'加载中......'">
    <Split>
      <template v-slot:headerPanel>
        <Header></Header>
      </template>
      <template v-slot:leftPanel>
        <PluginArea ref="pluginArea"></PluginArea>
      </template>
      <!-- 画布 -->
      <template v-slot:topPanel>
        <InnerDropzone ref="innerDropzone"></InnerDropzone>
      </template>
      <template v-slot:bottomPanel>
        <BottomDropzone ref="bottomDropzone"></BottomDropzone>
      </template>
      <template v-slot:rightPanel>
        <SettingArea :innerDropzone="settingInnerDropzone" :bottomDropzone="settingBottomDropzone"></SettingArea>
      </template>
    </Split>
  </Spin>
  <template v-for="item in warehouses">
    <micro-app
      class="hidden"
      v-if="item.name && item.url"
      :name="item.name"
      :url="item.url"
      @mounted="mountedComponent"
      @error="errorComponent(item.name)"
    ></micro-app>
  </template>
  <q-custom-warehouse class="w-0 h-0" @change="updateWarehouse(warehouseEnum.COMPONENT)">
    <div depot="true" version="1.0.0" list="[]"></div>
  </q-custom-warehouse>
  <q-page-warehouse class="w-0 h-0" @change="updateWarehouse(warehouseEnum.PAGE)">
    <div page-warehouse list="[]"></div>
  </q-page-warehouse>
</template>
<script setup lang="ts">
import { getConfigInfoApi } from "@/api/uibuilder/setting";
import {
  addKeyBoardEvents,
  addPageZoomEvents,
  addFocusEvents,
  addWindowEvents,
  useResetTree,
  getComponents,
  addCanvasObserver,
  initUndoRedo,
  componentsAction,
  modalDrag,
  initThemeConfig,
  retryException,
  getDesignerPage,
  handleTheme,
  noticeWarehouses,
  resetChildPage,
} from "@/composition/index";
import { ComponentProtocolEnum, DesignerEnum } from "@/enums/appEnum";
import { warehouseEnum } from "@/enums/pluginEnum";
import { useRouter, useRoute } from "vue-router";
import { message } from "ant-design-vue";
import { useAppStoreWithOut } from "@/store/modules/app";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import { useWorkspaceStoreWithOut } from "@/store/modules/workspace";
import { IPageModel } from "@/types/IPageModel";
import { warehouseInfo } from "@/types/IQDepot";
import { PageEnum } from "@/enums/pageEnum";
import { useEventListener } from "@vueuse/core";
import { cloneDeep, omit } from "lodash-es";
import BootStrap from "@/utils/designer/BootStrap";
import BottomDropzone from "./components/canvas/bottom-dropzone.vue";
import InnerDropzone from "./components/canvas/inner-dropzone.vue";
import Header from "./components/header/index.vue";
import PluginArea from "./components/plugin-area/index.vue";
import SettingArea from "./components/setting-area/index.vue";
import Split from "./components/split.vue";
import Spin from "./components/spin.vue";
import "@/css/common.scss";

// pinia
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();
const useWorkspaceStore = useWorkspaceStoreWithOut();

// 路由对象
const router = useRouter();
const route = useRoute();

// 画布实例
const innerDropzone = ref();
const bottomDropzone = ref();
const settingInnerDropzone = ref();
const settingBottomDropzone = ref();
const warehouseCount = ref(0);
const warehouses = ref<warehouseInfo[]>([]);

// 跳转至工作空间
const goWorkspace = () => {
  setTimeout(() => {
    router.replace(PageEnum.WORKSPACE);
  }, 3000);
};

// 仓库刷新
const pluginArea = ref();
function updateWarehouse(type: string) {
  pluginArea.value?.refreshWarehouse?.(type);
}

/**
 * 添加事件监听
 */
const useEventListeners = () => {
  // canvas节点观察
  addCanvasObserver(settingInnerDropzone.value, settingBottomDropzone.value);
  // 键盘监听
  addKeyBoardEvents();
  // 页面鼠标滚轮监听
  addPageZoomEvents();
  // 页面元素聚焦监听
  addFocusEvents();
  // window窗口失焦监听
  addWindowEvents();
  // modal弹窗移动指令
  modalDrag();
};

/**
 * 获取页面数据
 */
const pageInfo: any = ref();
async function getPageInfo() {
  const id = route.query.id;
  pageInfo.value = await getDesignerPage(String(id));
  handleTheme(pageInfo.value, String(route.query.emit || ""));
}

// 初始化页面
const initPage = () => {
  if (!pageInfo.value) return;
  pageInfo.value.page_name ? useAppStore.setPageName(pageInfo.value.page_name) : useAppStore.setPageName("未命名");
  useAppStore.setPageInstance(omit(pageInfo.value, "custom_model"));
  // pageModel初始化
  let tempDesignerPage = pageInfo.value?.custom_model;
  if (tempDesignerPage) {
    tempDesignerPage = JSON.parse(tempDesignerPage);
    const options = {
      root: settingInnerDropzone.value,
      config: tempDesignerPage,
      pluginRoot: settingBottomDropzone.value,
    };
    const bootStrap = new BootStrap(options);
    const pageModel = bootStrap as unknown as Promise<IPageModel>;
    pageModel.then((data) => {
      // 设置pageModel
      useAppStore.setPageModel(Object.preventExtensions(data));
      // 初始化撤销重做
      initUndoRedo();
      // 事件监听
      useEventListeners();
      // 重置图层面板
      useResetTree();
      // 更新moveable实例
      useSettingStore.moveableExample.setElementGuidelines();
      // 通知各个子仓库
      noticeWarehouses();
      // 端到端自动刷新仓库
      autoRefresh();
      // 元件初始化异常重试
      retryException();
    });
  }
};

/**
 * AIW跳转自动刷新仓库
 */
const autoRefreshState = ref(false);
provide("autoRefresh", autoRefreshState);
const cleanUpRefresh = reactive({
  cleanUp: () => {},
});
let autoRefreshLoading: any = undefined;
function autoRefresh() {
  const info = cloneDeep(useWorkspaceStore.endToEndInfo);
  useWorkspaceStore.clearEndToEndInfo();
  if (!info?.aiwAppId || !info?.pageWarehouse) {
    useAppStore.setHomeLoading(false);
    return;
  }
  // 自动导入app
  componentsAction(info.pageWarehouse, {
    type: ComponentProtocolEnum.AIW,
    body: {
      aiwAppId: info.aiwAppId,
    },
  });
  // 监听刷新消息
  cleanUpRefresh.cleanUp = useEventListener(window, DesignerEnum.DESIGNER, () => {
    autoRefreshState.value = true;
    useAppStore.setHomeLoading(false);
  });
  autoRefreshLoading = setTimeout(() => {
    useAppStore.setHomeLoading(false);
  }, info?.timeout || 3000);
}

// 子应用加载
const mountedComponent = () => {
  warehouseCount.value++;
  if (warehouseCount.value == warehouses.value.length) {
    useAppStore.setWarehouses(warehouses.value);
    // 页面初始化
    initPage();
  }
};

// 错误页面加载
const errorComponent = (depotName: string) => {
  message.error(`${depotName}元件仓库加载出错,请检查仓库子应用配置!`);
};

onMounted(async () => {
  settingInnerDropzone.value = (innerDropzone.value as { domRef: () => HTMLElement }).domRef();
  settingBottomDropzone.value = (bottomDropzone.value as { domRef: () => HTMLElement }).domRef();

  // 通过query的id获取页面数据进行初始化
  const id = route.query.id;
  if (!id) {
    message.error("获取失败,ui-builder实例id不存在!");
    goWorkspace();
  } else {
    // 加载用户主题
    initThemeConfig(true);
    // 获取页面数据
    await getPageInfo();
    // 获取元件仓库列表
    getConfigInfoApi({}).then((res) => {
      if (res?.data?.component_warehouse) {
        useAppStore.setDesignerConfig(Object.preventExtensions(res.data));
        res.data.component_warehouse.forEach((item: warehouseInfo) => {
          if (!useAppStore.disableWarehouse.includes(item.name)) {
            warehouses.value.push(item);
          }
        });
      }
      if (!warehouses.value.length) {
        useAppStore.setHomeLoading(false);
      }
      if (res?.data?.website_name) {
        useAppStore.setWebsiteName(res.data.website_name);
      }
      setTimeout(() => {
        getComponents();
      }, 1000);
    });
  }
});

onBeforeUnmount(() => {
  useAppStore.setEditStatus(false);
  // 清除observer观察器
  useAppStore.innerObserver?.stop();
  useAppStore.setInnerObserver(null);
  useAppStore.bottomObserver?.stop();
  useAppStore.setBottomObserver(null);
  // 清除自动刷新监听
  cleanUpRefresh.cleanUp();
  clearTimeout(autoRefreshLoading);
  // 重置底部画布tab
  useAppStore.setBottomContentTab("1");
  // 重置画布缩放系数
  useAppStore.setScaleNum(1);
  // 重置子页面状态
  resetChildPage();
});
</script>
<style lang="scss" scoped>
/**自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

::-webkit-scrollbar-thumb {
  background-color: #9c9da0;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

::-webkit-scrollbar-corner {
  background-color: transparent;
}
</style>

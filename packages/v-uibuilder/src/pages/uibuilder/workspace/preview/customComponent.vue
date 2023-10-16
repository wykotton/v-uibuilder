<template>
  <Spin :loading="loading" :title="'加载中......'">
    <div class="canvas">
      <div class="inner" ref="inner"></div>
    </div>
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
  <q-custom-warehouse class="w-0 h-0">
    <div depot="true" version="1.0.0" list="[]"></div>
  </q-custom-warehouse>
</template>
<script setup lang="ts">
import { useAppStoreWithOut } from "@/store/modules/app";
import { useUserStoreWithOut } from "@/store/modules/user";
import { message } from "ant-design-vue";
import { searchCombinationApi } from "@/api/uibuilder/edit";
import { useRoute } from "vue-router";
import { warehouseInfo } from "@/types/IQDepot";
import { ComponentProtocolEnum } from "@/enums/appEnum";
import { checkCombinationComponent, componentsAction, getComponents } from "@/composition/index";
import { getConfigInfoApi } from "@/api/uibuilder/setting";
import { ICombinationOptions } from "@/types/ICombination";
import { cloneDeep, isString } from "lodash-es";
import { PageModel } from "@/utils/designer/PageModel";
import DesignerPage from "@/utils/designer/DesignerPage";
import Spin from "../../edit/components/spin.vue";

// pinia
const useAppStore = useAppStoreWithOut();
const useUserStore = useUserStoreWithOut();

// 路由对象
const route = useRoute();

const loading = ref(true);
const warehouseCount = ref(0);
const warehouses = ref<warehouseInfo[]>([]);
const inner = ref();
const combinationInfo: any = ref();

/**
 * 获取集合数据
 */
async function getCombinationInfo() {
  const id = route.query.id;
  const userInfo = useUserStore.getUibUserInfo;
  if (!userInfo?.id) {
    message.destroy();
    message.error("未获取到用户信息, 请重新登录后再试!");
    return;
  }
  const request = await searchCombinationApi({
    userId: userInfo.id,
    id,
  });
  const {
    results,
    info: { msg = "" },
  } = request.data;
  if (msg !== "success") {
    message.destroy();
    message.error(msg);
    return;
  }
  combinationInfo.value = results[0];
}

// 子应用加载
const mountedComponent = () => {
  warehouseCount.value++;
  if (warehouseCount.value == warehouses.value.length) {
    // 页面初始化
    initPage();
  }
};

// 错误页面加载
const errorComponent = (depotName: string) => {
  message.error(`${depotName}元件仓库加载出错,请检查仓库子应用配置!`);
};

/**
 * 通知各个子仓库页面已经加载完成
 */
const noticeWarehouses = (data: any) => {
  warehouses.value.forEach(async (item: { name: string }) => {
    await componentsAction(item.name, { type: ComponentProtocolEnum.LOAD, body: data });
  });
};

/**
 * 渲染元件集合
 * @param component
 */
async function createCombinationComponent() {
  const createComponent = async (info: ICombinationOptions, parentElement: HTMLElement) => {
    let { options, children = [] } = info;
    const { slotName } = info;
    if (isString(options)) options = JSON.parse(options);
    if (isString(children)) children = JSON.parse(children);
    const {
      iovSchema: { componentName = "" },
    } = options;
    const element = document.createElement(componentName) as any;
    if (!element) {
      message.error("元件创建失败!");
      return;
    }
    // 兼容DI Angular组件创建后不初始化的问题
    if (element && !element.componentModel && element.connectedCallback) {
      element.connectedCallback?.();
      element.componentModel?.model?.lifeCycle?.updated?.(element, options, "initBaseModel");
      Reflect.deleteProperty(options, "iovSchema");
    }
    if (element.componentModel) {
      options.contextType = true;
      element.componentModel.updateModelEntity(JSON.stringify(options));
      DesignerPage.setComponentsPageModel(element.componentModel.model);
    }
    if (slotName) element.slot = slotName;
    parentElement.appendChild(element);
    for await (const item of children) {
      await createComponent(item, element);
    }
  };
  await createComponent(combinationInfo.value, inner.value);
  const pgModel = new PageModel(DesignerPage as any);
  pgModel.pageModelBindBootstrap();
  noticeWarehouses(pgModel);
  loading.value = false;
}

// 初始化页面
const initPage = async () => {
  await getComponents();
  await checkCombinationComponent(cloneDeep(combinationInfo.value));
  setTimeout(() => {
    // 元件集合初始化
    try {
      createCombinationComponent();
    } catch (error) {
      message.destroy();
      message.error("元件集合初始化失败!");
      loading.value = false;
      console.log(error);
    }
  }, 0);
};

onMounted(async () => {
  // 通过query的id获取页面数据进行初始化
  const id = route.query.id;
  if (!id) {
    message.error("获取失败,元件集合id不存在!");
  } else {
    // 获取元件集合数据
    await getCombinationInfo();
    // 获取元件仓库列表
    getConfigInfoApi({}).then((res) => {
      if (res?.data?.component_warehouse) {
        res.data.component_warehouse.forEach((item: warehouseInfo) => {
          if (!useAppStore.disableWarehouse.includes(item.name)) {
            warehouses.value.push(item);
          }
        });
      }
      if (!warehouses.value.length) {
        loading.value = false;
      }
    });
  }
});
</script>
<style scoped lang="scss">
.canvas {
  width: 100vw;
  height: 100vh;

  .inner {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: auto;
  }
}
</style>

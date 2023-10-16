<template>
  <Spin :loading="loading" :title="'加载中......'">
    <div class="canvas">
      <div class="inner" ref="inner"></div>
      <div class="bottom" ref="bottom"></div>
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
import { searchPageWarehouseApi } from "@/api/uibuilder/edit";
import { useRoute } from "vue-router";
import { getConfigInfoApi } from "@/api/uibuilder/setting";
import { warehouseInfo } from "@/types/IQDepot";
import { componentsAction } from "@/composition/index";
import { ComponentProtocolEnum } from "@/enums/appEnum";
import { IPageModel } from "@/types/IPageModel";
import { ISchema } from "@/types/IModelSchema";
import BootStrap from "@/utils/designer/BootStrap";
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
const bottom = ref();
const pageInfo: any = ref();

/**
 * 获取集合数据
 */
async function getPageWarehouseInfo() {
  const id = route.query.id;
  const userInfo = useUserStore.getUibUserInfo;
  if (!userInfo?.id) {
    message.destroy();
    message.error("未获取到用户信息, 请重新登录后再试!");
    return;
  }
  const request = await searchPageWarehouseApi({
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
  pageInfo.value = results[0];
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

// 初始化页面
const initPage = () => {
  // pageModel初始化
  let tempDesignerPage = pageInfo.value?.custom_model;
  if (tempDesignerPage) {
    tempDesignerPage = JSON.parse(tempDesignerPage);
    tempDesignerPage.componentsArray?.forEach((item: ISchema) => {
      item.contextType = true;
    });
    tempDesignerPage.exceptionComponents?.forEach((item: ISchema) => {
      item.contextType = true;
    });
    const options = {
      root: inner.value,
      config: tempDesignerPage,
      pluginRoot: bottom.value,
    };
    const bootStrap = new BootStrap(options);
    const pageModel = bootStrap as unknown as Promise<IPageModel>;
    pageModel.then((data) => {
      // 通知各个子仓库
      noticeWarehouses(data);
      loading.value = false;
    });
  }
};

onMounted(async () => {
  // 通过query的id获取页面数据进行初始化
  const id = route.query.id;
  if (!id) {
    message.error("获取失败,页面库页面id不存在!");
  } else {
    // 获取页面库页面数据
    await getPageWarehouseInfo();
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

  .bottom {
    display: none;
    position: relative;
  }
}
</style>

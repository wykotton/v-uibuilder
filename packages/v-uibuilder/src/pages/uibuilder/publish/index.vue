<template>
  <Spin :loading="loading" :title="'加载中......'">
    <div id="publish-myApp">
      <div
        ref="innerDropzone"
        id="publish-inner-dropzone"
        :style="{ height: `${canvasHeight}px`, width: `${canvasWidth}px` }"
      ></div>
      <div
        ref="bottomDropzone"
        id="publish-bottomcontent"
        :style="{ height: `${canvasHeight}px`, width: `${canvasWidth}px` }"
      ></div>
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
</template>
<script setup lang="ts">
import { previewConfigInfoApi } from "@/api/uibuilder/setting";
import { componentsAction, handlePageContent, showPageContent } from "@/composition/index";
import { ComponentProtocolEnum } from "@/enums/appEnum";
import { IPageModel } from "@/types/IPageModel";
import { warehouseInfo } from "@/types/IQDepot";
import { message } from "ant-design-vue";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ISchema } from "@/types/IModelSchema";
import { previewPageApi } from "@/api/uibuilder/management";
import { removeComponentMask } from "@/utils/moveable/mask";
import BootStrap from "@/utils/designer/BootStrap";
import Spin from "../edit/components/spin.vue";
import "@/utils/font/iconfont";

// 路由对象
const route = useRoute();
const router = useRouter();

const innerDropzone = ref();
const bottomDropzone = ref();
const warehouseCount = ref(0);
const warehouses = ref<warehouseInfo[]>([]);
const loading = ref(true);
const canvasWidth = ref(1920);
const canvasHeight = ref(1080);
const tempPageInfo = ref<Record<string, any>>({});

// 子应用加载
const mountedComponent = () => {
  warehouseCount.value++;
  checkUpMounted();
};

// 检查子应用加载完成
function checkUpMounted() {
  if (warehouseCount.value !== warehouses.value.length) return;
  const id = route.query.id;
  if (id) {
    // 页面初始化
    loading.value = true;
    initPage(String(id));
  }
}

// 错误页面加载
const errorComponent = (depotName: string) => {
  message.error(`${depotName}元件仓库加载出错,请检查仓库子应用配置!`);
};

// 创建上下画布元件承载容器
function createContainer() {
  const inner = document.createElement("div") as HTMLElement;
  inner.className = "publish-inner-container";
  const bottom = document.createElement("div") as HTMLElement;
  bottom.className = "publish-bottom-container";
  innerDropzone.value.append(inner);
  bottomDropzone.value.append(bottom);
  return { inner, bottom };
}

// 初始化页面
const initPage = async (id: string) => {
  const results = await previewPageApi({ id });
  const {
    code,
    results: [pageInfo = {}],
  } = results.data;
  switch (code) {
    case 404:
      message.error("ui-builder实例不存在!");
      return;
    case 500:
      message.error("获取ui-builder实例失败!");
      return;
  }
  tempPageInfo.value[String(id)] = pageInfo;
  handleTheme(pageInfo);
  try {
    if (pageInfo.custom_model) {
      const { inner, bottom } = createContainer();
      const designerPage = handleContextType(pageInfo.custom_model);
      const options = {
        root: inner,
        config: designerPage,
        pluginRoot: bottom,
      };
      const bootStrap = new BootStrap(options);
      const pageModel = bootStrap as unknown as Promise<IPageModel>;

      pageModel.then((data) => {
        // 通知各个子仓库
        noticeWarehouses(data);
        loading.value = false;
        // 元件初始化异常重试
        retryException(data);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * 变更元件状态为运行时
 * @param designerPage
 */
function handleContextType(designerPage: string) {
  const tempDesignerPage = JSON.parse(designerPage);
  tempDesignerPage.componentsArray?.forEach((item: ISchema) => {
    item.contextType = true;
  });
  tempDesignerPage.exceptionComponents?.forEach((item: ISchema) => {
    item.contextType = true;
  });
  return tempDesignerPage;
}

/**
 * 处理页面主题数据
 * @param pageInfo
 */
function handleTheme(pageInfo: any) {
  if (!pageInfo.theme) return;
  const theme = JSON.parse(pageInfo.theme);
  if (theme.canvasStyleData?.width) {
    canvasWidth.value = theme.canvasStyleData.width;
  }
  if (theme.canvasStyleData?.height) {
    canvasHeight.value = theme.canvasStyleData.height;
  }
}

/**
 * 通知各个子仓库页面已经加载完成
 */
const noticeWarehouses = (data: any) => {
  warehouses.value.forEach(async (item: { name: string }) => {
    const result = await componentsAction(item.name, { type: ComponentProtocolEnum.LOAD, body: data });
    if (!result) {
    }
  });
};

/**
 * 元件初始化异常重试
 */
let retryTimer: any = undefined;
function retryException(data: any) {
  let retryCount = 0;
  clearTimeout(retryTimer);
  const retry = () => {
    if (retryCount >= 5 || !data?.pageModel.exceptionComponents.length) return;
    data.pageModel.exceptionComponents.forEach((component: ISchema) => {
      const element: any = document.querySelector(`#${component.id}`);
      if (element?.componentModel) {
        // 元件已被正常渲染，进行数据恢复
        try {
          element.componentModel.updateModelEntity(JSON.stringify(component));
          removeComponentMask(element);
        } catch (error) {}
      }
    });
    retryTimer = setTimeout(() => {
      retryCount++;
      retry();
    }, 1000);
  };
  retry();
}

onMounted(() => {
  const id = route.query.id;
  if (!id) {
    message.error("获取失败,ui-builder实例id不存在!");
  } else {
    previewConfigInfoApi({}).then((res) => {
      if (res?.data?.component_warehouse) {
        warehouses.value = res.data.component_warehouse;
      }
      if (!warehouses.value.length) {
        loading.value = false;
      }
    });
  }
});

/**
 * 监听路由变更，处理页面更新
 */
router.afterEach((to, from) => {
  if (to.query?.id && to.query.id !== from.query.id) {
    handlePageContent(String(from.query.id), innerDropzone.value, bottomDropzone.value).then(() => {
      const pageContainer = document.querySelector(`#page-container-${to.query.id}`);
      if (pageContainer) {
        tempPageInfo.value?.[String(to.query.id)] ? handleTheme(tempPageInfo.value[String(to.query.id)]) : void 0;
        showPageContent(pageContainer as HTMLElement, innerDropzone.value, bottomDropzone.value);
      } else {
        checkUpMounted();
      }
    });
  }
});
</script>
<style lang="scss" scoped>
body {
  overflow: auto;
}

#publish-myApp {
  width: 100vw;
  height: 100vh;
  overflow: auto;

  #publish-inner-dropzone {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  #publish-bottomcontent {
    width: 100%;
    height: 100%;
    display: none;
    position: relative;
  }
}

.publish-inner-container,
.publish-bottom-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
}
</style>

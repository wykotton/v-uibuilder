<template>
  <div class="workspace-wrap">
    <div class="headers">
      <q-page-header class="h-48px">
        <q-link
          slot="left"
          :class="pageSpace !== PageSpaceType.LIST ? 'ml-88px' : 'ml-48px'"
          href="javascript:void(0);"
        >
          <div class="font-微软雅黑 font-bold text-24px text-white text-center w-full h-full">
            {{ useAppStore.websiteName || useAppStore.defaultWebsiteName }}
          </div>
        </q-link>
        <div slot="right" class="ml-10px mr-20px"><UserDropdown></UserDropdown></div>
      </q-page-header>
    </div>
    <div @click="backToList" v-if="pageSpace !== PageSpaceType.LIST" class="workspace-back">
      <span>返回</span>
      <svg
        t="1665536655715"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="16px"
        height="16px"
      >
        <path
          d="M700.371228 394.525472 174.028569 394.525472l255.952416-227.506551c12.389168-11.011798 13.505595-29.980825 2.492774-42.369993-11.011798-12.386098-29.977755-13.506619-42.367947-2.492774L76.425623 400.975371c-6.960529 5.496178-11.434423 14.003945-11.434423 23.561625 0 0.013303 0.001023 0.026606 0.001023 0.039909 0 0.01228-0.001023 0.025583-0.001023 0.037862 0 0.473791 0.01535 0.946558 0.037862 1.418302 0.001023 0.016373 0.001023 0.032746 0.001023 0.049119 0.39295 8.030907 3.992941 15.595186 10.034541 20.962427l315.040163 280.028764c5.717212 5.083785 12.83533 7.580652 19.925818 7.580652 8.274454 0 16.514115-3.403516 22.442128-10.07445 11.011798-12.387122 9.896394-31.357172-2.492774-42.367947l-256.128425-227.665163 526.518668 0c109.219517 0 198.075241 88.855724 198.075241 198.075241s-88.855724 198.075241-198.075241 198.075241L354.324888 850.696955c-16.57449 0-30.011524 13.437034-30.011524 30.011524s13.437034 30.011524 30.011524 30.011524l346.046341 0c142.31631 0 258.098289-115.783003 258.098289-258.098289S842.686515 394.525472 700.371228 394.525472z"
          fill="currentColor"
        ></path>
      </svg>
    </div>
    <!--  项目、页面库、组件库列表  -->
    <div class="workspace-container" v-show="pageSpace === PageSpaceType.LIST">
      <div class="thesis-nav">
        <div class="thesis-tabs">
          <template v-for="item in menuList" :key="item.value">
            <a-button
              @click="setPageType(item.value)"
              class="mr-8px"
              :type="useWorkspaceStore.currentPageType === item.value ? 'primary' : ''"
            >
              {{ item.label }}
            </a-button>
          </template>
        </div>
        <div v-if="searchType" class="search-wrap">
          <div class="refresh-btn">
            <a-button @click="handleRefresh(true)">刷新{{ searchType }}</a-button>
          </div>
          <!-- 站点暂时没提供导入操作 -->
          <div v-show="searchType !== '站点'" class="import-btn">
            <a-button @click="handleImport">导入{{ searchType }}</a-button>
          </div>
          <a-input-search
            v-model:value="searchInput"
            :placeholder="'搜索' + searchType"
            allow-clear
            @search="handleSearch"
          ></a-input-search>
        </div>
      </div>
      <ProjectCard
        ref="projectCard"
        v-if="useWorkspaceStore.currentPageType === PageType.PROJECT"
        :search-str="searchStr"
      ></ProjectCard>
      <ComponentCard
        ref="componentCard"
        v-else-if="useWorkspaceStore.currentPageType === PageType.COMPONENT"
        :search-str="searchStr"
      ></ComponentCard>
      <PageWarehouseCard
        ref="pageWarehouseCard"
        v-else-if="useWorkspaceStore.currentPageType === PageType.PAGE"
        :search-str="searchStr"
      ></PageWarehouseCard>
      <WebsiteCard
        ref="websiteCard"
        v-else-if="useWorkspaceStore.currentPageType === PageType.WEBSITE"
        :search-str="searchStr"
      ></WebsiteCard>
    </div>
    <!--  项目预览  -->
    <template v-if="pageSpace === PageSpaceType.PREVIEW">
      <PagesContainer :index="currentIndex" :toggle="!pageCatalogOpen"></PagesContainer>
      <PageCatalog
        :index="currentIndex"
        @toggle="pageCatalogOpen = !pageCatalogOpen"
        :toggle="pageCatalogOpen"
        :list="pagePreviewList"
        @content="handleChangeContent"
        @add="addPage"
        @addWebsite="addWebsite"
        @update="getProjectInfo"
      ></PageCatalog>
    </template>
    <a-modal
      v-model:visible="showImportModal"
      cancel-text="取消"
      ok-text="确定"
      :closable="false"
      :title="`导入${searchType}`"
      @cancel="cancelImport"
      @ok="submitImport"
    >
      <a-upload-dragger
        accept="application/json"
        v-model:fileList="importFiles"
        name="file"
        :multiple="false"
        :before-upload="() => false"
        :max-count="1"
      >
        <p class="ant-upload-drag-icon">
          <inbox-outlined></inbox-outlined>
        </p>
        <p class="ant-upload-text">单击或拖动文件到此区域</p>
      </a-upload-dragger>
    </a-modal>
  </div>
  <EndToEnd />
  <q-custom-warehouse class="w-0 h-0" @change="updateWarehouse">
    <div id="depot-components" list="[]"></div>
  </q-custom-warehouse>
  <q-page-warehouse class="w-0 h-0" @change="updateWarehouse">
    <div id="depot-pages" list="[]"></div>
  </q-page-warehouse>
</template>
<script setup lang="ts">
import { PageInfo } from "@/types/workspace";
import { PageSpaceType, PageType, UserEventType } from "@/enums/workspace";
import { workspaceGetProjectApi, workspaceImportProjectApi } from "@/api/uibuilder/workspace";
import { message } from "ant-design-vue";
import { InboxOutlined } from "@ant-design/icons-vue";
import { useWorkspaceStoreWithOut } from "@/store/modules/workspace";
import { createPage, createWebsite, initThemeConfig } from "@/composition/index";
import { throttle } from "lodash-es";
import { useRouter, useRoute } from "vue-router";
import { PageEnum } from "@/enums/pageEnum";
import { getConfigInfoApi } from "@/api/uibuilder/setting";
import { useAppStoreWithOut } from "@/store/modules/app";
import UserDropdown from "@/components/user-dropdown/index.vue";
import PageCatalog from "@/components/page-catalog/index.vue";
import PagesContainer from "./components/pagesContainer.vue";
import ProjectCard from "./components/projectCard.vue";
import ComponentCard from "./components/componentCard.vue";
import PageWarehouseCard from "./components/pageWarehouseCard.vue";
import WebsiteCard from "./components/websiteCard.vue";
import EndToEnd from "./endtoend/index.vue";

// pinia
const useAppStore = useAppStoreWithOut();
const useWorkspaceStore = useWorkspaceStoreWithOut();

// 路由对象
const route = useRoute();
const router = useRouter();

const menuList = [
  { label: "项目", value: PageType.PROJECT },
  { label: "元件库", value: PageType.COMPONENT },
  { label: "页面库", value: PageType.PAGE },
  { label: "站点", value: PageType.WEBSITE },
];

const previewSingle = ref<boolean>(false);
const pageSpace = ref<PageSpaceType>(PageSpaceType.LIST);
const searchType = computed<string>(() => {
  switch (useWorkspaceStore.currentPageType) {
    case PageType.PROJECT:
      return "项目";
    case PageType.COMPONENT:
      return "元件库";
    case PageType.PAGE:
      return "页面库";
    case PageType.WEBSITE:
      return "站点";
    default:
      return "";
  }
});

const searchStr = ref<string>("");
const contentIndex = ref<number>(0);
const currentIndex = ref<number>(0);
const pageCatalogOpen = ref<boolean>(true);
const pagePreviewList = ref<PageInfo[]>([]);
const showImportModal = ref<boolean>(false);
const importFiles = ref([]);

/**
 * 搜索数据
 */
const searchInput = ref();
const handleSearch = () => {
  searchInput.value ? (searchStr.value = searchInput.value) : (searchStr.value = "");
};

/**
 * 获取项目详细信息
 */
const getProjectInfo = (id?: number) => {
  if (!id) {
    pageSpace.value = PageSpaceType.PREVIEW;
    try {
      const id = parseInt(route.query.preview as string);
      getProjectInfo(id);
    } catch {}
  } else {
    workspaceGetProjectApi(id).then((res) => {
      if (res?.data) {
        if (res.data.info?.msg === "success") {
          const { results } = res.data;
          pagePreviewList.value = results[0].pageList;
          const index = pagePreviewList.value.findIndex((item) => item.id === contentIndex.value);
          if (index !== -1) {
            currentIndex.value = contentIndex.value;
          } else {
            currentIndex.value = pagePreviewList.value[0].id;
          }
        }
      }
    });
  }
};

/**
 * 返回数据列表页面
 */
const backToList = () => {
  router.push(`/uibuilder/workspace`);
};

const handleChangeContent = (index: number) => {
  currentIndex.value = index;
  contentIndex.value = index;
};

/**
 * 刷新操作
 */
const projectCard = ref(null);
const componentCard = ref(null);
const pageWarehouseCard = ref(null);
const websiteCard = ref(null);
const handleRefresh = throttle(
  (reset?: boolean) => {
    switch (useWorkspaceStore.currentPageType) {
      case PageType.PROJECT: {
        (projectCard.value as any)?.refreshProject?.(reset);
        break;
      }
      case PageType.COMPONENT: {
        (componentCard.value as any)?.refreshComponents?.(reset);
        break;
      }
      case PageType.PAGE: {
        (pageWarehouseCard.value as any)?.refreshPageList?.(reset);
        break;
      }
      case PageType.WEBSITE: {
        (websiteCard.value as any)?.refreshWebsite?.(reset);
        break;
      }
    }
  },
  1500,
  { trailing: false }
);

/**
 * 仓库数据更新
 * @param type
 */
function updateWarehouse() {
  switch (useWorkspaceStore.currentPageType) {
    case PageType.COMPONENT: {
      (componentCard.value as any)?.getComponents?.(searchStr.value);
      break;
    }
    case PageType.PAGE: {
      (pageWarehouseCard.value as any)?.getPageWarehouse?.(searchStr.value);
      break;
    }
  }
}

/**
 * 导入操作
 * 项目|元件库|页面库
 */
const handleImport = () => {
  switch (useWorkspaceStore.currentPageType) {
    case PageType.COMPONENT: {
      window.dispatchEvent(
        new CustomEvent("user", {
          detail: {
            type: UserEventType.IMPORT,
          },
        })
      );
      break;
    }
    case PageType.PAGE: {
      window.dispatchEvent(
        new CustomEvent("pageWarehouse", {
          detail: {
            type: UserEventType.IMPORT,
          },
        })
      );
      break;
    }
    case PageType.PROJECT: {
      showImportModal.value = true;
      break;
    }
  }
};

/**
 * 确认导入项目
 */
const submitImport = () => {
  if (!importFiles.value.length) {
    message.destroy();
    message.warning("请选择项目文件!");
    return;
  }
  const reader = new FileReader();
  reader.readAsText((importFiles.value[0] as any).originFileObj as Blob);
  reader.onload = () => {
    if (!reader.result) {
      message.error("读取JSON文件内容出错!");
      return;
    }
    try {
      const data = JSON.parse(reader.result as string);
      workspaceImportProjectApi([data]).then((res) => {
        if (res?.data?.info?.msg === "success") {
          importFiles.value = [];
          showImportModal.value = false;
          message.success(`已导入${res.data.importProject}个项目，共${res.data.importPage}个页面`);
          handleRefresh(true);
        } else {
          if (data?.info?.msg) {
            message.error(data.info.msg);
          } else {
            message.error("导入失败!");
          }
        }
      });
    } catch (e) {
      message.error("读取JSON文件内容出错!");
    }
  };
};

/**
 * 取消导入项目
 */
const cancelImport = () => {
  showImportModal.value = false;
};

/**
 * 项目新增页面
 */
const addPage = () => {
  if (route.query.preview) {
    createPage(parseInt(route.query.preview as unknown as string), "新建页面")?.then((res) => {
      router.push(`/uibuilder/edit?id=${(res as any).id}`);
    });
  }
};

/**
 * 项目新增站点
 */
function addWebsite() {
  const id = route.query.preview;
  if (!id) {
    message.destroy();
    message.error("项目id不存在, 无法进行操作!");
    return;
  }
  createWebsite(String(id));
}

/**
 * 数据类型切换
 * 项目|元件库|页面库
 * @param type
 */
const setPageType = (type: PageType) => {
  useWorkspaceStore.setPageType(type);
  searchInput.value?.value ? (searchInput.value.value = "") : void 0;
  searchStr.value = "";
};

/**
 * 页面初始化
 */
function initPage() {
  if (route.query.preview) {
    currentIndex.value = 0;
    pagePreviewList.value = [];
    pageSpace.value = PageSpaceType.PREVIEW;
    try {
      const id = parseInt(route.query.preview as string);
      previewSingle.value = false;
      getProjectInfo(id);
    } catch {}
    return;
  }
  pageSpace.value = PageSpaceType.LIST;
  handleRefresh();
}

/**
 * 监听路由变更，处理页面更新
 */
router.afterEach((to) => {
  if (to.path === PageEnum.WORKSPACE) {
    initPage();
  }
});

onMounted(() => {
  initPage();
  // 加载用户主题
  initThemeConfig();
  // 加载网站配置
  getConfigInfoApi({}).then((res) => {
    if (res?.data?.website_name) {
      useAppStore.setWebsiteName(res.data.website_name);
    }
  });
});
</script>

<style lang="scss" scoped>
.workspace-wrap {
  width: 100vw;
  height: 100vh;
  background-color: #e3e3e3;
  position: relative;
  overflow: hidden;

  .headers {
    height: var(--header-height);
    background-color: var(--theme-color);
  }
  .workspace-back {
    color: #fff;
    padding: 4px 6px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
    margin-right: 10px;
    position: absolute;
    left: 15px;
    top: 12px;
    z-index: 9999;
    font-size: 12px;
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    span {
      margin-right: 4px;
    }
  }
  .workspace-container {
    height: calc(100% - 48px);

    .thesis-nav {
      background-color: #fff;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      user-select: none;
      .thesis-tabs {
        display: grid;
        grid-template-columns: repeat(5, 90px);
        text-align: center;
        q-button {
          border: none;
        }
      }
      .search-wrap {
        height: 30px;
        display: flex;
        align-items: center;
        .import-btn,
        .refresh-btn {
          margin-right: 2em;
          input {
            display: none;
          }
          label {
            user-select: none;
            cursor: pointer;
            padding: 6px 10px;
            background-color: rgb(64, 158, 255);
            border-radius: 4px;
            color: #fff;
            font-size: 12px;
            &:hover {
              background-color: rgb(102, 177, 255);
            }
          }
        }
      }
    }
  }
}
</style>

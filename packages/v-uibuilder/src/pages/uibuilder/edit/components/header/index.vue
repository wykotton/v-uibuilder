<template>
  <header class="relative h-48px max-h-48px w-full">
    <q-page-header id="top-area" class="h-48px max-h-48px">
      <q-link slot="left" class="ml-48px mr-20px" @click="goToWorkspace">
        <div class="font-微软雅黑 font-bold text-24px text-white text-center w-full h-full">
          {{ useAppStore.websiteName || useAppStore.defaultWebsiteName }}
        </div>
      </q-link>

      <!-- 功能区 -->
      <q-popover trigger="click" slot="left" v-for="item in headerEdit" :key="item.key">
        <q-button
          :text="item.name"
          class="text-white text-xs"
          size="small"
          background="transparent"
          style="width: 80px !important"
        >
          <q-icon class="mr-6px" :name="item.leftIcon" slot="leftIcon" color="#ffffff"></q-icon>
          <q-icon class="ml-6px" :name="item.rightIcon" color="#ffffff"></q-icon>
        </q-button>
        <div slot="popover" tip="popover">
          <div
            v-for="subItem in item.dataList"
            :key="subItem.key"
            class="hover:bg-light-900 h-28px flex justify-around clear-both m-0 px-5px py-12px text-12px whitespace-normal cursor-pointer items-center"
            @click="handleClick(item.key, subItem)"
          >
            <q-icon :name="subItem.icon" class="pointer-events-none"></q-icon>
            <div
              class="relative ml-10px w-60px h-20px cursor-pointer text-12px inline-block leading-20px"
              :style="{
                border: backgroundEdit(subItem.key) === 'name' ? 'none' : '1px solid #e5e5e5',
                display: 'inline-block',
                backgroundColor: backgroundEdit(subItem.key),
              }"
            >
              {{ backgroundEdit(subItem.key) === "name" ? subItem.name : null }}
            </div>
          </div>
        </div>
      </q-popover>

      <a-modal
        v-model:visible="colorVisible"
        v-if="colorVisible"
        :title="colorTitle"
        :maskClosable="false"
        :maskStyle="{ backgroundColor: 'transparent' }"
        @ok="changeThemeColor"
      >
        <q-color-panel :value="colorValue" @change="colorPicker"></q-color-panel>
      </a-modal>

      <!-- 大小设置 -->
      <q-button
        text="大小设置"
        class="text-white text-xs"
        slot="left"
        size="small"
        background="transparent"
        @click="showSizeModal"
        style="width: 90px !important"
      >
        <q-icon class="mr-6px" name="orange" slot="leftIcon" color="#ffffff"></q-icon>
      </q-button>
      <a-modal
        v-model:visible="sizeVisible"
        v-if="sizeVisible"
        title="主画布大小"
        :maskClosable="false"
        :maskStyle="{ backgroundColor: 'transparent' }"
        @ok="changeCanvasSize"
      >
        <a-radio-group v-model:value="sizeType" button-style="solid">
          <a-radio-button value="select">选择大小</a-radio-button>
          <a-radio-button value="custom">自定义大小</a-radio-button>
        </a-radio-group>
        <div class="mt-20px">
          <div v-if="sizeType === 'select'" class="flex items-center">
            <span class="pr-4px">宽 x 高:</span>
            <a-select v-model:value="sizeSelect" style="width: 120px" @change="sizeSelectChange('select')">
              <a-select-option v-for="item in sizeList" :value="item">{{ item }}</a-select-option>
            </a-select>
          </div>
          <div v-else class="flex items-center">
            <span class="pr-4px">宽:</span>
            <a-input-number
              v-model:value="sizeWidth"
              :min="0"
              style="width: 120px"
              @change="sizeSelectChange('custom')"
            />
            <span class="pl-16px pr-4px">高:</span>
            <a-input-number
              v-model:value="sizeHeight"
              :min="0"
              style="width: 120px"
              @change="sizeSelectChange('custom')"
            />
          </div>
        </div>
      </a-modal>

      <!-- 子页面编辑状态 -->
      <div v-if="useAppStore.editType === EditTypeEnum.CHILD_PAGE" class="child-page" slot="center">
        <div class="edit-state">
          <div>项目子页面编辑中</div>
          <div class="info">( {{ useAppStore.childPageId }} )</div>
        </div>
        <div class="edit-close" @click="closeChildPage">退出编辑</div>
      </div>

      <!-- 顶部配置区开始 -->
      <q-button
        v-for="item in headerConfig"
        :key="item.key"
        :text="item.name"
        class="text-white w-60px text-center mr-6px text-xs"
        :style="{ width: item.name === '仓库配置' ? '70px !important' : '60px !important' }"
        slot="right"
        background="transparent"
        @click="headerConfigBtn(item)"
      ></q-button>
      <div class="ml-10px mr-20px" slot="right"><UserDropdown></UserDropdown></div>
      <!-- 顶部配置区结束 -->
    </q-page-header>
    <a-modal
      v-model:visible="warehouseModal"
      :closable="false"
      :maskClosable="false"
      :keyboard="false"
      title="选择禁用仓库"
      @ok="changeWarehouse"
    >
      <a-checkbox-group v-model:value="warehouseValue" :options="warehouseOptions" />
    </a-modal>
    <a-modal v-model:visible="projectModal" width="60%" title="打开页面" :footer="null">
      <a-spin :spinning="projectLoading">
        <div class="project-container">
          <div class="flex-1">
            <div class="title">项目列表</div>
            <a-radio-group v-model:value="projectChecked" @change="projectSelect">
              <a-radio-button v-for="item in projectList" :value="item.key" style="margin: 0 10px 10px 0">
                {{ item.title }}
              </a-radio-button>
            </a-radio-group>
          </div>
          <div class="pages-content">
            <a-spin :spinning="pagesLoading">
              <a-empty v-if="!pageList.length" description="暂无页面数据" />
              <div v-else>
                <div class="title pl-10px">页面列表</div>
                <div class="page-item" v-for="item in pageList" :key="item.key" :title="item.title">
                  <div class="item-title">{{ item.title }}</div>
                  <a-tooltip placement="top">
                    <template v-slot:title>跳转到此页面</template>
                    <link-outlined
                      :style="{ fontSize: '18px', color: '#409eff', cursor: 'pointer' }"
                      @click="openPage(item.key)"
                    />
                  </a-tooltip>
                </div>
              </div>
            </a-spin>
          </div>
        </div>
      </a-spin>
    </a-modal>
  </header>
</template>
<script setup lang="ts">
import { createVNode } from "vue";
import { QuestionCircleOutlined, LinkOutlined } from "@ant-design/icons-vue";
import { Modal, message } from "ant-design-vue";
import { useRouter, useRoute } from "vue-router";
import {
  savePage,
  useAlignmentEvents,
  useUndo,
  useRedo,
  handleCanvasBackground,
  changeMoveableAndGuides,
  resetLayout,
  resetThemeConfig,
  closeChildPage,
  useSaveChildPage,
} from "@/composition/index";
import { useAppStoreWithOut } from "@/store/modules/app";
import data from "@/assets/data.json";
import UserDropdown from "@/components/user-dropdown/index.vue";
import { IComponentWarehouse } from "@/types/IPageModel";
import { cloneDeep } from "lodash-es";
import { updateTheme } from "@/api/sys/user";
import { usePluginStoreWithOut } from "@/store/modules/plugin";
import { workspaceGetProjectApi, workspaceProjectsApi } from "@/api/uibuilder/workspace";
import { PageInfo, ProjectInfo } from "@/types/workspace";
import { PageEnum } from "@/enums/pageEnum";
import { EditTypeEnum } from "@/enums/appEnum";

// 路由对象
const router = useRouter();
const route = useRoute();

// pinia
const useAppStore = useAppStoreWithOut();
const usePluginStore = usePluginStoreWithOut();

// 头部工具栏
const headerEdit = reactive(data.headerEdit);
// 头部配置区
const headerConfig = reactive(data.headerConfig);

// 处理下拉菜单显示内容
const backgroundEdit = (key: string) => {
  switch (key) {
    case "1-1":
      return useAppStore.themeConfig.themeColors;
    case "1-2":
      return useAppStore.themeConfig.canvasColors;
    default:
      return "name";
  }
};

// color-Model
const colorVisible = ref(false);
const colorTitle = ref("");
const colorValue = ref("");
const colorPicker = (e: CustomEvent) => {
  colorValue.value = e.detail.value;
};

// 菜单项处理
const handleClick = (menuKey: string, item: any) => {
  switch (menuKey) {
    case "1":
      handleTheme(item);
      break;
    case "2":
      useAlignmentEvents(item);
      break;
    case "3":
      useTools(item);
      break;
    case "4":
      handleReset(item);
  }
};

/**
 * 主题菜单处理
 * @param key
 */
const handleTheme = (item: any) => {
  switch (item.key) {
    case "1-1":
      colorVisible.value = true;
      colorTitle.value = item.name;
      colorValue.value = useAppStore.themeConfig.themeColors;
      break;
    case "1-2":
      colorVisible.value = true;
      colorTitle.value = item.name;
      colorValue.value = useAppStore.themeConfig.canvasColors;
      break;
    case "1-3":
      break;
    case "1-4":
      useAppStore.setThemeConfig({ backgroundImage: "" });
      handleCanvasBackground();
      break;
    case "1-5":
      useAppStore.setThemeConfig({ isGrid: !useAppStore.themeConfig.isGrid });
      handleCanvasBackground();
      break;
  }
};

/**
 * 工具操作
 * @param item
 */
function useTools(item: any) {
  switch (item.key) {
    case "3-1":
      // 开启全屏
      usePluginStore.closeAllDrawer();
      useAppStore.setLayout({
        middleWidth: 100,
        rightWidth: 0,
        middleTopHeight: 100,
        middleBottomHeight: 0,
      });
      break;
  }
}

/**
 * 重置菜单处理
 * @param item
 */
const handleReset = (item: any) => {
  switch (item.key) {
    case "4-1":
      resetLayout();
      break;
    case "4-2":
      resetThemeConfig();
      break;
    case "4-3":
      useUndo();
      break;
    case "4-4":
      useRedo();
      break;
  }
};

/**
 * 打开|配置|保存|发布
 * @param item
 */
const headerConfigBtn = (item: any) => {
  switch (item.key) {
    case 1:
      // 打开
      getProjectList();
      break;
    case 2:
      // 仓库设置
      showSettingModal();
      break;
    case 3:
      // 保存
      useAppStore.editType === EditTypeEnum.PAGE ? savePage(Number(route.query.id)) : useSaveChildPage();
      break;
    case 4:
      // 发布
      release();
      break;
  }
};

/**
 * 发布操作
 */
const release = () => {
  if (useAppStore.editType !== EditTypeEnum.PAGE) return;
  Modal.confirm({
    title: "发布应用",
    icon: createVNode(QuestionCircleOutlined),
    content: "确定要发布当前页面吗？",
    okText: "确认",
    cancelText: "取消",
    onOk: () => {
      if (useAppStore.pageModel.pageModel.componentsArray.length > 0) {
        const id = Number(route.query.id);
        const results = savePage(id, true);
        results?.then(() => {
          const routerUrl = router.resolve({
            path: `/uibuilder/publish/${id}`,
            query: { id: id, url: route.query.url },
          });
          window.open(routerUrl.href);
        });
      } else {
        message.warning("无法发布空页面!");
      }
    },
  });
};

/**
 * 选择性加载仓库
 */
const warehouseModal = ref(false);
const warehouseValue = ref<string[]>([]);
const warehouseOptions = ref<{ value: string }[]>([]);
function showSettingModal() {
  if (useAppStore.editType !== EditTypeEnum.PAGE) {
    message.destroy();
    message.info("当前正在编辑子页面, 仓库配置已禁用!");
    return;
  }
  warehouseOptions.value = useAppStore.getComponentWarehouse?.map(({ name }: IComponentWarehouse) => name);
  warehouseValue.value = cloneDeep(useAppStore.disableWarehouse);
  warehouseModal.value = true;
}
function changeWarehouse() {
  if (warehouseValue.value.length === warehouseOptions.value.length) {
    message.destroy();
    message.warning("不可禁用掉所有仓库！");
    return;
  }
  useAppStore.setDisableWarehouse(cloneDeep(warehouseValue.value));
  warehouseModal.value = false;
  savePage(Number(route.query.id), true);
}

/**
 * 切换主题颜色
 */
function changeThemeColor() {
  switch (colorTitle.value) {
    case "主题色":
      useAppStore.setThemeConfig({ themeColors: colorValue.value });
      updateTheme({ theme: useAppStore.themeConfig }).then((res) => {
        const {
          info: { msg = "" },
        } = res.data;
        if (msg !== "success") {
          message.destroy();
          message.error("主题变更失败!");
          return;
        }
        document.documentElement.style.setProperty("--theme-color", colorValue.value);
        colorVisible.value = false;
      });
      break;
    case "背景色":
      useAppStore.setThemeConfig({ canvasColors: colorValue.value });
      updateTheme({ theme: useAppStore.themeConfig }).then((res) => {
        const {
          info: { msg = "" },
        } = res.data;
        if (msg !== "success") {
          message.destroy();
          message.error("主题变更失败!");
          return;
        }
        document.documentElement.style.setProperty("--canvas-color", colorValue.value);
        colorVisible.value = false;
      });
      break;
  }
}

/**
 * 画布大小设置
 */
const sizeVisible = ref(false);
const sizeList = [
  "800x600",
  "1024x768",
  "1152x864",
  "1280x600",
  "1280x720",
  "1280x768",
  "1280x800",
  "1280x960",
  "1280x1024",
  "1360x768",
  "1366x768",
  "1400x1050",
  "1440x900",
  "1600x900",
  "1680x1050",
  "1920x1080",
  "1920x1200",
  "2560x1440",
];
const sizeType = ref("select");
const sizeSelect = ref("");
const sizeWidth = ref<number>();
const sizeHeight = ref<number>();
function showSizeModal() {
  if (useAppStore.editType !== EditTypeEnum.PAGE) {
    message.destroy();
    message.info("当前正在编辑子页面, 大小设置已禁用!");
    return;
  }
  sizeWidth.value = cloneDeep(useAppStore.canvasStyleData.width);
  sizeHeight.value = cloneDeep(useAppStore.canvasStyleData.height);
  sizeSelect.value = `${sizeWidth.value}x${sizeHeight.value}`;
  sizeVisible.value = true;
}
function sizeSelectChange(type: string) {
  switch (type) {
    case "select":
      const sizeArr = sizeSelect.value.split("x");
      sizeWidth.value = Number(sizeArr[0]);
      sizeHeight.value = Number(sizeArr[1]);
      break;
    case "custom":
      sizeSelect.value = `${sizeWidth.value}x${sizeHeight.value}`;
      break;
  }
}
function changeCanvasSize() {
  if (!sizeWidth.value || !sizeHeight.value) {
    message.destroy();
    message.warning("请选择或设置画布大小!");
    return;
  }
  useAppStore.setCanvasStyle({ width: sizeWidth.value, height: sizeHeight.value });
  savePage(Number(route.query.id), true);
  changeMoveableAndGuides();
  sizeVisible.value = false;
}

/**
 * 显示所有项目信息
 */
const projectModal = ref(false);
const projectLoading = ref(false);
const pagesLoading = ref(false);
const projectList = ref<{ key: string; title: string }[]>([]);
const pageList = ref<{ key: string; title: string }[]>([]);
const projectChecked = ref("");
function getProjectList() {
  projectModal.value = true;
  projectLoading.value = true;
  workspaceProjectsApi({
    getAll: true,
  })
    .then((res) => {
      const {
        info: { msg = "" },
        results,
      } = res.data;
      if (msg !== "success") {
        message.destroy();
        message.error("项目信息获取失败!");
        return;
      }
      projectList.value = results.map((item: ProjectInfo) => {
        return { key: item.id, title: `${item.project_name}(ID: ${item.id})` };
      });
    })
    .finally(() => {
      projectLoading.value = false;
    });
}

/**
 * 切换项目，加载页面列表
 */
function projectSelect() {
  if (!projectChecked.value) return;
  pagesLoading.value = true;
  workspaceGetProjectApi(Number(projectChecked.value))
    .then((res) => {
      const {
        info: { msg = "" },
        results,
      } = res.data;
      if (msg !== "success") {
        message.destroy();
        message.error("项目信息获取失败!");
        return;
      }
      pageList.value = results[0].pageList.map((item: PageInfo) => {
        return { key: item.id, title: `${item.page_name}(ID: ${item.id})` };
      });
    })
    .finally(() => {
      pagesLoading.value = false;
    });
}

/**
 * 跳转到所选页面
 * @param id
 */
function openPage(id: string) {
  if (String(route.query.id) === String(id)) {
    message.destroy();
    message.warning("已在当前页面, 无需重复跳转!");
    return;
  }
  router.push(`${PageEnum.EDIT}?id=${id}`);
}

const goToWorkspace = () => {
  router.push("/uibuilder/workspace");
};
</script>
<style scoped lang="scss">
q-button {
  background-color: var(--theme-color) !important;
}

.child-page {
  border-radius: 8px;
  font-size: 14px;
  border: 1px solid #2e74ff;
  color: #fff;
  background-color: #081126;
  display: flex;
  align-items: center;
  padding: 6px 10px;
  user-select: none;

  .edit-state {
    display: flex;
    align-items: center;
    white-space: nowrap;

    .info {
      font-size: 12px;
      color: rgb(209, 209, 209);
    }
  }

  .edit-close {
    width: 90px;
    height: 24px;
    line-height: 22px;
    border-radius: 12px;
    margin-left: 10px;
    text-align: center;
    box-sizing: border-box;
    border: 1px solid #2e74ff;
    cursor: pointer;

    &:hover {
      background-color: #2e74ff;
    }
  }
}

.project-container {
  display: flex;

  .title {
    font-size: 14px;
    margin-bottom: 10px;
    color: #409eff;
  }

  .pages-content {
    width: 300px;
    border-left-width: 2px;

    .page-item {
      width: 100%;
      padding: 6px 10px;
      display: flex;
      align-items: center;

      &:hover {
        background-color: #e6f7ff;
      }

      .item-title {
        flex: 1;
        padding-right: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>

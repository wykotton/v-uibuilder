<template>
  <div class="left-menu-container" oncontextmenu="return false">
    <div class="p-13px w-46px h-46px" @click="showDrawerMenu(pluginsDrawerEnum.COM_MENU)">
      <a-tooltip placement="right">
        <template v-slot:title>
          <span>元件库</span>
        </template>
        <div>
          <svg class="icon text-20px cursor-pointer" aria-hidden="true">
            <use
              xlink:href="#icon-zujian"
              :style="{ color: usePluginStore.comMenu.visible ? '#66A6EC' : '#595959' }"
            ></use>
          </svg>
        </div>
      </a-tooltip>
    </div>
    <div class="p-13px w-46px h-46px" @click="showDrawerMenu(pluginsDrawerEnum.PAGE_LIBRARY)">
      <a-tooltip placement="right">
        <template v-slot:title>
          <span>页面库</span>
        </template>
        <div>
          <svg class="icon text-20px cursor-pointer" aria-hidden="true">
            <use
              xlink:href="#icon-yemian"
              :style="{ color: usePluginStore.pageLibrary.visible ? '#66A6EC' : '#595959' }"
            ></use>
          </svg>
        </div>
      </a-tooltip>
    </div>
    <div class="p-13px w-46px h-46px" @click="showDrawerMenu(pluginsDrawerEnum.PROJECT_PAGE)">
      <a-tooltip placement="right">
        <template v-slot:title>
          <span>项目页面</span>
        </template>
        <div>
          <svg class="icon text-20px cursor-pointer" aria-hidden="true">
            <use
              xlink:href="#icon-mubiaoyemianliebiao"
              :style="{ color: usePluginStore.projectPage.visible ? '#66A6EC' : '#595959' }"
            ></use>
          </svg>
        </div>
      </a-tooltip>
    </div>
    <div class="p-13px w-46px h-46px" @click="showDrawerMenu(pluginsDrawerEnum.CHILD_PAGE)">
      <a-tooltip placement="right">
        <template v-slot:title>
          <span>项目子页面</span>
        </template>
        <div>
          <svg class="icon text-20px cursor-pointer" aria-hidden="true">
            <use
              xlink:href="#icon-ziyemian"
              :style="{ color: usePluginStore.childPage.visible ? '#66A6EC' : '#595959' }"
            ></use>
          </svg>
        </div>
      </a-tooltip>
    </div>
    <div class="p-13px w-46px h-46px mt-auto">
      <a-tooltip placement="right">
        <template v-slot:title>
          <span>快捷键</span>
        </template>
        <div>
          <svg class="icon text-20px cursor-pointer" aria-hidden="true" @click="hotKeyBtn">
            <use xlink:href="#icon-kuaijiejian"></use>
          </svg>
        </div>
      </a-tooltip>
    </div>
    <a-modal
      class="modal-box shortcut-key-modal"
      title="UIBuilder快捷键"
      v-if="shortcutKeyVisible"
      v-model:visible="shortcutKeyVisible"
      :footer="false"
      width="30%"
      :z-index="9999"
    >
      <div v-for="(item, index) in shortcutKeyArr" :key="index" class="shortcut-key">
        <div class="shortcut-key-text">{{ item.keys }}</div>
        <div style="margin-left: auto; font-weight: 600">{{ item.title }}</div>
      </div>
    </a-modal>
    <div class="p-13px w-46px h-46px" @click="helpDocBtn">
      <a-tooltip placement="right">
        <template v-slot:title>
          <span>帮助文档</span>
        </template>
        <div>
          <svg class="icon text-20px cursor-pointer" aria-hidden="true">
            <use xlink:href="#icon-bangzhu"></use>
          </svg>
        </div>
      </a-tooltip>
    </div>
    <a-modal
      class="help-doc-modal"
      title="帮助文档"
      v-if="usePluginStore.helpDoc.visible"
      v-model:visible="usePluginStore.helpDoc.visible"
      :footer="false"
      width="80%"
      height="80%"
      :z-index="9999"
    >
      <iframe class="help-doc-iframe !h-80vh" :src="usePluginStore.helpDoc.url"></iframe>
    </a-modal>
    <div class="p-13px w-46px h-46px" @click="showDrawerMenu(pluginsDrawerEnum.SCHEMA_JSON)">
      <a-tooltip placement="right">
        <template v-slot:title>
          <span>页面Schema JSON</span>
        </template>
        <div>
          <svg class="icon text-20px cursor-pointer" aria-hidden="true">
            <use
              xlink:href="#icon-json"
              :style="{ color: usePluginStore.schemaJson.visible ? '#66A6EC' : '#595959' }"
            ></use>
          </svg>
        </div>
      </a-tooltip>
    </div>
  </div>
  <div id="drawer-container" class="w-0 h-full top-0 left-46px absolute"></div>
  <div class="left-menu-line"></div>
  <a-drawer
    :placement="'left'"
    :closable="false"
    :mask="false"
    :width="348"
    :visible="usePluginStore.comMenu.visible"
    :get-Container="'#drawer-container'"
    :style="{ position: 'absolute', left: usePluginStore.comMenu.visible ? '2px' : '0px' }"
    :z-index="997"
  >
    <template v-slot:title>
      <div class="flex items-center">
        <div>元件库</div>
        <svg
          class="icon ml-auto mr-20px cursor-pointer"
          aria-hidden="true"
          @click="usePluginStore.setDrawerFixed(pluginsDrawerEnum.COM_MENU, !usePluginStore.comMenu.fixed)"
        >
          <use
            :xlink:href="usePluginStore.comMenu.fixed ? '#icon-fix-full' : '#icon-fix'"
            :style="{ color: usePluginStore.comMenu.fixed ? '#66A6EC' : '#595959' }"
          ></use>
        </svg>
        <CloseOutlined class="cursor-pointer" @click="usePluginStore.closeAllDrawer" />
      </div>
    </template>
    <div class="com-menu-container" v-cloak>
      <CompProtocol ref="compProtocol"></CompProtocol>
    </div>
  </a-drawer>
  <a-drawer
    :placement="'left'"
    :closable="false"
    :mask="false"
    :visible="usePluginStore.pageLibrary.visible"
    :get-Container="'#drawer-container'"
    :style="{ position: 'absolute', left: usePluginStore.pageLibrary.visible ? '2px' : '0px' }"
    :width="348"
    :z-index="997"
  >
    <template v-slot:title>
      <div class="flex items-center">
        <div>页面库</div>
        <svg
          class="icon ml-auto mr-20px cursor-pointer"
          aria-hidden="true"
          @click="usePluginStore.setDrawerFixed(pluginsDrawerEnum.PAGE_LIBRARY, !usePluginStore.pageLibrary.fixed)"
        >
          <use
            :xlink:href="usePluginStore.pageLibrary.fixed ? '#icon-fix-full' : '#icon-fix'"
            :style="{ color: usePluginStore.pageLibrary.fixed ? '#66A6EC' : '#595959' }"
          ></use>
        </svg>
        <CloseOutlined class="cursor-pointer" @click="usePluginStore.closeAllDrawer" />
      </div>
    </template>
    <PageWarehouse ref="pageWarehouse"></PageWarehouse>
  </a-drawer>
  <a-drawer
    class="com-menu-schema"
    :placement="'left'"
    :closable="true"
    :mask="false"
    :visible="usePluginStore.schemaJson.visible"
    :destroy-on-close="true"
    :get-Container="'#drawer-container'"
    :style="{ position: 'absolute', left: usePluginStore.schemaJson.visible ? '2px' : '0px' }"
    @close="usePluginStore.closeAllDrawer"
    :width="schemaDrawerWidth"
    :z-index="997"
  >
    <template #title>
      <div style="display: flex; align-items: center">
        <div>页面Schema JSON</div>
        <!-- <a-button style="margin-left: auto; margin-right: 20px" @click="updateSchema">保存Schema</a-button> -->
      </div>
    </template>
    <q-code-editor
      ref="codeEditor"
      :value="pageSchemaJson"
      language="json"
      style="width: 100%; height: 100%; padding: 24px; display: block"
    ></q-code-editor>
  </a-drawer>
  <a-drawer
    :placement="'left'"
    :closable="false"
    :mask="false"
    :width="348"
    :visible="usePluginStore.projectPage.visible"
    :get-Container="'#drawer-container'"
    :style="{ position: 'absolute', left: usePluginStore.projectPage.visible ? '2px' : '0px' }"
    :z-index="997"
  >
    <template v-slot:title>
      <div class="flex items-center">
        <div>项目页面</div>
        <svg
          class="icon ml-auto mr-20px cursor-pointer"
          aria-hidden="true"
          @click="usePluginStore.setDrawerFixed(pluginsDrawerEnum.PROJECT_PAGE, !usePluginStore.projectPage.fixed)"
        >
          <use
            :xlink:href="usePluginStore.projectPage.fixed ? '#icon-fix-full' : '#icon-fix'"
            :style="{ color: usePluginStore.projectPage.fixed ? '#66A6EC' : '#595959' }"
          ></use>
        </svg>
        <CloseOutlined class="cursor-pointer" @click="usePluginStore.closeAllDrawer" />
      </div>
    </template>
    <ProjectPage></ProjectPage>
  </a-drawer>
  <a-drawer
    :placement="'left'"
    :closable="false"
    :mask="false"
    :width="348"
    :visible="usePluginStore.childPage.visible"
    :get-Container="'#drawer-container'"
    :style="{ position: 'absolute', left: usePluginStore.childPage.visible ? '2px' : '0px' }"
    :z-index="997"
  >
    <template v-slot:title>
      <div class="flex items-center">
        <div>项目子页面</div>
        <svg
          class="icon ml-auto mr-20px cursor-pointer"
          aria-hidden="true"
          @click="usePluginStore.setDrawerFixed(pluginsDrawerEnum.CHILD_PAGE, !usePluginStore.childPage.fixed)"
        >
          <use
            :xlink:href="usePluginStore.childPage.fixed ? '#icon-fix-full' : '#icon-fix'"
            :style="{ color: usePluginStore.childPage.fixed ? '#66A6EC' : '#595959' }"
          ></use>
        </svg>
        <CloseOutlined class="cursor-pointer" @click="usePluginStore.closeAllDrawer" />
      </div>
    </template>
    <ChildPage></ChildPage>
  </a-drawer>
</template>
<script setup lang="ts">
import { CloseOutlined } from "@ant-design/icons-vue";
import { usePluginStoreWithOut } from "@/store/modules/plugin";
import { message } from "ant-design-vue";
import { useAppStoreWithOut } from "@/store/modules/app";
import { stringifyDeep } from "@/utils";
import { drawerList, pluginsDrawerEnum, warehouseEnum } from "@/enums/pluginEnum";
import { getAppEnvConfig } from "@/utils/env";
import CompProtocol from "./components/comp-protocol.vue";
import PageWarehouse from "./components/page-warehouse.vue";
import ChildPage from "./components/child-page.vue";
import ProjectPage from "./components/project-page.vue";

// pinia
const usePluginStore = usePluginStoreWithOut();
const useAppStore = useAppStoreWithOut();

const { VITE_GLOB_DOCS_ADDRESS = "" } = getAppEnvConfig();

const shortcutKeyVisible = ref(false);
const codeEditor = ref(null);
const state = reactive({
  shortcutKeyArr: [
    { title: "删除选中组件", keys: "Delete" },
    { title: "多选组件", keys: "Ctrl+鼠标左键点击组件" },
    { title: "框选组件", keys: "shift+鼠标左键拖动画布" },
    { title: "组件移动", keys: "键盘方向键 ↑ → ↓ ←" },
    { title: "缩放画布", keys: "Ctrl+鼠标滚轮" },
    { title: "重置画布缩放", keys: "Ctrl+0" },
    { title: "画布拖拽", keys: "Space+鼠标左键拖动画布" },
  ],
  pageSchemaJson: "",
});
const { shortcutKeyArr, pageSchemaJson } = toRefs(state);
const schemaDrawerWidth = ref(500);

onBeforeUnmount(() => {
  // 重置所有drawer的数据
  drawerList.forEach((item) => {
    usePluginStore.setDrawerVisible(item, false);
  });
});

/**
 * 刷新仓库
 */
const compProtocol = ref();
const pageWarehouse = ref();
function refreshWarehouse(type: string) {
  switch (type) {
    case warehouseEnum.COMPONENT:
      compProtocol.value?.useGetComponent?.();
      break;
    case warehouseEnum.PAGE:
      pageWarehouse.value?.getPageWarehouseList?.();
      break;
  }
}
defineExpose({
  refreshWarehouse,
});

/**
 * 键盘快捷键
 */
const hotKeyBtn = () => {
  shortcutKeyVisible.value = true;
};

/**
 * 文档快捷键
 */
const helpDocBtn = () => {
  usePluginStore.setDocVisible(true);

  if (useAppStore.pageModel?.currentComponent && useAppStore.pageModel?.selectedComponents.length === 1) {
    usePluginStore.setDocUrl(
      `${VITE_GLOB_DOCS_ADDRESS}/component/${useAppStore.pageModel?.currentComponent.iovSchema.componentName}.html`
    );
    return;
  }

  usePluginStore.setDocUrl(VITE_GLOB_DOCS_ADDRESS);
};

/**
 * 展示页面schema
 */
const showJsonSchema = async () => {
  if (useAppStore.pageModel.pageModel.componentsArray.length > 0) {
    schemaDrawerWidth.value = document.body.clientWidth - 51;
    usePluginStore.setDrawerVisible("schemaJson", true);
    const componentsArray = useAppStore?.pageModel?.pageModel?.componentsArray
      ? useAppStore.pageModel.pageModel.componentsArray
      : [];
    pageSchemaJson.value = stringifyDeep(componentsArray);
    nextTick(() => {
      const editorFommat = (codeEditor?.value as any)?.editorFommat;
      if (editorFommat) {
        editorFommat();
      }
    });
  } else {
    message.warning("页面暂无Schema JSON数据!");
  }
};

/**
 * 打开插件区抽屉
 * @param key
 */
const showDrawerMenu = (key: string) => {
  if (!usePluginStore?.[key]) return;
  if (usePluginStore[key].visible) {
    usePluginStore.setDrawerVisible(key, false);
  } else {
    usePluginStore.closeAllDrawer();
    if (key === pluginsDrawerEnum.SCHEMA_JSON) {
      showJsonSchema();
    } else {
      usePluginStore.setDrawerVisible(key, true);
    }
  }
};
</script>
<style lang="scss">
.left-menu-container {
  width: 46px;
  height: 100%;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  z-index: 998;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

#drawer-container {
  ::v-deep(.ant-drawer-body) {
    height: calc(100% - 55px);
    // padding: 0;

    /**自定义滚动条样式 */
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
      -webkit-border-radius: 2em;
      -moz-border-radius: 2em;
      border-radius: 2em;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #9c9da0;
      -webkit-border-radius: 2em;
      -moz-border-radius: 2em;
      border-radius: 2em;
    }
  }
}

.left-menu-line {
  flex: 1;
  height: 100%;
  background-color: #e3e7ed;
}

section {
  width: 100%;
  height: 960px;
  overflow: hidden;

  .siderbar {
    height: 100%;
  }
}

.shortcut-key {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.shortcut-key .shortcut-key-text {
  color: #fff;
  border-radius: 6px;
  padding: 4px 10px;
  font-weight: 600;
  font-style: italic;
  background-color: rgba(102, 166, 236, 1);
}

.shortcut-key-modal .ant-modal {
  padding-bottom: 0 !important;
}

.shortcut-key-modal .ant-modal-body {
  height: calc(100% - 55px) !important;
}

.com-menu-schema .ant-drawer-header {
  padding: 11px 24px !important;
}

.help-doc-modal {
  .ant-modal-body {
    padding: 0 !important;
  }
}

.help-doc-iframe {
  width: 100%;
  height: 600px;
}
</style>

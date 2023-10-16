<template>
  <div id="right-menucontent">
    <a-collapse v-model="activeKey" expand-icon-position="right" :bordered="false">
      <a-collapse-panel key="0" :force-render="true">
        <template v-slot:header>
          <div class="right-panel-title">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shezhi"></use>
            </svg>
            <a-tooltip placement="left" slot="extra">
              <template v-slot:title>
                <span>组件操作区,支持对齐和删除组件</span>
              </template>
              <span>页面设置</span>
            </a-tooltip>
          </div>
        </template>
        <page-setting />
      </a-collapse-panel>
      <a-collapse-panel key="1" :force-render="true">
        <template v-slot:header>
          <div class="right-panel-title">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-caozuo"></use>
            </svg>
            <a-tooltip placement="left" slot="extra">
              <template v-slot:title>
                <span>组件操作区,支持对齐和删除组件</span>
              </template>
              <span>操作</span>
            </a-tooltip>
          </div>
        </template>
        <Operation />
      </a-collapse-panel>
      <a-collapse-panel key="2" :force-render="true">
        <template v-slot:header>
          <div class="right-panel-title">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shuxing"></use>
            </svg>
            <a-tooltip placement="left" slot="extra">
              <template v-slot:title>
                <span>组件属性配置区,可对组件属性进行配置</span>
              </template>
              <span>属性</span>
            </a-tooltip>
          </div>
        </template>
        <attribute-setter />
      </a-collapse-panel>
      <a-collapse-panel key="3" :force-render="true" collapsible="false">
        <template v-slot:header>
          <div class="right-panel-title">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-tuceng"></use>
            </svg>
            <a-tooltip placement="left" slot="extra">
              <template v-slot:title>
                <span>样式面板区,可对组件样式进行修改和设置</span>
              </template>
              <span>样式</span>
            </a-tooltip>
          </div>
        </template>
        <style-setter />
      </a-collapse-panel>
      <a-collapse-panel key="4" :force-render="true" collapsible="false">
        <template v-slot:header>
          <div class="right-panel-title">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-tuceng"></use>
            </svg>
            <a-tooltip placement="left" slot="extra">
              <template v-slot:title>
                <span>图层面板区,可对不同图层的组件进行定位操作</span>
              </template>
              <span>图层面板</span>
            </a-tooltip>
          </div>
        </template>

        <div id="zIndexPanel">
          <div class="layui-row" v-show="useSettingStore.treeData.length == 0 || !displayTree">
            <div class="layui-col-md12 p-20px">
              <a-empty description="暂无数据" />
            </div>
          </div>
          <DragLayer to="body" :disabled="displayTree" @close="closeDragLayer" title="图层面板">
            <div v-show="useSettingStore.treeData.length > 0">
              <ProjectTree>
                <div class="flex items-center">
                  <!-- <MoreOutlined @click="displayTree = !displayTree"></MoreOutlined> -->
                  <a-input-search
                    v-model:value="treeSearchValue"
                    placeholder="请输入查询内容"
                    style="width: 100%; margin-bottom: 10px"
                  />
                </div>
                <div
                  v-show="useSettingStore.nameBreadcrumb.length > 1 && useSettingStore.showNameBreadcrumb"
                  class="mb-10px"
                >
                  <a-breadcrumb separator=">" @click="breadcrumbClick">
                    <a-breadcrumb-item
                      v-for="item in useSettingStore.nameBreadcrumb"
                      :key="item.id"
                      :componentId="item.id"
                      href=""
                    >
                      {{ item.name }}
                    </a-breadcrumb-item>
                  </a-breadcrumb>
                </div>
                <div
                  v-show="useSettingStore.aliasNameBreadcrumb.length > 1 && useSettingStore.showAliasNameBreadcrumb"
                  class="mb-10px"
                >
                  <a-breadcrumb separator=">" @click="breadcrumbClick">
                    <a-breadcrumb-item
                      v-for="item in useSettingStore.aliasNameBreadcrumb"
                      :key="item.id"
                      :componentId="item.id"
                      href=""
                    >
                      {{ item.name }}
                    </a-breadcrumb-item>
                  </a-breadcrumb>
                </div>
                <modal-tree
                  :modalLayers="modalLayers"
                  :useSettingStore="useSettingStore"
                  :useAppStore="useAppStore"
                  :displayTree="displayTree"
                >
                  <template #child="{ item }">
                    <a-tree
                      v-model:checkedKeys="useSettingStore.checkedKeys"
                      :selected-keys="useSettingStore.selectedKeys"
                      :expanded-keys="useSettingStore.expandedKeys"
                      checkable
                      :multiple="useAppStore.isCtrlKey || useSettingStore.selectedKeys.length > 1"
                      :tree-data="item.children"
                      :check-strictly="true"
                      :show-icon="false"
                      :auto-expand-parent="useSettingStore.autoExpandParent"
                      @expand="onExpand"
                      @select="onSelect"
                      @check="onCheckBox"
                    >
                      <template #title="{ key, title }">
                        <a-dropdown :trigger="['contextmenu']" :overlayStyle="{ zIndex: !displayTree ? '10000' : '' }">
                          <span
                            v-if="title.toLowerCase().indexOf(treeSearchValue.toLowerCase()) > -1"
                            :id="`${key}_tree`"
                            @mouseenter="focusSelectCom(key)"
                            @mouseleave="blurSelectCom"
                            @dblclick="autoScrollCanvas(AutoScrollEnum.COMPONENT)"
                          >
                            {{ title.substr(0, title.toLowerCase().indexOf(treeSearchValue.toLowerCase())) }}
                            <span style="color: #f50">{{ treeSearchValue }}</span>
                            {{
                              title.substr(
                                title.toLowerCase().indexOf(treeSearchValue.toLowerCase()) + treeSearchValue.length
                              )
                            }}
                          </span>
                          <span
                            v-else
                            :id="`${key}_tree`"
                            @mouseenter="focusSelectCom(key)"
                            @mouseleave="blurSelectCom"
                            @dblclick="autoScrollCanvas(AutoScrollEnum.COMPONENT)"
                          >
                            {{ title }}
                          </span>
                          <template #overlay>
                            <a-menu @click="(e:any) => onContextMenuClick(key, title, e)">
                              <a-menu-item key="rename">设置别名</a-menu-item>
                              <a-menu-item key="copy">复制别名</a-menu-item>
                            </a-menu>
                          </template>
                        </a-dropdown>
                      </template>
                    </a-tree>
                  </template>
                </modal-tree>
                <a-tree
                  v-model:checkedKeys="useSettingStore.checkedKeys"
                  :selected-keys="useSettingStore.selectedKeys"
                  :expanded-keys="useSettingStore.expandedKeys"
                  checkable
                  :multiple="useAppStore.isCtrlKey || useSettingStore.selectedKeys.length > 1"
                  :tree-data="generalLayers"
                  :check-strictly="true"
                  :show-icon="false"
                  :auto-expand-parent="useSettingStore.autoExpandParent"
                  @expand="onExpand"
                  @select="onSelect"
                  @check="onCheckBox"
                >
                  <template #title="{ key, title }">
                    <a-dropdown :trigger="['contextmenu']" :overlayStyle="{ zIndex: !displayTree ? '10000' : '' }">
                      <span
                        v-if="title.toLowerCase().indexOf(treeSearchValue.toLowerCase()) > -1"
                        :id="`${key}_tree`"
                        @mouseenter="focusSelectCom(key)"
                        @mouseleave="blurSelectCom"
                        @dblclick="autoScrollCanvas(AutoScrollEnum.COMPONENT)"
                      >
                        {{ title.substr(0, title.toLowerCase().indexOf(treeSearchValue.toLowerCase())) }}
                        <span style="color: #f50">{{ treeSearchValue }}</span>
                        {{
                          title.substr(
                            title.toLowerCase().indexOf(treeSearchValue.toLowerCase()) + treeSearchValue.length
                          )
                        }}
                      </span>
                      <span
                        v-else
                        :id="`${key}_tree`"
                        @mouseenter="focusSelectCom(key)"
                        @mouseleave="blurSelectCom"
                        @dblclick="autoScrollCanvas(AutoScrollEnum.COMPONENT)"
                      >
                        {{ title }}
                      </span>
                      <template #overlay>
                        <a-menu @click="(e:any) => onContextMenuClick(key, title, e)">
                          <a-menu-item key="rename">设置别名</a-menu-item>
                          <a-menu-item key="copy">复制别名</a-menu-item>
                        </a-menu>
                      </template>
                    </a-dropdown>
                  </template>
                </a-tree>
              </ProjectTree>
            </div>
          </DragLayer>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="5" :force-render="true" collapsible="false">
        <template v-slot:header>
          <div class="right-panel-title">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zongxianshurushuchumianban"></use>
            </svg>
            <a-tooltip placement="left" slot="extra">
              <template v-slot:title>
                <span>事件面板给相应组件添加事件</span>
              </template>
              <span>事件面板</span>
            </a-tooltip>
          </div>
        </template>
        <div class="layui-row w-full" v-show="useSettingStore.selectedKeys.length !== 1">
          <div class="layui-col-md12 p-20px">
            <a-empty description="暂无数据" />
          </div>
        </div>
        <q-event-setting
          v-show="useSettingStore.selectedKeys.length === 1"
          ref="eventSetter"
          class="w-full"
          v-on:change="eventChange"
        ></q-event-setting>
      </a-collapse-panel>
      <a-collapse-panel
        v-for="(item, index) in customPlugins.plugins"
        :key="`custom_${index}`"
        :force-render="true"
        collapsible="false"
      >
        <template v-slot:header>
          <div class="right-panel-title">
            <span v-if="item.props?.icon" v-html="item.props.icon"></span>
            <svg v-else class="icon" aria-hidden="true">
              <use xlink:href="#icon-icon-mianxing_fuzhi_kuozhan"></use>
            </svg>
            <a-tooltip placement="left" slot="extra">
              <template v-slot:title>
                <span>{{ item.props?.description || "自定义扩展" }}</span>
              </template>
              <span>{{ item.props?.title || "自定义扩展" }}</span>
            </a-tooltip>
          </div>
        </template>
        <span v-html="item.pluginHTML"></span>
      </a-collapse-panel>
    </a-collapse>
  </div>
  <a-modal
    v-model:visible="renameVisible"
    v-if="renameVisible"
    :maskClosable="false"
    :closable="false"
    title="设置别名"
    @ok="handleRename"
  >
    <a-input v-model:value="componentAliasName" placeholder="请输入元件别名" />
  </a-modal>
</template>
<script setup lang="ts">
import {
  blurSelectCom,
  focusSelectCom,
  getTrees,
  onCheckBox,
  onClickComponent,
  ondblclickComponent,
  onExpand,
  onSelect,
  breadcrumbClick,
  changeCheckedAndExpanded,
  autoScrollCanvas,
} from "@/composition/index";
import { useAppStoreWithOut } from "@/store/modules/app";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import { MoveableExample } from "@/utils/moveable/example";
import { SelectoExample } from "@/utils/selecto/example";
import { isStringNormal } from "@/utils/utils";
import { useClipboard } from "@vueuse/core";
import { message } from "ant-design-vue";
import { CanvasIdEnum, AutoScrollEnum } from "@/enums/appEnum";
import { cloneDeep } from "lodash-es";
import Operation from "./components/operation.vue";
import DragLayer from "@/components/drag-layer/index.vue";
import ProjectTree from "./project-tree/index.vue";
import PageSetting from "./module/pageSetting.vue";
import ModalTree from "./project-tree/modal-tree.vue";
import AttributeSetter from "./components/attribute-setter.vue";
import StyleSetter from "./components/style-setter.vue";
import $ from "jquery";

const props = defineProps<{
  innerDropzone: any;
  bottomDropzone: any;
}>();

// pinia
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();

// 设置区
const activeKey = ref([]);
const displayTree = ref(true);
const { copy } = useClipboard({ legacy: true });

provide("displayTree", displayTree);

/**
 * 事件设置器
 */
const eventSetter = ref<unknown>(null);
watch([eventSetter], (newValue) => {
  useSettingStore.setEventSetter(newValue[0]);
});
/**
 * 事件设置器change事件
 */
const eventChange = (e: CustomEvent) => {
  if (useAppStore.pageModel?.selectedComponents.length !== 1) return;
  const component = document.querySelector(`#${useAppStore.pageModel?.currentComponent.id}`);
  if ((component as any)?.componentModel) {
    useSettingStore.setSetterChange(true);
    (component as any).componentModel.updateModelEntity(JSON.stringify(e.detail.value));
  }
};

/**
 * 监听画布，添加画布事件
 */
const { innerDropzone, bottomDropzone } = toRefs(props);
watch([innerDropzone, bottomDropzone], () => {
  if (!innerDropzone.value || !bottomDropzone.value) return;
  // 创建moveable
  const moveableExample = new MoveableExample();
  useSettingStore.setMoveableExample(Object.preventExtensions(moveableExample));
  // 创建selecto
  const selectoExample = new SelectoExample();
  useSettingStore.setSelectoExample(Object.preventExtensions(selectoExample));
  // 画布mousedown
  $(`#${CanvasIdEnum.INNER},#${CanvasIdEnum.BOTTOM}`).on("mousedown", ".draggable2", (e: any) => {
    if (useAppStore.isShiftKey) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    if (e?.which === 1) {
      onClickComponent(e);
    }
  });
  // 画布dblclick
  $(`#${CanvasIdEnum.INNER},#${CanvasIdEnum.BOTTOM}`).on("dblclick", ".draggable2", (e: any) => {
    if (useAppStore.isShiftKey) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    ondblclickComponent(e);
  });
});

/**
 * 搜索元件树
 */
const treeSearchValue = ref("");
watch(treeSearchValue, () => {
  if (!useSettingStore.autoExpandParent) {
    changeCheckedAndExpanded(true, false);
    useSettingStore.setAutoExpandParent(true);
  }
});

/**
 * tree右键菜单
 * @param key
 */
const renameVisible = ref(false);
const componentAliasName = ref("");
const renameKey = ref("");
function onContextMenuClick(key: string, title: string, ev: any) {
  switch (ev.key) {
    case "rename":
      renameKey.value = key;
      componentAliasName.value = title;
      renameVisible.value = true;
      break;
    case "copy":
      message.destroy();
      copy(title)
        .then(() => {
          message.success("复制成功!");
        })
        .catch(() => {
          message.warning("此环境不支持复制操作, 请手动复制");
        });

      break;
  }
}

function handleRename() {
  if (!isStringNormal(componentAliasName.value)) {
    message.destroy();
    message.error("请勿输入特殊字符！");
    return;
  }
  const component: any = document.querySelector(`#${renameKey.value}`);
  if (component && component?.componentModel) {
    component.componentModel.updateModelEntity(JSON.stringify({ componentAliasName: componentAliasName.value }));
    // 更新图层面板
    useSettingStore.setTreeData(getTrees());
  } else {
    message.destroy();
    message.error("未找到元件实例！");
  }
  renameVisible.value = false;
}

function closeDragLayer() {
  displayTree.value = true;
}

const generalLayers = computed(() => {
  return useSettingStore.treeData.filter(
    (v: any) => v.key?.slice(0, 7) !== "Q-MODAL" && v.key?.slice(0, 8) !== "Q-DRAWER"
  );
});
const modalLayers = computed(() => {
  return useSettingStore.treeData.filter(
    (v: any) => v.key?.slice(0, 7) === "Q-MODAL" || v.key?.slice(0, 8) === "Q-DRAWER"
  );
});

/**
 * 处理自定义扩展
 */
const customPlugins = reactive<any>({
  plugins: [],
});
function handleCustomPlugins() {
  const plugins = cloneDeep((window as any).pluginsContext?.skeleton?.pluginsConfig?.edit?.rightArea) || [];
  (window as any).pluginsContext?.material?.add({
    page: "edit",
    data: {
      selectedKeys: computed(() => {
        return useSettingStore.selectedKeys;
      }),
    },
  });
  (window as any).pluginsContext?.material?.add({
    page: "edit",
    data: {
      useSettingStore: useSettingStore,
    },
  });
  if (!plugins.length) return;
  plugins.forEach((config: any) => {
    try {
      let props = "";
      let pluginHTML = "";
      if (config.contentProps && Object.keys(config.contentProps).length) {
        config.contentPropsObject.keys(config.contentProps).forEach((key: string) => {
          const attribute = ` ${key}="${config.contentProps[key]}"`;
          props += attribute;
        });
      }
      pluginHTML = `<${config.content}${props}></${config.content}>`;
      config.pluginHTML = pluginHTML;
    } catch (error) {
      console.log(error);
    }
  });
  customPlugins.plugins = plugins;
}

onMounted(() => {
  handleCustomPlugins();
});
</script>
<style lang="scss" scoped>
// 设置区
#right-menucontent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #ffffff;

  .right-panel-title {
    width: 100%;
    display: flex;
    align-items: center;

    ::v-deep(.icon) {
      margin-right: 8px;
      width: 16px;
      height: 16px;
    }
  }

  .ant-collapse-borderless {
    background-color: #ffffff;
  }
}
</style>

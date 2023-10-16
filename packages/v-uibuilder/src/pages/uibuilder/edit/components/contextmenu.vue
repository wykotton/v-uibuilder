<template>
  <div id="canvas-contextmenu">
    <a-dropdown :visible="visible" :trigger="['contextmenu']">
      <slot></slot>
      <template #overlay>
        <div @click.stop class="dropdown-content">
          <a-menu :selectable="false" @click="handleMenuClick">
            <template v-for="item in menuList" :key="item.key">
              <template v-if="!item.children?.length">
                <a-menu-item :key="item.key" class="menu-item">
                  {{ item.title }}
                </a-menu-item>
              </template>
              <template v-else>
                <sub-menu :key="item.key" :menu-info="item" />
              </template>
            </template>
          </a-menu>
          <div v-if="menuTree.length" class="layer-content">
            <div class="layer-title">图层</div>
            <a-tree
              :tree-data="menuTree"
              :expandedKeys="expandedKeys"
              :selectedKeys="selectedKeys"
              @select="selectComponent"
            >
              <template #title="{ key, title }">
                <div class="layer-item" :title="title" @mouseenter="focusSelectCom(key)" @mouseleave="blurSelectCom">
                  {{ title }}
                </div>
              </template>
            </a-tree>
          </div>
        </div>
      </template>
    </a-dropdown>
  </div>
</template>
<script setup lang="ts">
import {
  deleteEvent,
  getTreeData,
  setFocus,
  useCloneComponent,
  blurSelectCom,
  focusSelectCom,
  onSelect,
  pageFocusEvent,
} from "@/composition/index";
import { CanvasIdEnum } from "@/enums/appEnum";
import { useAppStoreWithOut } from "@/store/modules/app";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import SubMenu from "@/components/sub-menu/index.vue";
import $ from "jquery";

// pinia
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();

const props = defineProps<{
  canvasDropzone: any;
}>();

const visible = ref(false);

/**
 * 监听画布右键事件
 */
const { canvasDropzone } = toRefs(props);
watch([canvasDropzone], () => {
  if (!canvasDropzone.value) return;
  $(canvasDropzone.value).on("contextmenu", ".draggable2", (e: any) => {
    // 所点组件已选中，就展示菜单
    const targetId = e.currentTarget?.id;
    if (!targetId) return;
    if (useAppStore.pageModel?.checkFocus(targetId)) {
      e.stopPropagation();
      e.preventDefault();
      pageFocusEvent();
      // 图层数据
      setMenuData(e.currentTarget);
      // 显示右键菜单
      if (useSettingStore.contextMenu) {
        visible.value = true;
      }
      return;
    }

    // 容器子组件禁止单击选中
    const parentId = e.currentTarget?.parentElement?.id;
    if (parentId && parentId !== CanvasIdEnum.INNER && parentId !== CanvasIdEnum.BOTTOM) return;

    e.stopPropagation();
    e.preventDefault();
    pageFocusEvent();
    if (!useAppStore.isCtrlKey) {
      // 设置moveable实例
      useSettingStore.moveableExample.setMoveableTarget(e);
    }
    // 设置组件选中
    setFocus(e);
    // 图层数据
    setMenuData(e.currentTarget);
    // 显示右键菜单
    if (useSettingStore.contextMenu) {
      visible.value = true;
    }
  });
});

function closeContextMenu() {
  visible.value = false;
}

const handleMenuClick = (e: any) => {
  closeContextMenu();
  switch (e.key) {
    case "copy":
      useCloneComponent();
      break;
    case "delete":
      deleteEvent();
      break;
  }
};

/**
 * 设置右键菜单图层数据
 * @param target
 */
interface MenuInfo {
  key: string;
  title: string;
  children?: MenuInfo[];
}
const menuList = ref<MenuInfo[]>([
  { key: "copy", title: "复制" },
  { key: "delete", title: "删除" },
]);
const menuTree = ref<MenuInfo[]>([]);
const expandedKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
function setMenuData(target: HTMLElement) {
  menuTree.value = getTreeData(target);
  expandedKeys.value = Array.from(target.querySelectorAll(".draggable2")).map((element: any) => element.id);
}
function selectComponent(keys: any, info: any) {
  closeContextMenu();
  onSelect(keys, info);
  selectedKeys.value = [];
}

onMounted(() => {
  $(document).on("contextmenu click", closeContextMenu);
});

onBeforeUnmount(() => {
  $(document).off("contextmenu click", closeContextMenu);
});
</script>
<style scoped lang="scss">
#canvas-contextmenu {
  width: auto;
  height: auto;
}

.dropdown-content {
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);

  ::v-deep(.menu-item) {
    height: 32px;
    line-height: 32px;
    margin: 0;

    &:hover {
      background-color: #f5f5f5;
    }
  }

  .layer-content {
    padding: 0 10px;
    box-sizing: border-box;
    border-top-width: 2px;

    .layer-title {
      font-size: 14px;
      padding: 6px 0 0 6px;
    }

    .layer-item {
      max-width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>

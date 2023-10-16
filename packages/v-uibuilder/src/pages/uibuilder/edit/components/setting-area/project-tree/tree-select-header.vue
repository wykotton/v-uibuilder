<template>
  <div>
    <div class="flex justify-between items-center mb-10px layer-select">
      <a-select ref="select" v-model:value="treeType" disabled>
        <a-select-option value="0">项目</a-select-option>
        <a-select-option value="1">页面图层</a-select-option>
      </a-select>
      <a-space align="baseline" class="!items-center flex">
        <a-dropdown :trigger="['click']" placement="bottom" :overlayStyle="{ zIndex: !displayTree ? '10000' : '' }">
          <div class="!flex">
            <svg class="icon text-18px cursor-pointer" aria-hidden="true">
              <use xlink:href="#icon-chakan"></use>
            </svg>
          </div>
          <template #overlay>
            <a-menu @click="handleScroll">
              <a-menu-item :key="AutoScrollEnum.COMPONENT">
                <span>元件聚焦</span>
              </a-menu-item>
              <a-menu-item :key="AutoScrollEnum.LAYER">
                <span>菜单聚焦</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-dropdown :trigger="['click']" placement="bottom" :overlayStyle="{ zIndex: !displayTree ? '10000' : '' }">
          <div class="!flex">
            <svg class="icon text-18px cursor-pointer" aria-hidden="true">
              <use xlink:href="#icon-caidanzhedie"></use>
            </svg>
          </div>
          <template #overlay>
            <a-menu @click="handleCollapseAndExpand">
              <a-menu-item :key="CollapseAndExpandEnum.EXPAND">
                <span>展开菜单</span>
              </a-menu-item>
              <a-menu-item :key="CollapseAndExpandEnum.COLLAPSE">
                <span>折叠菜单</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-divider type="vertical" style="margin: 0; border-color: #cfcfcf" />
        <a-dropdown
          :trigger="['click']"
          placement="bottomRight"
          :overlayStyle="{ zIndex: !displayTree ? '10000' : '' }"
        >
          <div class="!flex">
            <svg class="icon text-16px cursor-pointer" aria-hidden="true">
              <use xlink:href="#icon-shezhi"></use>
            </svg>
          </div>
          <template #overlay>
            <a-menu @click="handleSettingMenu">
              <a-menu-item v-for="item in settingMenu" :key="item.key">
                <div class="flex items-center">
                  <div class="w-20px min-w-20px flex items-center">
                    <CheckOutlined v-if="item.checked" :style="{ color: '#188FFE' }"></CheckOutlined>
                  </div>
                  <div>{{ item.name }}</div>
                </div>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-space>
    </div>
    <div>
      <div v-if="treeType === '0'">
        <DomSelectTree></DomSelectTree>
      </div>
      <div v-if="treeType === '1'">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { CheckOutlined } from "@ant-design/icons-vue";
import { autoScrollCanvas, changeCheckedAndExpanded, useCleanUpCanvas } from "@/composition/index";
import { AutoScrollEnum, CanvasIdEnum, CollapseAndExpandEnum } from "@/enums/appEnum";
import { SettingMenuItem } from "@/types/store";
import { SettingMenuEnum } from "@/enums/menuEnum";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import DomSelectTree from "./dom-select-tree.vue";
import { Ref } from "vue";

// pinia
const useSettingStore = useSettingStoreWithOut();

const treeType = ref("1");
watch(treeType, () => {
  console.log(treeType.value);
});

const displayTree = inject("displayTree") as Ref<boolean>;

const settingMenu = reactive<SettingMenuItem[]>([
  {
    key: SettingMenuEnum.EJECT_AND_STOW,
    name: "弹出/恢复",
  },
  {
    key: SettingMenuEnum.CLEAR_INNER,
    name: "清空主画布",
  },
  {
    key: SettingMenuEnum.CLEAR_BOTTOM,
    name: "清空服务画布",
  },
  {
    key: SettingMenuEnum.SHOW_NAME_BREADCRUMB,
    name: "显示组件名面包屑",
    checked: false,
  },
  {
    key: SettingMenuEnum.SHOW_ALIAS_NAME_BREADCRUMB,
    name: "显示组件别名面包屑",
    checked: true,
  },
]);

/**
 * 处理聚焦操作
 * @param param0
 */
function handleScroll({ key }: { key: string }) {
  autoScrollCanvas(key);
}

/**
 * 处理菜单折叠展开
 * @param param0
 */
function handleCollapseAndExpand({ key }: { key: string }) {
  switch (key) {
    case CollapseAndExpandEnum.COLLAPSE:
      useSettingStore.setExpandedKeys([]);
      useSettingStore.setAutoExpandParent(false);
      break;
    case CollapseAndExpandEnum.EXPAND:
      changeCheckedAndExpanded(true, false);
      useSettingStore.setAutoExpandParent(true);
      break;
  }
}

/**
 * 处理菜单设置项
 * @param param0
 */
function handleSettingMenu({ key }: { key: string }) {
  switch (key) {
    case SettingMenuEnum.EJECT_AND_STOW:
      displayTree.value = !displayTree.value;
      break;
    case SettingMenuEnum.CLEAR_INNER:
      useCleanUpCanvas(CanvasIdEnum.INNER);
      break;
    case SettingMenuEnum.CLEAR_BOTTOM:
      useCleanUpCanvas(CanvasIdEnum.BOTTOM);
      break;
    case SettingMenuEnum.SHOW_NAME_BREADCRUMB:
      const nameIndex = settingMenu.findIndex((item) => item.key === key);
      if (nameIndex) {
        settingMenu[nameIndex].checked = !settingMenu[nameIndex].checked;
        useSettingStore.setShowNameBreadcrumb(settingMenu[nameIndex].checked);
      }
      break;
    case SettingMenuEnum.SHOW_ALIAS_NAME_BREADCRUMB:
      const aliasIndex = settingMenu.findIndex((item) => item.key === key);
      if (aliasIndex) {
        settingMenu[aliasIndex].checked = !settingMenu[aliasIndex].checked;
        useSettingStore.setShowAliasNameBreadcrumb(settingMenu[aliasIndex].checked);
      }
      break;
  }
}
</script>
<style lang="scss">
.layer-select > .ant-select-selector {
  background-color: transparent;
}
</style>

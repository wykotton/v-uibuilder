<template>
  <div class="flex items-center">
    <!-- <MoreOutlined @click="displayTree = !displayTree"></MoreOutlined> -->
    <a-input-search
      v-model:value="treeSearchValue"
      placeholder="请输入查询内容"
      style="width: 100%; margin-bottom: 10px"
    />
  </div>
  <a-tree
    v-model:checkedKeys="useSettingStore.checkedKeys"
    :selected-keys="useSettingStore.selectedKeys"
    :expanded-keys="useSettingStore.expandedKeys"
    :multiple="useAppStore.isCtrlKey || useSettingStore.selectedKeys.length > 1"
    :tree-data="useSettingStore.treeData"
    :check-strictly="true"
    :show-icon="false"
    :auto-expand-parent="useSettingStore.autoExpandParent"
  >
    <template #title="{ key, title }">
      <a-dropdown style="z-index: 99999" :trigger="['contextmenu']">
        <span
          v-if="title.toLowerCase().indexOf(treeSearchValue.toLowerCase()) > -1"
          @mouseenter="focusSelectCom(key)"
          @mouseleave="blurSelectCom"
        >
          {{ title.substr(0, title.toLowerCase().indexOf(treeSearchValue.toLowerCase())) }}
          <span style="color: #f50">{{ treeSearchValue }}</span>
          {{ title.substr(title.toLowerCase().indexOf(treeSearchValue.toLowerCase()) + treeSearchValue.length) }}
        </span>
        <span v-else @mouseenter="focusSelectCom(key)" @mouseleave="blurSelectCom">{{ title }}</span>
        <!-- <template #overlay>
          <a-menu>
            <a-menu-item key="rename">重命名</a-menu-item>
            <a-menu-item key="copy">复制别名</a-menu-item>
          </a-menu>
        </template> -->
      </a-dropdown>
    </template>
  </a-tree>
</template>
<script setup lang="ts">
import { blurSelectCom, changeCheckedAndExpanded, focusSelectCom } from "@/composition/index";
import { useAppStoreWithOut } from "@/store/modules/app";
import { useSettingStoreWithOut } from "@/store/modules/setting";

// pinia
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();

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
</script>

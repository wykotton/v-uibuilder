<template>
  <a-config-provider :locale="zhCN">
    <div class="setter-container">
      <a-button @click="menuSetting">菜单编辑</a-button>
      <div class="menu-box" v-show="showMenuModal">
        <div class="header">
          <div class="title">菜单编辑</div>
          <a-button @click="recoverNode(MenuType.MENU)" style="margin-left: auto">取消</a-button>
          <a-button type="primary" @click="updateTree(MenuType.MENU)" style="margin-left: 15px">确定</a-button>
        </div>
        <div class="content">
          <a-space :size="6">
            <a-button @click="addMenu(MenuType.MENU)">
              <template #icon><plus-outlined /></template>
              添加节点
            </a-button>
            <a-button @click="editMenu(MenuType.MENU)">
              <template #icon><edit-outlined /></template>
              修改菜单
            </a-button>
            <a-button @click="editMoreMenu">
              <template #icon><edit-outlined /></template>
              二级菜单
            </a-button>
            <a-button @click="delMenu(MenuType.MENU)">
              <template #icon><delete-outlined /></template>
              删除
            </a-button>
          </a-space>
          <div class="h-20px"></div>
          <a-tree @select="selectMenu" :tree-data="menuData" :default-expand-all="true">
            <template #title="{ title, icon }">
              <div class="icon_title">
                <span v-html="icon" v-if="icon" class="icon"></span>
                <span>{{ title }}</span>
              </div>
            </template>
          </a-tree>
        </div>
      </div>
      <div class="more-menu-box" v-show="showMoreMenuModal">
        <div class="header">
          <div class="title">二级菜单编辑</div>
          <a-button @click="recoverNode(MenuType.MORE_MENU)" style="margin-left: auto">取消</a-button>
          <a-button type="primary" @click="updateTree(MenuType.MORE_MENU)" style="margin-left: 15px">确定</a-button>
        </div>
        <div class="content">
          <a-space :size="8">
            <a-button @click="addMenu(MenuType.MORE_MENU)">
              <template #icon><plus-outlined /></template>
              添加节点
            </a-button>
            <a-button @click="editMenu(MenuType.MORE_MENU)">
              <template #icon><edit-outlined /></template>
              修改菜单
            </a-button>
            <a-button @click="delMenu(MenuType.MORE_MENU)">
              <template #icon><delete-outlined /></template>
              删除
            </a-button>
          </a-space>
          <div class="h-20px"></div>
          <a-tree @select="selectMoreMenu" :tree-data="moreMenuData" :default-expand-all="true">
            <template #title="{ title, icon }">
              <div class="icon_title">
                <span v-html="icon" v-if="icon" class="icon"></span>
                <span>{{ title }}</span>
              </div>
            </template>
          </a-tree>
        </div>
      </div>
      <a-modal title="修改菜单名称和icon图标" v-model:visible="showEditModal" @ok="updateNode">
        <a-form>
          <a-form-item label="菜单名称">
            <a-input v-model:value="tempName" placeholder="输入菜单名"></a-input>
          </a-form-item>
          <a-form-item label="icon图标">
            <a-textarea v-model:value="tempIcon" placeholder="示例：<svg><path/></svg>" :rows="4"></a-textarea>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </a-config-provider>
</template>
<script setup lang="ts">
import { message } from "ant-design-vue";
import { cloneDeep } from "lodash-es";
import { onMounted, ref, watch } from "vue";
import { createHashId } from "../../../util/utils";
import { CollapseMenuData } from "@zzjz/v-uibuilder-types";
import zhCN from "ant-design-vue/lib/locale/zh_CN";

const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["optionsChange"]);

const menuData = ref<Array<CollapseMenuData>>([]);
const moreMenuData = ref<Array<CollapseMenuData>>([]);
const showEditModal = ref(false);
const selectedMenu = ref();
const selectedMoreMenu = ref();
const tempName = ref();
const tempIcon = ref();
const showMenuModal = ref(false);
const showMoreMenuModal = ref(false);
enum MenuType {
  MENU = "menu",
  MORE_MENU = "moreMenu",
}

onMounted(() => {
  menuData.value = cloneDeep(props.options) as Array<CollapseMenuData>;
});

watch(showMenuModal, () => {
  if (!showMenuModal.value) {
    selectedMenu.value = null;
    selectedMoreMenu.value = null;
  }
});

/**
 * 菜单设置
 */
const menuSetting = () => {
  showMenuModal.value = true;
};

/**
 * 确定更新
 */
const updateTree = async (type: string) => {
  switch (type) {
    case MenuType.MENU:
      if (!menuData.value) return;
      selectedMenu.value = null;
      showMenuModal.value = false;
      emit("optionsChange", cloneDeep(menuData.value));
      break;
    case MenuType.MORE_MENU:
      if (!moreMenuData.value) return;
      selectedMoreMenu.value = null;
      showMoreMenuModal.value = false;
      selectedMenu.value.moreChildren = moreMenuData.value;
      break;
  }
};

/**
 * 恢复节点
 */
const recoverNode = (type: string) => {
  menuData.value = cloneDeep(props.options) as any;
  showMoreMenuModal.value = false;
  showMenuModal.value = false;
};

/**
 * 选中菜单
 * @param _selectedKeys
 * @param $event
 */
const selectMenu = (_selectedKeys: string, $event: any) => {
  if ($event.selected) {
    selectedMenu.value = $event.node.dataRef;
  } else {
    selectedMenu.value = null;
  }
  resetMoreMenu();
};
const selectMoreMenu = (_selectedKeys: string, $event: any) => {
  if ($event.selected) {
    selectedMoreMenu.value = $event.node.dataRef;
  } else {
    selectedMoreMenu.value = null;
  }
};

/**
 * 添加菜单
 */
function insertNode(data: CollapseMenuData[], key: string, hashId: string) {
  for (let item of data) {
    if (key === item.key) {
      let node = {
        title: "新建菜单",
        children: [],
        icon: "",
        key: hashId,
      };
      if (!item.children) {
        item.children = [];
      }
      item.children.push(node);
      return;
    }
    if (item.children?.length) {
      insertNode(item.children, key, hashId);
    }
  }
}
const addMenu = (type: string) => {
  let hashId = createHashId();
  switch (type) {
    case MenuType.MENU:
      if (!selectedMenu.value) {
        menuData.value.push({
          title: "新建菜单",
          children: [],
          icon: "",
          key: hashId,
        });
      } else {
        insertNode(menuData.value, selectedMenu.value.key, hashId);
      }
      break;
    case MenuType.MORE_MENU:
      if (!selectedMoreMenu.value) {
        moreMenuData.value.push({
          title: "新建菜单",
          children: [],
          icon: "",
          key: hashId,
        });
      } else {
        insertNode(moreMenuData.value, selectedMoreMenu.value.key, hashId);
      }
      break;
  }
};

/**
 * 删除菜单
 */
function deleteTree(tree: any, key: string) {
  let treeData = cloneDeep(tree);
  const deleteParentNode = (data: any) => {
    const ret = [];
    for (let i = 0, l = data.length; i < l; i++) {
      const node = data[i];
      if (node.key !== key) {
        ret.push(node);
      }
      if (!!node.children) {
        node.children = deleteParentNode(node.children);
      }
    }
    return ret;
  };
  return deleteParentNode(treeData);
}
const delMenu = async (type: string) => {
  switch (type) {
    case MenuType.MENU:
      if (!selectedMenu.value) {
        message.destroy();
        message.warn(`请选中所需要删除的菜单！`);
        return;
      }
      menuData.value = deleteTree(menuData.value, selectedMenu.value.key);
      selectedMenu.value = null;
      resetMoreMenu();
      break;
    case MenuType.MORE_MENU:
      if (!selectedMoreMenu.value) {
        message.destroy();
        message.warn(`请选中所需要删除的菜单！`);
        return;
      }
      moreMenuData.value = deleteTree(moreMenuData.value, selectedMoreMenu.value.key);
      selectedMoreMenu.value = null;
      break;
  }
};

/**
 * 编辑菜单
 */
const editType = ref("");
const editMenu = (type: string) => {
  editType.value = type;
  switch (type) {
    case MenuType.MENU:
      if (!selectedMenu.value) {
        message.destroy();
        message.warn(`请选中所需要修改的菜单！`);
        return;
      }
      tempIcon.value = selectedMenu.value.icon;
      tempName.value = selectedMenu.value.title;
      showEditModal.value = true;
      break;
    case MenuType.MORE_MENU:
      if (!selectedMoreMenu.value) {
        message.destroy();
        message.warn(`请选中所需要修改的菜单！`);
        return;
      }
      tempIcon.value = selectedMoreMenu.value.icon;
      tempName.value = selectedMoreMenu.value.title;
      showEditModal.value = true;
      break;
  }
};

/**
 * 更新节点
 */
const updateNode = () => {
  switch (editType.value) {
    case MenuType.MENU:
      selectedMenu.value.icon = tempIcon.value;
      selectedMenu.value.title = tempName.value;
      break;
    case MenuType.MORE_MENU:
      selectedMoreMenu.value.icon = tempIcon.value;
      selectedMoreMenu.value.title = tempName.value;
      break;
  }
  showEditModal.value = false;
};

/**
 * 编辑二级菜单
 */
function editMoreMenu() {
  if (!selectedMenu.value) {
    message.destroy();
    message.warn(`请选中需要编辑的菜单！`);
    return;
  }
  moreMenuData.value = cloneDeep(selectedMenu.value.moreChildren) || [];
  showMoreMenuModal.value = true;
}

/**
 * 重置二级菜单编辑
 */
function resetMoreMenu() {
  selectedMoreMenu.value = null;
  moreMenuData.value = [];
  showMoreMenuModal.value = false;
}
</script>
<style></style>

<template>
  <a-config-provider :locale="zhCN">
    <a-button @click="menuSetting">编辑菜单</a-button>
    <a-modal
      v-model:visible="menuModal"
      width="600px"
      title="编辑菜单"
      :maskClosable="false"
      @ok="updateMenu"
      @cancel="cancel"
    >
      <div>
        <a-space :size="8">
          <a-button @click="addMenu('')">
            <template #icon><plus-outlined /></template>
            添加主菜单
          </a-button>
          <a-button @click="showMenuItemModal">
            <template #icon><edit-outlined /></template>
            修改
          </a-button>
          <a-button @click="useDeleteMenu">
            <template #icon><delete-outlined /></template>
            删除
          </a-button>
        </a-space>
        <div style="margin-top: 10px">
          <a-tree v-model:selectedKeys="selectedKeys" defaultExpandAll :tree-data="menuData" @select="onSelect">
            <template #title="{ title, key }">
              <div style="display: flex; align-items: center">
                <span>{{ title }}</span>
                <a-tooltip placement="bottom">
                  <template #title>
                    <span>添加子菜单</span>
                  </template>
                  <PlusOutlined
                    :style="{ fontSize: '12px', color: '#1890ff', marginLeft: '6px' }"
                    @click.stop="addMenu(key)"
                  ></PlusOutlined>
                </a-tooltip>
              </div>
            </template>
          </a-tree>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model:visible="menuItemModal"
      width="1000px"
      title="编辑菜单项"
      :maskClosable="false"
      @ok="updateMenuItem"
      @cancel="menuItemModal = false"
    >
      <div style="padding: 10px">
        <a-row style="align-items: center">
          <a-col :span="8">
            <div style="display: flex; align-items: center; padding: 6px">
              <div style="width: 120px; font-size: 14px; padding-left: 10px; box-sizing: border-box">菜单项名称</div>
              <div style="flex: 1">
                <a-input v-model:value="menuItem.title"></a-input>
              </div>
            </div>
          </a-col>
          <a-col :span="8">
            <div style="display: flex; align-items: center; padding: 6px">
              <div style="width: 120px; font-size: 14px; padding-left: 10px; box-sizing: border-box">
                菜单项字体大小
              </div>
              <div style="flex: 1">
                <a-input-number v-model:value="menuItem.fontSize" :min="10" style="width: 100%"></a-input-number>
              </div>
            </div>
          </a-col>
          <a-col :span="8">
            <div style="display: flex; align-items: center; padding: 6px">
              <div style="width: 120px; font-size: 14px; padding-left: 10px; box-sizing: border-box">
                菜单项字体粗细
              </div>
              <div style="flex: 1">
                <a-select v-model:value="menuItem.fontWeight" :options="fontWeightArr" style="width: 100%"></a-select>
              </div>
            </div>
          </a-col>
        </a-row>
        <a-row style="align-items: center">
          <a-col :span="8">
            <div style="display: flex; align-items: center; padding: 6px">
              <div style="width: 120px; font-size: 14px; padding-left: 10px; box-sizing: border-box">
                菜单项icon(SVG图像)
              </div>
              <div style="flex: 1">
                <a-input v-model:value="menuItem.icon"></a-input>
              </div>
            </div>
          </a-col>
          <a-col :span="8">
            <div style="display: flex; align-items: center; padding: 6px">
              <div style="width: 120px; font-size: 14px; padding-left: 10px; box-sizing: border-box">
                菜单项背景图(base64图像)
              </div>
              <div style="flex: 1">
                <a-input v-model:value="menuItem.bgImage"></a-input>
              </div>
            </div>
          </a-col>
          <a-col :span="8">
            <div style="display: flex; align-items: center; padding: 6px">
              <div style="width: 120px; font-size: 14px; padding-left: 10px; box-sizing 12px: border-box">
                菜单项鼠标移入背景图(base64图像)
              </div>
              <div style="flex: 1">
                <a-input v-model:value="menuItem.hoverBgImage"></a-input>
              </div>
            </div>
          </a-col>
        </a-row>
        <a-row style="align-items: center">
          <a-col :span="8">
            <div style="display: flex; align-items: center; padding: 6px">
              <div style="width: 120px; font-size: 14px; padding-left: 10px; box-sizing: border-box">菜单项背景色</div>
              <div style="flex: 1">
                <q-color-picker
                  style="width: 100%; height: 28px"
                  :value="menuItem.bgColor"
                  @change="colorPick($event, IColorTypes.BGCOLOR)"
                ></q-color-picker>
              </div>
            </div>
          </a-col>
          <a-col :span="8">
            <div style="display: flex; align-items: center; padding: 6px">
              <div style="width: 120px; font-size: 14px; padding-left: 10px; box-sizing: border-box">
                菜单项鼠标移入背景色
              </div>
              <div style="flex: 1">
                <q-color-picker
                  style="width: 100%; height: 28px"
                  :value="menuItem.hoverBgColor"
                  @change="colorPick($event, IColorTypes.HOVER_BG_COLOR)"
                ></q-color-picker>
              </div>
            </div>
          </a-col>
          <a-col :span="8">
            <div style="display: flex; align-items: center; padding: 6px">
              <div style="width: 120px; font-size: 14px; padding-left: 10px; box-sizing: border-box">
                菜单项文字颜色
              </div>
              <div style="flex: 1">
                <q-color-picker
                  style="width: 100%; height: 28px"
                  :value="menuItem.color"
                  @change="colorPick($event, IColorTypes.COLOR)"
                ></q-color-picker>
              </div>
            </div>
          </a-col>
        </a-row>
        <a-row style="align-items: center">
          <a-col :span="8">
            <div style="display: flex; align-items: center; padding: 6px">
              <div style="width: 120px; font-size: 14px; padding-left: 10px; box-sizing: border-box">
                菜单项鼠标移入文字颜色
              </div>
              <div style="flex: 1">
                <q-color-picker
                  style="width: 100%; height: 28px"
                  :value="menuItem.hoverColor"
                  @change="colorPick($event, IColorTypes.HOVER_COLOR)"
                ></q-color-picker>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </a-config-provider>
</template>
<script setup lang="ts">
import { cloneDeep } from "lodash-es";
import { createVNode, onMounted, ref } from "vue";
import { createHashId } from "../../../util/utils";
import { menuTreeData } from "@zzjz/v-uibuilder-types";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { Modal, message } from "ant-design-vue";
import { QuestionCircleOutlined } from "@ant-design/icons-vue";

const props = defineProps({
  menuData: {
    type: Array<menuTreeData>,
    required: true,
  },
});

const emit = defineEmits(["dataChange"]);
const enum IColorTypes {
  BGCOLOR = "bgColor",
  HOVER_BG_COLOR = "hoverBgColor",
  COLOR = "color",
  HOVER_COLOR = "hoverColor",
}

const menuData = ref<Array<menuTreeData>>([]);
const menuModal = ref(false);
const selectedKeys = ref<string[]>([]);

onMounted(() => {
  menuData.value = cloneDeep(props.menuData) as Array<menuTreeData>;
});

function defaultMenuItem() {
  return {
    key: createHashId(8, "contextmenu-"),
    title: "新建菜单",
    children: [],
    fontSize: 12,
    fontWeight: "",
    icon: "",
    bgImage: "",
    hoverBgImage: "",
    bgColor: "",
    hoverBgColor: "",
    color: "",
    hoverColor: "",
  };
}
const fontWeightArr = [
  {
    label: "100 Thin",
    value: "100",
  },
  {
    label: "200 Extra Light",
    value: "200",
  },
  {
    label: "300 Light",
    value: "300",
  },
  {
    label: "400 Normal",
    value: "400",
  },
  {
    label: "500 Medium",
    value: "500",
  },
  {
    label: "600 Semi Bold",
    value: "600",
  },
  {
    label: "700 Bold",
    value: "700",
  },
  {
    label: "800 Extra Bold",
    value: "800",
  },
  {
    label: "900 Black",
    value: "900",
  },
];
/**
 * 菜单设置
 */
const menuSetting = () => {
  selectedKeys.value = [];
  menuModal.value = true;
};
/**
 * 添加tabs
 */
function addMenu(key: string) {
  const defaultInfo = defaultMenuItem();
  if (!key) {
    menuData.value.push(defaultInfo);
    return;
  }
  const add = (key: string, treeData: menuTreeData[]) => {
    for (const item of treeData) {
      if (item.key === key) {
        item.children.push(defaultInfo);
        return true;
      } else {
        const results = add(key, item.children);
        if (results) return true;
      }
    }
    return false;
  };
  add(key, menuData.value);
}
/**
 * 删除tabs
 * @param index
 */
function useDeleteMenu() {
  if (!selectedKeys.value.length) {
    message.destroy();
    message.warning("请选择菜单项!");
    return;
  }
  Modal.confirm({
    title: "提示",
    icon: createVNode(QuestionCircleOutlined),
    content: "确定要删除当前菜单吗?",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      deleteMenu();
    },
  });
}
function deleteMenu() {
  const key = selectedKeys.value[0];
  const handleDelete = (key: string, treeData: menuTreeData[]) => {
    for (const index in treeData) {
      if (treeData[index].key === key) {
        treeData.splice(Number(index), 1);
        return true;
      } else {
        const results = handleDelete(key, treeData[index].children);
        if (results) return true;
      }
    }
    return false;
  };
  handleDelete(key, menuData.value);
}
/**
 * 改变颜色
 * @param e
 */
function colorPick(e: any, type: string) {
  if (!e.detail?.value) return;
  menuItem.value[type] = e.detail.value;
}
/**
 * 更新菜单
 */
const updateMenu = async () => {
  menuModal.value = false;
  emit("dataChange", cloneDeep(menuData.value));
};
/**
 * 恢复节点
 */
const cancel = () => {
  menuModal.value = false;
  menuData.value = cloneDeep(props.menuData) as any;
};

/**
 * 选择树节点
 */
const treeNode = ref<any>();
function onSelect(selectedKeys: string, event: any) {
  treeNode.value = event.node.dataRef;
}

/**
 * 修改菜单项
 */
const menuItemModal = ref(false);
const menuItem = ref<any>();
const menuItemInfo = {
  title: "",
  fontSize: "",
  fontWeight: "",
  icon: "",
  bgImage: "",
  hoverBgImage: "",
  bgColor: "",
  hoverBgColor: "",
  color: "",
  hoverColor: "",
};
function showMenuItemModal() {
  if (!treeNode.value) return;
  menuItem.value = Object.assign({}, cloneDeep(treeNode.value));
  menuItemModal.value = true;
}
function updateMenuItem() {
  if (!menuItem.value) return;
  Object.keys(menuItemInfo).forEach((key: string) => {
    treeNode.value[key] = menuItem.value[key];
  });
  menuItemModal.value = false;
}
</script>
<style scoped lang="scss"></style>

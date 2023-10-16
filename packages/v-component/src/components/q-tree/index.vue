<template>
  <a-config-provider :locale="zhCN">
    <a-button @click="menuSetting">菜单编辑</a-button>
    <a-modal class="modal-box" title="菜单编辑" @ok="updateTree" v-model:visible="showMenuModal" @cancel="recoverNode">
      <a-space :size="8">
        <a-button @click="addMenu">
          <a-icon type="plus" />
          添加节点
        </a-button>
        <a-button @click="addMenuIcon">
          <a-icon type="edit" />
          设置图标
        </a-button>
        <a-button @click="delMenu">
          <a-icon type="delete" />
          删除
        </a-button>
        <a-button @click="editMenu">
          <a-icon type="edit" />
          修改
        </a-button>
      </a-space>
      <div class="h-20px"></div>
      <a-tree
        style="max-height: 300px;overflow-y: auto;"
        @select="selectMenu"
        :tree-data="tempNodes"
        :default-expand-all="true"
        checkable
        show-line
        show-icon
      >
        <template #title="{ title, customIcon, disabled, disableCheckbox, key}">
          <div class="icon_title">
            <span v-html="customIcon" v-if="customIcon" class="icon"></span>
            <a-popover trigger="hover">
              <template #content>
                <div style="display: flex;justify-content: center;align-items: center">
                  禁用节点
                  <a-switch :checked="disabled" size="small"
                            @change="(value) => changeNodedisable(value, key, 'disabled')" />
                  <a-divider type="vertical" />
                  禁用checkbox
                  <a-switch :checked="disableCheckbox" size="small"
                            @change="(value) => changeNodedisable(value, key, 'disableCheckbox')" />
                </div>
              </template>
              {{ title }}
            </a-popover>
          </div>
        </template>
      </a-tree>
    </a-modal>
    <a-modal title="修改菜单名" v-model:visible="showEditModal" @ok="updateNodeName">
      <a-input v-model:value="tempName" placeholder="输入菜单名"></a-input>
    </a-modal>
    <a-modal title="菜单图标设置" v-model:visible="showEditIconModal" @ok="updateNodeIcon">
      <a-textarea v-model:value="tempIcon" placeholder="示例：<svg><path/></svg>" :rows="4"></a-textarea>
    </a-modal>
  </a-config-provider>
</template>
<script setup lang="ts">
import { message } from "ant-design-vue";
import { cloneDeep, findIndex, find } from "lodash-es";
import { onMounted, ref, watch } from "vue";
import { createHashId } from "../../util/utils";
import ConfigProvider from "ant-design-vue/lib/config-provider";
import zhCN from "ant-design-vue/lib/locale/zh_CN";

interface ITreeData {
  title: string;
  key: string;
  customIcon: string;
  children: ITreeData[];
  disableCheckbox: boolean;
  disabled: boolean;
}

const props = defineProps({
  options: {
    type: Object,
    required: true
  },
  showCheckBox: {
    type: Boolean,
    default: false
  },
  showLine: {
    type: Boolean,
    default: false
  },
  showIcon: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["optionsChange"]);

const tempNodes = ref<Array<ITreeData>>([]);
const showEditModal = ref(false);
const showEditIconModal = ref(false);
const selectedMenu = ref();
const tempName = ref();
const tempIcon = ref();
const showMenuModal = ref(false);

onMounted(() => {
  tempNodes.value = cloneDeep(props.options) as Array<ITreeData>;
});

watch(() => props.options, (value, oldValue, onCleanup) => {
  tempNodes.value = cloneDeep(value) as Array<ITreeData>;
})

watch(showMenuModal, () => {
  if (!showMenuModal.value) {
    selectedMenu.value = null;
  }
});




/**
 * 更新树属性
 * @param treeList
 * @param key
 * @param prop
 * @param value
 */
const updateNodeInTree = (treeList: Array<ITreeData>, key: string, prop: string, value: any) => {
  if (!treeList || !treeList.length) {
    return;
  }
  for (let i = 0; i < treeList.length; i++) {
    if (treeList[i].key == key) {
      treeList[i][prop] = value;
      break;
    }
    if (treeList[i].children && treeList[i].children.length) updateNodeInTree(treeList[i].children, key, prop, value);
  }
};

/**
 * 更新节点checkbox 与 disable 树形
 * @param v
 * @param key
 */
const changeNodedisable = (v: boolean, key: string, type: string) => {
  updateNodeInTree(tempNodes.value, key, type, v);
};



/**
 * 菜单设置
 */
const menuSetting = () => {
  showMenuModal.value = true;
};

/**
 * 确定更新
 */
const updateTree = async () => {
  if (!tempNodes.value) return;

  selectedMenu.value = null;
  showMenuModal.value = false;
  emit("optionsChange", cloneDeep(tempNodes.value));
};

/**
 * 恢复节点
 */
const recoverNode = () => {
  tempNodes.value = cloneDeep(props.options) as any;
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
  console.log(selectedMenu.value);
};

/**
 * 添加菜单
 */
const addMenu = () => {
  let hashId = createHashId();
  if (!selectedMenu.value) {
    tempNodes.value.push({
      title: "未命名",
      children: [],
      disabled: false,
      disableCheckbox: false,
      customIcon: "",
      key: hashId
    });
  } else {
    function insertNode(data: any) {
      for (let item of data) {
        if (selectedMenu.value.key === item.key) {
          let node = {
            title: "未命名",
            children: [],
            customIcon: "",
            disabled: false,
            disableCheckbox: false,
            key: hashId
          };
          if (!item.children) {
            item.children = [];
          }
          item.children.push(node);
          return;
        } else {
          insertNode(item.children || []);
        }
      }
    }

    insertNode(tempNodes.value);
  }
};

/**
 * 添加菜单图标
 */
const addMenuIcon = () => {
  if (!selectedMenu.value) {
    message.warn(`请选中所需要添加图标的菜单！`);
    return;
  }
  showEditIconModal.value = true;
  tempIcon.value = selectedMenu.value.customIcon;
};

/**
 * 更新节点图标
 */
const updateNodeIcon = () => {
  selectedMenu.value.customIcon = tempIcon.value;
  showEditIconModal.value = false;
};

/**
 * 删除菜单
 */
const delMenu = async () => {
  if (!selectedMenu.value) {
    message.warn(`请选中所需要删除的菜单！`);
    return;
  }

  function deleteTree(tree: any, sel: string) {
    let treeData = cloneDeep(tree);
    const deleteParentNode = (data: any) => {
      const ret = [];
      for (let i = 0, l = data.length; i < l; i++) {
        const node = data[i];
        if (node.key !== sel) {
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

  tempNodes.value = deleteTree(tempNodes.value, selectedMenu.value.key);
  selectedMenu.value = null;
};

/**
 * 编辑菜单
 */
const editMenu = () => {
  if (!selectedMenu.value) {
    message.warn(`请选中所需要修改的菜单！`);
    return;
  }
  showEditModal.value = true;
  tempName.value = selectedMenu.value.title;
};

/**
 * 更新节点名称
 */
const updateNodeName = () => {
  selectedMenu.value.title = tempName.value;
  showEditModal.value = false;
};
</script>
<style>
.h-20px {
  height: 20px;
}

.icon_title {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}

.icon {
  margin-right: 5px;
}
</style>

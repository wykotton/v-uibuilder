<template>
  <a-config-provider :locale="zhCN">
    <a-button @click="menuSetting">菜单编辑</a-button>
    <a-modal class="modal-box" title="菜单编辑" @ok="updateTree" v-model:visible="showMenuModal" @cancel="recoverNode">
      <a-space :size="8">
        <a-button @click="splitHorizontal">
          <template #icon><border-verticle-outlined /></template>
          横向分割
        </a-button>
        <a-button @click="splitVertical">
          <template #icon><border-horizontal-outlined /></template>
          纵向分割
        </a-button>
        <a-button @click="editMenu">
          <template #icon><edit-outlined /></template>
          修改
        </a-button>
        <a-button @click="delMenu">
          <template #icon><delete-outlined /></template>
          删除
        </a-button>
      </a-space>
      <div class="h-20px"></div>
      <!-- checkable -->
      <a-tree
        style="max-height: 300px;overflow-y: auto;"
        @select="selectMenu"
        :tree-data="tempNodes"
        :fieldNames="fieldNames"
        :default-expand-all="true"
        show-line
        show-icon
      >
        <template #title="{ title, horiz }">
          <div class="icon_title">
            <column-height-outlined v-if="horiz" />
            <column-width-outlined v-else />
            {{ title }}
          </div>
        </template>
      </a-tree>
    </a-modal>
    <a-modal title="修改" v-model:visible="showEditModal" @ok="updateNode">
      <a-form :model="panseForm" :label-col="{ style: { width: '150px' } }" :wrapper-col="{ span: 14 }">
        <a-form-item label="key">
          <a-input :value="panseForm.key" disabled />
        </a-form-item>
        <a-form-item label="是否启用标题栏">
          <a-switch v-model:checked="panseForm.titleEnable" checked-children="启用" un-checked-children="停用" />
        </a-form-item>
        
        <a-form-item label="标题">
          <a-input v-model:value="panseForm.title" />
        </a-form-item>
        
        <a-form-item label="标题栏文字颜色">
          <q-color-picker
            class="border-type-color"
            style="width: 100%; height: 28px; margin-top: 10px"
            :value="checkColorUtil(panseForm.titleColor)"
            @change="titleColorPick"
          ></q-color-picker>
        </a-form-item>
        
        <a-form-item label="标题分割线宽度">
          <a-input-number v-model:value="panseForm.splitLine.width" :min="0" :max="999" />
        </a-form-item>
        <a-form-item label="标题分割线颜色">
          <q-color-picker
            class="border-type-color"
            style="width: 100%; height: 28px; margin-top: 10px"
            :value="checkColorUtil(panseForm.splitLine.color)"
            @change="splitLineColorPick"
          ></q-color-picker>
        </a-form-item>

        
        <a-form-item label="标题栏方向">
          <a-radio-group v-model:value="panseForm.tbdDir">
            <a-radio value="top">顶部</a-radio>
            <a-radio value="left">左侧</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="收缩区间">
          <a-slider v-model:value="panseForm.intervalContraction" :tip-formatter="(value: number) => `${value}%`" range />
        </a-form-item>
        <a-form-item label="关联面板">
          <a-input v-model:value="panseForm.relatedId" placeholder="填入关联面板ID后，此面板的改变只会影响所填ID面板" />
        </a-form-item>
        
        <a-form-item label="是否带全屏">
          <a-switch v-model:checked="panseForm.full" />
        </a-form-item>
        <a-form-item label="全屏范围">
          <a-input v-model:value="panseForm.fullDom" placeholder="请填入组件id，如：Q-FORMyn2gdp4nv8z7" />
        </a-form-item>
        
        <a-form-item label="背景色">
          <q-color-picker
            class="border-type-color"
            style="width: 100%; height: 28px; margin-top: 10px"
            :value="checkColorUtil(panseForm.bg.bgcolor)"
            @change="bgcolorPick"
          ></q-color-picker>
        </a-form-item>
        <a-form-item label="背景图">
          <a-input-group compact>
            <a-input v-model:value="panseForm.bg.bgimg" style="width: calc(100% - 100px)" />
            <a-button type="primary" @click="openUploadWin()">选择</a-button>
          </a-input-group>
        </a-form-item>
        <a-form-item label="背景图大小">
          <a-select
            ref="select"
            v-model:value="panseForm.bg.bgimgSize"
            style="width: 120px"
            :options="bgimgSizeOptions"
          ></a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-config-provider>
</template>
<script setup lang="ts">
import { message, SelectProps } from "ant-design-vue";
import { cloneDeep } from "lodash-es";
import { onMounted, ref, watch } from "vue";
import { createHashId } from "../../util/utils";
import zhCN from "ant-design-vue/lib/locale/zh_CN";
import { panesDataItem } from "./IQSplitPanes"
import { 
  BorderVerticleOutlined,
  BorderHorizontalOutlined,
  EditOutlined,
  DeleteOutlined,
  ColumnWidthOutlined,
  ColumnHeightOutlined
} from "@ant-design/icons-vue";
import { checkColor } from "../../util/color/checkColor";
import { openFileSelector } from "../../util/utils";

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

const tempNodes = ref<Array<panesDataItem>>([]);
const fieldNames = ref({children:'list', title:'title', key:'key'});
const showEditModal = ref(false);
const selectedMenu = ref();
const panseForm = ref();
const showMenuModal = ref(false);
const bgimgSizeOptions = ref<SelectProps['options']>([
  {
    value: 'default',
    label: '默认',
  },
  {
    value: 'contain',
    label: '重复',
  },
  {
    value: 'full',
    label: '铺满',
  },
]);

onMounted(() => {
  tempNodes.value = cloneDeep(props.options) as Array<panesDataItem>;
});

watch(() => props.options, (value, oldValue, onCleanup) => {
  tempNodes.value = cloneDeep(value) as Array<panesDataItem>;
})

watch(showMenuModal, () => {
  if (!showMenuModal.value) {
    selectedMenu.value = null;
  }
});

const splitHorizontal = (e: MouseEvent) => {
  console.log(selectedMenu.value)
  if (!selectedMenu.value) {
    message.warn(`请先选中菜单！`);
    return;
  }
  if (selectedMenu.value.horiz) {
    if (selectedMenu.value?.list.length){
      const panseObj = selectedMenu.value.list[selectedMenu.value.list.length - 1]
      panseObj.size /= 2
      selectedMenu.value.list.push({
        key: createHashId(12, "split-"),
        title: "未命名",
        titleEnable: true,
        titleColor: "#333333",
        splitLine: {
          width: 1,
          color: "#1f38581a"
        },
        tbdDir: "top",
        horiz: true,
        size: panseObj.size,
        minSize: 0,
        maxSize: 100,
        bg: {
          bgcolor: "#f2f2f2",
          bgimg: "",
          bgimgSize: "default"
        },
        list: []
      })
    } else {
      // if (selectedMenu.value.key === "0")
      selectedMenu.value.horiz = true
      selectedMenu.value.list.push({
        key: createHashId(12, "split-"),
        title: "未命名1",
        titleEnable: true,
        titleColor: "#333333",
        splitLine: {
          width: 1,
          color: "#1f38581a"
        },
        tbdDir: "top",
        horiz: true,
        size: 50,
        minSize: 0,
        maxSize: 100,
        bg: {
          bgcolor: "#f2f2f2",
          bgimg: "",
          bgimgSize: "default"
        },
        list: []
      }, {
        key: createHashId(12, "split-"),
        title: "未命名2",
        titleEnable: true,
        titleColor: "#333333",
        splitLine: {
          width: 1,
          color: "#1f38581a"
        },
        tbdDir: "top",
        horiz: true,
        size: 50,
        minSize: 0,
        maxSize: 100,
        bg: {
          bgcolor: "#f2f2f2",
          bgimg: "",
          bgimgSize: "default"
        },
        list: []
      })
    }
    
  } else {
    if (selectedMenu.value?.list.length){
      message.warn(`请先修改该节点的分割方向`);
      return;
    } else {
      selectedMenu.value.horiz = true
      selectedMenu.value.list.push({
        key: createHashId(12, "split-"),
        title: "未命名1",
        titleEnable: true,
        titleColor: "#333333",
        splitLine: {
          width: 1,
          color: "#1f38581a"
        },
        tbdDir: "top",
        horiz: true,
        size: 50,
        minSize: 0,
        maxSize: 100,
        bg: {
          bgcolor: "#f2f2f2",
          bgimg: "",
          bgimgSize: "default"
        },
        list: []
      }, {
        key: createHashId(12, "split-"),
        title: "未命名2",
        titleEnable: true,
        titleColor: "#333333",
        splitLine: {
          width: 1,
          color: "#1f38581a"
        },
        tbdDir: "top",
        horiz: true,
        size: 50,
        minSize: 0,
        maxSize: 100,
        bg: {
          bgcolor: "#f2f2f2",
          bgimg: "",
          bgimgSize: "default"
        },
        list: []
      })
    }
  }
}
const splitVertical = (e: MouseEvent) => {
  if (!selectedMenu.value) {
    message.warn(`请先选中菜单！`);
    return;
  }
  if (!selectedMenu.value.horiz) {
    if (selectedMenu.value?.list.length){
      const panseObj = selectedMenu.value.list[selectedMenu.value.list.length - 1]
      panseObj.size /= 2
      selectedMenu.value.list.push({
        key: createHashId(12, "split-"),
        title: "未命名",
        titleEnable: true,
        titleColor: "#333333",
        splitLine: {
          width: 1,
          color: "#1f38581a"
        },
        tbdDir: "top",
        horiz: false,
        size: panseObj.size,
        minSize: 0,
        maxSize: 100,
        bg: {
          bgcolor: "#f2f2f2",
          bgimg: "",
          bgimgSize: "default"
        },
        list: []
      })
    } else {
      // if (selectedMenu.value.key === "0")
      selectedMenu.value.horiz = false
      selectedMenu.value.list.push({
        key: createHashId(12, "split-"),
        title: "未命名1",
        titleEnable: true,
        titleColor: "#333333",
        splitLine: {
          width: 1,
          color: "#1f38581a"
        },
        tbdDir: "top",
        horiz: false,
        size: 50,
        minSize: 0,
        maxSize: 100,
        bg: {
          bgcolor: "#f2f2f2",
          bgimg: "",
          bgimgSize: "default"
        },
        list: []
      }, {
        key: createHashId(12, "split-"),
        title: "未命名2",
        titleEnable: true,
        titleColor: "#333333",
        splitLine: {
          width: 1,
          color: "#1f38581a"
        },
        tbdDir: "top",
        horiz: false,
        size: 50,
        minSize: 0,
        maxSize: 100,
        bg: {
          bgcolor: "#f2f2f2",
          bgimg: "",
          bgimgSize: "default"
        },
        list: []
      })
    }
    
  } else {
    if (selectedMenu.value?.list.length){
      message.warn(`请先修改该节点的分割方向`);
      return;
    } else {
      selectedMenu.value.horiz = false
      selectedMenu.value.list.push({
        key: createHashId(12, "split-"),
        title: "未命名1",
        titleEnable: true,
        titleColor: "#333333",
        splitLine: {
          width: 1,
          color: "#1f38581a"
        },
        tbdDir: "top",
        horiz: false,
        size: 50,
        minSize: 0,
        maxSize: 100,
        bg: {
          bgcolor: "#f2f2f2",
          bgimg: "",
          bgimgSize: "default"
        },
        list: []
      }, {
        key: createHashId(12, "split-"),
        title: "未命名2",
        titleEnable: true,
        titleColor: "#333333",
        splitLine: {
          width: 1,
          color: "#1f38581a"
        },
        tbdDir: "top",
        horiz: false,
        size: 50,
        minSize: 0,
        maxSize: 100,
        bg: {
          bgcolor: "#f2f2f2",
          bgimg: "",
          bgimgSize: "default"
        },
        list: []
      })
    }
  }
}


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
        if (!!node.list) {
          node.list = deleteParentNode(node.list);
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
  const { key, titleEnable, title, titleColor, splitLine = { width: 1, color: "#1f38581a" }, tbdDir, full, fullDom, minSize, maxSize, relatedId = "", bg } = selectedMenu.value;
  panseForm.value = { key, titleEnable, title, titleColor, splitLine, tbdDir, full, fullDom, intervalContraction: [minSize, maxSize], relatedId, bg }
  showEditModal.value = true;
  console.log(panseForm.value)
};

/**
 * 更新节点名称
 */
const updateNode = () => {
  const { titleEnable, title, titleColor, splitLine, tbdDir, full, fullDom, intervalContraction, relatedId, bg } = panseForm.value;
  selectedMenu.value.titleEnable = titleEnable;
  selectedMenu.value.title = title;
  selectedMenu.value.titleColor = titleColor;
  selectedMenu.value.splitLine = splitLine;
  selectedMenu.value.tbdDir = tbdDir;
  selectedMenu.value.full = full;
  selectedMenu.value.fullDom = fullDom;
  selectedMenu.value.minSize = intervalContraction[0];
  selectedMenu.value.maxSize = intervalContraction[1];
  selectedMenu.value.relatedId = relatedId;
  selectedMenu.value.bg = bg;
  showEditModal.value = false;
};
/**
 * 颜色校验
 */
 const checkColorUtil = (v: string) => {
  return checkColor(v) ? v : "#FFFFFF";
};


// 属性编辑-颜色选择
const titleColorPick = (e: any) => {
  panseForm.value.titleColor = e.detail.value;
};
// 属性编辑-分割线颜色选择
const splitLineColorPick = (e: any) => {
  panseForm.value.splitLine.color = e.detail.value;
};

// 属性编辑-颜色选择
const bgcolorPick = (e: any) => {
  panseForm.value.bg.bgcolor = e.detail.value;
};
// 属性编辑-图片选择
const openUploadWin = () => {
  openFileSelector("qSplitPanesEditOpenWin", {
    selected: (val: string) => {
      if (!panseForm.value.bg) panseForm.value.bg = {}
      if (Object.prototype.toString.call(panseForm.value.bg) === '[object Object]') panseForm.value.bg.bgimg = val;
    },
  });
};

</script>
<style lang="scss" scoped>
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
.ant-btn{
  display: flex;
  align-items: center;
  .anticon {
    font-size: 18px;
  }
}
.ant-tree-show-line .ant-tree-switcher-line-icon {
    vertical-align: 0.15em;
}
</style>

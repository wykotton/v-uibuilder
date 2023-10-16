<template>
  <a-config-provider :locale="zhCN">
    <a-button @click="tabsSetting">tabs编辑</a-button>
    <a-modal
      v-model:visible="showModal"
      width="1000px"
      title="tabs编辑"
      :maskClosable="false"
      @ok="updateTabs"
      @cancel="cancel"
    >
      <div style="padding: 10px">
        <div v-for="(item, index) in tabs" :key="item.id" style="outline: 1px solid #1890ff; margin-bottom: 20px">
          <a-row>
            <a-col :span="8">
              <div style="display: flex; align-items: center; padding: 6px">
                <div style="width: 120px; font-size: 12px; padding-left: 10px; box-sizing: border-box">标签名称</div>
                <div style="flex: 1">
                  <a-input v-model:value="item.title"></a-input>
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div style="display: flex; align-items: center; padding: 6px">
                <div style="width: 120px; font-size: 12px; padding-left: 10px; box-sizing: border-box">标签icon</div>
                <div style="flex: 1">
                  <a-input v-model:value="item.icon"></a-input>
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div style="display: flex; align-items: center; padding: 6px">
                <div style="width: 120px; font-size: 12px; padding-left: 10px; box-sizing: border-box">标签背景图</div>
                <div style="flex: 1">
                  <a-input v-model:value="item.bgImage"></a-input>
                </div>
              </div>
            </a-col>
          </a-row>
          <a-row class="col-content">
            <a-col :span="8">
              <div style="display: flex; align-items: center; padding: 6px">
                <div style="width: 120px; font-size: 12px; padding-left: 10px; box-sizing: border-box">
                  标签选中背景图
                </div>
                <div style="flex: 1">
                  <a-input v-model:value="item.selectedImage"></a-input>
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div style="display: flex; align-items: center; padding: 6px">
                <div style="width: 120px; font-size: 12px; padding-left: 10px; box-sizing: border-box">标签背景色</div>
                <div style="flex: 1">
                  <q-color-picker
                    style="width: 100%; height: 28px"
                    :value="item.bgColor"
                    @change="colorPick($event, IColorTypes.BGCOLOR, index)"
                  ></q-color-picker>
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div style="display: flex; align-items: center; padding: 6px">
                <div style="width: 120px; font-size: 12px; padding-left: 10px; box-sizing: border-box">
                  标签选中背景色
                </div>
                <div style="flex: 1">
                  <q-color-picker
                    style="width: 100%; height: 28px"
                    :value="item.selectedBgColor"
                    @change="colorPick($event, IColorTypes.SELECTEDBGCOLOR, index)"
                  ></q-color-picker>
                </div>
              </div>
            </a-col>
          </a-row>
          <a-row class="col-content">
            <a-col :span="8">
              <div style="display: flex; align-items: center; padding: 6px">
                <div style="width: 120px; font-size: 12px; padding-left: 10px; box-sizing: border-box">
                  标签文字颜色
                </div>
                <div style="flex: 1">
                  <q-color-picker
                    style="width: 100%; height: 28px"
                    :value="item.color"
                    @change="colorPick($event, IColorTypes.COLOR, index)"
                  ></q-color-picker>
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div style="display: flex; align-items: center; padding: 6px">
                <div style="width: 120px; font-size: 12px; padding-left: 10px; box-sizing: border-box">
                  标签选中文字颜色
                </div>
                <div style="flex: 1">
                  <q-color-picker
                    style="width: 100%; height: 28px"
                    :value="item.selectedColor"
                    @change="colorPick($event, IColorTypes.SELECTEDCOLOR, index)"
                  ></q-color-picker>
                </div>
              </div>
            </a-col>
            <a-col :span="8">
              <div style="display: flex; align-items: center; padding: 6px">
                <div style="width: 120px; font-size: 12px; padding-left: 10px; box-sizing: border-box"></div>
                <a-button danger style="margin-left: auto" @click="deleteTabs(index)">删除</a-button>
              </div>
            </a-col>
          </a-row>
        </div>
        <div style="width: 100%; display: flex">
          <a-button @click="addTabs" style="margin: 0 auto">添加一项</a-button>
        </div>
      </div>
    </a-modal>
    </a-config-provider>
</template>
<script setup lang="ts">
import { cloneDeep } from "lodash-es";
import { onMounted, ref } from "vue";
import { createHash } from "../../../util/utils";
import { ITabsData } from "./types";
import ConfigProvider from "ant-design-vue/lib/config-provider";
import zhCN from "ant-design-vue/es/locale/zh_CN";

const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["optionsChange"]);
const enum IColorTypes {
  BGCOLOR = "bgColor",
  SELECTEDBGCOLOR = "selectedBgColor",
  COLOR = "color",
  SELECTEDCOLOR = "selectedColor",
}

const tabs = ref<Array<ITabsData>>([]);
const showModal = ref(false);

onMounted(() => {
  tabs.value = cloneDeep(props.options) as Array<ITabsData>;
});

function defaultTabs() {
  return {
    id: createHash(),
    title: "新建标签",
    icon: "",
    bgImage: "",
    hoverImage: "",
    selectedImage: "",
    bgColor: "",
    hoverBgColor: "",
    selectedBgColor: "",
    color: "",
    hoverColor: "",
    selectedColor: "",
    closeable: false,
  };
}

/**
 * 菜单设置
 */
const tabsSetting = () => {
  showModal.value = true;
};

/**
 * 添加tabs
 */
function addTabs() {
  tabs.value.push(defaultTabs());
}

/**
 * 删除tabs
 * @param index
 */
function deleteTabs(index: number) {
  tabs.value.splice(index, 1);
}

/**
 * 改变颜色
 * @param e
 */
function colorPick(e: any, type: string, index: number) {
  if (!e.detail?.value) return;
  tabs.value[index][type] = e.detail.value;
}

/**
 * 确定更新
 */
const updateTabs = async () => {
  showModal.value = false;
  emit("optionsChange", cloneDeep(tabs.value));
};

/**
 * 恢复节点
 */
const cancel = () => {
  showModal.value = false;
  tabs.value = cloneDeep(props.options) as any;
};
</script>
<style scoped lang="scss"></style>

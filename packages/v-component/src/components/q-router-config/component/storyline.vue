<template>
  <a-drawer
    :visible="storyVisible"
    placement="right"
    title="路由故事线"
    :mask="false"
    :width="520"
    :z-index="1000"
    :push="{ distance: 640 }"
    @close="closeStoryLine"
  >
    <a-spin :spinning="loading">
      <a-tabs v-model:activeKey="storyActiveKey" centered>
        <a-tab-pane key="global" tab="综合故事线">
          <div style="width: 100%; height: 32px; display: flex; align-items: center; margin-bottom: 20px">
            <a-input v-model:value="routerType" placeholder="请输入分类" style="flex: 1" />
            <a-button style="width: 100px" :block="true" @click="addRouterType">添加分类</a-button>
          </div>
          <a-tree
            :show-icon="true"
            :tree-data="storyTree"
            :selectable="false"
            defaultExpandAll
            draggable
            @drop="storyDrop"
          >
            <template #title="{ text, srcId, routerId, isDrag, isDelete, type, children }">
              <div v-if="isDrag" @dblclick="openRouter(srcId, routerId)" title="双击可编辑当前路由配置项">
                {{ text }}
              </div>
              <div v-else style="display: flex; align-items: center">
                <span>{{ text }}</span>
                <a-popconfirm
                  placement="right"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="deleteRouterType(type, children)"
                >
                  <template #title>
                    <p>确定要删除该分类吗?</p>
                  </template>
                  <delete-outlined
                    v-if="isDelete && type !== defaultType"
                    :style="{ fontSize: '14px', color: '#8F9BB3', marginLeft: '10px' }"
                  />
                </a-popconfirm>
              </div>
            </template>
          </a-tree>
        </a-tab-pane>
        <a-tab-pane key="launch" tab="发起元件">
          <div style="width: 100%; margin-bottom: 20px">
            <a-select
              v-model:value="triggerSelect"
              show-search
              :filter-option="filterComponent"
              placeholder="请选择发起元件"
              style="width: 100%"
              @change="storyTriggerChange"
            >
              <a-select-opt-group v-for="(item, key) in triggerSelectList.value" :key="key" :label="key">
                <a-select-option
                  v-for="item2 in item"
                  :key="item2.id"
                  :value="String(item2.id)"
                  :text="item2.text"
                  :componentAliasName="item2.componentAliasName"
                >
                  {{ item2.componentAliasName || item2.text || "未命名元件" }}
                  <br />
                  <span style="font-size: 12px">ID: {{ item2.id }}</span>
                </a-select-option>
              </a-select-opt-group>
            </a-select>
          </div>
          <a-tree :show-icon="true" :tree-data="triggerTree" :selectable="false" defaultExpandAll>
            <template #title="{ id, text, srcId, routerId, componentAliasName, event, isTrigger, showIcon }">
              <a-tooltip v-if="showIcon" placement="right">
                <template #title>
                  <div style="font-size: 12px">{{ isTrigger ? "元件发出消息:" : "元件接收消息:" }}</div>
                  <div v-for="item in event" :style="{ color: isTrigger ? '#1890ff' : '#52c41a' }">{{ item }}</div>
                </template>
                <div title="双击可编辑当前路由配置项" @dblclick="openRouter(srcId, routerId)">
                  <div style="display: flex; align-items: center">
                    <template v-if="isTrigger"><logout-outlined :style="{ color: '#1890ff' }" /></template>
                    <template v-else><login-outlined :style="{ color: '#52c41a' }" /></template>
                    <span style="margin-left: 6px">{{ componentAliasName || text || "未找到元件!" }}</span>
                  </div>
                  <div style="font-size: 12px; color: #cccccc">ID: {{ id }}</div>
                </div>
              </a-tooltip>
              <div v-else style="display: flex; align-items: center">
                <span style="margin-left: 6px">{{ componentAliasName || text || "未找到元件!" }}</span>
              </div>
            </template>
          </a-tree>
        </a-tab-pane>
        <a-tab-pane key="receive" tab="接收元件">
          <div style="width: 100%; margin-bottom: 20px">
            <a-select
              v-model:value="receiveSelect"
              show-search
              :filter-option="filterComponent"
              placeholder="请选择接收元件"
              style="width: 100%"
              @change="storyReceiveChange"
            >
              <a-select-opt-group v-for="(item, key) in receiveSelectList.value" :key="key" :label="key">
                <a-select-option
                  v-for="item2 in item"
                  :key="item2.id"
                  :value="String(item2.id)"
                  :text="item2.text"
                  :componentAliasName="item2.componentAliasName"
                >
                  {{ item2.componentAliasName || item2.text || "未命名元件" }}
                  <br />
                  <span style="font-size: 12px">ID: {{ item2.id }}</span>
                </a-select-option>
              </a-select-opt-group>
            </a-select>
          </div>
          <a-tree :show-icon="true" :tree-data="receiveTree" :selectable="false" defaultExpandAll>
            <template #title="{ id, text, srcId, routerId, componentAliasName, event, isTrigger, showIcon }">
              <a-tooltip v-if="showIcon" placement="right">
                <template #title>
                  <div style="font-size: 12px">{{ isTrigger ? "元件发出消息:" : "元件接收消息:" }}</div>
                  <div v-for="item in event" :style="{ color: isTrigger ? '#1890ff' : '#52c41a' }">{{ item }}</div>
                </template>
                <div title="双击可编辑当前路由配置项" @dblclick="openRouter(srcId, routerId)">
                  <div style="display: flex; align-items: center">
                    <template v-if="isTrigger"><logout-outlined :style="{ color: '#1890ff' }" /></template>
                    <template v-else><login-outlined :style="{ color: '#52c41a' }" /></template>
                    <span style="margin-left: 6px">{{ componentAliasName || text || "未找到元件!" }}</span>
                  </div>
                  <div style="font-size: 12px; color: #cccccc">ID: {{ id }}</div>
                </div>
              </a-tooltip>
              <div v-else style="display: flex; align-items: center">
                <span style="margin-left: 6px">{{ componentAliasName || text || "未找到元件!" }}</span>
              </div>
            </template>
          </a-tree>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
    <handle-router
      ref="handleRouter"
      isStoryLine
      :root="root"
      :data="data"
      :loading="loading"
      :pageId="pageId"
      :pageList="pageList"
      :routerTypeArr="routerTypeArr"
      :defaultType="defaultType"
      :onSearch="onSearch"
      :getRouterType="getRouterType"
      :changeElementData="changeElementData"
      :changeTypeList="changeTypeList"
      :getProjectData="getProjectData"
      :refreshStoryLine="refreshStoryLine"
    ></handle-router>
  </a-drawer>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import {
  findTargetInfo,
  findTriggerOrReceiveInfo,
  handleComponentsArray,
  IStoryType,
  ModalTypeInfo,
} from "../utils/utils";
import { message, TreeProps } from "ant-design-vue";
import { cloneDeep } from "lodash-es";
import { transformGroup, filterComponent } from "../utils/composition";
import { IRouterConfig, IRouterInfo } from "@zzjz/v-uibuilder-types";
import HandleRouter from "./handleRouter.vue";

const props = defineProps<{
  root: any;
  data: IRouterConfig;
  routerTypeArr: string[];
  loading: Boolean;
  pageId: String;
  pageList: any[];
  defaultType: string;
  tempRouterConfig: IRouterConfig;
  getRouterType: Function;
  closeRouterModal: Function;
  changeElementData: Function;
  onSearch: Function;
  changeTypeList: Function;
  getProjectData: Function;
}>();

const storyVisible = ref(false);
const storyActiveKey = ref("global");
const hashPageList = ref<any>({});
const storyTree = ref<TreeProps["treeData"]>();
const triggerTree = ref<TreeProps["treeData"]>();
const receiveTree = ref<TreeProps["treeData"]>();
const triggerSelect = ref(null);
const triggerSelectList = reactive({ value: <any>{} });
const receiveSelect = ref(null);
const receiveSelectList = reactive({ value: <any>{} });
const routerType = ref("");
async function showStoryLine() {
  props.closeRouterModal?.();
  storyTree.value = [];
  triggerTree.value = [];
  receiveTree.value = [];
  triggerSelect.value = null;
  triggerSelectList.value = {};
  receiveSelect.value = null;
  receiveSelectList.value = {};
  storyActiveKey.value = "global";
  storyVisible.value = true;
  props.getRouterType();
  setTimeout(() => {
    handleStoryTree();
  }, 0);
}
function closeStoryLine() {
  closeRouterModal();
  storyVisible.value = false;
}

// 获取综合故事线
function handleStoryTree() {
  hashPageList.value = handleComponentsArray(cloneDeep(props.pageList));
  const { tree, trigger, receive } = findTargetInfo(props.tempRouterConfig, hashPageList.value, props.routerTypeArr);
  triggerSelectList.value = transformGroup(trigger);
  receiveSelectList.value = transformGroup(receive);
  storyTree.value = tree;
}
// 获取发起元件故事线
function storyTriggerChange(value: string) {
  triggerTree.value = findTriggerOrReceiveInfo(props.tempRouterConfig, hashPageList.value, IStoryType.TRIGGER, value);
}
// 获取接收元件故事线
function storyReceiveChange(value: string) {
  receiveTree.value = findTriggerOrReceiveInfo(props.tempRouterConfig, hashPageList.value, IStoryType.RECEIVE, value);
}
function storyDrop(ev: any) {
  const { node, dragNode } = ev;
  if (!node.dataRef.isDrop || !dragNode.dataRef.isDrag) return;
  const { type: nodeType } = node.dataRef;
  const { type: dragNodeType, id = "", routerId = "" } = dragNode.dataRef;
  if (nodeType === dragNodeType) return;
  const index = (props.data[id] ?? []).findIndex((item: IRouterInfo) => item.id === routerId);
  if (index !== -1) {
    props.data[id][index].type = nodeType;
    props.onSearch();
    props.changeElementData();
    const { tree } = findTargetInfo(props.tempRouterConfig, hashPageList.value, props.routerTypeArr);
    storyTree.value = tree;
    if (triggerSelect.value) {
      storyTriggerChange(triggerSelect.value);
    }
    if (receiveSelect.value) {
      storyReceiveChange(receiveSelect.value);
    }
  }
}
/**
 * 故事线快速打开对应路由配置项
 * @param srcId
 * @param routerId
 * @returns
 */
const handleRouter = ref();
function openRouter(srcId: string, routerId: string) {
  if (!srcId || !routerId) return;
  const index = (props.data[srcId] ?? []).findIndex((item: IRouterInfo) => item.id === routerId);
  if (index === -1) return;
  handleRouter.value?.openRouterModal(ModalTypeInfo.EDIT, srcId, routerId);
}

/**
 * 添加路由分类
 */
function addRouterType() {
  if (!routerType.value) return;
  if (props.routerTypeArr.includes(routerType.value)) {
    message.destroy();
    message.warning("已存在该路由分类!");
    return;
  }
  props.routerTypeArr.push(routerType.value);
  routerType.value = "";
  props.changeTypeList();
  const { tree } = findTargetInfo(props.tempRouterConfig, hashPageList.value, props.routerTypeArr);
  storyTree.value = tree;
}
/**
 * 删除路由分类
 * @param type
 * @param children
 */
function deleteRouterType(type: string, children: any[]) {
  if (children.length) {
    message.destroy();
    message.warning("该分类下存在路由配置项, 无法删除!");
    return;
  }
  const index = props.routerTypeArr.findIndex((item: string) => item === type);
  if (!type || index === -1) {
    message.destroy();
    message.warning("未查找到该分类!");
    return;
  }
  props.routerTypeArr.splice(index, 1);
  props.changeTypeList();
  const { tree } = findTargetInfo(props.tempRouterConfig, hashPageList.value, props.routerTypeArr);
  storyTree.value = tree;
}

/**
 * 关闭抽屉
 */
function closeRouterModal() {
  handleRouter.value?.closeRouterModal();
}

/**
 * 更新故事线
 */
function refreshStoryLine() {
  handleStoryTree();
  if (triggerSelect.value) {
    storyTriggerChange(triggerSelect.value);
  }
  if (receiveSelect.value) {
    storyReceiveChange(receiveSelect.value);
  }
}

/**
 * 导出供外部调用数据
 */
defineExpose({
  closeStoryLine,
  showStoryLine,
});
</script>
<style lang="scss" scoped></style>

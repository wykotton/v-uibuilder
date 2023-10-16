<template>
  <a-config-provider :locale="zhCN">
    <a-spin :spinning="loading">
      <div class="attr-container">
        <div class="title">属性绑定</div>
        <div class="search-input">
          <a-input-search
            ref="attrSearch"
            v-model:value="searchText"
            placeholder="请输入查询关键字"
            @search="onSearch"
            @mousedown="searchFocus"
          ></a-input-search>
        </div>
        <div style="display: flex; align-items: center; margin-top: 10px">
          <a-button
            style="width: 90px"
            :disabled="contextType"
            @click.stop="openRouterModal(ModalTypeInfo.ADD, '', '')"
            @mousedown.stop="() => null"
          >
            新建
            <plus-outlined />
          </a-button>
        </div>
        <a-collapse v-model:activeKey="routerActiveKey" :bordered="false" style="margin-top: 10px">
          <a-collapse-panel v-for="boundId in Object.keys(tempAttributeConfig)" :key="boundId" :header="boundId">
            <div
              v-for="attributeInfo in tempAttributeConfig[boundId]"
              @mousedown.stop="() => null"
              :style="{
                outline: attributeInfo._state === RouterState.ERROR ? '2px solid red' : '1px solid #e1e4e8',
                display: 'flex',
                alignItems: 'center',
                marginTop: '10px',
                padding: '10px',
                borderRadius: '4px',
              }"
            >
              <div>
                <div
                  v-html="attributeInfo.titleHighlights || attributeInfo.title"
                  style="font-weight: 600; color: #666666"
                ></div>
                <div
                  v-html="attributeInfo.targetHighlights || attributeInfo.target"
                  style="padding: 0 6px; margin-top: 4px; border-radius: 2px; background-color: #eaebef"
                ></div>
              </div>
              <a-tooltip placement="bottom">
                <template #title>
                  <span>查看</span>
                </template>
                <eye-outlined
                  :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: 'auto' }"
                  @click.stop="openRouterModal(ModalTypeInfo.SEE, attributeInfo.bound.target, attributeInfo.id)"
                />
              </a-tooltip>
              <a-tooltip placement="bottom">
                <template #title>
                  <span>编辑</span>
                </template>
                <form-outlined
                  v-show="!contextType"
                  :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }"
                  @click.stop="openRouterModal(ModalTypeInfo.EDIT, attributeInfo.bound.target, attributeInfo.id)"
                />
              </a-tooltip>
              <a-tooltip placement="bottom">
                <template #title>
                  <span>删除</span>
                </template>
                <delete-outlined
                  v-show="!contextType"
                  :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }"
                  @click.stop="openRouterModal(ModalTypeInfo.DELETE, attributeInfo.bound.target, attributeInfo.id)"
                />
              </a-tooltip>
              <a-tooltip placement="bottom">
                <template #title>
                  <span>复制</span>
                </template>
                <copy-outlined
                  v-show="!contextType"
                  :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }"
                  @click.stop="openRouterModal(ModalTypeInfo.COPY, attributeInfo.bound.target, attributeInfo.id)"
                />
              </a-tooltip>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </a-spin>
    <a-drawer
      v-model:visible="modalVisible"
      placement="right"
      :title="modalTitle"
      :mask="false"
      :width="645"
      :z-index="1000"
      class="router-drawer-wrapClassName"
    >
      <template #extra>
        <a-button type="primary" @click="handleDataInfo">确定</a-button>
      </template>
      <a-spin :spinning="loading">
        <div
          ref="selectContainer"
          :style="{
            overflow: 'auto',
            background: 'white',
            outline: tempDataInfo._targetState === RouterState.ERROR ? '2px solid red' : '1px solid rgb(225, 228, 232)',
            position: 'relative',
          }"
        >
          <div style="display: flex; align-items: center; padding: 10px 0">
            <div style="width: 90px; text-align: right">
              <span style="color: red">*</span>
              配置项名称:
            </div>
            <div style="width: 455px; margin-left: 10px">
              <a-input
                v-model:value="tempDataInfo.title"
                :disabled="modalType === ModalTypeInfo.SEE"
                :maxlength="30"
                showCount
                placeholder="请输入名称"
              />
            </div>
          </div>
          <div style="display: flex; align-items: center; padding: 10px 0">
            <div style="width: 90px; text-align: right">
              <span style="color: red">*</span>
              配置项类型:
            </div>
            <div style="width: 455px; margin-left: 10px; display: flex">
              <a-select
                v-if="typeSelect === 'choose'"
                v-model:value="tempDataInfo.type"
                :disabled="modalType === ModalTypeInfo.SEE"
                placeholder="请选择属性绑定分类"
                style="flex: 1"
              >
                <a-select-option v-for="(routerType, index) in attrTypeArr" :value="routerType" :key="index">
                  {{ routerType }}
                </a-select-option>
              </a-select>
              <a-input
                v-else
                v-model:value="tempDataInfo.type"
                :disabled="modalType === ModalTypeInfo.SEE"
                :maxLength="15"
                placeholder="请输入属性绑定分类"
                style="flex: 1"
              />
              <a-divider type="vertical" style="margin: 0 6px; height: 32px; top: 0" />
              <a-radio-group v-model:value="typeSelect" :disabled="modalType === ModalTypeInfo.SEE">
                <a-radio-button value="choose">选择</a-radio-button>
                <a-radio-button value="add">新增</a-radio-button>
              </a-radio-group>
            </div>
          </div>
          <div
            :style="{
              backgroundColor: currentTarget === CurrentTypeInfo.BIND ? '#91d5ff' : '',
              display: 'flex',
              alignItems: 'center',
              padding: '10px 0',
              cursor: 'pointer',
            }"
            @click="selectCurrent(CurrentTypeInfo.BIND)"
          >
            <div style="width: 90px; text-align: right">
              <span style="color: red">*</span>
              元件:
            </div>
            <div style="width: 455px; margin-left: 10px">
              <a-select
                v-model:value="tempDataInfo.target"
                :disabled="modalType === ModalTypeInfo.SEE"
                show-search
                :filter-option="filterComponent"
                placeholder="请选择元件"
                style="width: 100%"
                @change="
                  (value: string) => {
                    elementChange(value, CurrentTypeInfo.BIND);
                  }
                "
              >
                <a-select-opt-group
                  v-for="(components, componentsKey) in componentsArr.value"
                  :key="componentsKey"
                  :label="componentsKey"
                >
                  <a-select-option
                    v-for="component in components"
                    :key="component.id"
                    :value="String(component.id)"
                    :text="component.text"
                    :componentAliasName="component.componentAliasName"
                    @mouseenter="focusSelectCom(component.id)"
                    @mouseleave="blurSelectCom"
                  >
                    {{ component.componentAliasName || component.text || "未命名元件" }}
                    <br />
                    <span style="font-size: 12px">ID: {{ component.id }}</span>
                  </a-select-option>
                </a-select-opt-group>
              </a-select>
            </div>
            <bulb-outlined
              v-if="modalType !== ModalTypeInfo.SEE"
              :style="{ fontSize: '18px', color: '#91d5ff', marginLeft: '8px' }"
              title="选中该项后, 再选中画布元件可快速设置该元件"
            />
          </div>
          <div style="display: flex; align-items: flex-start; padding: 10px 0">
            <div style="width: 90px; text-align: right; margin-top: 4px">
              <span style="color: red">*</span>
              属性:
            </div>
            <div style="width: 455px; margin-left: 10px; display: flex">
              <a-input
                v-model:value="tempDataInfo.attribute"
                :disabled="modalType === ModalTypeInfo.SEE"
                style="flex: 1"
                @change="attributeChange(CurrentTypeInfo.BIND)"
              ></a-input>
              <a-divider
                v-if="modalType !== ModalTypeInfo.SEE"
                type="vertical"
                style="margin: 0 6px; height: 32px; top: 0"
              />
              <a-popover
                v-if="modalType !== ModalTypeInfo.SEE"
                v-model:visible="bindVisible"
                placement="left"
                trigger="click"
                title="选择属性"
                arrow-point-at-center
              >
                <template #content>
                  <div v-if="waitBindList.length" style="width: 400px; height: 600px; overflow: auto">
                    <a-input-search
                      v-model:value="bindSearchValue"
                      placeholder="请输入查询内容"
                      style="width: 100%; margin-bottom: 10px"
                    />
                    <a-tree
                      :selected-keys="bindSelectedKey"
                      :tree-data="waitBindList"
                      :load-data="bindLoadData"
                      :check-strictly="true"
                      :show-icon="false"
                      @select="
                        (keys: any, info: any) => {
                          onSelectAttr(keys, info, CurrentTypeInfo.BIND);
                        }
                      "
                    >
                      <template #title="{ title }">
                        <span v-if="title.indexOf(bindSearchValue) > -1" class="whitespace-nowrap">
                          {{ title.substr(0, title.indexOf(bindSearchValue)) }}
                          <span style="color: #f50">{{ bindSearchValue }}</span>
                          {{ title.substr(title.indexOf(bindSearchValue) + bindSearchValue.length) }}
                        </span>
                        <span v-else>{{ title }}</span>
                      </template>
                    </a-tree>
                  </div>
                  <div
                    v-else
                    style="
                      width: 400px;
                      height: 600px;
                      overflow: auto;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <a-empty description="暂无可选属性" />
                  </div>
                </template>
                <a-button type="primary" :disabled="modalType === ModalTypeInfo.SEE">选择</a-button>
              </a-popover>
            </div>
          </div>
          <div style="display: flex; align-items: flex-start; padding: 10px 0">
            <div style="width: 90px; min-width: 90px; text-align: right; margin-top: 4px">绑定源:</div>
            <div style="width: 455px; margin-left: 10px">
              <div
                :style="{
                  width: '100%',
                  outline:
                    tempDataInfo.bound._targetState === RouterState.ERROR
                      ? '2px solid red'
                      : '1px solid rgb(225, 228, 232)',
                  borderRadius: '4px',
                  marginBottom: '10px',
                }"
              >
                <div
                  :style="{
                    backgroundColor: currentTarget === CurrentTypeInfo.BOUND ? '#91d5ff' : '',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 0',
                    cursor: 'pointer',
                  }"
                  @click="selectCurrent(CurrentTypeInfo.BOUND)"
                >
                  <div style="width: 75px; text-align: right">
                    <span style="color: red">*</span>
                    绑定元件:
                  </div>
                  <div style="width: 330px; margin-left: 10px">
                    <a-select
                      v-model:value="tempDataInfo.bound.target"
                      :disabled="modalType === ModalTypeInfo.SEE"
                      show-search
                      placeholder="请选择绑定元件"
                      style="width: 100%"
                      @change="
                          (value: string) => {
                            elementChange(value, CurrentTypeInfo.BOUND);
                          }
                        "
                    >
                      <a-select-opt-group
                        v-for="(boundComponents, boundComponentsKey) in componentsArr.value"
                        :key="boundComponentsKey"
                        :label="boundComponentsKey"
                      >
                        <a-select-option
                          v-for="boundComponent in boundComponents"
                          :key="boundComponent.id"
                          :value="String(boundComponent.id)"
                          :text="boundComponent.text"
                          :componentAliasName="boundComponent.componentAliasName"
                          @mouseenter="focusSelectCom(boundComponent.id)"
                          @mouseleave="blurSelectCom"
                        >
                          {{ boundComponent.componentAliasName || boundComponent.text || "未命名元件" }}
                          <br />
                          <span style="font-size: 12px">ID: {{ boundComponent.id }}</span>
                        </a-select-option>
                      </a-select-opt-group>
                    </a-select>
                  </div>
                  <bulb-outlined
                    v-if="modalType !== ModalTypeInfo.SEE"
                    :style="{ fontSize: '18px', color: '#91d5ff', marginLeft: '8px' }"
                    title="选中该项后, 再选中画布元件可快速设置该绑定元件"
                  />
                </div>
                <div style="display: flex; align-items: flex-start; padding: 10px 0">
                  <div style="width: 75px; text-align: right; margin-top: 4px">
                    <span style="color: red">*</span>
                    绑定属性:
                  </div>
                  <div style="width: 330px; margin-left: 10px; display: flex">
                    <a-input
                      v-model:value="tempDataInfo.bound.attribute"
                      :disabled="modalType === ModalTypeInfo.SEE"
                      style="flex: 1"
                    ></a-input>
                    <a-divider
                      v-if="modalType !== ModalTypeInfo.SEE"
                      type="vertical"
                      style="margin: 0 6px; height: 32px; top: 0"
                    />
                    <a-popover
                      v-if="modalType !== ModalTypeInfo.SEE"
                      v-model:visible="boundVisible"
                      placement="left"
                      trigger="click"
                      title="选择属性"
                      arrow-point-at-center
                    >
                      <template #content>
                        <div v-if="waitBoundList.length" style="width: 400px; height: 600px; overflow: auto">
                          <a-input-search
                            v-model:value="boundSearchValue"
                            placeholder="请输入查询内容"
                            style="width: 100%; margin-bottom: 10px"
                          />
                          <a-tree
                            :selected-keys="boundSelectedKey"
                            :tree-data="waitBoundList"
                            :load-data="boundLoadData"
                            :check-strictly="true"
                            :show-icon="false"
                            @select="
                              (keys: any, info: any) => {
                                onSelectAttr(keys, info, CurrentTypeInfo.BOUND);
                              }
                            "
                          >
                            <template #title="{ title }">
                              <span v-if="title.indexOf(bindSearchValue) > -1" class="whitespace-nowrap">
                                {{ title.substr(0, title.indexOf(bindSearchValue)) }}
                                <span style="color: #f50">{{ bindSearchValue }}</span>
                                {{ title.substr(title.indexOf(bindSearchValue) + bindSearchValue.length) }}
                              </span>
                              <span v-else>{{ title }}</span>
                            </template>
                          </a-tree>
                        </div>
                        <div
                          v-else
                          style="
                            width: 400px;
                            height: 600px;
                            overflow: auto;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                          "
                        >
                          <a-empty description="暂无可选属性" />
                        </div>
                      </template>
                      <a-button type="primary" :disabled="modalType === ModalTypeInfo.SEE">选择</a-button>
                    </a-popover>
                  </div>
                </div>
                <div style="display: flex; align-items: flex-start; padding: 10px 0">
                  <div style="width: 75px; text-align: right; margin-top: 4px">数据处理:</div>
                  <div style="margin-left: 10px; display: flex; align-items: center">
                    <a-textarea
                      v-model:value="tempDataInfo.bound.script"
                      :disabled="modalType === ModalTypeInfo.SEE"
                      style="width: 330px; height: 150px"
                    />
                    <code-outlined
                      v-if="modalType !== ModalTypeInfo.SEE"
                      :style="{ fontSize: '18px', color: '#91d5ff', marginLeft: '8px' }"
                      title="编辑数据处理函数"
                      @click="showCodeEditor"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-spin>
    </a-drawer>
    <a-modal
      v-model:visible="codeModal"
      v-if="codeModal"
      title="代码编辑"
      :maskClosable="false"
      width="80%"
      @ok="codeChange"
    >
      <q-code-editor
        ref="codeEditor"
        :value="codeStr"
        language="javascript"
        style="width: 100%; height: 600px; display: block"
      ></q-code-editor>
    </a-modal>
  </a-config-provider>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue";
import { cloneDeep, isArray, isObject } from "lodash-es";
import { createHashId, focusSelectCom, blurSelectCom } from "../../util/utils";
import { IAttributeInfo, IBound } from "../../types/runtime/IAttributeConfig";
import { ISchema } from "../../types/runtime/IModelSchema";
import { handleAttributeBind } from "../../util/attr-bind";
import { message, Modal } from "ant-design-vue";
import { EventDataNode } from "ant-design-vue/es/tree";
import { JSONPath } from "jsonpath-plus";
import type { TreeProps } from "ant-design-vue";
import zhCN from "ant-design-vue/lib/locale/zh_CN";

const props = defineProps<{
  root: any;
  insideChange: { value: boolean };
}>();
const data: { [key: string]: IAttributeInfo[] } = cloneDeep(props.root.value);

enum RouterState {
  OK = "ok",
  ERROR = "error",
}
const defaultBound: IBound = {
  id: "",
  target: "",
  attribute: "",
  script: "function(data) { return data; }",
  _targetState: RouterState.OK,
};
const defaultInfo: IAttributeInfo = {
  id: "",
  title: "",
  type: "",
  target: "",
  attribute: "",
  bound: defaultBound,
  _state: RouterState.OK,
  _targetState: RouterState.OK,
};

const tempDataInfo = ref(cloneDeep(defaultInfo));
const tempDataIndex = ref(-1);
const selectContainer = ref(null);
const routerActiveKey = ref("");
const contextType = ref(props.root.contextType);

/**
 * 搜索框聚焦处理
 */
const attrSearch = ref();
function searchFocus() {
  attrSearch.value?.focus();
}

/**
 * 搜索属性绑定配置项
 */
const searchText = ref("");
const tempAttributeConfig = ref({});
const onSearch = (value: string) => {
  try {
    tempAttributeConfig.value = {};
    Object.keys(data).forEach((key) => {
      if (!value) {
        data[key].forEach((item: IAttributeInfo) => {
          classifyBind(item);
        });
        return;
      }
      data[key]?.forEach((item: IAttributeInfo) => {
        if (item.title?.indexOf(value) > -1 || item.target?.indexOf(value) > -1) {
          const tempData = cloneDeep(item);
          if (tempData.title?.indexOf(value) > -1) {
            const replaceReg = new RegExp(value, "g"); // 匹配关键字正则
            const replaceString = '<span style="color: red">' + value + "</span>"; // 高亮替换v-html值
            tempData["titleHighlights"] = tempData.title.replace(replaceReg, replaceString);
          }
          if (tempData.target?.indexOf(value) > -1) {
            const replaceReg = new RegExp(value, "g"); // 匹配关键字正则
            const replaceString = '<span style="color: red">' + value + "</span>"; // 高亮替换v-html值
            tempData["targetHighlights"] = tempData.target.replace(replaceReg, replaceString);
          }
          classifyBind(tempData);
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};
const classifyBind = (info: IAttributeInfo) => {
  if (info.type) {
    tempAttributeConfig.value[info.type] ? void 0 : (tempAttributeConfig.value[info.type] = []);
    tempAttributeConfig.value[info.type].push(info);
  } else {
    tempAttributeConfig.value[defaultType.value] ? void 0 : (tempAttributeConfig.value[defaultType.value] = []);
    tempAttributeConfig.value[defaultType.value].push(info);
  }
};

/**
 * 下拉框搜索元件
 * @param input
 * @param option
 * @returns
 */
const filterComponent = (input: string, option: any) => {
  if (option.componentAliasName) {
    return (
      option.componentAliasName.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
      `ID: ${option.value}`.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  } else if (option.text) {
    return (
      option.text.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
      `ID: ${option.value}`.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  } else {
    return (
      "未命名元件".toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
      `ID: ${option.value}`.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  }
};

/**
 * 对组件数据进行分组
 * @param components
 * @returns
 */
const transformGroup = (components: ISchema[]) => {
  const list = {};
  components.forEach((item: ISchema) => {
    const iovSchema = item?.iovSchema;
    const componentAliasName = item?.componentAliasName || "";
    const text = item?.iovSchema?.text || "";
    const id = item.id;
    const info = { id, text, componentAliasName, iovSchema };
    if (id) {
      list?.[text] ? void 0 : (list[text] = []);
      list[text].push(info);
    }
  });
  return list;
};

/**
 * 获取元件可选列表
 */
const componentClass = [".draggable2", ".child-page-children"];
function getTargetList() {
  const tempList: ISchema[] = [];
  componentClass.forEach((name: string) => {
    Array.from(document.querySelectorAll(name)).forEach((element: any) => {
      const model = element?.componentModel?.model;
      if (model?.id) {
        tempList.push(model);
      }
    });
  });
  componentsArr.value = transformGroup(tempList);
}

/**
 * 路由分类
 */
const typeSelect = ref("choose");
const attrTypeArr = ref<string[]>([]);
const defaultType = ref("默认分类");
function getRouterType() {
  const tempTypesArr: string[] = [defaultType.value];
  Object.keys(data).forEach((key: string) => {
    data[key].forEach((item: IAttributeInfo) => {
      if (item.type && !tempTypesArr.includes(item.type)) {
        tempTypesArr.push(item.type);
      }
    });
  });
  attrTypeArr.value = tempTypesArr;
}

/**
 * 配置项操作
 */
const loading = ref(false);
const modalVisible = ref(false);
const modalType = ref("");
const modalTitle = ref("");
const handleConfigKey = ref("");
const componentsArr = reactive({ value: <any>{} });
enum ModalTypeInfo {
  ADD = "add",
  SEE = "see",
  EDIT = "edit",
  DELETE = "delete",
  COPY = "copy",
}
const openRouterModal = async (type: string, boundId: string, configId: string) => {
  tempDataIndex.value = -1;
  handleConfigKey.value = boundId;
  modalType.value = type;
  resetCurrent();
  getTargetList();
  getRouterType();
  if (data[boundId]?.length) {
    tempDataIndex.value = data[boundId].findIndex((item: IAttributeInfo) => item.id === configId);
  }
  switch (type) {
    case ModalTypeInfo.ADD:
      handleTempData(ModalTypeInfo.ADD, "创建", true, false, false);
      break;
    case ModalTypeInfo.SEE:
      handleTempData(ModalTypeInfo.SEE, "查看", false, true, true);
      break;
    case ModalTypeInfo.EDIT:
      handleTempData(ModalTypeInfo.EDIT, "编辑", false, false, true);
      break;
    case ModalTypeInfo.DELETE:
      Modal.confirm({
        title: "确定要删除吗?",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          confirmDelete();
        },
      });
      break;
    case ModalTypeInfo.COPY:
      handleTempData(ModalTypeInfo.COPY, "复制", true, false, true);
      break;
  }
};

/**
 * 组件选择改变
 * 更新组件属性treeData
 * @param value
 * @param type
 * @param index
 */
const bindTargetId = ref("");
const boundTargetId = ref("");
const elementChange = (value: string, type: string) => {
  const element = document.querySelector(`#${value}`);
  const model = (element as any)?.componentModel?.model;
  switch (type) {
    case CurrentTypeInfo.BIND:
      // 设置OK状态
      tempDataInfo.value._targetState = RouterState.OK;
      // 清空已添加事件列表
      tempDataInfo.value.attribute = "";
      // 清空tree选中属性
      bindSelectedKey.value = [];
      bindTargetId.value = value;
      break;
    case CurrentTypeInfo.BOUND:
      // 设置OK状态
      tempDataInfo.value.bound._targetState = RouterState.OK;
      // 清空属性
      tempDataInfo.value.bound.attribute = "";
      // 清空tree选中属性
      boundSelectedKey.value = [];
      boundTargetId.value = value;
      break;
  }
  reloadBindList(model, type);
  checkUpAttributeInfo();
};

/**
 * 元件属性绑定列表
 * @param resetList
 */
interface treeProps {
  title: string;
  key: string;
  children: treeProps[];
}
const waitBindList = ref<treeProps[]>([]);
const waitBoundList = ref<treeProps[]>([]);
function reloadBindList(model: ISchema, type: string) {
  if (!model) return;
  // 当前元件待绑定属性
  const waitBindArr = Object.keys(model).map((key: string) => {
    return {
      title: key,
      key,
      children: [],
    };
  });
  switch (type) {
    case CurrentTypeInfo.BIND:
      waitBindList.value = waitBindArr;
      break;
    case CurrentTypeInfo.BOUND:
      waitBoundList.value = waitBindArr;
      break;
  }
}

/**
 * 搜索属性tree
 */
const bindSearchValue = ref("");
const boundSearchValue = ref("");
/**
 * 清除所有搜索内容
 */
function clearUpSearch() {
  bindSearchValue.value = "";
  boundSearchValue.value = "";
}

/**
 * 异步加载元件属性
 */
const bindLoadData: TreeProps["loadData"] = (treeNode) => {
  return onLoadData(treeNode, true);
};
const boundLoadData: TreeProps["loadData"] = (treeNode) => {
  return onLoadData(treeNode, false);
};
function onLoadData(treeNode: EventDataNode, isBind: Boolean) {
  return new Promise<void>((resolve) => {
    const { key = "", children = [] } = treeNode.dataRef || <Record<string, any>>{};
    if (!treeNode.dataRef || children.length || !key) {
      resolve();
      return;
    }
    let componentModel = {};
    if (isBind) {
      const element = document.querySelector(`#${bindTargetId.value}`);
      componentModel = (element as any)?.componentModel?.model;
    } else {
      const element = document.querySelector(`#${boundTargetId.value}`);
      componentModel = (element as any)?.componentModel?.model;
    }
    const attribute = JSONPath({ path: key, json: componentModel })[0];
    if (isObject(attribute) || isArray(attribute)) {
      treeNode.dataRef.children = Object.keys(attribute).map((attr: string) => {
        return {
          title: attr,
          key: Number.isNaN(Number(attr)) ? `${key}.${attr}` : `${key}[${attr}]`,
          children: [],
        };
      });
      if (isBind) {
        waitBindList.value = [...waitBindList.value];
      } else {
        waitBoundList.value = [...waitBoundList.value];
      }
    }
    resolve();
  });
}

/**
 * 同步输入框和tree属性
 * @param type
 */
function attributeChange(type: string) {
  switch (type) {
    case CurrentTypeInfo.BIND:
      bindSelectedKey.value = [tempDataInfo.value.attribute];
      break;
    case CurrentTypeInfo.BOUND:
      boundSelectedKey.value = [tempDataInfo.value.bound.attribute];
      break;
  }
}

/**
 * 属性tree选中
 */
const bindSelectedKey = ref<string[]>([]);
const boundSelectedKey = ref<string[]>([]);
const bindVisible = ref(false);
const boundVisible = ref(false);
watch([bindVisible, boundVisible], () => {
  clearUpSearch();
});
function closeAttrPop() {
  bindVisible.value = false;
  boundVisible.value = false;
}
function onSelectAttr(keys: any, info: any, type: string) {
  closeAttrPop();
  if (!keys.length) return;
  // 被点击的key
  const eventKey = info.node.eventKey;
  switch (type) {
    case CurrentTypeInfo.BIND:
      bindSelectedKey.value = keys;
      tempDataInfo.value.attribute = eventKey;
      bindVisible.value = false;
      break;
    case CurrentTypeInfo.BOUND:
      boundSelectedKey.value = keys;
      tempDataInfo.value.bound.attribute = eventKey;
      boundVisible.value = false;
      break;
  }
}

/**
 * 编辑时初始化treeData
 */
const initTreeData = () => {
  if (!tempDataInfo.value.target) return;
  const bindElement = document.querySelector(`#${tempDataInfo.value.target}`);
  const bindModel = (bindElement as any)?.componentModel?.model;
  reloadBindList(bindModel, CurrentTypeInfo.BIND);
  const boundElement = document.querySelector(`#${tempDataInfo.value.bound.target}`);
  const boundModel = (boundElement as any)?.componentModel?.model;
  reloadBindList(boundModel, CurrentTypeInfo.BOUND);
  bindSelectedKey.value = [tempDataInfo.value.attribute];
  boundSelectedKey.value = [tempDataInfo.value.bound.attribute];
};

/**
 * 处理路由临时编辑数据
 * @param type 操作类型
 * @param title model-title
 * @param refresh 刷新路由项id
 * @param clear 清除快速选中参数
 * @param init 初始化元件可选事件
 * @returns
 */
const handleTempData = async (type: string, title: string, refresh: boolean, clear: boolean, init: boolean) => {
  switch (type) {
    case ModalTypeInfo.ADD:
      tempDataInfo.value = cloneDeep(defaultInfo);
      tempDataInfo.value.type = defaultType.value;
      break;
    case ModalTypeInfo.SEE:
    case ModalTypeInfo.EDIT:
    case ModalTypeInfo.COPY:
      tempDataInfo.value = cloneDeep(data[handleConfigKey.value][tempDataIndex.value]);
      break;
  }
  if (!tempDataInfo.value) {
    message.destroy();
    message.error("未找到属性绑定项数据!");
    return;
  }
  refresh && (tempDataInfo.value.id = createHashId(12, "attr-"));
  modalTitle.value = `${title}属性绑定项 ` + tempDataInfo.value.title;
  clear && clearCurrent();
  init && initTreeData();
  modalVisible.value = true;
};

/**
 * 弹窗确定操作
 * @returns
 */
const handleDataInfo = () => {
  if (!modalType.value) {
    message.error("程序操作类型出错!");
    return;
  }
  if (
    !tempDataInfo.value.title ||
    !tempDataInfo.value.type ||
    !tempDataInfo.value.target ||
    !tempDataInfo.value.attribute ||
    !tempDataInfo.value.bound.target ||
    !tempDataInfo.value.bound.attribute
  ) {
    message.error("缺少必填参数");
    return;
  }
  switch (modalType.value) {
    case ModalTypeInfo.ADD:
    case ModalTypeInfo.COPY:
      confirmAdd();
      break;
    case ModalTypeInfo.EDIT:
      confirmEdit();
      break;
    default:
      modalVisible.value = false;
  }
};

/**
 * 检查属性绑定是否重复
 */
function checkUpRepeat() {
  let repeat = false;
  let attrUnchanged = false;
  let infoUnchanged = false;
  data[tempDataInfo.value.bound.target]?.forEach((item: IAttributeInfo) => {
    if (
      tempDataInfo.value.target === item.target &&
      tempDataInfo.value.attribute === item.attribute &&
      tempDataInfo.value.bound.target === item.bound.target &&
      tempDataInfo.value.bound.attribute === item.bound.attribute
    ) {
      if (tempDataInfo.value.id !== item.id) {
        // 属性绑定项重复
        repeat = true;
      }
      if (tempDataInfo.value.id === item.id) {
        // 属性绑定项未更改
        attrUnchanged = true;
        // 基础数据未修改
        if (
          tempDataInfo.value.title === item.title &&
          tempDataInfo.value.type === item.type &&
          tempDataInfo.value.bound.script === item.bound.script
        ) {
          infoUnchanged = true;
        }
      }
    }
  });
  if (repeat) {
    message.destroy();
    message.warning("已存在该属性绑定!");
  }
  return { repeat, attrUnchanged, infoUnchanged };
}

/**
 * 确认增加配置项
 */
function confirmAdd() {
  const { repeat } = checkUpRepeat();
  if (repeat) return;
  // 此处使用被绑定元件id作为hashKey,便于被绑定元件元件属性变更时快速查找关系数据
  isArray(data[tempDataInfo.value.bound.target])
    ? data[tempDataInfo.value.bound.target].push(tempDataInfo.value)
    : (data[tempDataInfo.value.bound.target] = [tempDataInfo.value]);
  changeElementData();
  onSearch(searchText.value);
  modalVisible.value = false;
  handleAttributeBind(tempDataInfo.value);
}

/**
 * 确认编辑配置项
 */
function confirmEdit() {
  const { repeat, attrUnchanged, infoUnchanged } = checkUpRepeat();
  if (infoUnchanged) {
    modalVisible.value = false;
    return;
  }
  if (repeat) return;
  if (tempDataInfo.value.bound.target !== handleConfigKey.value) {
    data[handleConfigKey.value].splice(tempDataIndex.value, 1);
    isArray(data[tempDataInfo.value.bound.target])
      ? data[tempDataInfo.value.bound.target].push(tempDataInfo.value)
      : (data[tempDataInfo.value.bound.target] = [tempDataInfo.value]);
  } else {
    data[tempDataInfo.value.bound.target][tempDataIndex.value] = tempDataInfo.value;
  }
  changeElementData();
  onSearch(searchText.value);
  modalVisible.value = false;
  if (!attrUnchanged) {
    handleAttributeBind(tempDataInfo.value);
  }
}

/**
 * 确认删除配置项
 */
function confirmDelete() {
  if (tempDataInfo.value.id && data[handleConfigKey.value][tempDataIndex.value].id === tempDataInfo.value.id) {
    modalVisible.value = false;
  }
  if (handleConfigKey.value !== "" && tempDataIndex.value !== -1) {
    data[handleConfigKey.value]?.splice(tempDataIndex.value, 1);
  }
  onSearch(searchText.value);
  changeElementData();
}

/**
 * 更新组件value
 */
const changeElementData = () => {
  props.insideChange.value = true;
  props.root.value = cloneDeep(data);
};

/**
 * 选择外部需要变更哪个源
 * @param type
 * @param index
 */
enum CurrentTypeInfo {
  BIND = "bind",
  BOUND = "bound",
}
const currentTarget = ref<string>(CurrentTypeInfo.BIND);
function selectCurrent(type: string) {
  if (modalType.value === ModalTypeInfo.SEE) return;
  currentTarget.value = type;
}
function resetCurrent() {
  currentTarget.value = CurrentTypeInfo.BIND;
}
function clearCurrent() {
  currentTarget.value = "";
}

/**
 * 组件外部更新元件源
 * @param value
 */
// @ts-ignore
function changeTarget(value: string) {
  if (!value || !modalVisible.value || !currentTarget.value || modalType.value === ModalTypeInfo.SEE) return;
  switch (currentTarget.value) {
    case CurrentTypeInfo.BIND:
      if (tempDataInfo.value.target === value) return;
      getTargetList();
      tempDataInfo.value.target = value;
      elementChange(value, CurrentTypeInfo.BIND);
      break;
    case CurrentTypeInfo.BOUND:
      getTargetList();
      tempDataInfo.value.bound.target = value;
      elementChange(value, CurrentTypeInfo.BOUND);
      break;
  }
}

/**
 * 检查路由是否正确
 * 添加错误项标识
 */
function checkUpAttributeInfo() {
  const isError =
    tempDataInfo.value._targetState === RouterState.ERROR ||
    tempDataInfo.value.bound._targetState === RouterState.ERROR;
  tempDataInfo.value._state = isError ? RouterState.ERROR : RouterState.OK;
}

/**
 * 检查接收源的page，进行自动修复
 * 添加错误项标识
 */
async function repairRouterConfig() {
  if (!Object.keys(data).length) return;
  Object.keys(data).forEach((key: string) => {
    let tempAttrBindInfo = cloneDeep(data[key]);
    tempAttrBindInfo?.forEach((attrBind: IAttributeInfo, attrIndex: number) => {
      const srcTarget = document.querySelector(`#${attrBind.target}`);
      let isError = false;
      if (srcTarget) {
        attrBind._targetState = RouterState.OK;
      } else {
        attrBind._targetState = RouterState.ERROR;
        isError = true;
      }
      const boundTarget = document.querySelector(`#${attrBind.bound.target}`);
      if (boundTarget) {
        attrBind.bound._targetState = RouterState.OK;
      } else {
        attrBind.bound._targetState = RouterState.ERROR;
        isError = true;
      }
      attrBind.bound.script = String(attrBind.bound.script);
      attrBind._state = isError ? RouterState.ERROR : RouterState.OK;
      data[key][attrIndex] = attrBind;
    });
  });
  onSearch(searchText.value);
  changeElementData();
}

/**
 * code编辑
 */
const codeModal = ref(false);
const codeEditor = ref(null);
const codeStr = ref("");
function showCodeEditor() {
  codeStr.value = tempDataInfo.value.bound.script;
  codeModal.value = true;
}
function codeChange() {
  try {
    const code = (codeEditor.value as any).getValue();
    tempDataInfo.value.bound.script = code;
    codeModal.value = false;
  } catch (error) {
    console.log(error);
    message.error("无法获取编辑器内容!");
  }
}

/**
 * 组件外部更新元件源
 * @param value
 */
function changeContextType(value: boolean) {
  contextType.value = value;
}

onMounted(async () => {
  repairRouterConfig();
});
/**
 * 导出供外部调用函数
 */
defineExpose({
  changeTarget,
  changeContextType,
});
</script>
<style lang="scss" scoped></style>

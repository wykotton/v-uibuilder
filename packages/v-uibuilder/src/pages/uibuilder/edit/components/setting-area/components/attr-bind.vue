<template>
  <a-button @click="attributeModalOpen">属性绑定</a-button>
  <a-modal
    class="my-page-class"
    v-model:visible="attributeModal"
    v-if="attributeModal"
    title="属性绑定"
    :maskClosable="false"
    okText="确定"
    cancelText="取消"
    width="80%"
    :bodyStyle="{ maxHeight: '700px', overflow: 'auto' }"
    @ok="handleAttributeModal"
    @cancel="cancelHandleAttributeModal"
  >
    <div class="w-full flex flex-col items-center">
      <div class="w-600px">
        <a-steps :current="stepCurrent" type="navigation" size="small" class="mb-60px">
          <a-step title="属性列表" />
          <a-step title="可绑定元件" />
          <a-step title="可绑定属性" />
          <a-step title="数据处理函数" />
        </a-steps>
      </div>
    </div>
    <div class="flex mt-10px">
      <div class="border w-260px min-w-200px h-500px max-h-500px overflow-auto">
        <a-input-search
          v-model:value="waitBindSearchValue"
          placeholder="请输入查询内容"
          style="width: 100%; margin-bottom: 10px"
        />
        <a-tree
          v-model:selectedKeys="waitSelectedKey"
          :tree-data="waitBindList"
          :load-data="waitLoadData"
          :check-strictly="true"
          :show-icon="false"
        >
          <template #title="{ title }">
            <span v-if="title.indexOf(waitBindSearchValue) > -1" class="whitespace-nowrap">
              {{ title.substr(0, title.indexOf(waitBindSearchValue)) }}
              <span style="color: #f50">{{ waitBindSearchValue }}</span>
              {{ title.substr(title.indexOf(waitBindSearchValue) + waitBindSearchValue.length) }}
            </span>
            <span v-else>{{ title }}</span>
          </template>
        </a-tree>
      </div>
      <div class="border w-260px min-w-200px h-500px max-h-500px overflow-auto">
        <a-input-search
          v-model:value="componentSearchValue"
          placeholder="请输入查询内容"
          style="width: 100%; margin-bottom: 10px"
        />
        <a-tree
          :selectedKeys="afterSelectedKey"
          :tree-data="useSettingStore.treeData"
          :check-strictly="true"
          :show-icon="false"
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          @expand="onExpand"
          @select="afterSelect"
        >
          <template #title="{ key, title }">
            <div
              v-if="title.indexOf(componentSearchValue) > -1"
              @mouseenter="focusSelectCom(key)"
              @mouseleave="blurSelectCom"
            >
              {{ title.substr(0, title.indexOf(componentSearchValue)) }}
              <span style="color: #f50">{{ componentSearchValue }}</span>
              {{ title.substr(title.indexOf(componentSearchValue) + componentSearchValue.length) }}
            </div>
            <div v-else @mouseenter="focusSelectCom(key)" @mouseleave="blurSelectCom">{{ title }}</div>
          </template>
        </a-tree>
      </div>
      <div class="border w-260px min-w-200px h-500px max-h-500px overflow-auto">
        <a-input-search
          v-model:value="targetBindSearchValue"
          placeholder="请输入查询内容"
          style="width: 100%; margin-bottom: 10px"
        />
        <a-tree
          v-model:selectedKeys="targetSelectedKey"
          :tree-data="targetBindList"
          :load-data="targetLoadData"
          :check-strictly="true"
          :show-icon="false"
        >
          <template #title="{ title }">
            <div v-if="title.indexOf(targetBindSearchValue) > -1" class="whitespace-nowrap">
              {{ title.substr(0, title.indexOf(targetBindSearchValue)) }}
              <span style="color: #f50">{{ targetBindSearchValue }}</span>
              {{ title.substr(title.indexOf(targetBindSearchValue) + targetBindSearchValue.length) }}
            </div>
            <div v-else>{{ title }}</div>
          </template>
        </a-tree>
      </div>
      <div class="border w-260px min-w-200px h-500px max-h-500px overflow-auto flex flex-col items-center">
        <a-textarea v-model:value="targetBindFn" :rows="6" style="width: 100%"></a-textarea>
        <a-button type="primary" style="margin-top: 10px" @click="editBindFn">编辑函数</a-button>
      </div>
      <div class="w-80px h-500px max-h-500px flex items-center justify-center">
        <a-button type="primary" @click="addAttrBind">添加+</a-button>
      </div>
      <div class="border flex-1 min-w-300px h-500px max-h-500px overflow-auto">
        <a-list size="small" bordered :data-source="selectedList">
          <template #renderItem="{ item }">
            <a-list-item>
              <span class="whitespace-pre-line" v-html="item.title"></span>
              <template #actions>
                <div>
                  <a-popconfirm placement="left" ok-text="Yes" cancel-text="No" @confirm="deleteAttrBind(item.index)">
                    <template #title>
                      <p>确定要删除该属性绑定吗?</p>
                    </template>
                    <a>移除</a>
                  </a-popconfirm>
                  <br />
                  <a-divider style="margin: 6px 0" />
                  <a @click="changeBindFn(item.index)">编辑函数</a>
                </div>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </div>
  </a-modal>
  <a-modal
    v-model:visible="codeModal"
    v-if="codeModal"
    title="代码编辑"
    :maskClosable="false"
    okText="确定"
    cancelText="取消"
    width="60%"
    @ok="codeChange"
  >
    <q-code-editor
      ref="codeEditor"
      :value="codeStr"
      language="javascript"
      style="width: 100%; height: 600px; display: block"
    ></q-code-editor>
  </a-modal>
</template>
<script setup lang="ts">
import {
  blurSelectCom,
  focusSelectCom,
  getParentAttribute,
  proxySetFN,
  rewritePropertyDescriptor,
} from "@/composition/index";
import { useAppStoreWithOut } from "@/store/modules/app";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import { IRelationship } from "@/types/IComponentModel";
import DesignerPage from "@/utils/designer/DesignerPage";
import { message, TreeProps } from "ant-design-vue";
import { cloneDeep, isArray, isObject } from "lodash-es";
import { watch } from "vue";
import { JSONPath } from "jsonpath-plus";
import { EventDataNode } from "ant-design-vue/es/tree";

const useSettingStore = useSettingStoreWithOut();
const useAppStore = useAppStoreWithOut();
const attributeModal = ref(false);
const afterSelectedKey = ref<string[]>([]);
const waitSelectedKey = ref<string[]>([]);
const waitBindList = ref<Array<{ title: string; key: string }>>([]);
const targetSelectedKey = ref<string[]>([]);
const targetBindList = ref<Array<{ title: string; key: string }>>([]);
const selectedList = ref<Array<{ title: string; key: string; handleFn: string }>>([]);
const stepCurrent = ref(0);
const pageModel = useAppStore.pageModel;
const waitBindSearchValue = ref("");
const targetBindSearchValue = ref("");
const targetBindFn = ref("function(data){ return data; }");

watch(attributeModal, () => {
  if (!attributeModal.value) {
    clearInfo();
    return;
  }
  reloadBindList(true);
});
watch([waitSelectedKey, afterSelectedKey, targetSelectedKey, targetBindFn], () => {
  if (waitSelectedKey.value.length && afterSelectedKey.value.length && targetSelectedKey.value.length) {
    stepCurrent.value = 3;
  } else if (waitSelectedKey.value.length && afterSelectedKey.value.length) {
    stepCurrent.value = 2;
  } else if (waitSelectedKey.value.length) {
    stepCurrent.value = 1;
  } else {
    stepCurrent.value = 0;
  }
});

/**
 * 元件绑定列表
 */
function reloadBindList(resetList: Boolean) {
  const componentModel = pageModel.currentComponent;
  // 已绑定清单
  const relationArr = (componentModel?.attrBindRelationship ?? []).map((current: IRelationship, index: number) => {
    const { src, selectedKey, target, bindKey, handleFn } = current;
    const value = `<span style="color: #1890ff">${src}</span>--<span style="color: #52c41a">${selectedKey}</span>\n<span style="color: #1890ff">${target}</span>--<span style="color: #52c41a">${bindKey}</span>`;
    return {
      title: value,
      key: value,
      handleFn,
      index,
    };
  });
  selectedList.value = relationArr;
  if (resetList) {
    // 当前元件待绑定属性
    const waitBindArr = Object.keys(componentModel).map((key: string) => {
      return {
        title: key,
        key,
        children: [],
      };
    });
    waitBindList.value = waitBindArr;
  }
}

function attributeModalOpen() {
  expandedKeys.value = cloneDeep(useSettingStore.expandedKeys);
  attributeModal.value = true;
}

/**
 * 移除属性绑定
 */
function deleteAttrBind(index: number) {
  const componentModel = pageModel.currentComponent;
  const { target } = componentModel?.attrBindRelationship[index];
  if (!target) return;
  componentModel?.attrBindRelationship.splice(index, 1);
  reloadBindList(false);
}

/**
 * 添加属性绑定
 */
function addAttrBind() {
  if (stepCurrent.value !== 3) {
    message.destroy();
    message.warning("请完善属性绑定流程!");
    return;
  }
  const componentModel = pageModel.currentComponent;
  const RELAKEY = "attrBindRelationship";
  const [waitKey] = waitSelectedKey.value;
  const [afterkey] = afterSelectedKey.value;
  const [bindKey] = targetSelectedKey.value;
  const handleFn = targetBindFn.value;
  const proxyModel = pageModel.get(afterkey);
  if (!proxyModel || !componentModel) return;
  // const element = document.createElement(proxyModel.iovSchema.componentName) as any;
  // const reductionTempObj = Object.getOwnPropertyDescriptor(element.componentModel.model, bindKey);
  const relationship = Reflect.get(componentModel, RELAKEY);
  const index = relationship.findIndex(
    (item: { [key: string]: string }) =>
      item.src === componentModel.id &&
      item.selectedKey === waitKey &&
      item.target === afterkey &&
      item.bindKey === bindKey
  );
  if (index !== -1) {
    message.destroy();
    message.warning("已存在该属性绑定!");
    return;
  }
  Reflect.set(componentModel, RELAKEY, {
    src: componentModel.id,
    selectedKey: waitKey,
    target: afterkey,
    bindKey,
    handleFn,
  });
  const { currentAttr, currentKey } = getParentAttribute(proxyModel, bindKey);
  // 进行set重写
  rewritePropertyDescriptor(proxyModel, currentAttr, currentKey, bindKey, componentModel.id);
  // 初次重写完成后调用一次数据绑定
  proxySetFN(bindKey, componentModel.id, proxyModel.id);
  // element.remove();
  reloadBindList(false);
}

/**
 * 属性弹窗确定操作
 */
function handleAttributeModal() {
  attributeModal.value = false;
  clearUpSearch();
}

function clearInfo() {
  waitSelectedKey.value.length = 0;
  targetSelectedKey.value.length = 0;
  afterSelectedKey.value.length = 0;
  targetBindList.value.length = 0;
  targetBindFn.value = "function(data){ return data; }";
  stepCurrent.value = 0;
}

function cancelHandleAttributeModal() {
  clearInfo();
  clearUpSearch();
}

/**
 * 元件树
 */
const componentSearchValue = ref("");
const autoExpandParent = ref(true);
const expandedKeys = ref<string[]>([]);
watch(componentSearchValue, () => {
  autoExpandParent.value = true;
});
const onExpand = (keys: string[]) => {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
};
const afterSelect = (selectedKeys: string[]) => {
  const [targetKey] = selectedKeys;
  const componentModel = pageModel.currentComponent;
  if (componentModel?.id === targetKey) {
    message.destroy();
    message.warning("不可绑定自身属性!");
    return;
  }
  afterSelectedKey.value = selectedKeys;
  const model = DesignerPage.componentsArray.find((current) => current.id === targetKey) ?? {};
  targetBindList.value = Object.keys(model).map((key) => {
    return {
      title: key,
      key,
      children: [],
    };
  });
};

/**
 * 清除所有搜索内容
 */
function clearUpSearch() {
  waitBindSearchValue.value = "";
  componentSearchValue.value = "";
  targetBindSearchValue.value = "";
}

/**
 * 异步加载元件属性
 */
const waitLoadData: TreeProps["loadData"] = (treeNode) => {
  return onLoadData(treeNode, true);
};
const targetLoadData: TreeProps["loadData"] = (treeNode) => {
  return onLoadData(treeNode, false);
};
function onLoadData(treeNode: EventDataNode, isWait: Boolean) {
  return new Promise<void>((resolve) => {
    const { key = "", children = [] } = treeNode.dataRef || <Record<string, any>>{};
    if (!treeNode.dataRef || children.length || !key) {
      resolve();
      return;
    }
    let componentModel = {};
    if (isWait) {
      componentModel = pageModel.currentComponent;
    } else {
      const [targetKey] = afterSelectedKey.value;
      componentModel = DesignerPage.componentsArray.find((current) => current.id === targetKey) ?? {};
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
      if (isWait) {
        waitBindList.value = [...waitBindList.value];
      } else {
        targetBindList.value = [...targetBindList.value];
      }
    }
    resolve();
  });
}

/**
 * 编辑数据处理函数
 */
const codeModal = ref(false);
const codeEditor = ref(null);
const codeStr = ref("");
const codeType = ref("");
const editIndex = ref(-1);
const enum codeTypeEnum {
  ADD = "add",
  EDIT = "edit",
}
function editBindFn() {
  codeType.value = codeTypeEnum.ADD;
  codeStr.value = targetBindFn.value;
  codeModal.value = true;
}
function changeBindFn(index: number) {
  editIndex.value = index;
  codeType.value = codeTypeEnum.EDIT;
  const { handleFn = "" } = selectedList.value[index];
  codeStr.value = handleFn;
  codeModal.value = true;
}
function codeChange() {
  const code = (codeEditor.value as any).getValue();
  switch (codeType.value) {
    case codeTypeEnum.ADD:
      targetBindFn.value = code;
      break;
    case codeTypeEnum.EDIT:
      const componentModel = pageModel.currentComponent;
      const attrBindRelationship = componentModel?.attrBindRelationship ?? [];
      if (attrBindRelationship[editIndex.value]) {
        attrBindRelationship[editIndex.value].handleFn = code;
      }
      break;
  }
  codeModal.value = false;
}
</script>
<style lang="scss">
body.my-page-class {
  :deep(.ant-modal-body) {
    background-color: red;
  }
}
</style>

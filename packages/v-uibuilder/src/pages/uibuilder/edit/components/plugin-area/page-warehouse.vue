<template>
  <div class="page-container">
    <a-spin :spinning="componentsLoading">
      <a-input-search
        @search="searchPage"
        v-model:value="searchText"
        placeholder="输入页面名查询"
        class="w-full py-12px"
      ></a-input-search>
      <div ref="compRef">
        <a-button type="primary" @click="handleOperation">操作</a-button>
        <a-divider type="vertical" />
        <a-select
          v-model:value="selectOperation"
          class="w-90px"
          placeholder="选择操作"
          :options="operationList"
        ></a-select>
        <a-tabs v-model:activeKey="tabsActiveKey">
          <a-tab-pane v-for="(item, index) in group" :key="index" :tab="item">
            <a-collapse v-model:activeKey="activeKey[index]">
              <template v-for="(panel, pIndex) in pageSchema">
                <a-collapse-panel
                  :header="panel[0]"
                  :key="pIndex"
                  v-if="panel[1].some((current: any) => current?.group?.includes(item))"
                >
                  <ul class="com-menu-ul">
                    <template v-for="com in panel[1]">
                      <li
                        class="com-menu-li cursor-pointer"
                        draggable="true"
                        :key="com?.id"
                        v-if="com?.group?.includes(item)"
                      >
                        <div class="com-menu-item">
                          <span class="com-menu-name" v-html="com.highlights || com.name"></span>
                          <DownloadOutlined
                            class="com-menu-download"
                            @click="importToDesigner(com.id)"
                          ></DownloadOutlined>
                        </div>
                      </li>
                    </template>
                  </ul>
                </a-collapse-panel>
              </template>
            </a-collapse>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-spin>
    <div class="page-add-btn">
      <a-button @click="showPageModel" block>新建页面库</a-button>
    </div>
  </div>
  <a-modal
    v-model:visible="pageModelVisible"
    v-if="pageModelVisible"
    title="新建页面"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    :closable="false"
    @ok="addPage"
    @cancel="closePageModel"
  >
    <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
      <a-form-item :required="true" label="存储库">
        <a-radio-group v-model:value="radioType" button-style="solid" @change="warehouseChange">
          <a-radio-button value="user">我的页面</a-radio-button>
          <a-radio-button value="public">公共页面</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        :required="true"
        :label="isNewType === 'choose' ? '选择类型' : '新增类型'"
        :validate-status="rules.type.validateStatus"
        :help="rules.type.errorMsg"
      >
        <a-select
          v-if="isNewType === 'choose'"
          v-model:value="pageInfo.type"
          placeholder="请选择页面类型"
          @change="pageInfoChange('type')"
          style="width: 235px"
        >
          <a-select-option v-for="(item, index) in typeArr" :value="item" :key="index">
            {{ item }}
          </a-select-option>
        </a-select>
        <a-input
          v-else
          v-model:value="pageInfo.type"
          :maxLength="15"
          placeholder="请输入页面类型"
          @change="pageInfoChange('type')"
          style="width: 235px"
        />
        <a-divider type="vertical" />
        <a-radio-group v-model:value="isNewType" @change="clearRules">
          <a-radio-button value="choose">选择</a-radio-button>
          <a-radio-button value="add">新增</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        :required="true"
        label="名称"
        :validate-status="rules.name.validateStatus"
        :help="rules.name.errorMsg"
      >
        <a-input
          v-model:value="pageInfo.name"
          :maxLength="15"
          placeholder="请输入元件集合名称"
          @change="pageInfoChange('name')"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import { createVNode } from "vue";
import { Modal } from "ant-design-vue";
import { message } from "ant-design-vue";
import type { SelectProps } from "ant-design-vue";
import { QuestionCircleOutlined, DownloadOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { cloneDeep, isArray, isEqual, isString } from "lodash-es";
import { useUserStoreWithOut } from "@/store/modules/user";
import { ComponentProtocolEnum } from "@/enums/appEnum";
import { IPageWarehouseOptions } from "@/types/IPageWarehouse";
import { searchPageWarehouseApi, findPageWarehouseApi, loadPageWarehouseApi } from "@/api/uibuilder/edit";
import { dataSearch, savePageWarehouse } from "@/composition/index";
import { useRoute } from "vue-router";

// pinia
const useUserStore = useUserStoreWithOut();

// 路由对象
const route = useRoute();

const componentsLoading = ref(true);
const group = ref([]);
const activeKey = ref([[], [], []]);
const compRef = ref(null);
const pageList = ref<any>([]);
const pageSchema = ref();
const tabsActiveKey = ref(0);
const selectOperation = ref(ComponentProtocolEnum.REFRESH);
const operationList = ref<SelectProps["options"]>([
  {
    value: ComponentProtocolEnum.REFRESH,
    label: "刷新页面库",
  },
  {
    value: ComponentProtocolEnum.IMPORT,
    label: "导入页面",
  },
  {
    value: ComponentProtocolEnum.EXPORT,
    label: "导出页面",
  },
  {
    value: ComponentProtocolEnum.DELETE,
    label: "删除页面",
  },
]);

function useGetComponent() {
  refreshPageWarehouse();
  setTimeout(async () => {
    const pageWarehouse = document.querySelector("[page-warehouse]");
    if (pageWarehouse) {
      let list = pageWarehouse.getAttribute("list");
      try {
        isString(list) ? (list = JSON.parse(list)) : void 0;
        if (isArray(list)) {
          pageList.value = list;
          pageSchema.value = await transformSchema(list);
        } else {
          pageList.value = [];
        }
      } catch (error) {
        pageList.value = [];
        console.log(error);
      }
    } else {
      pageList.value = [];
    }
  }, 200);
}
onMounted(() => {
  useGetComponent();
});

/**
 * 返回页面库数据
 * @param components
 */
async function transformSchema(components: any[]) {
  const componentMap = new Map();
  componentsLoading.value = true;

  for await (const current of components) {
    const { type = "", group: tGroup = [] } = current;
    // await DesignerPage.defineCustomWebcomponent(current);
    // const target = document.createElement(name) as any;

    // if (!target) return;
    // // 兼容DI Angular组件创建后不初始化的问题
    // if (target && !target.componentModel && target.connectedCallback) {
    //   target?.connectedCallback();
    // }

    const modelGroup = isString(tGroup) ? JSON.parse(tGroup) : tGroup;
    const modelType = type;

    Object.assign(group.value, [...new Set([...group.value, ...modelGroup])]);

    if (!modelType) {
      console.error(`页面类型不存在`);
      continue;
    }
    if (!componentMap.has(modelType)) {
      componentMap.set(modelType, []);
    }
    componentMap.get(modelType).push(cloneDeep(current));
  }
  componentsLoading.value = false;
  return componentMap;
}

/**
 * 查询页面
 */
const searchText = ref("");
async function searchPage() {
  if (!searchText.value) {
    pageSchema.value = await transformSchema(pageList.value);
    return;
  }
  const results = dataSearch(pageList.value, searchText.value, "page");
  pageSchema.value = await transformSchema(results);
}

/**
 * 操作页面库
 */
const eventName = "pageWarehouse";
function handleOperation() {
  switch (selectOperation.value) {
    case ComponentProtocolEnum.REFRESH:
      useGetComponent();
      break;
    default:
      window.dispatchEvent(new CustomEvent(eventName, { detail: { type: selectOperation.value } }));
  }
}
function refreshPageWarehouse() {
  window.dispatchEvent(new CustomEvent(eventName, { detail: { type: ComponentProtocolEnum.REFRESH } }));
}
// function deletePageWarehouse() {
//   window.dispatchEvent(new CustomEvent(eventName, { detail: { type: ComponentProtocolEnum.DELETE } }));
// }
// function importPageWarehouse() {
//   window.dispatchEvent(new CustomEvent(eventName, { detail: { type: ComponentProtocolEnum.IMPORT } }));
// }
// function exportPageWarehouse() {
//   window.dispatchEvent(new CustomEvent(eventName, { detail: { type: ComponentProtocolEnum.EXPORT } }));
// }

/**
 * 页面Modal
 */
const pageModelVisible = ref(false);
const showPageModel = () => {
  pageModelVisible.value = true;
  getTypes(["我的页面"]);
};
const closePageModel = () => {
  if (confirmLoading.value) {
    pageModelVisible.value = true;
    message.destroy();
    message.warning("正在保存中, 请稍后再试!");
    return;
  }
  resetForm();
};

/**
 * page可选类型
 */
const typeArr = ref<string[]>([]);
const getTypes = (group: Array<string>) => {
  pageList.value.forEach((item: IPageWarehouseOptions) => {
    if (!item.group || !item.type) return;
    isString(item.group) ? (item.group = JSON.parse(item.group)) : void 0;
    if (isEqual(item.group, group) && !typeArr.value.includes(item.type)) {
      typeArr.value.push(item.type);
    }
  });
};

/**
 * 数据校验
 */
const rules: { [key: string]: any } = reactive({
  type: { validateStatus: "", errorMsg: "" },
  name: { validateStatus: "", errorMsg: "" },
});
const clearRules = () => {
  pageInfo.type = "";
  rules.type = { validateStatus: "", errorMsg: "" };
};
const checkFun = (data: string, { msg1, msg2 }: { [key: string]: string }, rulesKey: string) => {
  const reg = new RegExp("[`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？\\s]");
  if (!data || data === "" || reg.test(data)) {
    rules[rulesKey].validateStatus = "error";
    rules[rulesKey].errorMsg = reg.test(data) ? msg1 : msg2;
    return false;
  }
  return true;
};
const checkCombination = (type: string) => {
  switch (type) {
    case "type":
      return checkFun(
        pageInfo.type,
        {
          msg1: "不允许包含特殊字符",
          msg2: isNewType.value === "add" ? "请输入正确的页面类型" : "请选择正确的页面类型",
        },
        "type"
      );
    case "name":
      return checkFun(pageInfo.name, { msg1: "不允许包含特殊字符", msg2: "请输入正确的页面名称" }, "name");
  }
  return false;
};
const resetForm = () => {
  typeArr.value = [];
  rules.type = { validateStatus: "", errorMsg: "" };
  rules.name = { validateStatus: "", errorMsg: "" };
  pageInfo.type = "";
  pageInfo.name = "";
  isNewType.value = "add";
  radioType.value = "user";
};

/**
 * 页面信息
 */
const pageInfo = reactive({
  type: "",
  name: "",
});
const radioType = ref("user");
const isNewType = ref("add");
const warehouseChange = () => {
  typeArr.value = [];
  clearRules();
  radioType.value === "user" ? getTypes(["我的页面"]) : getTypes(["公共页面"]);
};
const pageInfoChange = (type: string) => {
  if (type === "type") {
    if (checkCombination("type")) {
      rules.type = { validateStatus: "", errorMsg: "" };
    }
  } else {
    if (checkCombination("name")) {
      rules.name = { validateStatus: "", errorMsg: "" };
    }
  }
};

/**
 * 新增页面
 */
const confirmLoading = ref(false);
const addPage = async () => {
  if (!checkCombination("type") || !checkCombination("name")) return;
  const userInfo = useUserStore.getUibUserInfo;
  if (!userInfo?.id) {
    message.destroy();
    message.error("未获取到用户信息, 请重新登录后再试!");
    return;
  }
  const searchInfo = await searchPageWarehouseApi({
    userId: radioType.value === "user" ? userInfo.id : "",
    name: pageInfo.name,
  });
  const {
    results,
    info: { msg = "" },
  } = searchInfo.data;
  if (msg !== "success") {
    message.destroy();
    message.error("页面数据查找失败, 请重试!");
    return;
  }
  if (results?.length) {
    Modal.confirm({
      content: "已存在该页面, 是否覆盖？",
      icon: createVNode(QuestionCircleOutlined),
      onOk() {
        handleSave();
      },
    });
  } else {
    handleSave();
  }
};

/**
 * 保存页面
 */
const handleSave = async () => {
  confirmLoading.value = true;
  const results = await savePageWarehouse(pageInfo, radioType.value);
  confirmLoading.value = false;
  const {
    info: { msg = "" },
  } = results.data;
  if (msg === "success") {
    message.success("保存成功");
    pageModelVisible.value = false;
    resetForm();
    // 刷新页面库
    useGetComponent();
  } else {
    message.error("保存到页面库失败!");
  }
};

/**
 * 导入当前数据到designer
 * @param id
 */
function importToDesigner(id: string) {
  Modal.confirm({
    title: "确定要载入页面吗?",
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode("div", { style: "color:red;" }, `当前页面数据将会被完全覆盖`),
    onOk: async () => {
      const data = await findPageWarehouseApi({ ids: [id] });
      const {
        results,
        info: { msg = "" },
      } = data.data;
      if (msg !== "success") {
        message.destroy();
        message.error("页面数据查找失败, 请重试!");
        return;
      }
      if (!results.length) {
        message.destroy();
        message.error("页面数据不存在!");
        return;
      }
      updatePageInfo(results[0]);
    },
  });
}
async function updatePageInfo(info: any) {
  const id = Number(route.query.id);
  if (!id) {
    message.destroy();
    message.error("页面实例id不存在, 无法进行操作!");
    return;
  }
  const userInfo = useUserStore.getUibUserInfo;
  if (!userInfo?.sso_user_id) {
    message.destroy();
    message.error("未查询到用户信息, 请重新登录后再试!");
    return;
  }
  const { custom_model, theme } = info;
  const data = { custom_model, theme, id, userId: userInfo.id };
  const results = await loadPageWarehouseApi(data);
  const {
    info: { msg = "" },
  } = results.data;
  if (msg !== "success") {
    message.destroy();
    message.error("页面载入失败, 请重试!");
    return;
  }
  location.reload();
}
</script>
<style lang="scss" scoped>
.page-container {
  height: calc(100% - 40px);
  overflow-x: hidden;
  /* 兼容其他浏览器，防止overflow-y: overlay不生效 */
  overflow-y: auto;
  overflow-y: overlay;

  .page-add-btn {
    width: calc(100% - 48px);
    bottom: 15px;
    z-index: 1;
    padding: 0;
    position: absolute;
    display: flex;
    justify-content: center;
  }
}

.com-menu-ul {
  width: 100%;
  margin: 0;
}

.com-menu-li {
  width: 100%;
  height: 42px;
  position: relative;
  padding-left: 15px;

  &:hover {
    -webkit-box-shadow: 0 6px 16px 0 rgb(0 0 0 / 15%);
    box-shadow: 0 6px 16px 0 rgb(0 0 0 / 15%);
    border-color: transparent;
    background-color: #e6f7ff;
  }
}

.com-menu-item {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  .com-menu-name {
    width: 70%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .com-menu-download {
    margin-left: auto;
    margin-top: 5px;
    font-size: 18px;
    margin-right: 15px;
    display: none;
  }

  &:hover {
    .com-menu-download {
      display: block;
    }
  }
}

::v-deep(.highlights-text) {
  color: #ff5134;
}

::v-deep(.ant-collapse-content-box) {
  padding: 0 !important;
}
::v-deep(.ant-collapse-content) {
  overflow: hidden;
}
</style>

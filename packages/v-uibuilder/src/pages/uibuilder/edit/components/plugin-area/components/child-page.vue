<template>
  <div class="page-container">
    <a-spin :spinning="componentsLoading">
      <a-input-search
        @search="searchPage"
        v-model:value="searchText"
        placeholder="输入页面名查询"
        class="w-full"
      ></a-input-search>
      <div v-for="(item, index) in tempPageList" class="page-card">
        <div>
          <div class="card-title" v-html="item.nameHighlights || item.name"></div>
          <div class="card-key" @click="copied(item.id)" title="点击可复制ID">
            <span class="select-none">ID：</span>
            <span v-html="item.idHighlights || item.id"></span>
          </div>
        </div>
        <!-- <a-tooltip placement="bottom">
          <template #title>
            <span>查看</span>
          </template>
          <eye-outlined :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: 'auto' }" @click="" />
        </a-tooltip> -->
        <a-tooltip placement="bottom">
          <template #title>
            <span>编辑</span>
          </template>
          <form-outlined
            :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: 'auto' }"
            @click="editChildPage(item.id)"
          />
        </a-tooltip>
        <a-tooltip placement="bottom">
          <template #title>
            <span>复制</span>
          </template>
          <copy-outlined
            :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }"
            @click="showPageModel(operationType.COPY, index)"
          />
        </a-tooltip>
        <a-tooltip placement="bottom">
          <template #title>
            <span>重命名</span>
          </template>
          <highlight-outlined
            :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }"
            @click="showPageModel(operationType.RENAME, index)"
          />
        </a-tooltip>
        <a-tooltip placement="bottom">
          <template #title>
            <span>删除</span>
          </template>
          <delete-outlined
            :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }"
            @click="handleDelete(index)"
          />
        </a-tooltip>
      </div>
    </a-spin>
    <div class="page-add-btn">
      <a-button @click="showPageModel(operationType.ADD, -1)" block>新建子页面</a-button>
    </div>
  </div>
  <a-modal
    v-model:visible="pageModelVisible"
    v-if="pageModelVisible"
    :title="modelTitle"
    :maskClosable="false"
    :closable="false"
    @ok="handleModel"
  >
    <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
      <a-form-item :required="true" label="子页面名称" :validate-status="rules.validateStatus" :help="rules.errorMsg">
        <a-input
          v-model:value="childPageName"
          show-count
          :maxlength="30"
          placeholder="请输入子页面名称"
          @change="checkName"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import {
  addChildPageApi,
  deleteChildPageApi,
  findChildPageApi,
  getChildPageApi,
  renameChildPageApi,
} from "@/api/uibuilder/edit";
import { createHash } from "@/utils/uuid";
import { FormOutlined, DeleteOutlined, CopyOutlined, HighlightOutlined } from "@ant-design/icons-vue";
import { cloneDeep } from "lodash-es";
import { useAppStoreWithOut } from "@/store/modules/app";
import { message, Modal } from "ant-design-vue";
import { editChildPage } from "@/composition/index";
import { useClipboard } from "@vueuse/core";

// pinia
const useAppStore = useAppStoreWithOut();

interface IChildPageInfo {
  id: string;
  name: string;
  idHighlights?: string;
  nameHighlights?: string;
  innerDropzone: any[];
  bottomDropzone: any[];
}
const componentsLoading = ref(false);
const childPageName = ref("");
const childPageList = ref<IChildPageInfo[]>([]);
const tempPageList = ref<IChildPageInfo[]>([]);

/**
 * 复制子页面ID
 * @param id
 */
const { copy } = useClipboard({ legacy: true });
async function copied(id: string) {
  message.destroy();
  copy(id)
    .then(() => {
      message.success(`已复制子页面ID_${id}`);
    })
    .catch(() => {
      message.warning("此环境不支持复制操作, 请手动复制ID");
    });
}

/**
 * 查询页面
 */
const searchText = ref("");
async function searchPage() {
  if (!searchText.value) {
    tempPageList.value = childPageList.value;
    return;
  }
  tempPageList.value = [];
  cloneDeep(childPageList.value).forEach((item: IChildPageInfo) => {
    let temp = { ...item };
    const nameReg = item.name?.indexOf(searchText.value) > -1;
    const idReg = item.id?.indexOf(searchText.value) > -1;
    if (nameReg || idReg) {
      if (nameReg) {
        let replaceReg = new RegExp(searchText.value, "g"); // 匹配关键字正则
        let replaceString = '<span style="color: red">' + searchText.value + "</span>"; // 高亮替换v-html值
        temp["nameHighlights"] = temp.name.replace(replaceReg, replaceString);
      }
      if (idReg) {
        let replaceReg = new RegExp(searchText.value, "g"); // 匹配关键字正则
        let replaceString = '<span style="color: red">' + searchText.value + "</span>"; // 高亮替换v-html值
        temp["idHighlights"] = temp.id.replace(replaceReg, replaceString);
      }
      tempPageList.value.push(temp);
    }
  });
}

/**
 * 页面Modal
 */
const pageModelVisible = ref(false);
const modelTitle = ref("");
const modelType = ref("");
const pageIndex = ref(-1);
enum operationType {
  ADD = "add",
  COPY = "copy",
  RENAME = "rename",
}
function showPageModel(type: string, index: number) {
  modelType.value = type;
  pageIndex.value = index;
  resetRules();
  switch (type) {
    case operationType.ADD:
      modelTitle.value = "新增子页面";
      childPageName.value = "";
      break;
    case operationType.COPY:
      modelTitle.value = "复制子页面";
      childPageName.value = tempPageList.value[index].name;
      break;
    case operationType.RENAME:
      modelTitle.value = "重命名子页面";
      childPageName.value = tempPageList.value[index].name;
      break;
  }
  pageModelVisible.value = true;
}
function handleModel() {
  switch (modelType.value) {
    case operationType.ADD:
      addChildPage();
      break;
    case operationType.COPY:
      copyChildPage();
      break;
    case operationType.RENAME:
      renameChildPage();
      break;
  }
}

/**
 * 检查name合法性
 */
const rules = reactive({
  validateStatus: "",
  errorMsg: "",
});
function checkName() {
  let status = true;
  const reg = new RegExp("[`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？\\s]");
  if (!childPageName.value || childPageName.value === "" || reg.test(childPageName.value)) {
    rules.validateStatus = "error";
    rules.errorMsg = reg.test(childPageName.value) ? "不允许包含特殊字符" : "请输入正确的页面名称";
    status = false;
  } else {
    resetRules();
    status = true;
  }
  let index = -1;
  switch (modelType.value) {
    case operationType.RENAME:
      const id = tempPageList.value[pageIndex.value].id;
      index = childPageList.value.findIndex((item) => item.name === childPageName.value && item.id !== id);
      break;
    default:
      index = childPageList.value.findIndex((item) => item.name === childPageName.value);
      break;
  }
  if (index !== -1) {
    rules.validateStatus = "error";
    rules.errorMsg = "已存在相同名称子页面";
    status = false;
  }
  return status;
}
function resetRules() {
  rules.validateStatus = "";
  rules.errorMsg = "";
}

/**
 * 新增操作
 * @param info
 * @param errorMsg
 */
async function addRequest(info: Record<string, any>, errorMsg: string) {
  const request = await addChildPageApi(info);
  const {
    code,
    info: { msg = "" },
  } = request.data;
  message.destroy();
  if (code !== 200) {
    message.error(msg || `${errorMsg}子页面失败`);
    return;
  }
  message.success(`已${errorMsg}子页面`);
  pageModelVisible.value = false;
  getChildPage();
}

/**
 * 新增子页面
 */
async function addChildPage() {
  if (!checkName()) return;
  const projectId = useAppStore.pageInstance.project_id;
  if (!projectId) return;
  const info = {
    projectId,
    id: createHash(),
    name: childPageName.value,
    innerDropzone: [],
    bottomDropzone: [],
  };
  addRequest(info, "新增");
}

/**
 * 复制子页面
 */
async function copyChildPage() {
  const id = tempPageList.value[pageIndex.value].id;
  const projectId = useAppStore?.pageInstance?.project_id;
  if (!id || !projectId) return;
  const request = await findChildPageApi({ projectId, id });
  const {
    code,
    results,
    info: { msg = "" },
  } = request.data;
  if (code !== 200) {
    message.destroy();
    message.error(msg);
    return;
  }
  if (!checkName()) return;
  const info = {
    ...results,
    projectId,
    id: createHash(),
    name: childPageName.value,
  };
  addRequest(info, "复制");
}

/**
 * 重命名子页面
 */
async function renameChildPage() {
  const id = tempPageList.value[pageIndex.value].id;
  const projectId = useAppStore?.pageInstance?.project_id;
  if (!id || !projectId) {
    message.destroy();
    message.error("参数错误, 未找到子页面ID或项目ID!");
    return;
  }
  const name = tempPageList.value[pageIndex.value].name;
  if (name === childPageName.value) {
    pageModelVisible.value = false;
    return;
  }
  if (!checkName()) return;
  const request = await renameChildPageApi({ projectId, id, name: childPageName.value });
  const {
    code,
    info: { msg = "" },
  } = request.data;
  message.destroy();
  if (code !== 200) {
    message.error(msg);
    return;
  }
  message.success("重命名子页面成功");
  pageModelVisible.value = false;
  const index = childPageList.value.findIndex((item) => item.id === id);
  if (index !== -1) {
    childPageList.value[index].name = childPageName.value;
    searchPage();
  }
}

/**
 * 处理删除操作
 * @param index
 */
function handleDelete(index: number) {
  Modal.confirm({
    title: "确定要删除该子页面吗?",
    okText: "确定",
    cancelText: "取消",
    onOk() {
      deleteChildPage(index);
    },
  });
}

/**
 * 删除子页面
 * @param index
 */
async function deleteChildPage(index: number) {
  const projectId = useAppStore.pageInstance.project_id;
  const id = tempPageList.value[index].id;
  if (!id || !projectId) return;
  if (id === useAppStore.childPageId) {
    message.destroy();
    message.warning("正在编辑当前子页面, 无法进行删除操作!");
    return;
  }
  const request = await deleteChildPageApi({ projectId, id });
  const {
    code,
    info: { msg = "" },
  } = request.data;
  message.destroy();
  if (code !== 200) {
    message.error(msg || "删除子页面失败");
    return;
  }
  message.success("删除子页面成功");
  getChildPage();
}

/**
 * 获取项目子页面列表
 */
async function getChildPage() {
  const projectId = useAppStore.pageInstance.project_id;
  if (!projectId) return;
  componentsLoading.value = true;
  const request = await getChildPageApi({ projectId });
  const {
    results = [],
    info: { msg = "" },
  } = request.data;
  if (msg !== "success") {
    message.destroy();
    message.error("页面数据查找失败, 请重试!");
    componentsLoading.value = false;
    return;
  }
  childPageList.value = results.reverse();
  searchPage();
  componentsLoading.value = false;
}
onMounted(() => {
  getChildPage();
});
</script>
<style scoped lang="scss">
.page-container {
  height: calc(100% - 40px);
  overflow-x: hidden;
  overflow-y: auto;

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

.page-card {
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #e1e4e8;

  .card-title {
    font-weight: 600;
    color: #666666;
  }
  .card-key {
    padding: 0 6px;
    margin-top: 4px;
    border-radius: 2px;
    background-color: #eaebef;
    cursor: copy;
  }
}
</style>

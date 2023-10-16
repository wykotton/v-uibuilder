<template>
  <div>
    <a-modal
      v-model:visible="projectModal"
      :closable="false"
      :maskClosable="false"
      :keyboard="false"
      title="选择或新建"
    >
      <template #footer>
        <a-button key="submit" type="primary" :loading="modalLoading" @click="chooseOrAdd">确定</a-button>
      </template>
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-item
          :required="true"
          :label="isNewType === ProjectType.CHOOSE ? '选择项目' : '新建项目'"
          :validate-status="projectRules.project.validateStatus"
          :help="projectRules.project.errorMsg"
        >
          <a-select
            v-if="isNewType === ProjectType.CHOOSE"
            v-model:value="projectId"
            placeholder="请选择项目"
            style="width: 235px"
            show-search
            @change="changePageList"
          >
            <a-select-option v-for="item in tempProjectList" :value="item.id" :key="item.id">
              {{ item.project_name }}
            </a-select-option>
          </a-select>
          <a-input
            v-else
            v-model:value="projectName"
            :maxLength="15"
            placeholder="请输入项目名称"
            style="width: 235px"
            @change="validateStatus(true)"
          />
          <a-divider type="vertical" />
          <a-radio-group v-model:value="isNewType" @change="clearRules(true, false)">
            <a-radio-button value="choose">选择</a-radio-button>
            <a-radio-button value="add">新增</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="isNewType === ProjectType.CHOOSE"
          :required="true"
          :label="isPageType === ProjectType.CHOOSE ? '选择页面' : '新建页面'"
          :validate-status="projectRules.page.validateStatus"
          :help="projectRules.page.errorMsg"
        >
          <a-select
            v-if="isPageType === ProjectType.CHOOSE"
            v-model:value="pageId"
            placeholder="请选择页面"
            style="width: 235px"
            show-search
            @change="clearRules(false, true)"
          >
            <a-select-option v-for="item in tempPageList" :value="item.id" :key="item.id">
              {{ item.page_name || "未命名页面" }}
            </a-select-option>
          </a-select>
          <a-input
            v-else
            v-model:value="pageName"
            :maxLength="15"
            placeholder="请输入页面名称"
            style="width: 235px"
            @change="validateStatus(false)"
          />
          <a-divider type="vertical" />
          <a-radio-group v-if="showPageType" v-model:value="isPageType" @change="clearRules(false, true)">
            <a-radio-button value="choose">选择</a-radio-button>
            <a-radio-button value="add">新增</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal v-model:visible="websiteModal" :closable="false" :maskClosable="false" :keyboard="false" title="选择项目">
      <template #footer>
        <a-button key="submit" type="primary" @click="addWebsite">确定</a-button>
      </template>
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-item :required="true" label="选择项目" :validate-status="websiteStatus" :help="websiteHelp">
          <a-select
            v-model:value="websiteProject"
            placeholder="请选择项目"
            style="width: 235px"
            show-search
            @change="changeProject"
          >
            <a-select-option v-for="item in tempProjectList" :value="item.id" :key="item.id">
              {{ item.project_name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { PageInfo, ProjectInfo } from "@/types/workspace";
import { isStringNormal } from "@/utils/utils";
import { workspaceAddProjectApi, workspaceGetProjectApi, workspaceProjectsApi } from "@/api/uibuilder/workspace";
import { message, Modal } from "ant-design-vue";
import { checkUser, createPage, createWebsite, handleEndToEndMethod, logout } from "@/composition/index";
import { useRouter } from "vue-router";
import { useWorkspaceStoreWithOut } from "@/store/modules/workspace";
import { createVNode } from "vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { EndToEndEnum } from "@/enums/settingEnum";
import { cloneDeep } from "lodash-es";

// 路由对象
const router = useRouter();

// pinia
const useWorkspaceStore = useWorkspaceStoreWithOut();

/**
 * 端到端引导操作
 */
enum ProjectType {
  CHOOSE = "choose",
  ADD = "add",
}
const projectModal = ref(false);
const modalLoading = ref(false);
const isNewType = ref(ProjectType.ADD);
const isPageType = ref(ProjectType.ADD);
const showPageType = ref(true);
const projectId = ref<string | undefined>(undefined);
const projectName = ref("");
const tempProjectList = ref<ProjectInfo[]>([]);
const tempPageList = ref<PageInfo[]>([]);
const pageId = ref<string | undefined>(undefined);
const pageName = ref("");
const projectRules = reactive({
  project: { validateStatus: "", errorMsg: "" },
  page: { validateStatus: "", errorMsg: "" },
});
function clearRules(isProject: boolean, isPage: boolean) {
  isProject && (projectRules.project = { validateStatus: "", errorMsg: "" });
  isPage && (projectRules.page = { validateStatus: "", errorMsg: "" });
}
// 表单校验
function validateStatus(isProject: boolean) {
  let status = true;
  let rules = { validateStatus: "", errorMsg: "" };
  switch (isProject ? isNewType.value : isPageType.value) {
    case ProjectType.CHOOSE:
      if (isProject ? !projectId.value : !pageId.value) {
        rules = { validateStatus: "error", errorMsg: `请选择${isProject ? "项目" : "页面"}` };
        status = false;
      }
      break;
    case ProjectType.ADD:
      if (isProject ? !projectName.value : !pageName.value) {
        rules = { validateStatus: "error", errorMsg: `请输入${isProject ? "项目" : "页面"}名称` };
        status = false;
      }
      if (!isStringNormal(isProject ? projectName.value : pageName.value)) {
        rules = { validateStatus: "error", errorMsg: "请勿输入特殊字符" };
        status = false;
      }
  }
  isProject ? (projectRules.project = rules) : (projectRules.page = rules);
  return status;
}
// 选择或新增操作
function chooseOrAdd() {
  switch (isNewType.value) {
    case ProjectType.CHOOSE:
      if (!validateStatus(true)) return;
      if (!validateStatus(false)) return;
      if (projectId.value && isPageType.value === ProjectType.ADD) {
        modalLoading.value = true;
        createNewPage(projectId.value, pageName.value);
      } else {
        projectModal.value = false;
        router.replace(`/uibuilder/edit?id=${pageId.value}`);
      }
      break;
    case ProjectType.ADD:
      if (!validateStatus(true)) return;
      modalLoading.value = true;
      workspaceAddProjectApi(projectName.value)
        .then(({ data }: { data: any }) => {
          if (data?.info?.msg === "success") {
            //为此项目创建一个新页面
            const projectId = data?.results.id;
            if (projectId) {
              createNewPage(projectId);
            }
          } else {
            modalLoading.value = false;
            message.error("创建项目失败");
          }
        })
        .catch(() => {
          modalLoading.value = false;
          message.error("创建项目失败");
        });
      break;
  }
}
// 创建新页面
function createNewPage(projectId: string, pageName = "") {
  createPage(parseInt(projectId), pageName, true)
    ?.then((res) => {
      projectModal.value = false;
      router.replace(`/uibuilder/edit?id=${(res as any).id}`);
    })
    .catch(() => {
      message.error("页面创建失败");
    })
    .finally(() => {
      modalLoading.value = false;
    });
}
// 变更页面可选列表
function changePageList() {
  if (projectId.value) {
    clearRules(true, false);
    workspaceGetProjectApi(Number(projectId.value)).then((res) => {
      const { results }: { results: ProjectInfo[] } = res.data;
      tempPageList.value = results[0]?.pageList || [];
      pageId.value = undefined;
    });
  }
}

/**
 * 创建website
 */
const websiteModal = ref(false);
const websiteStatus = ref("");
const websiteProject = ref<string | undefined>(undefined);
const websiteHelp = ref("");
function changeProject() {
  websiteStatus.value = "";
  websiteHelp.value = "";
}
function addWebsite() {
  if (!websiteProject.value) {
    websiteStatus.value = "error";
    websiteHelp.value = "请选择项目";
    return;
  }
  createWebsite(websiteProject.value);
}

/**
 * 端到端操作分发
 */
function handleOperation() {
  const info = cloneDeep(useWorkspaceStore.endToEndInfo);
  switch (useWorkspaceStore.endToEndInfo.type) {
    case EndToEndEnum.WORK_SPACE:
      useWorkspaceStore.clearEndToEndInfo();
      break;
    case EndToEndEnum.EDIT_PAGE:
      useWorkspaceStore.clearEndToEndInfo();
      if (info.pageId) {
        router.replace(`/uibuilder/edit?id=${info.pageId}`);
      }
      break;
    case EndToEndEnum.PREVIEW_PAGE:
      useWorkspaceStore.clearEndToEndInfo();
      if (info.pageId) {
        router.replace(`/uibuilder/publish/${info.pageId}?id=${info.pageId}`);
      }
      break;
    case EndToEndEnum.ADD_PAGE:
      useWorkspaceStore.clearEndToEndInfo();
      showPageType.value = false;
      getProjectList("project");
      break;
    case EndToEndEnum.IMPORT_APP:
      getProjectList("project");
      break;
    case EndToEndEnum.PREVIEW_WEBSITE:
      useWorkspaceStore.clearEndToEndInfo();
      if (info.websiteId) {
        router.replace(`/uibuilder/website-visit?id=${info.websiteId}`);
      }
      break;
    case EndToEndEnum.EDIT_WEBSITE:
      useWorkspaceStore.clearEndToEndInfo();
      if (info.websiteId) {
        router.replace(`/uibuilder/website?id=${info.websiteId}`);
      }
      break;
    case EndToEndEnum.ADD_WEBSITE:
      useWorkspaceStore.clearEndToEndInfo();
      getProjectList("website");
      break;
  }
}

/**
 * 获取项目列表
 */
function getProjectList(type: string) {
  workspaceProjectsApi({ getAll: true }).then(async (res) => {
    if (res.data) {
      const { results }: { count: number; results: ProjectInfo[] } = res.data;
      tempProjectList.value = results;
      switch (type) {
        case "project":
          projectModal.value = true;
          break;
        case "website":
          websiteModal.value = true;
      }
    } else {
      message.destroy();
      message.error("项目数据获取失败!");
    }
  });
}

/**
 * 端到端自动化
 */
async function endToEnd() {
  if (!useWorkspaceStore.endToEndInfo?.type) return;
  await handleEndToEndMethod();
  if (await checkUser()) {
    Modal.confirm({
      title: `跳转用户和当前用户不一致，是否切换用户?`,
      content: createVNode("div", { style: "color:red;" }, `用户不一致可能后续操作出现错误`),
      icon: createVNode(ExclamationCircleOutlined),
      okText: "确定",
      cancelText: "取消",
      onOk() {
        logout(true);
      },
      onCancel() {
        handleOperation();
      },
    });
    return;
  }
  handleOperation();
}

onMounted(() => {
  endToEnd();
});
</script>

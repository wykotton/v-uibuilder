<template>
  <a-spin :spinning="loading" wrapperClassName="spin-container">
    <div
      :class="{
        'workspace-area': true,
        pending: loading,
      }"
    >
      <div class="item-card-wrap">
        <div class="add-button" @click="openAdd">
          <svg
            t="1665380735117"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
          >
            <path
              d="M1016.232845 544.423355v-65.388605H543.881461V6.683366H478.673487v472.351384H6.141471v65.388605H478.673487v472.351385h65.207974V544.423355z"
              fill="rgba(0, 0, 0, 0.4)"
            ></path>
          </svg>
          <p>创建新项目</p>
        </div>
      </div>
      <item-card
        v-for="item in projectList"
        :key="item.id"
        :data="item"
        :type="PageType.PROJECT"
        @preview="toPreview"
        @edit="toEdit"
        @delete="handleDeleteItem"
        @update="refreshProject"
      ></item-card>
    </div>
    <pagination
      v-if="projectList.length"
      @change="handlePageChange"
      :page-total="total"
      :current-page="pageIndex"
      :page-size="pageSize"
    ></pagination>
  </a-spin>
  <a-modal
    v-model:visible="showAddModal"
    cancel-text="取消"
    ok-text="确定"
    :closable="false"
    :maskClosable="false"
    :keyboard="false"
    title="创建新项目"
    @cancel="addFormPayload.name = ''"
    @ok="submitAdd"
  >
    <a-form :model="addFormPayload" ref="addForm">
      <a-form-item label="项目名称" name="name" :rules="[{ required: true }]">
        <a-input v-model:value="addFormPayload.name" show-count :maxlength="30"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import { ProjectInfo } from "@/types/workspace";
import { PageType } from "@/enums/workspace";
import { isStringNormal } from "@/utils/utils";
import {
  workspaceAddProjectApi,
  workspaceDeleteProjectApi,
  workspaceGetProjectApi,
  workspaceProjectsApi,
} from "@/api/uibuilder/workspace";
import { FormInstance, message, Modal } from "ant-design-vue";
import { createPage, dataSearch } from "@/composition/index";
import { useRouter } from "vue-router";
import ItemCard from "@/pages/uibuilder/workspace/components/itemCard.vue";
import Pagination from "@/pages/uibuilder/workspace/components/pagination.vue";

// 路由对象
const router = useRouter();

const props = defineProps<{
  searchStr: string;
}>();
const emit = defineEmits(["preview"]);

/**
 * 搜索项目
 */
watch(
  () => props.searchStr,
  () => {
    refreshProject(true);
  }
);

/**
 * 刷新数据
 */
const refreshProject = (reset?: boolean) => {
  if (reset) {
    pageIndex.value = 1;
  }
  getProjectList(props.searchStr);
};
// 暴露刷新事件
defineExpose({
  refreshProject,
});

/**
 * 新增项目
 */
const showAddModal = ref<boolean>(false);
const addFormPayload = ref<any>({});
const addForm = ref<FormInstance>();
const openAdd = () => {
  showAddModal.value = true;
};
const submitAdd = () => {
  if (addForm.value) {
    addForm.value.validate().then((data) => {
      if (!isStringNormal(data.name)) {
        message.destroy();
        message.warning("请勿输入特殊字符！");
        return;
      }
      workspaceAddProjectApi(data.name)
        .then(({ data }: { data: any }) => {
          if (data?.info?.msg === "success") {
            addFormPayload.value.name = "";
            showAddModal.value = false;
            //为此项目创建一个新页面
            const projectId = data?.results.id;
            if (projectId) {
              createPage(parseInt(projectId), "新建页面");
            }
            getProjectList(props.searchStr);
          } else {
            if (data?.info?.msg) {
              message.error(data.info.msg);
            } else {
              message.error("创建失败");
            }
          }
        })
        .catch((e) => {
          message.error("创建失败");
          console.log(e);
        });
    });
  }
};

/**
 * 分页器change
 * @param param0
 */
const pageIndex = ref(1);
const pageSize = ref(9);
const total = ref(0);
const handlePageChange = ({ index, size }: { index: number; size: number }) => {
  pageIndex.value = index;
  pageSize.value = size;
  getProjectList(props.searchStr);
};

/**
 * 预览操作
 * @param id
 */
const toPreview = (id: number | string) => {
  router.push(`/uibuilder/workspace?preview=${id}`);
  //获取信息
  emit("preview", id as number);
};

/**
 * 编辑页面
 * 跳转至designer设计页面
 * @param e
 */
const toEdit = (e: { id: number }) => {
  workspaceGetProjectApi(e.id).then((res) => {
    if (res?.data) {
      if (res.data.info?.msg === "success") {
        const { results } = res.data;
        router.push(`/uibuilder/edit?id=${results[0].pageList[0].id}`);
      }
    }
  });
};

/**
 * 删除项目
 * @param param0
 */
const handleDeleteItem = ({ id, name }: { id: string; name: string }) => {
  Modal.confirm({
    title: `确定删除项目: ${name}?`,
    onOk: () => {
      workspaceDeleteProjectApi(id)
        .then(({ data }: { data: any }) => {
          if (data?.info?.msg === "success") {
            message.success(`已删除项目: ${name}`);
            // 当前页无数据，查找上一页
            if (projectList.value.length === 1 && pageIndex.value > 1) {
              pageIndex.value -= 1;
            }
            getProjectList(props.searchStr);
          } else {
            if (data?.info?.msg) {
              message.error(data.info.msg);
            } else {
              message.error("删除失败");
            }
          }
        })
        .catch((e) => {
          console.log(e);
          message.error("删除失败");
        });
    },
  });
};

/**
 * 获取项目列表数据
 */
const projectList = ref<ProjectInfo[]>([]);
const loading = ref(false);
const getProjectList = async (projectName?: string) => {
  loading.value = true;
  const request = await workspaceProjectsApi({
    page: pageIndex.value,
    pageSize: pageSize.value,
    projectName,
  });
  const {
    count = 0,
    results = [],
    info: { msg = "" },
  } = request.data;
  if (msg !== "success") {
    message.destroy();
    message.error("项目数据获取失败!");
    loading.value = false;
    return;
  }
  total.value = count;
  if (projectName) {
    projectList.value = dataSearch(results, projectName, "project");
  } else {
    projectList.value = results;
  }
  loading.value = false;
};
onMounted(() => {
  getProjectList(props.searchStr);
});
</script>
<style scoped lang="scss">
.spin-container {
  height: calc(100% - 40px);

  ::v-deep(.ant-spin-container) {
    height: 100%;
  }
}
.workspace-area {
  height: calc(100% - 58px);
  padding: 60px 160px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  grid-column-gap: 60px;
  grid-row-gap: 40px;
  justify-content: center;
  &.pending {
    filter: blur(2px);
  }
  @media screen and (min-width: 1400px) {
    padding: 60px 200px;
    grid-column-gap: 100px;
    grid-row-gap: 60px;
  }
  .item-card-wrap {
    width: 200px;
    height: 200px;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: all 200ms linear;
    user-select: none;
    position: relative;
    background-color: #fff;
    &:hover {
      transform: scale(1.02);
      transform-origin: center center;
      transition: all 200ms linear;
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.4);
    }
    .add-button {
      color: rgba(0, 0, 0, 0.4);
      letter-spacing: 4px;
      font-weight: bold;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      text-align: center;
      svg {
        margin: auto;
      }
      p {
        margin-top: 20px;
        margin-bottom: 0;
        width: 150px;
      }
    }
  }
}
</style>

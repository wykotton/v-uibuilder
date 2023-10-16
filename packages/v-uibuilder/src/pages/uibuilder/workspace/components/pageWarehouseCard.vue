<template>
  <a-spin :spinning="loading" wrapperClassName="spin-container">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="user" tab="我的页面">
        <div
          :class="{
            'workspace-area': true,
            pending: loading,
          }"
        >
          <item-card
            v-for="item in userList"
            :key="item.id"
            :data="item"
            :edit="false"
            :type="PageType.PAGE_WAREHOUSE"
            @preview="toPreview"
            @edit=""
            @delete="handleDeleteItem"
            @update="refreshPageList"
          ></item-card>
        </div>
        <pagination
          v-if="userList.length"
          @change="handleUserPageChange"
          :page-total="userTotal"
          :current-page="userPageIndex"
          :page-size="userPageSize"
        ></pagination>
      </a-tab-pane>
      <a-tab-pane key="public" tab="公共页面">
        <div
          :class="{
            'workspace-area': true,
            pending: loading,
          }"
        >
          <item-card
            v-for="item in publicList"
            :key="item.id"
            :data="item"
            :edit="false"
            :type="PageType.PAGE_WAREHOUSE"
            @preview="toPreview"
            @edit=""
            @delete="handleDeleteItem"
            @update="refreshPageList"
          ></item-card>
        </div>
        <pagination
          v-if="publicList.length"
          @change="handlePublicPageChange"
          :page-total="publicTotal"
          :current-page="publicPageIndex"
          :page-size="publicPageSize"
        ></pagination>
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>
<script setup lang="ts">
import { PageWarehouseInfo } from "@/types/workspace";
import { workspaceDeleteProjectApi } from "@/api/uibuilder/workspace";
import { message, Modal } from "ant-design-vue";
import { dataPaging, dataSearch, getWarehouse, parseComponents } from "@/composition/index";
import { ComponentProtocolEnum } from "@/enums/appEnum";
import { PageType } from "@/enums/workspace";
import { useRouter } from "vue-router";
import ItemCard from "./itemCard.vue";
import Pagination from "./pagination.vue";

// 路由对象
const router = useRouter();

const props = defineProps<{
  searchStr: string;
}>();
const activeKey = ref("user");

/**
 * 搜索项目
 */
watch(
  () => props.searchStr,
  (newValue) => {
    getPageWarehouse(newValue);
  }
);

/**
 * 预览
 * @param id
 */
function toPreview(id: number | string) {
  const routerUrl = router.resolve({
    path: "/uibuilder/preview-page",
    query: { id },
  });
  window.open(routerUrl.href);
}

/**
 * 分页器change
 * @param param0
 */
const userPageIndex = ref(1);
const userPageSize = ref(10);
const userTotal = ref(0);
const handleUserPageChange = ({ index, size }: { index: number; size: number }) => {
  userPageSize.value = size;
  userPageIndex.value = index;
  userList.value = dataPaging(pageList.user, userPageIndex.value, userPageSize.value);
};
const publicPageIndex = ref(1);
const publicPageSize = ref(10);
const publicTotal = ref(0);
const handlePublicPageChange = ({ index, size }: { index: number; size: number }) => {
  publicPageSize.value = size;
  publicPageIndex.value = index;
  publicList.value = dataPaging(pageList.public, publicPageIndex.value, publicPageSize.value);
};

/**
 * 删除页面
 * @param param0
 */
const handleDeleteItem = ({ id, name }: { id: string; name: string }) => {
  Modal.confirm({
    title: `确定删除页面: ${name}?`,
    onOk: () => {
      workspaceDeleteProjectApi(id)
        .then(({ data }: { data: any }) => {
          if (data?.info?.msg === "success") {
            message.success(`已删除页面: ${name}`);
            // getList();
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
 * 获取页面库数据
 */
const loading = ref(false);
interface pageListOptions {
  user: PageWarehouseInfo[];
  public: PageWarehouseInfo[];
}
const pageList = reactive<pageListOptions>({
  user: [],
  public: [],
});
const userList = ref<PageWarehouseInfo[]>([]);
const publicList = ref<PageWarehouseInfo[]>([]);
const getPageWarehouse = (name?: string) => {
  customElements.whenDefined("q-page-warehouse").then(() => {
    loading.value = true;
    getWarehouse("depot-pages")
      .then((data: PageWarehouseInfo[]) => {
        const results = parseComponents(data);
        if (name) {
          userPageIndex.value = 1;
          publicPageIndex.value = 1;
          pageList.user = dataSearch(results.user, name, "page");
          pageList.public = dataSearch(results.public, name, "page");
        } else {
          pageList.user = results.user;
          pageList.public = results.public;
        }
        userList.value = dataPaging(pageList.user, userPageIndex.value, userPageSize.value);
        if (!userList.value.length && userPageIndex.value > 1) {
          // 当前页无数据，查找上一页
          userPageIndex.value -= 1;
          userList.value = dataPaging(pageList.user, userPageIndex.value, userPageSize.value);
        }
        userTotal.value = pageList.user.length;
        publicList.value = dataPaging(pageList.public, publicPageIndex.value, publicPageSize.value);
        if (!publicList.value.length && publicPageIndex.value > 1) {
          // 当前页无数据，查找上一页
          publicPageIndex.value -= 1;
          publicList.value = dataPaging(pageList.public, publicPageIndex.value, publicPageSize.value);
        }
        publicTotal.value = pageList.public.length;
      })
      .catch(() => {
        message.warn("加载页面库失败！");
      })
      .finally(() => {
        loading.value = false;
      });
  });
};

/**
 * 刷新数据
 */
const refreshPageList = (reset?: boolean) => {
  if (reset) {
    userPageIndex.value = 1;
    publicPageIndex.value = 1;
  }
  window.dispatchEvent(new CustomEvent("pageWarehouse", { detail: { type: ComponentProtocolEnum.REFRESH } }));
};
// 暴露刷新事件
defineExpose({
  refreshPageList,
  getPageWarehouse,
});

onMounted(() => {
  getPageWarehouse();
});
</script>
<style scoped lang="scss">
.spin-container {
  height: calc(100% - 40px);
  padding: 0 30px;

  ::v-deep(.ant-spin-container) {
    height: 100%;
  }

  ::v-deep(.ant-tabs) {
    height: 100%;
  }

  ::v-deep(.ant-tabs-content) {
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
}
</style>

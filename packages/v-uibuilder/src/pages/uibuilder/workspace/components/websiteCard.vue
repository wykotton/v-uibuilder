<template>
  <a-spin :spinning="loading" wrapperClassName="spin-container">
    <div
      :class="{
        'workspace-area': true,
        pending: loading,
      }"
    >
      <item-card
        v-for="item in websiteList"
        :key="item.id"
        :data="item"
        :export="false"
        :type="PageType.WEBSITE"
        @preview="toPreview"
        @edit="toEdit"
        @delete="handleDeleteItem"
        @update="refreshWebsite"
      ></item-card>
    </div>
    <pagination
      v-if="websiteList.length"
      @change="handlePageChange"
      :page-total="total"
      :current-page="pageIndex"
      :page-size="pageSize"
    ></pagination>
  </a-spin>
</template>
<script setup lang="ts">
import { WebsiteInfo } from "@/types/workspace";
import { PageType } from "@/enums/workspace";
import { deleteWebsite, getWebsite } from "@/api/uibuilder/website";
import { message, Modal } from "ant-design-vue";
import { useRouter } from "vue-router";
import { useUserStoreWithOut } from "@/store/modules/user";
import { dataSearch } from "@/composition/index";
import ItemCard from "@/pages/uibuilder/workspace/components/itemCard.vue";
import Pagination from "@/pages/uibuilder/workspace/components/pagination.vue";

// 路由对象
const router = useRouter();

// pinia
const useUserStore = useUserStoreWithOut();

const props = defineProps<{
  searchStr: string;
}>();

/**
 * 搜索项目
 */
watch(
  () => props.searchStr,
  () => {
    refreshWebsite(true);
  }
);

/**
 * 刷新数据
 */
const refreshWebsite = (reset?: boolean) => {
  if (reset) {
    pageIndex.value = 1;
  }
  getWebsiteList(props.searchStr);
};
// 暴露刷新事件
defineExpose({
  refreshWebsite,
});

/**
 * 分页器change
 * @param param0
 */
const pageIndex = ref(1);
const pageSize = ref(10);
const total = ref(0);
const handlePageChange = ({ index, size }: { index: number; size: number }) => {
  pageIndex.value = index;
  pageSize.value = size;
  getWebsiteList(props.searchStr);
};

/**
 * 预览操作
 * @param id
 */
const toPreview = (id: number | string) => {
  const routeUrl = router.resolve({
    path: `/uibuilder/website-visit`,
    query: {
      id,
    },
  });
  window.open(routeUrl.href);
};

/**
 * 编辑
 * 跳转至站点设计页面
 * @param e
 */
const toEdit = (e: { type: "project" | "component"; id: number }) => {
  router.push(`/uibuilder/website?id=${e.id}`);
};

/**
 * 删除站点
 * @param param0
 */
const handleDeleteItem = ({ id, name }: { id: string; name: string }) => {
  Modal.confirm({
    title: `确定删除站点: ${name}?`,
    onOk: () => {
      const userInfo = useUserStore.getUibUserInfo;
      if (!userInfo?.id) {
        message.destroy();
        message.warning("用户信息不存在, 请重新登录后再试!");
        return;
      }
      const results = deleteWebsite({ id, userId: userInfo.id });
      results
        .then((res) => {
          const {
            info: { msg = "" },
          } = res.data;
          message.destroy();
          if (msg !== "success") {
            message.error("站点删除失败!");
            return;
          }
          message.success("已删除站点");
          // 当前页无数据，查找上一页
          if (websiteList.value.length === 1 && pageIndex.value > 1) {
            pageIndex.value -= 1;
          }
          getWebsiteList(props.searchStr);
        })
        .catch((err) => {
          console.log(err);
          message.error("站点删除失败!");
        });
    },
  });
};

/**
 * 获取项目列表数据
 */
const websiteList = ref<WebsiteInfo[]>([]);
const loading = ref(false);
const getWebsiteList = (websiteName?: string) => {
  const userInfo = useUserStore.getUibUserInfo;
  if (!userInfo?.id) return;
  loading.value = true;
  const request = getWebsite({
    userId: userInfo.id,
    websiteName,
    page: pageIndex.value,
    pageSize: pageSize.value,
  });
  request
    .then((res) => {
      if (res.data) {
        const { count, results }: { count: number; results: WebsiteInfo[] } = res.data;
        total.value = count;
        if (websiteName) {
          websiteList.value = dataSearch(results, websiteName, "website");
        } else {
          websiteList.value = results;
        }
      }
    })
    .finally(() => {
      loading.value = false;
    });
};
onMounted(() => {
  getWebsiteList(props.searchStr);
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

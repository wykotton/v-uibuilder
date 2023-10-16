<template>
  <a-spin :spinning="loading" tip="加载中...">
    <div class="website-construction">
      <div class="website-header">
        <LeftOutlined class="header-icon" :title="'返回'" @click="router.replace(PageEnum.WORKSPACE)"></LeftOutlined>
        <a-divider type="vertical" class="divider" />
        <a-tooltip placement="bottom">
          <template #title>
            <span>访问站点</span>
          </template>
          <LaptopOutlined class="header-icon" @click="previewClick"></LaptopOutlined>
        </a-tooltip>
        <a-input
          class="header-input"
          v-model:value="website.mainTitle"
          show-count
          :maxlength="30"
          placeholder="站点名称"
        />
        <div class="edit-btn" @click="previewState = !previewState">{{ previewState ? "编辑" : "预览" }}</div>
        <div class="save-btn" @click="saveClick">保存</div>
      </div>
      <div class="divider"></div>
      <div class="website-content">
        <div class="website-content-left">
          <Website :website="website"></Website>
        </div>
        <div :class="{ 'website-content-right': true, retract: previewState }">
          <a-tabs v-model:activeKey="activeKey" centered class="h-full">
            <a-tab-pane key="menu" tab="菜单配置">
              <div class="overflow-y-auto" style="height: calc(100vh - 96px)">
                <MenuSetting :website="website"></MenuSetting>
              </div>
            </a-tab-pane>
            <a-tab-pane key="website" tab="站点配置">
              <div class="overflow-y-auto" style="height: calc(100vh - 96px)">
                <WebsiteSetting :website="website"></WebsiteSetting>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>
  </a-spin>
</template>
<script setup lang="ts">
import { LeftOutlined, LaptopOutlined } from "@ant-design/icons-vue";
import { useUserStoreWithOut } from "@/store/modules/user";
import { message } from "ant-design-vue";
import { findWebsite, updateWebsite } from "@/api/uibuilder/website";
import { PageEnum } from "@/enums/pageEnum";
import Website from "./components/website.vue";
import WebsiteSetting from "./setting/websiteSetting.vue";
import MenuSetting from "./setting/menuSetting.vue";
import { isStringNormal } from "@/utils/utils";

// 路由对象
const route = useRoute();
const router = useRouter();

// pinia
const useUserStore = useUserStoreWithOut();

const previewState = ref(false);
const activeKey = ref("menu");
const website: any = ref({});
const loading = ref(false);

/**
 * 访问站点
 */
function previewClick() {
  const id = route.query.id;
  if (id) {
    const url = `/#/uibuilder/website-visit?id=${id}`;
    window.open(url);
  }
}

// 跳转至工作空间
const goWorkspace = () => {
  setTimeout(() => {
    router.replace(PageEnum.WORKSPACE);
  }, 3000);
};

/**
 * 保存站点
 */
function saveClick() {
  const id = route.query.id;
  if (!id) {
    message.destroy();
    message.error("站点id不存在, 无法进行保存!");
    return;
  }
  const userInfo = useUserStore.getUibUserInfo;
  if (!userInfo?.id) {
    message.destroy();
    message.warning("用户信息不存在, 请重新登录后再试!");
    return;
  }
  if (!website.value.mainTitle || !isStringNormal(website.value.mainTitle)) {
    message.destroy();
    message.warning("请输入正确的站点名称, 不可包含特殊字符!");
    return;
  }
  loading.value = true;
  const results = updateWebsite({
    id,
    userId: userInfo.id,
    websiteName: website.value.mainTitle,
    config: website.value,
  });
  results
    .then((res) => {
      const {
        info: { msg = "" },
      } = res.data;
      message.destroy();
      if (msg !== "success") {
        message.error("站点保存失败!");
        return;
      }
      message.success("保存成功");
    })
    .catch((err) => {
      console.log(err);
      message.error("站点保存失败!");
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 获取website数据
 */
function getWebsite(id: number) {
  if (!id) return;
  const userInfo = useUserStore.getUibUserInfo;
  if (!userInfo?.id) {
    message.warning("用户信息不存在, 请重新登录后再试!");
    return;
  }
  loading.value = true;
  const results = findWebsite({ websiteId: id, userId: userInfo.id });
  results
    .then((res) => {
      const { code, results } = res.data;
      switch (code) {
        case 403:
          message.error("无权编辑此站点实例!");
          goWorkspace();
          return;
        case 404:
          message.error("站点实例不存在!");
          goWorkspace();
          return;
        case 500:
          message.error("获取站点实例失败!");
          goWorkspace();
          return;
      }
      website.value = JSON.parse(results[0].config);
      if (results[0].website_name !== website.value.mainTitle) {
        website.value.mainTitle = results[0].website_name;
      }
      loading.value = false;
    })
    .catch((err) => {
      console.log(err);
      goWorkspace();
      message.error("站点信息获取失败!");
    });
}
onMounted(() => {
  getWebsite(Number(route.query.id));
});

/**
 * 监听路由变更，处理页面更新
 */
router.afterEach((to, from) => {
  if (!to.query.id || to.path !== PageEnum.WEBSITE) return;
  if (to.query.id !== from.query.id) {
    previewState.value = false;
    activeKey.value = "menu";
    website.value = {};
    loading.value = false;
    getWebsite(Number(to.query.id));
  }
});
</script>
<style scoped lang="scss">
.website-construction {
  width: 100vw;
  height: 100vh;
  .website-header {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    background-color: #081126;
    .header-icon {
      color: #acacaf;
      font-size: 20px;
      padding: 10px;
      cursor: pointer;
    }
    .divider {
      width: 2px;
      height: 100%;
      background-color: #32353b;
    }
    ::v-deep(.header-input) {
      max-width: 300px;
      min-width: 150px;
      height: 30px;
      padding: 0 10px;
      border: 1px solid transparent;
      background-color: #32353b;
      color: #fff;
      input {
        background-color: inherit;
        color: inherit;
      }
      .ant-input-suffix {
        .ant-input-show-count-suffix {
          color: #1890ff;
        }
      }
    }
    .edit-btn,
    .save-btn {
      width: 100px;
      height: 26px;
      text-align: center;
      line-height: 24px;
      border-radius: 13px;
      margin-right: 24px;
      font-size: 12px;
      cursor: pointer;
    }
    .edit-btn {
      border: 1px solid #2e74ff;
      color: #fff;
      margin-left: auto;
    }
    .save-btn {
      background-color: #2e74ff;
      color: #fff;
    }
  }
  .divider {
    width: 100%;
    height: 1px;
    background-color: #49536e;
  }
  .website-content {
    width: 100%;
    height: calc(100% - 50px);
    display: flex;
    flex-direction: row;
    .website-content-left {
      flex: 1;
      height: 100%;
      overflow: hidden;
    }
    .website-content-right {
      width: 450px;
      height: 100%;
      transition: all 0.3s;
      background-color: #2b3551;
      ::v-deep(.ant-tabs) {
        color: #6a7491;
        min-width: 350px;
      }
      ::v-deep(.ant-tabs-nav) {
        margin-bottom: 0;
      }
      ::v-deep(.ant-tabs-nav::before) {
        border-color: #3e4760;
      }
    }
    .retract {
      width: 0px !important;
    }
  }
}
</style>

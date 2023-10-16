<template>
  <div class="container">
    <div class="menu">
      <div class="add-menu-btn" @click="useAddMenu('')">
        <PlusOutlined :style="{ fontSize: '12px', color: '#fff' }"></PlusOutlined>
        <span>添加主菜单</span>
      </div>
      <div class="menu-content">
        <a-tree
          class="menu-tree"
          :selected-keys="selectedKeys"
          defaultExpandAll
          :tree-data="website.treeData"
          @select="onSelect"
        >
          <template #title="{ title, key, isNull }">
            <div class="tree-content">
              <span class="content-text">{{ title }}</span>
              <div class="content-icon">
                <a-tooltip placement="bottom">
                  <template #title>
                    <span>添加子菜单</span>
                  </template>
                  <PlusOutlined
                    v-if="getTreeLevel(website.treeData, key).level < 4"
                    :style="{ fontSize: '12px', color: '#8B91A0', marginLeft: '4px' }"
                    @click.stop="useAddMenu(key)"
                  ></PlusOutlined>
                </a-tooltip>
                <a-tooltip placement="bottom">
                  <template #title>
                    <span>设置主页</span>
                  </template>
                  <HomeOutlined
                    v-if="!isNull"
                    :style="{
                      fontSize: '12px',
                      color: website.homePage === key ? '#1890FF' : '#8B91A0',
                      marginLeft: '4px',
                    }"
                    @click.stop="setHomePage(key)"
                  ></HomeOutlined>
                </a-tooltip>
                <a-tooltip placement="bottom">
                  <template #title>
                    <span>删除菜单</span>
                  </template>
                  <DeleteOutlined
                    :style="{ fontSize: '12px', color: '#8B91A0', marginLeft: '4px' }"
                    @click.stop="useDeleteMenu(key)"
                  ></DeleteOutlined>
                </a-tooltip>
              </div>
            </div>
          </template>
        </a-tree>
      </div>
    </div>
    <div class="setting">
      <div class="setting-title">内容设置</div>
      <div class="divider"></div>
      <div v-if="Object.keys(tempInfo).length && tempInfo.key === selectedKeys[0]">
        <div class="mt-10px">
          <div class="ml-10px">菜单显示名称</div>
        </div>
        <div class="mt-4px">
          <a-input
            v-model:value="tempInfo.title"
            show-count
            :maxlength="15"
            class="menu-input"
            type="text"
            placeholder="菜单名称"
          />
        </div>
        <div class="mt-10px ml-10px flex items-center">
          <a-checkbox v-model:checked="tempInfo.isNull" :disabled="tempInfo?.children.length > 0" />
          <div class="ml-10px">设为空节点</div>
        </div>
        <div v-if="!tempInfo.isNull">
          <a-spin :spinning="contentSpinning" tip="加载中...">
            <div class="mt-10px">
              <div class="ml-10px">内容设置</div>
            </div>
            <div class="mt-4px ml-10px">
              <a-select
                v-model:value="tempInfo.contentType"
                placeholder="请选择内容类型"
                style="width: 176px; height: 28px"
              >
                <a-select-option v-for="item in contentType" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
              <div v-if="tempInfo.contentType === contentTypeEnum.EXTERNAL" class="url-container">
                <a-textarea v-model:value="tempInfo.src" class="url-input" placeholder="外部Http链接" :rows="4" />
                <div class="change-btn" @click="changeRender">更新</div>
              </div>
              <div v-if="tempInfo.contentType === contentTypeEnum.PAGE" class="url-container">
                <a-select v-model:value="tempInfo.pageId" placeholder="请选择页面" style="width: 165px; height: 28px">
                  <a-select-option v-for="item in pageList" :key="item.id" :value="item.id">
                    {{ item.page_name }}
                  </a-select-option>
                </a-select>
                <div class="change-btn" @click="changeRender">更新</div>
              </div>
            </div>
          </a-spin>
          <div class="mt-10px">
            <div class="ml-10px">查看方式</div>
          </div>
          <div class="mt-4px ml-10px">
            <a-radio-group v-model:value="tempInfo.openMode">
              <a-radio
                :style="radioStyle"
                v-for="item in openModeType"
                :key="item.value"
                :value="item.value"
                style="color: #fff"
              >
                {{ item.label }}
              </a-radio>
            </a-radio-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PlusOutlined, DeleteOutlined, HomeOutlined, QuestionCircleOutlined } from "@ant-design/icons-vue";
import { contentTypeEnum, openModeEnum } from "@/enums/websiteEnum";
import { websiteOptions } from "@/types/website";
import { getTreeLevel, getTreeInfo, addMenu, iframeRender, deleteMenu } from "@/composition/index";
import { Modal } from "ant-design-vue";
import { createVNode } from "vue";
import { PageInfo } from "@/types/workspace";
import { workspaceGetProjectApi } from "@/api/uibuilder/workspace";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
  website: websiteOptions;
}>();
watch(
  () => props.website.projectId,
  (newValue) => {
    if (newValue) {
      getPageList(Number(newValue));
    }
  }
);

const selectedKeys = ref<string[]>([]);
const contentSpinning = ref(false);
const contentType = ref([
  {
    value: contentTypeEnum.PAGE,
    label: "我的页面",
  },
  {
    value: contentTypeEnum.EXTERNAL,
    label: "外部链接",
  },
]);
const openModeType = ref([
  {
    value: openModeEnum.CURRENT,
    label: "当前页面打开",
  },
  {
    value: openModeEnum.NEW,
    label: "新窗口打开",
  },
]);
const radioStyle = reactive({
  display: "flex",
  height: "30px",
  lineHeight: "30px",
});

/**
 * 菜单选择
 */
const tempInfo: any = ref({});
function onSelect(keys: any) {
  if (!keys.length) return;
  selectedKeys.value = keys;
  tempInfo.value = getTreeInfo(props.website.treeData, keys[0]);
}

/**
 * 添加菜单
 * @param key
 */
function useAddMenu(key: string) {
  addMenu(key, props.website.treeData);
}

/**
 * 设置主页
 * @param key
 */
function setHomePage(key: string) {
  if (props.website.homePage === key) {
    props.website.homePage = "";
  } else {
    props.website.homePage = key;
  }
}

/**
 * 删除菜单
 * @param key
 */
function useDeleteMenu(key: string) {
  Modal.confirm({
    title: "提示",
    icon: createVNode(QuestionCircleOutlined),
    content: "确定要删除当前菜单吗?",
    okText: "确认",
    cancelText: "取消",
    onOk() {
      deleteMenu(key, props.website.treeData);
      if (tempInfo.value?.key) {
        tempInfo.value = getTreeInfo(props.website.treeData, tempInfo.value.key);
      }
    },
  });
}

/**
 * 更新渲染内容
 */
function changeRender() {
  const container = document.querySelector(".iframe-content") as HTMLElement;
  if (!container) return;
  iframeRender(container, props.website.menuCache, tempInfo.value);
}

/**
 * 获取项目的页面列表
 * @param id
 */
const pageList = ref<PageInfo[]>([]);
function getPageList(id: number) {
  if (!id) return;
  workspaceGetProjectApi(id).then((res) => {
    if (res?.data) {
      if (res.data.info?.msg === "success") {
        const { results } = res.data;
        pageList.value = results[0]?.pageList || [];
      }
    }
  });
}

/**
 * 监听路由变更，处理页面更新
 */
router.afterEach((to, from) => {
  if (!to.query.id) return;
  if (to.query.id !== from.query.id) {
    selectedKeys.value = [];
    contentSpinning.value = false;
    tempInfo.value = {};
    pageList.value = [];
  }
});
</script>
<style scoped lang="scss">
.container {
  height: 100%;
  display: flex;
  flex-direction: row;
  .menu {
    width: 255px;
    .add-menu-btn {
      width: 140px;
      height: 28px;
      margin: 15px auto;
      color: #fff;
      padding: 0 20px;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      background-color: #2861ff;
    }
    .menu-content {
      width: 100%;
      ::v-deep(.menu-tree) {
        background-color: #2b3551 !important;
      }
      ::v-deep(.tree-content) {
        width: 100%;
        display: flex;
        align-items: center;
        .content-text {
          max-width: 110px;
          color: #1890ff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .content-icon {
          min-width: 25px;
          margin-left: 4px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .setting {
    width: 195px;
    height: 100%;
    color: #afb3bd;
    background-color: #3e4760;
    .setting-title {
      font-size: 14px;
      padding: 10px 20px;
    }
    .divider {
      width: 100%;
      height: 1px;
      background-color: #49536e;
    }
    ::v-deep(.menu-input) {
      width: 180px;
      color: #fff;
      margin-left: 7px;
      height: 32px;
      padding: 0 8px;
      font-size: 12px;
      line-height: 32px;
      background-color: #2b3551;
      border: 1px solid hsla(0, 0%, 100%, 0.1);
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
    ::v-deep(.url-container) {
      width: 180px;
      padding: 8px;
      margin-top: 15px;
      box-sizing: border-box;
      background-color: #2b3551;
      .url-input {
        width: 165px;
        color: #fff;
        margin: 0 auto;
        padding: 0 8px;
        background-color: #3e4760;
        border: 1px solid hsla(0, 0%, 100%, 0.1);
      }
      .change-btn {
        width: 165px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        margin: 10px auto 0;
        color: #fff;
        padding: 0 20px;
        cursor: pointer;
        background-color: #2861ff;
      }
    }
  }
}
</style>

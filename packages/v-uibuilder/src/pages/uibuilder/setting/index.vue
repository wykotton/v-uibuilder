<template>
  <div class="setting-container">
    <div class="headers">
      <q-page-header class="h-48px">
        <q-link slot="left" class="ml-88px mr-20px" @click="goToWorkspace">
          <div class="font-微软雅黑 font-bold text-24px text-white text-center w-full h-full">
            {{ useAppStore.websiteName || useAppStore.defaultWebsiteName }}
          </div>
        </q-link>
      </q-page-header>
    </div>
    <div @click="router.go(-1)" class="go-back">
      <span>返回</span>
      <svg
        t="1665536655715"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width="16px"
        height="16px"
      >
        <path
          d="M700.371228 394.525472 174.028569 394.525472l255.952416-227.506551c12.389168-11.011798 13.505595-29.980825 2.492774-42.369993-11.011798-12.386098-29.977755-13.506619-42.367947-2.492774L76.425623 400.975371c-6.960529 5.496178-11.434423 14.003945-11.434423 23.561625 0 0.013303 0.001023 0.026606 0.001023 0.039909 0 0.01228-0.001023 0.025583-0.001023 0.037862 0 0.473791 0.01535 0.946558 0.037862 1.418302 0.001023 0.016373 0.001023 0.032746 0.001023 0.049119 0.39295 8.030907 3.992941 15.595186 10.034541 20.962427l315.040163 280.028764c5.717212 5.083785 12.83533 7.580652 19.925818 7.580652 8.274454 0 16.514115-3.403516 22.442128-10.07445 11.011798-12.387122 9.896394-31.357172-2.492774-42.367947l-256.128425-227.665163 526.518668 0c109.219517 0 198.075241 88.855724 198.075241 198.075241s-88.855724 198.075241-198.075241 198.075241L354.324888 850.696955c-16.57449 0-30.011524 13.437034-30.011524 30.011524s13.437034 30.011524 30.011524 30.011524l346.046341 0c142.31631 0 258.098289-115.783003 258.098289-258.098289S842.686515 394.525472 700.371228 394.525472z"
          fill="currentColor"
        ></path>
      </svg>
    </div>
    <q-spin :loading="spinning" style="calc(100% - 48px)">
      <div style="background-color: #ececec; height: calc(100vh - 48px)" class="form-wrapper">
        <a-row :gutter="16" style="height: 100%">
          <a-col :span="24">
            <a-card title="系统配置" :bordered="false" style="height: 100%; position: relative">
              <q-from>
                <div slot="q-form-slot" id="form-input-wrapper">
                  <div class="configuration-item">
                    <!-- <div class="form-item">
                      <label class="form-item-label">使用本地配置:</label>
                      <div class="form-item-content">
                        <q-switch></q-switch>
                      </div>
                    </div> -->
                    <div class="form-item" v-for="item in configurations" :key="item.name">
                      <label :class="{ 'form-item-label': item.name === 'website_name' }">{{ item.title }}:</label>
                      <div class="form-item-content">
                        <q-input-number
                          v-if="item.name === 'component_loading_timeout'"
                          :value="config.datas[item.name] || 5"
                          :name="item.name"
                          :placeholder="item.placeholder"
                          max="30"
                          min="5"
                          style="width: 100%"
                        ></q-input-number>
                        <q-input
                          v-else
                          :value="config.datas[item.name] || ''"
                          :name="item.name"
                          :placeholder="item.placeholder"
                          :maxlength="item.name === 'website_name' ? 15 : ''"
                          style="width: 100%"
                        ></q-input>
                      </div>
                    </div>
                    <div class="form-item" v-for="(item, index) in config.datas.component_warehouse" :key="index">
                      <label>
                        <a-tooltip v-if="index === 0">
                          <template #title>
                            <div>
                              <div>1.仓库唯一ID,以英文为开头和结尾.</div>
                              <div>2.子应用仓库地址.</div>
                            </div>
                          </template>
                          <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); margin-right: 10px" />
                        </a-tooltip>
                        {{ index === 0 ? "元件仓库:" : "" }}
                      </label>
                      <div class="form-item-content">
                        <q-input
                          class="w-150px"
                          :value="item.name"
                          name="component_warehouse"
                          customType="name"
                          :index="index"
                          placeholder="请输入仓库名称"
                        ></q-input>
                        <q-input
                          class="flex-1 ml-10px"
                          :value="item.url"
                          name="component_warehouse"
                          customType="url"
                          :index="index"
                          placeholder="请输入仓库地址"
                        ></q-input>
                      </div>
                      <div class="form-item-icon">
                        <a-tooltip placement="top" v-if="index === 0">
                          <template #title>
                            <span>增加元件仓库</span>
                          </template>
                          <plus-outlined @click="handleAdd('component_warehouse')" />
                        </a-tooltip>
                        <a-popconfirm
                          v-else
                          title="确定要删除该元件仓库吗?"
                          ok-text="确定"
                          cancel-text="取消"
                          @confirm="handleDelete('component_warehouse', index)"
                        >
                          <delete-outlined />
                        </a-popconfirm>
                      </div>
                    </div>
                    <div class="form-item" v-for="(item, index) in config.datas.end_to_end" :key="index">
                      <label>
                        <a-tooltip v-if="index === 0">
                          <template #title>
                            <div>
                              <div>1.端到端跳转平台.</div>
                              <div>2.端到端操作类型.</div>
                              <div>3.数据处理函数.</div>
                            </div>
                          </template>
                          <info-circle-outlined style="color: rgba(0, 0, 0, 0.45); margin-right: 10px" />
                        </a-tooltip>
                        {{ index === 0 ? "端到端:" : "" }}
                      </label>
                      <div class="form-item-content">
                        <q-input
                          class="w-150px"
                          :value="item.name"
                          name="end_to_end"
                          customType="name"
                          :index="index"
                          placeholder="请输入跳转平台"
                        ></q-input>
                        <q-select
                          class="w-150px ml-10px"
                          :options="typesInfo"
                          :value="item.type"
                          name="end_to_end"
                          customType="type"
                          :index="index"
                          placeholder="请选择操作类型"
                        ></q-select>
                        <q-input
                          class="flex-1 ml-10px"
                          :value="item.method"
                          name="end_to_end"
                          customType="method"
                          :index="index"
                          placeholder="请输入数据处理函数"
                        ></q-input>
                      </div>
                      <div class="form-item-icon">
                        <a-tooltip placement="top">
                          <template #title>
                            <span>编辑数据处理函数</span>
                          </template>
                          <code-outlined :style="{ marginRight: '10px' }" @click="editMethod(index)" />
                        </a-tooltip>
                        <a-tooltip placement="top" v-if="index === 0">
                          <template #title>
                            <span>增加数据处理函数</span>
                          </template>
                          <plus-outlined @click="handleAdd('end_to_end')" />
                        </a-tooltip>
                        <a-popconfirm
                          v-else
                          title="确定要删除该数据处理函数吗?"
                          ok-text="确定"
                          cancel-text="取消"
                          @confirm="handleDelete('end_to_end', index)"
                        >
                          <delete-outlined />
                        </a-popconfirm>
                      </div>
                    </div>
                  </div>
                  <div class="btn-wrapper">
                    <a-popconfirm title="确定要重置系统配置吗?" ok-text="确定" cancel-text="取消" @confirm="redo">
                      <q-button class="w-80px h-30px rounded-sm theme" style="background-color: #c0c4cc">重置</q-button>
                    </a-popconfirm>
                    <q-button
                      @click="saveConfig"
                      :disabled="isDisabled"
                      class="w-80px ml-20px h-30px rounded-sm theme"
                      :style="{ backgroundColor: isDisabled ? '#c0c4cc' : 'var(--theme-color, #409eff)' }"
                    >
                      保存
                    </q-button>
                  </div>
                </div>
              </q-from>
            </a-card>
            <div
              style="
                width: 100%;
                text-align: center;
                position: absolute;
                bottom: 0;
                height: 22px;
                border-top: 1px solid #f0f0f0;
              "
            >
              Version: {{ config.datas.version }}
            </div>
          </a-col>
        </a-row>
      </div>
    </q-spin>
  </div>
  <a-modal
    v-model:visible="codeModal"
    v-if="codeModal"
    title="代码编辑"
    :maskClosable="false"
    okText="确定"
    cancelText="取消"
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
</template>
<script setup lang="ts">
import { getConfigInfoApi, saveConfigInfoApi } from "@/api/uibuilder/setting";
import {
  SaveOutlined,
  RedoOutlined,
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CodeOutlined,
} from "@ant-design/icons-vue";
import { defineComponent } from "vue";
import { message } from "ant-design-vue";
import { cloneDeep, isArray, isEqual } from "lodash-es";
import { initThemeConfig } from "@/composition/index";
import { removeLineBreaks } from "@/utils";
import { EndToEndEnum } from "@/enums/settingEnum";
import { useAppStoreWithOut } from "@/store/modules/app";
import { isStringNormal } from "@/utils/utils";

// pinia
const useAppStore = useAppStoreWithOut();

// const vm = getCurrentInstance();
const router = useRouter();

defineComponent({
  components: {
    SaveOutlined,
    RedoOutlined,
  },
});

const spinning = ref<boolean>(false);
const config = reactive({ datas: {} }) as any;
const tempObj = reactive({ datas: {} }) as any;
const isDisabled = ref<boolean>(true);
watch(config, () => {
  // console.log(tempObj);
  // console.log(config);
  isDisabled.value = isEqual(tempObj, config);
});

const configurations = reactive([
  { title: "网站名称", name: "website_name", placeholder: "请输入网站名称" },
  // { title: "APP发布路径", name: "app_publish_path", placeholder: "请输入APP发布路径" },
  // { title: "图元服务IP", name: "app_publish_ip", placeholder: "请输入图元服务IP" },
  // { title: "图元路径", name: "app_all_pel_path", placeholder: "请输入图元路径" },
  // { title: "图元图片路径", name: "app_pic_path", placeholder: "请输入图元图片路径" },
  // { title: "DI服务地址", name: "deepinsight_path", placeholder: "请输入DI服务地址" },
  // { title: "主题颜色", name: "app_theme_color", placeholder: "请输入主题颜色" },
  // { title: "网格主题颜色", name: "app_cavans_color", placeholder: "请输入网格主题颜色" },
  { title: "版权信息", name: "copyright", placeholder: "请输入版权信息" },
  { title: "服务端sentry地址", name: "sentry_dsn", placeholder: "请输入服务端sentry上报地址" },
  { title: "元件加载超时时间(5秒-30秒)", name: "component_loading_timeout", placeholder: "请输入元件加载超时时间" },
]);

// function setData() {
//   const inputNodeList = document.querySelectorAll("q-input");
//   const switchNode = document.querySelector("q-switch");
//   inputNodeList.forEach((it) => {
//     const key = it.getAttribute("name") || "";
//     if (config.datas.hasOwnProperty(key)) it.setAttribute("value", config.datas[key]);
//   });
//   switchNode && switchNode.setAttribute("value", `${config.datas.used === 1}`);
//   const { ctx } = vm as any;
//   ctx.$forceUpdate();
// }

function redo() {
  config.datas = {
    website_name: "UIBuilder",
    // app_publish_path: "http://192.168.21.46:3011/deepCharts/out/js/bundle.js",
    // app_pic_path: "http://192.168.21.46:3011/deepCharts/imgs/customed/",
    // app_all_pel_path: "http://192.168.21.46:3011/deepCharts/pelList/list",
    // data: {},
    // used: 1,
    copyright: "© 2021 http://www.zzjunzhi.com/ MIT license",
    // deepinsight_path: "http://192.168.11.102:6093/api/rest/queryAllConfig.rest",
    // app_publish_ip: "http://192.168.21.46:3011",
    // app_theme_color: "rgba(0,0,0,1)",
    // app_cavans_color: "rgba(255,255,255,1)",
    // is_grid: true,
    sentry_dsn: "",
    component_loading_timeout: 5,
    component_warehouse: cloneDeep(warehouseDefault),
    end_to_end: cloneDeep(endToEndDefault),
  };
  saveConfig();
}

/**
 * 检查配置
 */
function checkConfig() {
  let isError = false;
  if (!config.datas["website_name"] || !isStringNormal(config.datas["website_name"])) {
    isError = true;
    message.destroy();
    message.warning("请输入正确的网站名称, 请勿输入特殊字符!");
  }
  return isError;
}

/**
 * 保存配置
 */
const saveConfig = () => {
  if (isDisabled.value) {
    message.destroy();
    message.warning("当前没有更改内容!");
    return;
  }
  if (checkConfig()) return;
  spinning.value = true;
  saveConfigInfoApi(config.datas).then((res) => {
    message.destroy();
    try {
      if (res.info.msg === "success") {
        config.datas = res.results;
        tempObj.datas = cloneDeep(res.results);
        spinning.value = false;
        message.success("保存成功");
        useAppStore.setWebsiteName(res.results["website_name"]);
      }
    } catch (e) {
      console.log(e);
      spinning.value = false;
      message.error("保存失败！");
    }
  });
};

/**
 * 触发vue视图更新
 * @param e
 */
function onInputEvent(e: any) {
  const name = e.target.name;
  const type = e.target.getAttribute("customType");
  const index = e.target.getAttribute("index");
  switch (name) {
    case "component_warehouse":
      config.datas.component_warehouse[index][type] = e.detail.value;
      break;
    case "end_to_end":
      config.datas.end_to_end[index][type] = e.detail.value;
      break;
    default:
      config.datas[name] = e.detail.value;
  }
}

/**
 * 增加元件仓库/端到端配置
 */
const warehouseDefault = [{ name: "", url: "" }];
const endToEndDefault = [{ name: "", type: "", method: "function(query) { return query; }" }];
const handleAdd = (type: string) => {
  switch (type) {
    case "component_warehouse":
      config.datas.component_warehouse.push(cloneDeep(warehouseDefault[0]));
      break;
    case "end_to_end":
      config.datas.end_to_end.push(cloneDeep(endToEndDefault[0]));
      break;
  }
};
/**
 * 删除元件仓库/ 端到端配置
 */
const handleDelete = (type: string, index: number) => {
  switch (type) {
    case "component_warehouse":
      config.datas.component_warehouse.splice(index, 1);
      break;
    case "end_to_end":
      config.datas.end_to_end.splice(index, 1);
      break;
  }
};

/**
 * 端到端
 */
const typesInfo: { label: string; value: string }[] = [
  { label: "跳转至工作空间", value: EndToEndEnum.WORK_SPACE },
  { label: "编辑一个页面", value: EndToEndEnum.EDIT_PAGE },
  { label: "新增一个页面", value: EndToEndEnum.ADD_PAGE },
  { label: "预览一个页面", value: EndToEndEnum.PREVIEW_PAGE },
  { label: "页面自动导入APP", value: EndToEndEnum.IMPORT_APP },
  { label: "预览一个站点", value: EndToEndEnum.PREVIEW_WEBSITE },
  { label: "编辑一个站点", value: EndToEndEnum.EDIT_WEBSITE },
  { label: "使用一个项目新建站点", value: EndToEndEnum.ADD_WEBSITE },
];
const editIndex = ref<number>(-1);
function editMethod(index: number) {
  const tempMethod = cloneDeep(config.datas.end_to_end[index]["method"]);
  codeStr.value = tempMethod;
  editIndex.value = index;
  codeModal.value = true;
}

/**
 * 代码编辑器
 */
const codeModal = ref(false);
const codeEditor = ref(null);
const codeStr = ref("");
function codeChange() {
  const code = removeLineBreaks((codeEditor.value as any).getValue());
  config.datas.end_to_end[editIndex.value]["method"] = code;
  codeModal.value = false;
}

const goToWorkspace = () => {
  router.push("/uibuilder/workspace");
};

onMounted(() => {
  getConfigInfoApi({}).then((res) => {
    config.datas = res.data as any;
    tempObj.datas = cloneDeep(res.data as any);
    if (!isArray(config.datas.component_warehouse) || !config.datas.component_warehouse.length) {
      config.datas.component_warehouse = cloneDeep(warehouseDefault);
    }
    if (!isArray(config.datas.end_to_end) || !config.datas.end_to_end.length) {
      config.datas.end_to_end = cloneDeep(endToEndDefault);
    }
    if (!config.datas.component_loading_timeout) {
      config.datas.component_loading_timeout = 5;
    }
    if (res?.data?.website_name) {
      useAppStore.setWebsiteName(res.data.website_name);
    }
  });

  // 加载用户主题
  initThemeConfig();

  nextTick(() => {
    const formNode = document.querySelector("#form-input-wrapper");
    formNode && formNode.addEventListener("onChange", onInputEvent);
  });
});
</script>
<style scoped lang="scss">
.theme {
  color: #fff;
}
.setting-container {
  overflow: hidden;
  width: 100%;
  height: 100%;

  .headers {
    height: var(--header-height);
    box-shadow: 0 4px 3px 0 rgb(36 41 46 / 25%);
    background-color: var(--theme-color);
  }

  .go-back {
    color: #fff;
    padding: 4px 6px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
    margin-right: 10px;
    position: absolute;
    left: 15px;
    top: 12px;
    z-index: 9999;
    font-size: 12px;
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    span {
      margin-right: 4px;
    }
  }

  .form-wrapper {
    #form-input-wrapper {
      height: calc(100vh - 180px);

      .configuration-item {
        width: 60%;
        height: calc(100% - 50px);
        margin: 0 auto;
        overflow: auto;
      }
    }

    .form-item {
      box-sizing: border-box;
      margin: 0 0 24px;
      padding: 0 20px 0 0;
      color: #000000d9;
      font-size: 14px;
      font-variant: tabular-nums;
      line-height: 1.5715;
      list-style: none;
      font-feature-settings: "tnum";
      vertical-align: top;
      display: flex;
      flex-flow: row wrap;

      label {
        justify-content: end;
        vertical-align: middle;
        width: 200px;
        position: relative;
        display: inline-flex;
        align-items: center;
        max-width: 100%;
        height: 32px;
        color: #000000d9;
        font-size: 14px;
      }

      .form-item-label {
        &::before {
          display: inline-block;
          margin-right: 4px;
          color: #ff4d4f;
          font-size: 14px;
          font-family: SimSun, sans-serif;
          line-height: 1;
          content: "*";
        }
      }

      .form-item-content {
        margin-left: 10px;
        flex: auto;
        max-width: 100%;
        display: flex;
      }

      .form-item-icon {
        padding-left: 15px;
        cursor: pointer;
      }
    }
    .btn-wrapper {
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>

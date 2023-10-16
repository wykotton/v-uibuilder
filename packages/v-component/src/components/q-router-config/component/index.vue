<template>
  <a-config-provider :locale="zhCN">
    <a-spin :spinning="loading">
      <div class="router-container">
        <div class="title">路由配置</div>
        <div class="search-input">
          <a-input-search
            ref="inputSearch"
            v-model:value="searchText"
            placeholder="请输入查询关键字"
            @search="onSearch"
            @mousedown="searchFocus"
          ></a-input-search>
        </div>
        <div style="display: flex; align-items: center; margin-top: 10px">
          <a-button
            style="width: 90px"
            :disabled="contextType"
            @click.stop="openRouterModal(ModalTypeInfo.ADD, '', '')"
            @mousedown.stop="() => null"
          >
            新建
            <plus-outlined />
          </a-button>
          <a-button
            style="width: 100px; margin-left: 10px"
            :disabled="contextType"
            @click.stop="showStoryLine"
            @mousedown.stop="() => null"
          >
            故事线
            <partition-outlined />
          </a-button>
          <!-- <div style="cursor: pointer; margin-left: 20px" @click="importExport('import')">导入</div>
                  <div style="cursor: pointer; margin-left: 10px" @click="importExport('export')">导出</div> -->
        </div>
        <a-collapse v-model:activeKey="routerActiveKey" :bordered="false" style="margin-top: 10px">
          <a-collapse-panel v-for="router in Object.keys(tempRouterConfig)" :key="router" :header="router">
            <div
              class="router-list"
              v-for="routerInfo in tempRouterConfig[router]"
              @mousedown.stop="() => null"
              :style="{ outline: routerInfo._state === RouterState.ERROR ? '2px solid red' : '1px solid #e1e4e8' }"
            >
              <div class="info">
                <div
                  class="title"
                  v-html="routerInfo.titleHighlights || routerInfo.title"
                  :title="routerInfo.title"
                ></div>
                <div class="label" v-html="routerInfo.srcHighlights || routerInfo.src" :title="routerInfo.src"></div>
              </div>
              <div class="router-btn">
                <a-tooltip placement="bottom">
                  <template #title>
                    <span>查看</span>
                  </template>
                  <eye-outlined
                    :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: 'auto' }"
                    @click.stop="openRouterModal(ModalTypeInfo.SEE, routerInfo.src, routerInfo.id)"
                  />
                </a-tooltip>
                <a-tooltip placement="bottom">
                  <template #title>
                    <span>编辑</span>
                  </template>
                  <form-outlined
                    v-show="!contextType"
                    :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }"
                    @click.stop="openRouterModal(ModalTypeInfo.EDIT, routerInfo.src, routerInfo.id)"
                  />
                </a-tooltip>
                <a-tooltip placement="bottom">
                  <template #title>
                    <span>删除</span>
                  </template>
                  <delete-outlined
                    v-show="!contextType"
                    :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }"
                    @click.stop="openRouterModal(ModalTypeInfo.DELETE, routerInfo.src, routerInfo.id)"
                  />
                </a-tooltip>
                <a-tooltip placement="bottom">
                  <template #title>
                    <span>复制</span>
                  </template>
                  <copy-outlined
                    v-show="!contextType"
                    :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }"
                    @click.stop="openRouterModal(ModalTypeInfo.COPY, routerInfo.src, routerInfo.id)"
                  />
                </a-tooltip>
              </div>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
      <handle-router
        ref="handleRouter"
        :root="root"
        :data="data"
        :loading="loading"
        :pageId="pageId"
        :pageList="pageList"
        :routerTypeArr="routerTypeArr"
        :defaultType="defaultType"
        :onSearch="onSearch"
        :getRouterType="getRouterType"
        :closeStoryLineModal="closeStoryLineModal"
        :changeElementData="changeElementData"
        :changeTypeList="changeTypeList"
        :getProjectData="getProjectData"
      ></handle-router>
      <story-line
        ref="storyLine"
        :root="root"
        :data="data"
        :loading="loading"
        :pageId="pageId"
        :pageList="pageList"
        :routerTypeArr="routerTypeArr"
        :defaultType="defaultType"
        :tempRouterConfig="tempRouterConfig"
        :onSearch="onSearch"
        :getRouterType="getRouterType"
        :closeRouterModal="closeRouterModal"
        :changeElementData="changeElementData"
        :changeTypeList="changeTypeList"
        :getProjectData="getProjectData"
      ></story-line>
    </a-spin>
    <!-- <a-modal
    v-model:visible="schemaVisible"
    v-if="schemaVisible"
    :title="schemaTitle"
    :maskClosable="false"
    width="80%"
    @ok="importData"
  >
    <div style="width: 100%; padding: 10px">
      <a-textarea v-model:value="dataSchema" style="width: 100%; height: 400px" />
    </div>
  </a-modal> -->
  </a-config-provider>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { cloneDeep, isString, throttle, isArray } from "lodash-es";
import { createHashId, getPageInfo, getProjectInfo, getRouteVariable } from "../../../util/utils";
import { IRouterInfo, IReceive } from "../../../types/runtime/IRouterConfig";
import { message } from "ant-design-vue";
import { ModalTypeInfo } from "../utils/utils";
import { routerSearch } from "../utils/composition";
import zhCN from "ant-design-vue/lib/locale/zh_CN";
import HandleRouter from "./handleRouter.vue";
import StoryLine from "./storyline.vue";

const props = defineProps<{
  root: any;
  insideChange: { value: boolean };
}>();
const data: { [key: string]: IRouterInfo[] } = cloneDeep(props.root.value);

enum RouterState {
  OK = "ok",
  ERROR = "error",
}
const routerActiveKey = ref("");
const contextType = ref(props.root.contextType);

/**
 * 页面数据
 */
const pageList = ref<any>([]);
const pageId = ref<any>(null);
const projectId = ref<any>(null);
/**
 * 获取项目id
 */
async function getProjectId() {
  if (!pageId.value) return;
  // const token = getUserToken();
  // if (!token) {
  //   message.destroy();
  //   message.error("路由配置元件: 未找到用户信息, 无法获取项目数据!");
  //   return;
  // }
  const request = await getPageInfo(Number(pageId.value), props.root.domain);
  if (request?.data?.data) {
    const {
      results,
      info: { msg = "" },
    } = request.data.data;
    if (msg !== "success") return;
    if (results[0]?.project_id) {
      projectId.value = results[0].project_id;
    }
  }
}

/**
 * 获取项目数据
 * @returns
 */
const loading = ref(false);
const getProjectData = throttle(
  async () => {
    if (!projectId.value) {
      message.destroy();
      message.error("路由配置元件: 未找到项目id, 无法获取项目数据!");
      return;
    }
    // const token = getUserToken();
    // if (!token) {
    //   message.destroy();
    //   message.error("路由配置元件: 未找到用户信息, 无法获取项目数据!");
    //   return;
    // }
    loading.value = true;
    const request = await getProjectInfo(Number(projectId.value), props.root.domain);
    if (request?.data?.data) {
      const {
        results,
        info: { msg = "" },
      } = request.data.data;
      if (msg === "success" && results[0]?.pageList) {
        const tempList = isString(results[0].pageList) ? JSON.parse(results[0].pageList) : results[0].pageList;
        pageList.value = tempList.map((item: any) => {
          isString(item.custom_model) ? (item.custom_model = JSON.parse(item.custom_model)) : void 0;
          return item;
        });
      }
    }
    loading.value = false;
  },
  5000,
  { trailing: false }
);

/**
 * 搜索框聚焦处理
 */
const inputSearch = ref();
function searchFocus() {
  inputSearch.value?.focus();
}

/**
 * 搜索路由配置项
 */
const searchText = ref("");
const tempRouterConfig = ref<any>({});
function onSearch() {
  tempRouterConfig.value = routerSearch(data, defaultType.value, searchText.value);
}

/**
 * 路由分类
 */
const routerTypeArr = ref<string[]>([]);
const defaultType = ref("默认分类");
function getRouterType() {
  const tempTypesArr: string[] = cloneDeep(props.root.typeSortList);
  !tempTypesArr.includes(defaultType.value) ? tempTypesArr.push(defaultType.value) : void 0;
  Object.keys(data).forEach((key: string) => {
    data[key].forEach((item: IRouterInfo) => {
      if (item.type && !tempTypesArr.includes(item.type)) {
        tempTypesArr.push(item.type);
      }
    });
  });
  routerTypeArr.value = [...tempTypesArr];
}

/**
 * 配置项操作
 */
const handleRouter = ref();
const storyLine = ref();
function openRouterModal(type: string, src: string, routerId: string) {
  handleRouter.value?.openRouterModal(type, src, routerId);
}
function showStoryLine() {
  storyLine.value?.showStoryLine();
}
function closeRouterModal() {
  handleRouter.value?.closeRouterModal();
}
function closeStoryLineModal() {
  storyLine.value?.closeStoryLine();
}

/**
 * 组件外部更新元件源
 * @param value
 */
function changeSelectedComponent(value: string) {
  handleRouter.value?.changeSelectedComponent(value);
}

/**
 * 导入导出路由配置数据
 */
// const schemaType = ref("");
// const schemaVisible = ref(false);
// const schemaTitle = ref("");
// const dataSchema = ref("");
// const importExport = (type: string) => {
//   if (type === "import") {
//     schemaTitle.value = "导入路由配置";
//     dataSchema.value = "[ ]";
//   } else {
//     schemaTitle.value = "导出路由配置";
//     const tempDataSchema = <any>[];
//     Object.keys(data).forEach((key) => {
//       tempDataSchema.push(data[key]);
//     });
//     dataSchema.value = JSON.stringify(tempDataSchema);
//   }
//   schemaType.value = type;
//   schemaVisible.value = true;
// };
// const importData = () => {
//   if (schemaType.value === "export") {
//     schemaVisible.value = false;
//     return;
//   }
//   try {
//     const tempData = JSON.parse(dataSchema.value);
//     if (Array.isArray(tempData)) {
//       let repeatTitle = false;
//       let repeatKey = false;
//       tempData.forEach((item) => {
//         Object.keys(data).forEach((key) => {
//           if (item.title === data[key].title) repeatTitle = true;
//           if (item.src === data[key].src) repeatKey = true;
//         });
//       });
//       if (repeatTitle) {
//         message.destroy();
//         message.error("配置项名称(title)重复");
//         return;
//       }
//       if (repeatKey) {
//         message.destroy();
//         message.error("已存在该发起源(src)");
//         return;
//       }
//       tempData.forEach((item: any) => {
//         data[item.src] = item;
//       });
//       onSearch(searchText.value);
//       schemaVisible.value = false;
//       changeElementData();
//     } else {
//       message.destroy();
//       message.error("schema信息有误");
//     }
//   } catch (error) {
//     message.destroy();
//     message.error("schema信息有误");
//   }
// };

/**
 * 更新组件value
 */
const changeElementData = () => {
  props.insideChange.value = true;
  props.root.value = cloneDeep(data);
};
/**
 * 更新路由分类
 */
const changeTypeList = () => {
  props.root.typeSortList = cloneDeep(routerTypeArr.value);
};

/**
 * 组件外部更新配置项
 * @param config
 */
// @ts-ignore
// function changeConfig(config: ChangeConfigInfo) {
//   if (!config.source || !config.target || !config.page) return;
//   if (data?.[config.source]) {
//     // 已有配置项，检查是否有相同接收源
//     const tempRouterInfo = cloneDeep(data[config.source]);
//     let hasReceive = false;
//     let receiveIndex: number | null = null;
//     tempRouterInfo.receive.forEach((item: IReceive, index: number) => {
//       if (item.page === config.page && item.target === config.target) {
//         hasReceive = true;
//         receiveIndex = index;
//       }
//     });
//     if (!hasReceive) {
//       tempRouterInfo.receive.push({
//         page: config.page,
//         target: config.target,
//         event: <any>[],
//         script: "function(data) { return data; }",
//       });
//       receiveIndex = tempRouterInfo.receive.length - 1;
//     }
//     data[config.source] = tempRouterInfo;
//     changeElementData();
//     openRouterModal(ModalTypeInfo.EDIT, config.source, "");
//     selectCurrent(CurrentTypeInfo.RECEIVE, receiveIndex);
//   } else {
//     // 没有配置项，进行添加
//     const tempRouterInfo = cloneDeep(defaultInfo);
//     tempRouterInfo.title = `新建配置项${new Date().toLocaleString()}`;
//     tempRouterInfo.src = config.source;
//     tempRouterInfo.receive.push({
//       page: config.page,
//       target: config.target,
//       event: <string[]>[],
//       script: "function(data) { return data; }",
//       reply: <IReceive[]>[],
//       _targetState: RouterState.OK,
//       _current: true,
//     });
//     data[config.source] = tempRouterInfo;
//     onSearch(searchText.value);
//     changeElementData();
//     openRouterModal(ModalTypeInfo.EDIT, config.source, "");
//   }
// }

/**
 * 元件外部选择配置项
 * @param value
 * @returns
 */
// @ts-ignore
// function selectConfig(value: string) {
//   if (!value || !data[value]) return;
//   openRouterModal(ModalTypeInfo.EDIT, value, "");
// }

/**
 * 元件外部删除配置项
 * @param config
 */
// @ts-ignore
// function deleteConfig(config: ChangeConfigInfo) {
//   if (!config.source || !config.target || !config.page) return;
//   if (data?.[config.source]) {
//     const routerInfo = cloneDeep(data[config.source]);
//     const index = routerInfo.receive.findIndex(
//       (item: IReceive) => item.page === config.page && item.target === config.target
//     );
//     if (index > -1) {
//       // 查找到配置项就删除
//       routerInfo.receive.splice(index, 1);
//       data[config.source] = routerInfo;
//       changeElementData();
//       // 若正在编辑此配置项，则把临时数据也删除掉
//       if (modalVisible.value) {
//         const tempIndex = tempDataInfo.value.receive.findIndex(
//           (item) => item.page === config.page && item.target === config.target
//         );
//         if (tempIndex > -1) {
//           tempDataInfo.value.receive.splice(tempIndex, 1);
//         }
//       }
//     } else {
//       message.error("未找到路由配置项!");
//     }
//   } else {
//     message.error("未找到路由配置项!");
//   }
// }

/**
 * 获取新增的路由关系和删除的路由关系
 */
// @ts-ignore
// function handleAddOrDelete() {
//   const addEdge: EdgeInfo[] = [];
//   const deleteEdge: EdgeInfo[] = [];
//   if (tempDataInfo.value.src !== handleRouterKey.value) {
//     // 发起源变更，原数据全被删除，全部添加了新数据
//     const oldRouter = cloneDeep(data[handleRouterKey.value]);
//     oldRouter.receive.forEach((item: IReceive) => {
//       deleteEdge.push({
//         id: `${oldRouter.src}|${item.page}|${item.target}`,
//         source: `${pageId.value}|${oldRouter.src}`,
//         target: `${item.page}|${item.target}`,
//       });
//     });
//     const newRouter = cloneDeep(tempDataInfo.value);
//     newRouter.receive.forEach((item) => {
//       addEdge.push({
//         id: `${newRouter.src}|${item.page}|${item.target}`,
//         source: `${pageId.value}|${newRouter.src}`,
//         target: `${item.page}|${item.target}`,
//       });
//     });
//   } else {
//     const oldRouter = cloneDeep(data[handleRouterKey.value]);
//     const newRouter = cloneDeep(tempDataInfo.value);
//     // 进行数据比较，筛出新增数据和删除数据
//     const difference = (arrVal: IReceive, othVal: IReceive) => {
//       if (arrVal.page !== othVal.page || arrVal.target !== othVal.target) {
//         return false;
//       }
//       return true;
//     };
//     const addRouter = differenceWith(newRouter.receive, oldRouter.receive, difference);
//     const deleteRouter = differenceWith(oldRouter.receive, newRouter.receive, difference);
//     addRouter.forEach((item) => {
//       addEdge.push({
//         id: `${handleRouterKey.value}|${item.page}|${item.target}`,
//         source: `${pageId.value}|${handleRouterKey.value}`,
//         target: `${item.page}|${item.target}`,
//       });
//     });
//     deleteRouter.forEach((item) => {
//       deleteEdge.push({
//         id: `${handleRouterKey.value}|${item.page}|${item.target}`,
//         source: `${pageId.value}|${handleRouterKey.value}`,
//         target: `${item.page}|${item.target}`,
//       });
//     });
//   }
//   sendRouterChange(addEdge, deleteEdge);
// }

/**
 * 发送路由变更信息给designer页面路由关系图
 * @param addEdge
 * @param deleteEdge
 */
// function sendRouterChange(addEdge: EdgeInfo[], deleteEdge: EdgeInfo[]) {
//   window.dispatchEvent(
//     new CustomEvent("router:change", {
//       detail: {
//         addEdge,
//         deleteEdge,
//       },
//     })
//   );
// }

/**
 * 检查接收源的page，进行自动修复
 * 添加错误项标识
 */
async function repairRouterConfig() {
  await getProjectData();
  if (!Object.keys(data).length) return;
  const tempPageList: any = {};
  pageList.value.forEach((page: any) => {
    tempPageList[page.id] = page;
  });
  Object.keys(data).forEach((key: string) => {
    let tempRouterInfo = cloneDeep(data[key]);
    // start
    // 注意！注意！注意！此次更新将路由数据结构由key:map改为key:array
    // 此处操作用于兼容旧数据，转换为当前数据结构
    if (tempRouterInfo && !isArray(tempRouterInfo)) {
      tempRouterInfo = [tempRouterInfo];
      !isArray(data) ? (data[key] = []) : void 0;
    }
    //end
    tempRouterInfo?.forEach((router: IRouterInfo, routerIndex: number) => {
      // start 兼容旧数据 (变更: 新增路由id和分类)
      router.id ? void 0 : (router.id = createHashId(12, "router-"));
      router.type ? void 0 : (router.type = defaultType.value);
      // end
      // start 兼容旧数据 (变更: 可手动选择需要响应变更的model属性)
      router.attribute ? void 0 : (router.attribute = []);
      // end
      const srcTarget = document.querySelector(`#${router.src}`);
      let isError = false;
      if (srcTarget) {
        router._srcState = RouterState.OK;
      } else {
        router._srcState = RouterState.ERROR;
        isError = true;
      }
      router.receive.forEach((receive: IReceive) => {
        // start 兼容旧数据 (变更: 新增接收源回流)
        receive.id ? void 0 : (receive.id = createHashId(12, "receive-"));
        receive.reply ? (receive.reply = true) : (receive.reply = false);
        receive.replyEvents?.length ? void 0 : (receive.replyEvents = []);
        receive.replyScript ? void 0 : (receive.replyScript = "");
        // end
        if (receive._current) {
          const receiveTarget = document.querySelector(`#${receive.target}`);
          if (receiveTarget) {
            receive._targetState = RouterState.OK;
            receive.page = pageId.value;
          } else {
            receive._targetState = RouterState.ERROR;
            isError = true;
          }
        } else {
          if (tempPageList[receive.page]) {
            receive._targetState = RouterState.OK;
          } else {
            receive._targetState = RouterState.ERROR;
            isError = true;
          }
        }
        receive.script = String(receive.script);
        receive.replyScript = String(receive.replyScript);
      });
      router._state = isError ? RouterState.ERROR : RouterState.OK;
      data[key][routerIndex] = router;
    });
  });
  onSearch();
  changeElementData();
}

/**
 * 组件外部更新元件运行时状态
 * @param value
 */
function changeContextType(value: boolean) {
  contextType.value = value;
}

onMounted(async () => {
  pageId.value = getRouteVariable("id");
  onSearch();
  await getProjectId();
  repairRouterConfig();
});

/**
 * 导出供外部调用函数
 */
defineExpose({
  changeSelectedComponent,
  changeContextType,
});
</script>
<style lang="scss" scoped></style>

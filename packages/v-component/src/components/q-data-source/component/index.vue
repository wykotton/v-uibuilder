<template>
  <div class="source-container">
    <div class="title">API数据源</div>
    <div class="search-content">
      <a-select
        ref="select"
        v-model:value="searchSelect"
        :options="selectOptions"
        style="width: 90px; min-width: 90px"
        @change="selectChange"
      ></a-select>
      <a-input-search
        ref="sourceSearch"
        v-model:value="searchText"
        placeholder="请输入"
        @search="onSearch"
        @mousedown="searchFocus"
      />
    </div>
    <div style="display: flex; align-items: center; margin-top: 10px">
      <a-dropdown :trigger="['click']">
        <template #overlay>
          <a-menu @click="openDrawer">
            <a-sub-menu key="api" title="API数据">
              <a-menu-item key="fetch">fetch</a-menu-item>
              <a-menu-item key="jsonp">jsonp</a-menu-item>
            </a-sub-menu>
            <a-menu-item key="database">数据库</a-menu-item>
          </a-menu>
        </template>
        <a-button style="width: 90px; min-width: 90px">
          新建
          <down-outlined />
        </a-button>
      </a-dropdown>
      <!-- <div style="cursor: pointer; margin-left: 20px" @click="importExport('import')">导入</div>
          <div style="cursor: pointer; margin-left: 10px" @click="importExport('export')">导出</div> -->
    </div>
    <div v-for="item in tempDataSource" class="source-list">
      <div class="info">
        <div class="title" :title="item.title">{{ item.title || "" }}</div>
        <div class="label">
          <span class="tag">{{ item.requestType }}</span>
          <span class="source-id" title="点击可复制数据源ID" @click="copied(item.sourceId)">{{ item.sourceId }}</span>
        </div>
      </div>
      <div class="source-btn">
        <a-tooltip placement="bottom">
          <template #title>
            <span>查看</span>
          </template>
          <eye-outlined
            :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: 'auto' }"
            @click="openDrawer(drawerTypeEnum.SEE, item.sourceId)"
          />
        </a-tooltip>
        <a-tooltip placement="bottom">
          <template #title>
            <span>编辑</span>
          </template>
          <form-outlined
            :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }"
            @click="openDrawer(drawerTypeEnum.EDIT, item.sourceId)"
          />
        </a-tooltip>
        <a-tooltip placement="bottom">
          <template #title>
            <span>删除</span>
          </template>
          <delete-outlined
            :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }"
            @click="openDrawer(drawerTypeEnum.DELETE, item.sourceId)"
          />
        </a-tooltip>
        <a-tooltip placement="bottom">
          <template #title>
            <span>复制</span>
          </template>
          <copy-outlined
            :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }"
            @click="openDrawer(drawerTypeEnum.COPY, item.sourceId)"
          />
        </a-tooltip>
      </div>
    </div>
    <div
      v-show="schemaVisible"
      style="width: 600px; position: absolute; border: 1px solid #dedede; right: -600px; top: -1px"
    >
      <div style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #dedede">
        <div style="font-size: 15px; font-weight: 600; color: #666666">{{ schemaTitle }}</div>
        <div
          v-if="schemaType === 'import'"
          style="margin-left: auto; color: #4274f8; cursor: pointer"
          @click="importData"
        >
          确定
        </div>
        <div
          v-if="schemaType === 'import' || drawerType === 'edit' || drawerType === 'copy'"
          style="margin-left: 10px; cursor: pointer"
          @click="schemaVisible = false"
        >
          取消
        </div>
        <div v-if="schemaType === 'export'" style="margin-left: auto; cursor: pointer" @click="schemaVisible = false">
          关闭
        </div>
      </div>
      <div style="width: 100%; padding: 10px">
        <a-textarea v-model:value="dataSchema" style="width: 100%; height: 400px" />
      </div>
    </div>
  </div>
  <api-source
    ref="apiSource"
    :root="root"
    :data="data"
    :changeElementData="changeElementData"
    :fetchRequest="fetchRequest"
    :jsonpRequest="jsonpRequest"
    :httpRequest="httpRequest"
    :onSearch="onSearch"
    :initiateRequestsInAUnifiedManner="initiateRequestsInAUnifiedManner"
  ></api-source>
  <data-base
    ref="database"
    :root="root"
    :data="data"
    :changeElementData="changeElementData"
    :fetchRequest="fetchRequest"
    :httpRequest="httpRequest"
    :onSearch="onSearch"
    :initiateRequestsInAUnifiedManner="initiateRequestsInAUnifiedManner"
  ></data-base>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { cloneDeep, isObject, isArray, isBoolean, isNumber, isString } from "lodash-es";
import { IMessage } from "../../../types/runtime/IMessage";
import { IApiSource, IDatabase, IRequestEvent, IRequestInfo } from "../../../types/runtime/IDataSource";
import { useClipboard } from "@vueuse/core";
import { Modal, message } from "ant-design-vue";
import axios from "axios";
import fetchJsonp from "fetch-jsonp";
import ApiSource from "./api.vue";
import DataBase from "./database.vue";
import { findMod, isJson } from "../utils/utils";

const props = defineProps<{
  root: any;
  data: Array<any>;
  insideChange: { value: boolean };
}>();

enum attrTypeEnum {
  DEFAULT = "default",
  BOOLEAN = "boolean",
  JS = "js",
  JSON = "json",
}
enum sourceTypeEnum {
  FETCH = "fetch",
  JSONP = "jsonp",
  DATABASE = "database",
}
enum drawerTypeEnum {
  SEE = "see",
  EDIT = "edit",
  DELETE = "delete",
  COPY = "copy",
}
const attrTypesArr: string[] = [attrTypeEnum.DEFAULT, attrTypeEnum.BOOLEAN, attrTypeEnum.JS, attrTypeEnum.JSON];

const searchSelect = ref("all");
const searchText = ref("");
const tempDataSource = ref(cloneDeep(props.data));

// const instance = getCurrentInstance()
const apiSource = ref();
const database = ref();

/**
 * 变更展示分类
 * @param value
 */
const selectOptions = [
  { label: "全部", value: "all" },
  { label: "fetch", value: sourceTypeEnum.FETCH },
  { label: "jsonp", value: sourceTypeEnum.JSONP },
  { label: "database", value: sourceTypeEnum.DATABASE },
];
const selectChange = (value: string) => {
  if (value === "all") {
    tempDataSource.value = props.data.filter((item: IApiSource | IDatabase) =>
      item.sourceId.includes(searchText.value)
    );
  } else {
    tempDataSource.value = props.data.filter(
      (item: IApiSource | IDatabase) => item.sourceId.includes(searchText.value) && item.requestType.includes(value)
    );
  }
};

/**
 * 搜索请求源数据
 */
const onSearch = () => {
  if (searchSelect.value === "all") {
    tempDataSource.value = props.data.filter((item: IApiSource | IDatabase) =>
      item.sourceId.includes(searchText.value)
    );
  } else {
    tempDataSource.value = props.data.filter(
      (item: IApiSource | IDatabase) =>
        item.sourceId.includes(searchText.value) && item.requestType.includes(searchSelect.value)
    );
  }
};
/**
 * 搜索框聚焦处理
 */
const sourceSearch = ref();
function searchFocus() {
  sourceSearch.value?.focus();
}

/**
 * 复制数据ID
 */
const { copy } = useClipboard({ legacy: true });
function copied(sourceId: string) {
  message.destroy();
  copy(sourceId)
    .then(() => {
      message.success(`已复数据源ID_${sourceId}`);
    })
    .catch(() => {
      message.warning("此环境不支持复制操作, 请手动复制ID");
    });
}

/**
 * 开启操作抽屉
 */
// const sourceStatus = ref("");
const drawerType = ref("");
const openDrawer = (e: any, id: string) => {
  const type = e.key || e;
  const index = props.data.findIndex((item: IApiSource | IDatabase) => item.sourceId === id);
  switch (type) {
    case sourceTypeEnum.FETCH:
    case sourceTypeEnum.JSONP:
      database.value.drawerVisible = false;
      apiSource.value.openDrawer(e, id);
      break;
    case sourceTypeEnum.DATABASE:
      apiSource.value.drawerVisible = false;
      database.value.openDrawer(e, id);
      break;
    case drawerTypeEnum.COPY:
    case drawerTypeEnum.EDIT:
    case drawerTypeEnum.SEE:
      if (props.data[index].requestType === sourceTypeEnum.DATABASE) {
        apiSource.value.drawerVisible = false;
        database.value.openDrawer(e, id);
      } else {
        database.value.drawerVisible = false;
        apiSource.value.openDrawer(e, id);
      }
      break;
    case drawerTypeEnum.DELETE:
      Modal.confirm({
        title: "确定要删除吗?",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          if (props.data[index].sourceId === apiSource.value.tempDataInfo.sourceId) {
            apiSource.value.drawerVisible = false;
          }
          if (props.data[index].sourceId === database.value.tempDataInfo.sourceId) {
            database.value.drawerVisible = false;
          }
          if (index !== -1) {
            props.data.splice(index, 1);
          }
          onSearch();
          changeElementData();
        },
      });
      break;
    default:
      break;
  }
};

/**
 * 请求的处理函数
 */
enum eventType {
  IS_REQUEST = "isRequest",
  HANDLE_PARAM = "handleParam",
  HANDLE_SUCCESS = "handleSuccess",
  HANDLE_ERROR = "handleError",
  HANDLE_FLOW_API = "handleFlowApi",
}

/**
 * 导入导出
 */
const schemaType = ref("");
const schemaVisible = ref(false);
const schemaTitle = ref("");
const dataSchema = ref("");

// function importExport(type: string) {
//   if (type === "import") {
//     schemaTitle.value = "导入";
//     dataSchema.value = "[ ]";
//   } else {
//     schemaTitle.value = "导出";
//     dataSchema.value = JSON.stringify(cloneDeep(props.data));
//   }
//   schemaType.value = type;
//   schemaVisible.value = true;
// }

function importData() {
  try {
    const tempData = JSON.parse(dataSchema.value);
    if (Array.isArray(tempData)) {
      props.data.push.apply(props.data, tempData);
      onSearch();
      schemaVisible.value = false;
    } else {
      message.error("schema信息有误");
    }
  } catch (error) {
    message.error("schema信息有误");
  }
}

/**
 * 组件初始化自动数据请求
 */
function httpRequest(sourceId?: string) {
  const requestArr = [] as any;
  props.data.forEach((item: IApiSource | IDatabase) => {
    const autoRequest =
      item.autoRequest.type === attrTypeEnum.DEFAULT
        ? item.autoRequest.value
        : new Function(`return ${item.autoRequest.value}`)();
    if (sourceId === item.sourceId) {
      switch (item.requestType) {
        case sourceTypeEnum.FETCH:
        case sourceTypeEnum.DATABASE:
          requestArr.push(fetchRequest(item));
          break;
        case sourceTypeEnum.JSONP:
          requestArr.push(jsonpRequest(item as IApiSource));
          break;
      }
    } else {
      switch (item.requestType) {
        case sourceTypeEnum.FETCH:
        case sourceTypeEnum.DATABASE:
          autoRequest ? requestArr.push(fetchRequest(item)) : void 0;
          break;
        case sourceTypeEnum.JSONP:
          autoRequest ? requestArr.push(jsonpRequest(item as IApiSource)) : void 0;
          break;
      }
    }
  });

  initiateRequestsInAUnifiedManner(requestArr);
}

/**
 * 处理axios的config参数
 * @param item
 */
function handleAxiosConfig(item: IApiSource | IDatabase) {
  if (item.requestType === sourceTypeEnum.FETCH) {
    const tempItem = item as IApiSource;
    let config = <any>{};
    const headers = <any>{};
    if (Array.isArray(tempItem.requestHeader.value)) {
      tempItem.requestHeader.value.forEach((header) => {
        headers[header.key] = header.value;
      });
    } else if (tempItem.requestHeader.value !== "") {
      headers["headers"] = new Function(`return ${tempItem.requestHeader.value}`)();
    }
    let data = <any>{};
    if (Array.isArray(tempItem.requestParam.value)) {
      tempItem.requestParam.value.forEach((param) => {
        if (!param.key || !param.value) return;
        // 处理各类型参数
        switch (param.type) {
          case attrTypeEnum.DEFAULT:
            data[param.key] = param.value;
            break;
          case attrTypeEnum.BOOLEAN:
            data[param.key] = param.value ? true : false;
            break;
          case attrTypeEnum.JS:
            try {
              data[param.key] = new Function(`return ${param.value}`)();
            } catch (error) {
              console.log("数据源JS参数解析失败,请检查数据!");
              console.log(error);
              data[param.key] = param.value;
            }
            break;
          case attrTypeEnum.JSON:
            try {
              data[param.key] = isString(param.value) ? JSON.parse(param.value) : param.value;
            } catch (error) {
              console.log("数据源JSON参数解析失败,请检查数据!");
              console.log(error);
              data[param.key] = param.value;
            }
            break;
          default:
            data[param.key] = param.value;
            break;
        }
      });
    } else {
      data = new Function(`return ${tempItem.requestParam.value}`)();
    }
    config.url =
      tempItem.requestUrl.type === attrTypeEnum.DEFAULT
        ? tempItem.requestUrl.value
        : new Function(`return ${tempItem.requestUrl.value}`)();
    config.method =
      tempItem.requestMethod.type === attrTypeEnum.DEFAULT
        ? tempItem.requestMethod.value
        : new Function(`return ${tempItem.requestMethod.value}`)();
    Object.keys(headers).length ? (config.headers = headers) : void 0;
    tempItem.requestMethod.value === "PUT" || tempItem.requestMethod.value === "POST"
      ? (config.data = data)
      : (config.params = data);
    config.timeout =
      tempItem.timeout.type === attrTypeEnum.DEFAULT
        ? tempItem.timeout.value
        : new Function(`return ${tempItem.timeout.value}`)();
    if (tempItem.paramsType === "raw") {
      config.data = tempItem.paramsCode;
    }
    try {
      const eventInfo = tempItem.eventHandler.find((event: IRequestEvent) => event.key === eventType.HANDLE_PARAM);
      if (eventInfo) {
        const script = new Function(`return ${eventInfo.value}`)();
        config = script(config);
      }
    } catch (error) {
      console.log("数据源请求前参数处理错误! ", error);
    }
    return config;
  } else {
    return item;
  }
}

/**
 * fetch请求
 * @param item
 * @returns
 */
const fetchRequest = (item: IApiSource | IDatabase, isTest = false) => {
  const config = handleAxiosConfig(item);
  // config.sourceRequest = item;
  let request;
  // console.log(config);
  if (item.requestType === sourceTypeEnum.FETCH) {
    (item as IApiSource).paramsType === "raw" ? (config.data = (item as IApiSource).paramsCode) : void 0;
    if ((item as IApiSource).crossDomain.value) {
      request = axios(config);
    } else {
      // 使用designer的代理，请求UIB-server的代理接口
      request = axios({
        url: props.root.domain + "/ui-builder/http-proxy",
        method: "POST",
        data: {
          config,
        },
      });
    }
  } else {
    request = axios({
      url: props.root.domain + "/ui-builder/query-database-data",
      method: "POST",
      data: {
        config,
      },
    });
  }

  return request
    .then((res: any) => {
      res.sourceRequest = cloneDeep(item);
      return res;
    })
    .catch((error: any) => {
      error.sourceRequest = cloneDeep(item);
      return error;
    })
    .finally(() => {
      testDisabled.value = false;
      checkUpPolling(item, sourceTypeEnum.FETCH, isTest);
    });
};

/**
 * jsonp请求
 * @param item
 */
function jsonpRequest(item: IApiSource, isTest = false) {
  const request = fetchJsonp(item.requestUrl.value, {
    nonce: "",
    jsonpCallback: "",
    jsonpCallbackFunction: "",
    referrerPolicy: "",
    timeout: Number(item.timeout.value),
  });
  return request
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      // console.log("jsonp result", json);
      // requestCompletion({ sourceId: item.sourceId, results: json });
      json.sourceRequest = cloneDeep(item);
      return json;
    })
    .catch((error) => {
      // console.log("request failed", error);
      // requestCompletion({ sourceId: item.sourceId, results: error });
      error.sourceRequest = cloneDeep(item);
      return error;
    });
  // .finally(() => {
  //   testDisabled.value = false;
  // });
}

/**
 * 检查请求是否要进行轮询
 * @param item
 */
function checkUpPolling(item: IApiSource | IDatabase, type: string, isTest = false) {
  const newItem = props.data.find((info: IApiSource | IDatabase) => info.sourceId === item.sourceId);
  if (!newItem?.polling?.value || isTest) return;
  clearTimeout(newItem.timer);
  switch (type) {
    case sourceTypeEnum.FETCH:
    case sourceTypeEnum.DATABASE:
      newItem.timer = setTimeout(() => {
        // fetchRequest(newItem);
        httpRequest(newItem.sourceId);
      }, Number(newItem.pollingInterval.value));
      break;
    case sourceTypeEnum.JSONP:
      newItem.timer = setTimeout(() => {
        // fetchJsonp(newItem);
        httpRequest(newItem.sourceId);
      }, Number(newItem.pollingInterval.value));
      break;
  }
}

/**
 * 测试请求
 */
const testDisabled = ref(false);
function changeLoadingState(state: boolean) {
  props.data.forEach((item: IApiSource | IDatabase) => {
    if (item?.loading.value?.length) {
      item.loading.value.map((it) => {
        if (!it.key) return;
        const node = document.querySelector(`#${it.key}`);
        if (node) (node as any).spinning = state;
        setTimeout(() => {
          (node as any).spinning = false;
        }, 120000);
      });
    }
  });
}

/**
 * 数据请求完成，发送路由消息
 */
function requestCompletion(body: any) {
  changeLoadingState(false);
  const message: IMessage = {
    header: {
      src: props.root.id,
      dst: "",
      srcType: "requestCompletion",
      dstType: "",
    },
    body,
  };
  props.root.componentModel.sendMessage(message);
}

/**
 * 更新组件value
 */
const changeElementData = () => {
  props.insideChange.value = true;
  const tempData = cloneDeep(props.data);
  tempData.forEach((item: IApiSource | IDatabase) => {
    clearTimeout(item.timer);
    item.timer = null;
  });
  props.root.source = tempData;
};

/**
 * 外部调用，发起数据请求
 */
function initiateRequest(params: { sourceId: string }) {
  changeLoadingState(true);
  let sourceId = "";
  if (isObject(params)) sourceId = params.sourceId;
  const requestArr = [] as any;
  for (let i = 0; i < props.data.length; i++) {
    const item = props.data[i];
    if (item.hasCatch && sessionStorage[props.root.id] && JSON.parse(sessionStorage[props.root.id])[item.sourceId]) {
      if (sourceId && sourceId === item.sourceId) {
        requestCompletion([JSON.parse(sessionStorage[props.root.id])[item.sourceId]]);
        break;
      } else {
        requestCompletion([JSON.parse(sessionStorage[props.root.id])[item.sourceId]]);
        continue;
      }
    }
    if (sourceId) {
      if (sourceId === item.sourceId && item.requestType === sourceTypeEnum.FETCH) {
        requestArr.push(fetchRequest(item));
        break;
      }

      if (sourceId === item.sourceId && item.requestType === sourceTypeEnum.FETCH) {
        requestArr.push(jsonpRequest(item));
        break;
      }
    } else {
      if (item.requestType === sourceTypeEnum.FETCH) {
        requestArr.push(fetchRequest(item));
      } else if (item.requestType === sourceTypeEnum.JSONP) {
        requestArr.push(jsonpRequest(item));
      }
    }
  }
  initiateRequestsInAUnifiedManner(requestArr);
}

/**
 * 统一发起请求
 * @param reqArr
 */
function initiateRequestsInAUnifiedManner(reqArr: any[]) {
  if (reqArr && reqArr.length) {
    axios
      .all(reqArr)
      .then(
        axios.spread(async (...res) => {
          const result = await Promise.all(
            res.map(async (it: any) => {
              return await new Promise(async (resolve) => {
                const item = cloneDeep(it.sourceRequest) || null;
                Reflect.deleteProperty(it, "sourceRequest");
                let eventIndex = -1;
                try {
                  eventIndex = item?.eventHandler.findIndex(
                    (item: any) => item.key === eventType.HANDLE_SUCCESS || item.key === eventType.HANDLE_FLOW_API
                  );
                } catch (error) {
                  console.log(error);
                }
                const hasCatch = item?.hasCatch;
                if (eventIndex !== -1) {
                  const fun = new Function(`return ${item.eventHandler[eventIndex].value}`)();
                  const r = await fun(it, item);
                  if (hasCatch) {
                    if (sessionStorage[props.root.id]) {
                      const tempSession = JSON.parse(sessionStorage[props.root.id]);
                      tempSession[item.sourceId] = r;
                      sessionStorage[props.root.id] = JSON.stringify(tempSession);
                    } else {
                      sessionStorage[props.root.id] = JSON.stringify({ [item.sourceId]: r });
                    }
                  }
                  resolve({ sourceId: item.sourceId, results: r });
                } else {
                  if (hasCatch) {
                    if (sessionStorage[props.root.id]) {
                      const tempSession = JSON.parse(sessionStorage[props.root.id]);
                      tempSession[item.sourceId] = { [item.sourceId]: { sourceId: item.sourceId, results: it } };
                      sessionStorage[props.root.id] = JSON.stringify(tempSession);
                    } else {
                      sessionStorage[props.root.id] = JSON.stringify({
                        [item.sourceId]: { sourceId: item.sourceId, results: it },
                      });
                    }
                  }
                  resolve({ sourceId: item.sourceId, results: it });
                }
              });
            })
          );
          result.length && requestCompletion(result);
        })
      )
      .catch((error) => {
        console.log(error);
        const item = cloneDeep(error.sourceRequest) || null;
        Reflect.deleteProperty(error, "sourceRequest");
        if (!item) return;
        const eventIndex = item.eventHandler.findIndex((item: any) => item.key === eventType.HANDLE_ERROR);
        if (eventIndex !== -1) {
          const fun = new Function(`return ${item.eventHandler[eventIndex].value}`)();
          const result = fun(error, item);
          requestCompletion([{ sourceId: item.sourceId, results: result }]);
        } else {
          requestCompletion([{ sourceId: item.sourceId, results: error }]);
        }
      });
  }
}

/**
 * 更新参数
 * @param id 数据源id
 * @param paramsList 需要替换的参数列表
 * @param isCover 是否覆盖
 */
function updateRequestParams(updateParams: any = {}) {
  const { id, paramsList, isCover } = updateParams || {};
  if (!id || !isArray(paramsList)) return;
  props.data.length &&
    props.data.map((req: any) => {
      try {
        // if (req.sourceId === id && isJson(req.paramsCode)) {
        if (req.sourceId !== id) return;
        // 有缓存则删除缓存
        // if(req.hasCatch){
        //   clearCatch(req.sourceId)
        // }
        if (req.requestType === sourceTypeEnum.DATABASE) {
          const paramData: any = {};
          paramsList.forEach((param: any) => {
            const { key = "", value = "" } = param;
            paramData[key] = value;
          });
          isBoolean(paramData.pagination) ? (req.pagination = paramData.pagination) : void 0;
          isNumber(paramData.page) && paramData.page > 1 ? (req.page = parseInt(paramData.page)) : void 0;
          isNumber(paramData.limit) && paramData.limit > 1 && paramData.limit < 1000
            ? (req.limit = parseInt(paramData.limit))
            : void 0;
          httpRequest(id);
          return;
        }
        if (req.paramsType === "raw") {
          if (!isJson(req.paramsCode)) return;
          const paramsCodeCopy = JSON.parse(req.paramsCode);
          if (isCover) {
            req.paramsCode = paramsList;
          } else {
            paramsList.length &&
              paramsList.map((params: any) => {
                const { path, value } = params;
                // const pathArr = path.split(".");
                // let props = "";
                // pathArr.map((it: any) => (props += `['${it}']`));
                if (value) {
                  findMod(paramsCodeCopy, path, value);
                  // const fn = typeof value === "object"
                  //   ? new Function(`paramsCodeCopy${props}=value`)
                  //   : new Function(`paramsCodeCopy${props}='${value}'`);
                  // fn(paramsCodeCopy, value)
                }
              });
            req.paramsCode = JSON.stringify(paramsCodeCopy);
          }
        } else {
          const paramData = <{ key: string; value: string; type: string }[]>[];
          paramsList.forEach((param: any) => {
            const { key = "", value = "", type = "" } = param;
            if (!key || (!isBoolean(value) && !value) || (type && !attrTypesArr.includes(type))) return;
            paramData.push(param);
          });
          req.requestParam.value = handleParamMerge(isCover, req.requestParam.value, paramData);
        }
        httpRequest(id);
      } catch (e) {
        console.log("修改参数路径错误", e);
      }
    });
}

/**
 * 处理参数合并
 * @param oldParam
 * @param newParam
 */
function handleParamMerge(isCover: boolean, oldParam: IRequestInfo[], newParam: IRequestInfo[]) {
  if (!isArray(oldParam)) return oldParam;
  const paramMerge = cloneDeep(oldParam);
  const paramCover = <IRequestInfo[]>[];
  newParam.forEach((param: IRequestInfo) => {
    const { key, type } = param;
    if (!key) return;
    if (!type || !attrTypesArr.includes(type)) {
      param.type = attrTypeEnum.DEFAULT;
    }
    paramCover.push(param);
    const index = paramMerge.findIndex((item) => item.key === param.key);
    if (index !== -1) return;
    paramMerge.push(param);
  });
  if (isCover) {
    return paramCover;
  } else {
    return paramMerge;
  }
}

/**
 * 开启/关闭轮询
 * @param data
 */
function switchPolling(param: any = {}) {
  const { id, polling, pollingInterval } = param;
  if (!id && !isBoolean(polling)) return;
  props.data.length &&
    props.data.map((item: IApiSource | IDatabase) => {
      if (item.sourceId === id) {
        item.polling.value = polling;
        isNumber(pollingInterval) && pollingInterval > 0 ? (item.pollingInterval.value = pollingInterval) : void 0;
        if (polling) {
          // 开启轮询，发起请求
          httpRequest(item.sourceId);
        } else {
          // 关闭轮询，清除轮询定时器
          clearTimeout(item.timer);
          item.timer = null;
        }
      }
    });
}

onMounted(() => {
  setTimeout(() => httpRequest(), 1000);
});
onBeforeUnmount(() => {
  // 卸载前清除轮询定时器
  props.data.forEach((item: IApiSource | IDatabase) => {
    clearTimeout(item.timer);
    item.timer = null;
  });
});

defineExpose({
  initiateRequest,
  updateRequestParams,
  switchPolling,
});
</script>
<style lang="scss" scoped></style>

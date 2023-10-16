<template>
  <a-drawer
    v-model:visible="drawerVisible"
    placement="right"
    :title="drawerTitle"
    :mask="false"
    :width="520"
    :z-index="1000"
  >
    <template #extra>
      <a-button :disabled="testDisabled" @click="requestTest" style="margin-right: 15px">测试</a-button>
      <a-button v-if="drawerType !== 'see'" type="primary" @click="handleDataInfo(drawerType)">
        {{ drawerType === "add" ? "创建" : "确定" }}
      </a-button>
    </template>
    <a-spin :spinning="loading">
      <div class="request-item" style="margin: 0">
        <div class="item-title">类型:</div>
        <div class="item-content">
          <a-input v-model:value="tempDataInfo.requestType" placeholder="请求类型" disabled />
        </div>
      </div>
      <div class="request-item">
        <div class="item-title">
          <span style="color: red">*</span>
          数据源ID:
        </div>
        <div class="item-content">
          <a-input v-model:value="tempDataInfo.sourceId" disabled placeholder="请输入数据源ID" />
        </div>
      </div>
      <div class="request-item">
        <div class="item-title">
          <span style="color: red">*</span>
          数据源名称:
        </div>
        <div class="item-content">
          <a-input
            v-model:value="tempDataInfo.title"
            :maxlength="30"
            showCount
            :disabled="drawerType === 'see'"
            placeholder="请输入数据源名称"
          />
        </div>
      </div>
      <div class="request-item">
        <div class="item-title">
          <span style="color: red">*</span>
          请求地址:
        </div>
        <div class="item-content">
          <a-input
            v-if="tempDataInfo.requestUrl.type === attrType.DEFAULT"
            v-model:value="tempDataInfo.requestUrl.value"
            :disabled="drawerType === 'see'"
            placeholder="请输入请求地址"
          />
          <a-input
            v-if="tempDataInfo.requestUrl.type === attrType.JS"
            v-model:value="tempDataInfo.requestUrl.value"
            :disabled="drawerType === 'see'"
            placeholder="请输入js表达式"
          >
            <template #prefix>
              <span style="color: #bfbfbf; user-select: none">{{ leftBrackets }}</span>
            </template>
            <template #suffix>
              <span style="color: #bfbfbf; user-select: none">{{ rightBrackets }}</span>
            </template>
          </a-input>
        </div>
        <!-- <div style="color: #C0C9D9; cursor: pointer; font-weight: 600; margin-left: 10px; user-select: none" @click="changeRequestUrl">{ / }</div> -->
      </div>
      <div v-if="tempDataInfo.requestType === 'fetch'" class="request-item" style="align-items: flex-start">
        <div class="item-title">请求参数:</div>
        <div class="item-content">
          <a-radio-group
            v-model:value="tempDataInfo.paramsType"
            name="radioGroups"
            :disabled="drawerType === 'see'"
            @change="paramsTypeChange"
          >
            <a-radio value="query">query</a-radio>
            <a-radio value="raw">raw</a-radio>
          </a-radio-group>
        </div>

        <!-- <div v-if="tempDataInfo.requestParam.type === attrType.JS || (tempDataInfo.requestParam.type === attrType.DEFAULT && tempDataInfo.requestParam.value.length === 0)" style="color: #C0C9D9; cursor: pointer; font-weight: 600; margin: 4px 0 0 10px; user-select: none" @click="changeRequestParam">{ / }</div> -->
      </div>
      <div class="request-item">
        <div class="item-title" style="margin-top: 4px"></div>
        <div class="item-content" v-if="tempDataInfo.paramsType === 'query'">
          <div
            v-if="tempDataInfo.requestParam.type === attrType.DEFAULT && isArray(tempDataInfo.requestParam.value)"
            v-for="(item, index) in tempDataInfo.requestParam.value"
            style="display: flex; align-items: center; margin-bottom: 10px"
          >
            <a-input
              v-model:value="item.key"
              :disabled="drawerType === 'see'"
              placeholder="key"
              style="width: 80px; min-width: 80px"
            />
            <div style="padding: 0 4px; color: #bfbfbf; font-size: 18px">:</div>
            <div style="flex: 1">
              <a-input
                v-if="item.type === attrType.DEFAULT || item.type === attrType.JSON"
                v-model:value="item.value"
                :disabled="drawerType === 'see'"
                placeholder="value"
                style="width: 100%"
              />
              <a-switch
                v-if="item.type === attrType.BOOLEAN"
                v-model:checked="item.value"
                :disabled="drawerType === 'see'"
              />
              <a-input
                v-if="item.type === attrType.JS"
                v-model:value="item.value"
                :disabled="drawerType === 'see'"
                placeholder="请输入js表达式"
                style="width: 100%"
              >
                <template #prefix>
                  <span style="color: #bfbfbf; user-select: none">{{ leftBrackets }}</span>
                </template>
                <template #suffix>
                  <span style="color: #bfbfbf; user-select: none">{{ rightBrackets }}</span>
                </template>
              </a-input>
            </div>
            <!-- <a-dropdown :trigger="['click']">
                    <template #overlay>
                      <a-menu @click="handleRequestParam($event,index)">
                        <a-menu-item key="default">字符串</a-menu-item>
                        <a-menu-item key="boolean">布尔</a-menu-item>
                        <a-menu-item key="js">表达式</a-menu-item>
                      </a-menu>
                    </template>
                    <a-button style="padding: 4px 6px; height: 20px; line-height: 0.5; margin-left: 6px">
                        <down-outlined />
                    </a-button>
                  </a-dropdown> -->
            <delete-outlined
              v-if="drawerType !== 'see'"
              :style="{ fontSize: '16px', color: '#8F9BB3', marginLeft: '8px' }"
              @click="deleteRequestParam(index)"
            />
          </div>
          <a-button
            v-if="tempDataInfo.requestParam.type === attrType.DEFAULT"
            :disabled="drawerType === 'see'"
            @click="addRequestParam"
          >
            <template #icon>
              <plus-outlined />
            </template>
            添加
          </a-button>
          <a-input
            v-if="tempDataInfo.requestParam.type === attrType.JS"
            v-model:value="tempDataInfo.requestParam.value"
            :disabled="drawerType === 'see'"
            placeholder="请输入js表达式"
          >
            <template #prefix>
              <span style="color: #bfbfbf; user-select: none">{{ leftBrackets }}</span>
            </template>
            <template #suffix>
              <span style="color: #bfbfbf; user-select: none">{{ rightBrackets }}</span>
            </template>
          </a-input>
        </div>
        <div class="item-content" v-else-if="tempDataInfo.paramsType === 'raw'" style="display: flex">
          <a-input v-model:value="tempDataInfo.paramsCode" placeholder="" />
          <a-tooltip>
            <template v-slot:title>编辑代码</template>
            <a-button type="link" class="setting-icon" @click="codeEditorClick('params', null)">
              <template #icon><code-outlined :style="{ color: '#1890FF' }" /></template>
            </a-button>
          </a-tooltip>
        </div>
      </div>
      <div class="request-item">
        <div class="item-title">
          <span style="color: red">*</span>
          请求方法:
        </div>
        <div class="item-content">
          <a-select
            v-if="tempDataInfo.requestMethod.type === attrType.DEFAULT"
            v-model:value="tempDataInfo.requestMethod.value"
            :disabled="tempDataInfo.requestType === 'jsonp' || drawerType === 'see'"
            style="width: 342px"
          >
            <a-select-option value="GET">GET</a-select-option>
            <a-select-option value="POST">POST</a-select-option>
            <a-select-option value="PUT">PUT</a-select-option>
            <a-select-option value="PATCH">PATCH</a-select-option>
            <a-select-option value="DELETE">DELETE</a-select-option>
          </a-select>
          <a-input
            v-if="tempDataInfo.requestMethod.type === attrType.JS"
            v-model:value="tempDataInfo.requestMethod.value"
            :disabled="tempDataInfo.requestType === 'jsonp' || drawerType === 'see'"
            placeholder="请输入js表达式"
            style="width: 342px"
          >
            <template #prefix>
              <span style="color: #bfbfbf; user-select: none">{{ leftBrackets }}</span>
            </template>
            <template #suffix>
              <span style="color: #bfbfbf; user-select: none">{{ rightBrackets }}</span>
            </template>
          </a-input>
        </div>
        <!-- <div style="color: #C0C9D9; cursor: pointer; font-weight: 600; margin-left: 10px; user-select: none" @click="changeRequestMethod">{ / }</div> -->
      </div>
      <div class="request-item">
        <div class="item-title">是否自动请求:</div>
        <div class="item-content">
          <a-switch
            v-if="tempDataInfo.autoRequest.type === attrType.DEFAULT"
            v-model:checked="tempDataInfo.autoRequest.value"
            :disabled="drawerType === 'see'"
          />
          <a-input
            v-if="tempDataInfo.autoRequest.type === attrType.JS"
            v-model:value="tempDataInfo.autoRequest.value"
            :disabled="drawerType === 'see'"
            placeholder="请输入js表达式"
          >
            <template #prefix>
              <span style="color: #bfbfbf; user-select: none">{{ leftBrackets }}</span>
            </template>
            <template #suffix>
              <span style="color: #bfbfbf; user-select: none">{{ rightBrackets }}</span>
            </template>
          </a-input>
        </div>
        <!-- <div style="color: #C0C9D9; cursor: pointer; font-weight: 600; margin-left: 10px; user-select: none" @click="changeAutoRequest">{ / }</div> -->
      </div>
      <div v-if="tempDataInfo.requestType === 'fetch'" class="request-item">
        <div class="item-title">是否支持跨域:</div>
        <div class="item-content">
          <a-switch
            v-if="tempDataInfo.crossDomain.type === attrType.DEFAULT"
            v-model:checked="tempDataInfo.crossDomain.value"
            :disabled="drawerType === 'see'"
          />
          <a-input
            v-if="tempDataInfo.crossDomain.type === attrType.JS"
            v-model:value="tempDataInfo.crossDomain.value"
            :disabled="drawerType === 'see'"
            placeholder="请输入js表达式"
          >
            <template #prefix>
              <span style="color: #bfbfbf; user-select: none">{{ leftBrackets }}</span>
            </template>
            <template #suffix>
              <span style="color: #bfbfbf; user-select: none">{{ rightBrackets }}</span>
            </template>
          </a-input>
        </div>
        <!-- <div style="color: #C0C9D9; cursor: pointer; font-weight: 600; margin-left: 10px; user-select: none" @click="changeCrossDomain">{ / }</div> -->
      </div>
      <div class="request-item" style="align-items: flex-start">
        <div class="item-title" style="margin-top: 4px">loading组件ID:</div>
        <div class="item-content">
          <div
            v-for="(loa, l) in tempDataInfo?.loading?.value"
            :key="l"
            style="display: flex; align-items: center; margin-bottom: 10px"
          >
            <a-input v-model:value="loa.key" :disabled="drawerType === 'see'" placeholder="key" style="flex: 1" />
            <delete-outlined
              v-if="drawerType !== 'see'"
              :style="{ fontSize: '16px', color: '#8F9BB3', marginLeft: '8px' }"
              @click="deleteLoading(l)"
            />
          </div>
          <a-button :disabled="drawerType === 'see'" @click="addLoading">
            <template #icon>
              <plus-outlined />
            </template>
            添加
          </a-button>
          <!-- <a-button style="margin-left: 5px" :disabled="drawerType === 'see'" @click="clearLoading">
              <template #icon>
                <delete-outlined />
              </template>
              清空
            </a-button> -->
        </div>
      </div>
      <div class="request-item">
        <div class="item-title">是否轮询:</div>
        <div class="item-content">
          <a-switch v-model:checked="tempDataInfo.polling.value" :disabled="drawerType === 'see'" />
        </div>
      </div>
      <div class="request-item">
        <div class="item-title">开启缓存:</div>
        <div class="item-content">
          <a-switch v-model:checked="tempDataInfo.hasCatch" :disabled="drawerType === 'see'" />
        </div>
      </div>
      <div class="request-item">
        <div class="item-title"></div>
        <div class="item-content">
          <a-button
            v-if="tempDataInfo.requestHeader.type === attrType.DEFAULT"
            :disabled="drawerType === 'see'"
            @click="clearCatch(tempDataInfo.sourceId)"
          >
            清除缓存
          </a-button>
        </div>
      </div>
      <div class="request-item">
        <div class="item-title">轮询间隔(毫秒):</div>
        <div class="item-content">
          <a-input-number
            v-model:value="tempDataInfo.pollingInterval.value"
            :disabled="drawerType === 'see'"
            :min="0"
            style="width: 342px"
          />
        </div>
      </div>
      <div class="request-item">
        <div class="item-title">超时时长(毫秒):</div>
        <div class="item-content">
          <a-input-number
            v-if="tempDataInfo.timeout.type === attrType.DEFAULT"
            v-model:value="tempDataInfo.timeout.value"
            :disabled="drawerType === 'see'"
            :min="5000"
            style="width: 342px"
          />
          <a-input
            v-if="tempDataInfo.timeout.type === attrType.JS"
            v-model:value="tempDataInfo.timeout.value"
            :disabled="drawerType === 'see'"
            placeholder="请输入js表达式"
          >
            <template #prefix>
              <span style="color: #bfbfbf; user-select: none">{{ leftBrackets }}</span>
            </template>
            <template #suffix>
              <span style="color: #bfbfbf; user-select: none">{{ rightBrackets }}</span>
            </template>
          </a-input>
        </div>
        <!-- <div style="color: #C0C9D9; cursor: pointer; font-weight: 600; margin-left: 10px" @click="changeOvertime">{ / }</div> -->
      </div>
      <div v-if="tempDataInfo.requestType === 'fetch'" class="request-item" style="align-items: flex-start">
        <div class="item-title" style="margin-top: 4px">请求头信息:</div>
        <div class="item-content">
          <div
            v-if="tempDataInfo.requestHeader.type === attrType.DEFAULT && isArray(tempDataInfo.requestHeader.value)"
            v-for="(item, index) in tempDataInfo.requestHeader.value"
            style="display: flex; align-items: center; margin-bottom: 10px"
          >
            <a-input
              v-model:value="item.key"
              :disabled="drawerType === 'see'"
              placeholder="key"
              style="width: 80px; min-width: 80px"
            />
            <div style="padding: 0 4px; color: #bfbfbf; font-size: 18px">:</div>
            <div style="flex: 1">
              <a-input
                v-if="item.type === attrType.DEFAULT"
                v-model:value="item.value"
                :disabled="drawerType === 'see'"
                placeholder="value"
                style="width: 100%"
              />
              <a-switch
                v-if="item.type === attrType.BOOLEAN"
                v-model:checked="item.value"
                :disabled="drawerType === 'see'"
              />
              <a-input
                v-if="item.type === attrType.JS"
                v-model:value="item.value"
                :disabled="drawerType === 'see'"
                placeholder="请输入js表达式"
                style="width: 100%"
              >
                <template #prefix>
                  <span style="color: #bfbfbf; user-select: none">{{ leftBrackets }}</span>
                </template>
                <template #suffix>
                  <span style="color: #bfbfbf; user-select: none">{{ rightBrackets }}</span>
                </template>
              </a-input>
            </div>
            <!-- <a-dropdown :trigger="['click']">
                    <template #overlay>
                        <a-menu @click="handleRequestHeader($event,index)">
                            <a-menu-item key="default">字符串</a-menu-item>
                            <a-menu-item key="boolean">布尔</a-menu-item>
                            <a-menu-item key="js">表达式</a-menu-item>
                        </a-menu>
                    </template>
                    <a-button style="padding: 4px 6px; height: 20px; line-height: 0.5; margin-left: 6px">
                        <down-outlined />
                    </a-button>
                  </a-dropdown> -->
            <delete-outlined
              v-if="drawerType !== 'see'"
              :style="{ fontSize: '16px', color: '#8F9BB3', marginLeft: '8px' }"
              @click="deleteRequestHeader(index)"
            />
          </div>
          <a-button
            v-if="tempDataInfo.requestHeader.type === attrType.DEFAULT"
            :disabled="drawerType === 'see'"
            @click="addRequestHeader"
          >
            <template #icon>
              <plus-outlined />
            </template>
            添加
          </a-button>
          <a-input
            v-if="tempDataInfo.requestHeader.type === attrType.JS"
            v-model:value="tempDataInfo.requestHeader.value"
            :disabled="drawerType === 'see'"
            placeholder="请输入js表达式"
          >
            <template #prefix>
              <span style="color: #bfbfbf; user-select: none">{{ leftBrackets }}</span>
            </template>
            <template #suffix>
              <span style="color: #bfbfbf; user-select: none">{{ rightBrackets }}</span>
            </template>
          </a-input>
        </div>
        <!-- <div v-if="tempDataInfo.requestHeader.type === attrType.JS || (tempDataInfo.requestHeader.type === attrType.DEFAULT && tempDataInfo.requestHeader.value.length === 0)" style="color: #C0C9D9; cursor: pointer; font-weight: 600; margin: 4px 0 0 10px; user-select: none" @click="changeRequestHeader">{ / }</div> -->
      </div>
      <div class="request-item">
        <div class="item-title">添加数据处理函数:</div>
        <div class="item-content">
          <a-dropdown :trigger="['click']" :disabled="drawerType === 'see'">
            <template #overlay>
              <a-menu @click="handleEvent">
                <a-menu-item v-for="item in tempEventList" :key="item.key">{{ item.title }}</a-menu-item>
              </a-menu>
            </template>
            <a-button>
              选择添加
              <down-outlined />
            </a-button>
          </a-dropdown>
          <div v-for="item in tempDataInfo.eventHandler" :key="item.key" style="margin-top: 6px">
            <div>{{ item.title }}</div>
            <div style="display: flex; align-items: center">
              <a-textarea v-model:value="item.value" :disabled="drawerType === 'see'" style="flex: 1; height: 150px" />
              <close-circle-outlined
                :style="{ fontSize: '16px', marginLeft: '10px', cursor: 'pointer' }"
                @click="deleteEvent(item.key)"
              />
              <a-tooltip>
                <template v-slot:title>编辑代码</template>
                <a-button type="link" class="setting-icon" @click="codeEditorClick('handle', item)">
                  <template #icon><code-outlined :style="{ color: '#1890FF' }" /></template>
                </a-button>
              </a-tooltip>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </a-drawer>
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
      :value="paramsCode"
      language="javascript"
      style="width: 100%; height: 600px; display: block"
    ></q-code-editor>
  </a-modal>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { cloneDeep, pullAllBy, isArray } from "lodash-es";
import { createHashId } from "../../../util/utils";
import { IApiSource } from "../../../types/runtime/IDataSource";
import { message } from "ant-design-vue";
import { logTestInfo } from "../utils/utils";

const props = defineProps<{
  root: any;
  data: IApiSource[];
  changeElementData: Function;
  fetchRequest: Function;
  jsonpRequest: Function;
  httpRequest: Function;
  onSearch: Function;
  initiateRequestsInAUnifiedManner: Function;
}>();

enum attrType {
  DEFAULT = "default",
  BOOLEAN = "boolean",
  JS = "js",
  JSON = "json",
}

const leftBrackets = "{{";
const rightBrackets = "}}";

const defaultInfo: IApiSource = {
  requestType: "fetch",
  sourceId: "",
  title: "",
  autoRequest: { value: false, type: attrType.DEFAULT },
  requestUrl: { value: "", type: attrType.DEFAULT },
  requestParam: { value: [], type: attrType.DEFAULT },
  requestMethod: { value: "GET", type: attrType.DEFAULT },
  crossDomain: { value: false, type: attrType.DEFAULT },
  polling: { value: false, type: attrType.DEFAULT },
  pollingInterval: { value: 5000, type: attrType.DEFAULT },
  timeout: { value: 5000, type: attrType.DEFAULT },
  requestHeader: { value: [], type: attrType.DEFAULT },
  eventHandler: [],
  timer: null,
  paramsType: "query",
  paramsCode: "",
  hasCatch: false,
  loading: { value: [{ key: "" }] },
};
const tempDataInfo = ref(cloneDeep(defaultInfo));

const codeModal = ref(false);
const codeEditor = ref(null);
const paramsCode = ref("");
const editorLanguage = ref("json");
const codeEditorType = ref("params");
const selectEvent = ref({});

// const instance = getCurrentInstance()

/**
 * 代码编辑器
 */
function codeChange() {
  const code = (codeEditor.value as any).getValue();
  paramsCode.value = code;
  switch (codeEditorType.value) {
    case "params": {
      tempDataInfo.value.paramsCode = code;
      break;
    }
    default: {
      (selectEvent.value as any).value = code;
      break;
    }
  }

  codeModal.value = false;
}

/**
 * 打开代码编辑器
 * @param type
 */
function codeEditorClick(type: string, event: any) {
  codeModal.value = true;
  codeEditorType.value = type;
  selectEvent.value = event;
  switch (type) {
    case "params": {
      editorLanguage.value = "json";
      paramsCode.value = tempDataInfo.value.paramsCode;
      break;
    }
    default: {
      editorLanguage.value = "javascript";
      paramsCode.value = event.value.toString();
      break;
    }
  }
}

/**
 * raw自动设置请求头
 */
const paramsTypeChange = (e: any) => {
  if (e.target.value === "raw") {
    tempDataInfo.value.requestHeader.value = [
      { key: "Content-Type", value: "application/json", type: attrType.DEFAULT },
    ];
  } else {
    tempDataInfo.value.requestHeader.value = [];
  }
};

/**
 * 清除缓存
 * @param req
 */
function clearCatch(id: string) {
  const temp = JSON.parse(sessionStorage[props.root.id] || "{}");
  if (temp[id]) {
    delete temp[id];
    sessionStorage[props.root.id] = JSON.stringify(temp);
  }
}

/**
 * 开启操作抽屉
 */
// const sourceStatus = ref("");
const drawerVisible = ref(false);
const drawerType = ref("");
const drawerTitle = ref("");
const handleSourceIndex = ref(0);
const openDrawer = (e: any, id: string) => {
  const type = e.key || e;
  handleSourceIndex.value = props.data.findIndex((item: IApiSource) => item.sourceId === id);
  switch (type) {
    case "fetch":
      tempDataInfo.value = cloneDeep(defaultInfo);
      tempDataInfo.value.sourceId = createHashId(8, "dataSource-");
      tempDataInfo.value.requestType = "fetch";
      drawerType.value = "add";
      drawerTitle.value = "创建数据源 " + tempDataInfo.value.requestType;
      drawerVisible.value = true;
      changeEventList();
      break;
    case "jsonp":
      tempDataInfo.value = cloneDeep(defaultInfo);
      tempDataInfo.value.sourceId = createHashId(8, "dataSource-");
      tempDataInfo.value.requestType = "jsonp";
      drawerType.value = "add";
      drawerTitle.value = "创建数据源 " + tempDataInfo.value.requestType;
      drawerVisible.value = true;
      changeEventList();
      break;
    case "see":
      tempDataInfo.value = cloneDeep(props.data[handleSourceIndex.value]);
      drawerType.value = "see";
      drawerTitle.value = "查看数据源";
      drawerVisible.value = true;
      changeEventList();
      break;
    case "edit":
      tempDataInfo.value = cloneDeep(props.data[handleSourceIndex.value]);
      drawerType.value = "edit";
      drawerTitle.value = "编辑数据源 " + tempDataInfo.value.requestType;
      drawerVisible.value = true;
      changeEventList();
      break;
    case "copy":
      tempDataInfo.value = cloneDeep(props.data[handleSourceIndex.value]);
      tempDataInfo.value.sourceId = createHashId(8, "dataSource-");
      drawerType.value = "copy";
      drawerTitle.value = "复制数据源";
      drawerVisible.value = true;
      changeEventList();
      break;
  }
};

/**
 * 变更自动请求
 */
// const changeAutoRequest = () => {
//   if (tempDataInfo.value.autoRequest.type === attrType.DEFAULT) {
//     tempDataInfo.value.autoRequest.type = attrType.JS;
//     tempDataInfo.value.autoRequest.value = String(tempDataInfo.value.autoRequest.value);
//   } else {
//     tempDataInfo.value.autoRequest.type = attrType.DEFAULT;
//     tempDataInfo.value.autoRequest.value = false;
//   }
// };

/**
 * 更改请求地址
 */
// const changeRequestUrl = () => {
//   tempDataInfo.value.requestUrl.type === attrType.DEFAULT
//     ? (tempDataInfo.value.requestUrl.type = attrType.JS)
//     : (tempDataInfo.value.requestUrl.type = attrType.DEFAULT);
// };

/**
 * 更改请求参数
 */
// const changeRequestParam = () => {
//   if (tempDataInfo.value.requestParam.type === attrType.DEFAULT) {
//     tempDataInfo.value.requestParam.type = attrType.JS;
//     tempDataInfo.value.requestParam.value = "";
//   } else {
//     tempDataInfo.value.requestParam.type = attrType.DEFAULT;
//     tempDataInfo.value.requestParam.value = <any>[];
//   }
// };

/**
 * 添加请求参数
 */
const addRequestParam = () => {
  if (!isArray(tempDataInfo.value.requestParam.value)) {
    tempDataInfo.value.requestParam.value = [];
  }
  tempDataInfo.value.requestParam.value.push({
    key: "",
    value: "",
    type: attrType.DEFAULT,
  });
};

/**
 * 处理请求参数
 * @param e
 * @param index
 */
// const handleRequestParam = (e: any, index: number) => {
//   if (!isArray(tempDataInfo.value.requestParam.value)) return;
//   tempDataInfo.value.requestParam.value[index].type = e.key;
//   switch (e.key) {
//     case "string":
//       tempDataInfo.value.requestParam.value[index].value = String(tempDataInfo.value.requestParam.value[index].value);
//       break;
//     case "boolean":
//       tempDataInfo.value.requestParam.value[index].value = false;
//       break;
//     case "js":
//       tempDataInfo.value.requestParam.value[index].value = String(tempDataInfo.value.requestParam.value[index].value);
//       break;
//   }
// };

/**
 * 删除请求参数
 * @param index
 */
const deleteRequestParam = (index: number) => {
  if (!isArray(tempDataInfo.value.requestParam.value)) return;
  tempDataInfo.value.requestParam.value.splice(index, 1);
};

/**
 * 变更请求方式数据格式
 */
// const changeRequestMethod = () => {
//   tempDataInfo.value.requestMethod.type === attrType.DEFAULT
//     ? (tempDataInfo.value.requestMethod.type = attrType.JS)
//     : (tempDataInfo.value.requestMethod.type = attrType.DEFAULT);
// };

/**
 * 变更跨域数据格式
 */
// const changeCrossDomain = () => {
//   if (tempDataInfo.value.crossDomain.type === attrType.DEFAULT) {
//     tempDataInfo.value.crossDomain.type = attrType.JS;
//     tempDataInfo.value.crossDomain.value = String(tempDataInfo.value.crossDomain.value);
//   } else {
//     tempDataInfo.value.crossDomain.type = attrType.DEFAULT;
//     tempDataInfo.value.crossDomain.value = false;
//   }
// };

/**
 * 变更超时数据格式
 */
// const changeOvertime = () => {
//   if (tempDataInfo.value.timeout.type === attrType.DEFAULT) {
//     tempDataInfo.value.timeout.type = attrType.JS;
//     tempDataInfo.value.timeout.value = String(tempDataInfo.value.timeout.value);
//   } else {
//     tempDataInfo.value.timeout.type = attrType.DEFAULT;
//     tempDataInfo.value.timeout.value = 5000;
//   }
// };

/**
 * 变更请求头数据格式
 */
// const changeRequestHeader = () => {
//   if (tempDataInfo.value.requestHeader.type === attrType.DEFAULT) {
//     tempDataInfo.value.requestHeader.type = attrType.JS;
//     tempDataInfo.value.requestHeader.value = "";
//   } else {
//     tempDataInfo.value.requestHeader.type = attrType.DEFAULT;
//     tempDataInfo.value.requestHeader.value = <any>[];
//   }
// };

/**
 * 添加请求头
 */
const addRequestHeader = () => {
  if (!isArray(tempDataInfo.value.requestHeader.value)) {
    tempDataInfo.value.requestHeader.value = [];
  }
  tempDataInfo.value.requestHeader.value.push({
    key: "",
    value: "",
    type: attrType.DEFAULT,
  });
};

/**
 * 处理请求头
 * @param e
 * @param index
 */
// const handleRequestHeader = (e: any, index: number) => {
//   if (!isArray(tempDataInfo.value.requestHeader.value)) return;
//   tempDataInfo.value.requestHeader.value[index].type = e.key;
//   switch (e.key) {
//     case "string":
//       tempDataInfo.value.requestHeader.value[index].value = String(tempDataInfo.value.requestHeader.value[index].value);
//       break;
//     case "boolean":
//       tempDataInfo.value.requestHeader.value[index].value = false;
//       break;
//     case "js":
//       tempDataInfo.value.requestHeader.value[index].value = String(tempDataInfo.value.requestHeader.value[index].value);
//       break;
//   }
// };

/**
 * 删除请求头
 * @param index
 */
const deleteRequestHeader = (index: number) => {
  if (!isArray(tempDataInfo.value.requestHeader.value)) return;
  tempDataInfo.value.requestHeader.value.splice(index, 1);
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
const eventList = [
  {
    key: eventType.IS_REQUEST,
    title: "是否发起请求的计算函数",
    value: "function(data) { return true; }",
  },
  {
    key: eventType.HANDLE_PARAM,
    title: "请求前对参数的处理函数",
    value: "function(data) { return data; }",
  },
  {
    key: eventType.HANDLE_SUCCESS,
    title: "请求成功对结果的处理函数",
    value: "function(res,data,axios,sendMsg) { console.log(res); }",
  },
  {
    key: eventType.HANDLE_ERROR,
    title: "请求失败对异常的处理函数",
    value: "function(error) { console.log(error); }",
  },
  {
    key: eventType.HANDLE_FLOW_API,
    title: "请求太白状态api处理函数",
    value:
      "function(res, sourceData) {\n" +
      "        return new Promise(resolve => {\n" +
      "          if(res?.data?.data?.status === 'SUCCESS'){\n" +
      "            const url = new URL(sourceData?.requestUrl?.value)\n" +
      "            const origin = url.origin\n" +
      "            const workflowId = res?.data?.data?.result?.workflowId\n" +
      "            const userName = JSON.parse(sourceData.paramsCode).userName\n" +
      "            if(workflowId){\n" +
      "              const myHeaders = new Headers();\n" +
      "              myHeaders.append('Content-Type', 'application/json');\n" +
      "              const raw = JSON.stringify({\n" +
      "                'focusList': [\n" +
      "                  userName,\n" +
      "                  workflowId\n" +
      "                ]\n" +
      "              });\n" +
      "              const requestOptions = {\n" +
      "                method: 'POST',\n" +
      "                headers: myHeaders,\n" +
      "                body: raw,\n" +
      "                redirect: 'follow'\n" +
      "              }\n" +
      "\n" +
      "              const sendReq = () => {\n" +
      "                fetch(`${origin}/rest/runner/waitRunState`,requestOptions)\n" +
      "                  .then(response => response.json())\n" +
      "                  .then((res) => {\n" +
      "                    let isStop = false\n" +
      "                    const result = res?.data?.result\n" +
      "                    if(res?.data?.status === 'SUCCESS'){\n" +
      "                      result.map((flowInfo) => {\n" +
      "                        if(flowInfo.content.status === 'running'){\n" +
      "                          const flowResult = flowInfo?.content?.result?.currentData?.result\n" +
      "                          if(flowResult && flowResult.length){\n" +
      "                            resolve({ sourceId: sourceData.sourceId, results: flowResult });\n" +
      "                          }\n" +
      "                        }\n" +
      "                      })\n" +
      "                      if(result.some((it) => it.content.status === 'finish')){\n" +
      "                        isStop = true\n" +
      "\n" +
      "                      }\n" +
      "                      if(result.some((it) => it.content.status === 'error')){\n" +
      "                        isStop = true\n" +
      "                        const error = result.find((it) => it.content.status === 'error')\n" +
      "                        if(error) throw new Error(error.content.message)\n" +
      "                      }\n" +
      "                      if(!result.length){\n" +
      "                        isStop = true\n" +
      "\n" +
      "                      }\n" +
      "                      if(!isStop){\n" +
      "                        sendReq()\n" +
      "                      }\n" +
      "                    }\n" +
      "                  })\n" +
      "                  .catch(error => console.log('error', error));\n" +
      "              }\n" +
      "              sendReq()\n" +
      "            }\n" +
      "          }\n" +
      "        })\n" +
      "      }",
  },
];

const tempEventList = ref(cloneDeep(eventList));
const changeEventList = () => {
  tempEventList.value = cloneDeep(eventList);
  pullAllBy(tempEventList.value, tempDataInfo.value.eventHandler, "key");
};
const handleEvent = (e: any) => {
  const eventIndex = tempEventList.value.findIndex((item) => item.key === e.key);
  if (eventIndex !== -1) {
    tempDataInfo.value.eventHandler.push(tempEventList.value[eventIndex]);
  }
  changeEventList();
};
const deleteEvent = (key: string) => {
  const eventIndex = tempDataInfo.value.eventHandler.findIndex((item: { key: string }) => item.key === key);
  if (eventIndex !== -1) {
    tempDataInfo.value.eventHandler.splice(eventIndex, 1);
    changeEventList();
  }
};

/**
 * 检查配置项重复title
 */
function checkRepeatTitle() {
  for (const source of props.data) {
    if (source.title === tempDataInfo.value.title && source.sourceId !== tempDataInfo.value.sourceId) return true;
  }
  return false;
}

/**
 * 处理请求源数据
 * @param type
 * @returns
 */
function handleDataInfo(type: string) {
  if (
    !tempDataInfo.value.title ||
    !tempDataInfo.value.sourceId ||
    !tempDataInfo.value.requestUrl.value ||
    !tempDataInfo.value.requestMethod.value
  ) {
    message.destroy();
    message.error("缺少必填参数!");
    return;
  }
  if (checkRepeatTitle()) {
    message.destroy();
    message.warning("已存在相同名称, 请重命名该配置项!");
    return;
  }
  let repeatId = false;
  switch (type) {
    case "add":
    case "copy":
      repeatId = false;
      props.data.forEach((item: IApiSource) => {
        if (item.sourceId === tempDataInfo.value.sourceId) repeatId = true;
      });
      if (repeatId) {
        message.error("数据源ID重复");
        return;
      }
      props.data.push(tempDataInfo.value);
      props.onSearch();
      break;
    case "edit":
      repeatId = false;
      const tempDataList = cloneDeep(props.data);
      tempDataList.splice(handleSourceIndex.value, 1);
      tempDataList.forEach((item: IApiSource) => {
        if (item.sourceId === tempDataInfo.value.sourceId) repeatId = true;
      });
      if (repeatId) {
        message.error("数据源ID重复");
        return;
      }
      props.data[handleSourceIndex.value] = tempDataInfo.value;
      props.onSearch();
      break;
  }
  drawerVisible.value = false;
  props.changeElementData();
  props.httpRequest(tempDataInfo.value.sourceId);
}

/**
 * 测试请求
 */
const testDisabled = ref(false);
const loading = ref(false);
async function requestTest() {
  if (tempDataInfo.value.requestUrl.value === "") {
    message.destroy();
    message.error("请输入请求地址!");
    return;
  }
  loading.value = true;
  testDisabled.value = true;
  if (tempDataInfo.value.requestType === "fetch") {
    const request = props.fetchRequest(tempDataInfo.value, true);
    props.initiateRequestsInAUnifiedManner([request]);
    const results = await request;
    loading.value = false;
    testDisabled.value = false;
    logTestInfo(results);
  } else if (tempDataInfo.value.requestType === "jsonp") {
    const request = props.jsonpRequest(tempDataInfo.value, true);
    props.initiateRequestsInAUnifiedManner([request]);
    const results = await request;
    loading.value = false;
    testDisabled.value = false;
    logTestInfo(results);
  }
}

// 添加loading
function addLoading() {
  if (!tempDataInfo.value.loading) tempDataInfo.value.loading = { value: [] };
  tempDataInfo.value.loading.value.push({ key: "" });
}

// function clearLoading() {
//   tempDataInfo.value.loading = { value: [{ key: "" }] };
// }

const deleteLoading = (index: number) => {
  tempDataInfo.value.loading.value.splice(index, 1);
};

defineExpose({
  drawerVisible,
  tempDataInfo,
  openDrawer,
});
</script>
<style lang="scss" scoped></style>

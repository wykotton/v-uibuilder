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
          数据库类型:
        </div>
        <div class="item-content">
          <a-select
            v-model:value="tempDataInfo.databaseType"
            :options="databaseOptions"
            :disabled="drawerType === 'see'"
            style="width: 100%"
          ></a-select>
        </div>
      </div>
      <div class="request-item">
        <div class="item-title">
          <span style="color: red">*</span>
          数据库地址:
        </div>
        <div class="item-content">
          <a-input v-model:value="tempDataInfo.host" :disabled="drawerType === 'see'" placeholder="请输入数据库地址" />
        </div>
      </div>
      <div class="request-item">
        <div class="item-title">
          <span style="color: red">*</span>
          数据库端口号:
        </div>
        <div class="item-content">
          <a-input-number
            v-model:value="tempDataInfo.port"
            :disabled="drawerType === 'see'"
            placeholder="请输入数据库端口号"
            style="width: 100%"
          />
        </div>
      </div>
      <div class="request-item">
        <div class="item-title">
          <span style="color: red">*</span>
          数据库用户名:
        </div>
        <div class="item-content">
          <a-input
            v-model:value="tempDataInfo.username"
            :disabled="drawerType === 'see'"
            placeholder="请输入数据库用户名"
          />
        </div>
      </div>
      <div class="request-item">
        <div class="item-title">
          <span style="color: red">*</span>
          数据库密码:
        </div>
        <div class="item-content">
          <a-input-password
            v-model:value="tempDataInfo.password"
            :disabled="drawerType === 'see'"
            placeholder="请输入数据库密码"
          />
        </div>
      </div>
      <div class="request-item">
        <div class="item-title">
          <span style="color: red">*</span>
          数据库名称:
        </div>
        <div class="item-content">
          <a-input
            v-model:value="tempDataInfo.database"
            :disabled="drawerType === 'see'"
            placeholder="请输入数据库名称"
          />
        </div>
      </div>
      <div class="request-item">
        <div class="item-title">
          <span style="color: red">*</span>
          数据库表名:
        </div>
        <div class="item-content">
          <a-input
            v-model:value="tempDataInfo.tableName"
            :disabled="drawerType === 'see'"
            placeholder="请输入数据库表名"
          />
        </div>
      </div>
      <div class="request-item">
        <div class="item-title">是否开启分页:</div>
        <div class="item-content">
          <a-switch v-model:checked="tempDataInfo.pagination" :disabled="drawerType === 'see'" />
        </div>
      </div>
      <div v-show="tempDataInfo.pagination" class="request-item">
        <div class="item-title">
          <span style="color: red">*</span>
          第几页:
        </div>
        <div class="item-content">
          <a-input-number
            v-model:value="tempDataInfo.page"
            :min="1"
            :disabled="drawerType === 'see'"
            placeholder="请输入需要查询第几页"
          />
        </div>
      </div>
      <div v-show="tempDataInfo.pagination" class="request-item">
        <div class="item-title">
          <span style="color: red">*</span>
          每页数量:
        </div>
        <div class="item-content">
          <a-input-number
            v-model:value="tempDataInfo.limit"
            :min="1"
            :disabled="drawerType === 'see'"
            placeholder="请输入每页查询数量"
          />
        </div>
      </div>
      <div class="request-item">
        <div class="item-title">是否自动请求:</div>
        <div class="item-content">
          <a-switch
            v-if="tempDataInfo.autoRequest.type === attrType.DEFAULT"
            v-model:checked="tempDataInfo.autoRequest.value"
            :disabled="drawerType === 'see'"
          />
        </div>
        <!-- <div style="color: #C0C9D9; cursor: pointer; font-weight: 600; margin-left: 10px; user-select: none" @click="changeAutoRequest">{ / }</div> -->
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
        </div>
        <!-- <div style="color: #C0C9D9; cursor: pointer; font-weight: 600; margin-left: 10px" @click="changeOvertime">{ / }</div> -->
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
                <a-button type="link" class="setting-icon" @click="codeEditorClick(item)">
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
import { cloneDeep, pullAllBy } from "lodash-es";
import { createHashId } from "../../../util/utils";
import { IDatabase } from "../../../types/runtime/IDataSource";
import { message } from "ant-design-vue";
import { logTestInfo } from "../utils/utils";

const props = defineProps<{
  root: any;
  data: IDatabase[];
  changeElementData: Function;
  fetchRequest: Function;
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

const defaultInfo: IDatabase = {
  requestType: "database",
  sourceId: "",
  title: "",
  databaseType: "mysql",
  host: "",
  port: 3306,
  username: "",
  password: "",
  database: "",
  tableName: "",
  pagination: false,
  page: 1,
  limit: 10,
  autoRequest: { value: false, type: attrType.DEFAULT },
  polling: { value: false, type: attrType.DEFAULT },
  pollingInterval: { value: 5000, type: attrType.DEFAULT },
  timeout: { value: 5000, type: attrType.DEFAULT },
  eventHandler: [],
  timer: null,
  hasCatch: false,
  loading: { value: [{ key: "" }] },
};
const tempDataInfo = ref(cloneDeep(defaultInfo));

const codeModal = ref(false);
const codeEditor = ref(null);
const paramsCode = ref("");
const editorLanguage = ref("json");
const selectEvent = ref({});

// const instance = getCurrentInstance()
const databaseOptions = [
  { label: "MySQL", value: "mysql" },
  // { label: "PostgreSQL", value: "postgres" },
  // { label: "MSSQL", value: "mssql" },
  // { label: "SQLite3", value: "sqlite" },
  // { label: "Oracle", value: "oracle" },
];

/**
 * 代码编辑器
 */
function codeChange() {
  const code = (codeEditor.value as any).getValue();
  paramsCode.value = code;
  (selectEvent.value as any).value = code;
  codeModal.value = false;
}

/**
 * 打开代码编辑器
 * @param type
 */
function codeEditorClick(event: any) {
  codeModal.value = true;
  selectEvent.value = event;
  editorLanguage.value = "javascript";
  paramsCode.value = event.value.toString();
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
  handleSourceIndex.value = props.data.findIndex((item: IDatabase) => item.sourceId === id);
  switch (type) {
    case "database":
      tempDataInfo.value = cloneDeep(defaultInfo);
      tempDataInfo.value.sourceId = createHashId(8, "dataSource-");
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
 * 检查配置项信息
 */
function checkDataInfo() {
  let error = false;
  const checkKeys = ["title", "databaseType", "host", "port", "username", "password", "database", "tableName"];
  checkKeys.forEach((key: string) => {
    !tempDataInfo.value[key] ? (error = true) : void 0;
  });
  if (error) {
    message.destroy();
    message.warning("缺少必填参数!");
    return false;
  }
  if (tempDataInfo.value.pagination && (!tempDataInfo.value.page || !tempDataInfo.value.limit)) {
    message.destroy();
    message.warning("缺少分页参数!");
    return false;
  }
  return true;
}

/**
 * 处理请求源数据
 * @param type
 * @returns
 */
function handleDataInfo(type: string) {
  if (!checkDataInfo()) {
    message.destroy();
    message.error("缺少必填参数");
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
      props.data.forEach((item: IDatabase) => {
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
      tempDataList.forEach((item: IDatabase) => {
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
 * 导入导出
 */
// const schemaType = ref("");
// const schemaVisible = ref(false);
// const schemaTitle = ref("");
// const dataSchema = ref("");

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

// function importData() {
//   try {
//     const tempData = JSON.parse(dataSchema.value);
//     if (Array.isArray(tempData)) {
//       props.data.push.apply(props.data, tempData);
//       onSearch(searchText.value);
//       schemaVisible.value = false;
//     } else {
//       message.error("schema信息有误");
//     }
//   } catch (error) {
//     message.error("schema信息有误");
//   }
// }

/**
 * 测试请求
 */
const testDisabled = ref(false);
const loading = ref(false);
async function requestTest() {
  if (!checkDataInfo()) {
    message.destroy();
    message.error("缺少必填参数");
    return;
  }
  loading.value = true;
  testDisabled.value = true;
  const request = props.fetchRequest(tempDataInfo.value, true);
  props.initiateRequestsInAUnifiedManner([request]);
  const results = await request;
  loading.value = false;
  testDisabled.value = false;
  logTestInfo(results);
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

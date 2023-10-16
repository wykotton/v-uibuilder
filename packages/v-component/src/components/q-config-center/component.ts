import { cloneDeep } from "lodash-es";
import { createApp, defineComponent, onMounted, reactive, ref } from "vue";
import { Button, ConfigProvider, Form, message, Modal, Select, Spin, Tabs, Textarea, Tooltip } from "ant-design-vue";
import Input from "ant-design-vue/lib/input";
import InputNumber from "ant-design-vue/lib/input-number";
import { EyeOutlined, CopyOutlined, FormOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { getPageInfo, getProjectInfo, getRouteVariable, getUserToken } from "../../util/utils";
import zhCN from "ant-design-vue/lib/locale/zh_CN";
import axios from "axios";

export const createVueComponent = (root: any) => {
  const component = defineComponent({
    template: `
        <a-config-provider :locale="zhCN">
          <div class="attribute-container">
            <a-spin :spinning="loading">
              <a-input-search
                v-model:value="searchText"
                @search="onSearch"
                placeholder="输入属性名称或属性名查询"
              ></a-input-search>
              <div>
                <a-tabs v-model:activeKey="tabsActiveKey">
                  <a-tab-pane v-for="item in tabs" :key="item.key" :tab="item.title">
                    <a-button type="primary" @click="openModal('add', '')">新增属性</a-button>
                    <div v-for="config in tempConfig[item.key]" :key="config.key" class="attribute-card">
                      <div>
                        <div v-html="config.title" class="attribute-title"></div>
                        <div v-html="config.key" class="attribute-key"></div>
                      </div>
                      <a-tooltip placement="bottom">
                        <template #title>
                          <span>查看</span>
                        </template>
                        <EyeOutlined
                          :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: 'auto' }"
                          @click="openModal('see', config.key)"
                        ></EyeOutlined>
                      </a-tooltip>
                      <a-tooltip placement="bottom">
                        <template #title>
                          <span>编辑</span>
                        </template>
                        <FormOutlined
                          :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }"
                          @click="openModal('edit', config.key)"
                        ></FormOutlined>
                      </a-tooltip>
                      <a-tooltip placement="bottom">
                        <template #title>
                          <span>删除</span>
                        </template>
                        <DeleteOutlined
                          :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }"
                          @click="openModal('delete', config.key)"
                        ></DeleteOutlined>
                      </a-tooltip>
                      <a-tooltip placement="bottom">
                        <template #title>
                          <span>复制</span>
                        </template>
                        <CopyOutlined
                          :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }"
                          @click="openModal('copy', config.key)"
                        ></CopyOutlined>
                      </a-tooltip>
                    </div>
                  </a-tab-pane>
                </a-tabs>
              </div>
            </a-spin>
            <a-modal
              v-model:visible="configVisible"
              v-if="configVisible"
              :title="modalTitle"
              :confirmLoading="confirmLoading"
              :maskClosable="false"
              :closable="false"
              @ok="handleStaticConfig"
              @cancel="closeConfigModel"
            >
              <a-form v-if="tabsActiveKey === 'staticConfig'" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
                <a-form-item
                  label="属性名称"
                  :required="true"
                  :validate-status="rules.title.validateStatus"
                  :help="rules.title.errorMsg"
                >
                  <a-input
                    v-model:value="tempConfigInfo.title"
                    :maxLength="15"
                    placeholder="请输入属性名称"
                    @change="configInfoChange('title')"
                  />
                </a-form-item>
                <a-form-item
                  label="属性名"
                  :required="true"
                  :validate-status="rules.key.validateStatus"
                  :help="rules.key.errorMsg"
                >
                  <a-input
                    v-model:value="tempConfigInfo.key"
                    :maxLength="15"
                    placeholder="请输入属性名"
                    @change="configInfoChange('key')"
                  />
                </a-form-item>
                <a-form-item label="属性值">
                  <a-textarea v-model:value="tempConfigInfo.value" :rows="2" placeholder="请输入属性值" />
                </a-form-item>
              </a-form>
              <a-form v-else :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
                <a-form-item
                  label="属性名称"
                  :required="true"
                  :validate-status="rules.title.validateStatus"
                  :help="rules.title.errorMsg"
                >
                  <a-input
                    v-model:value="tempConfigInfo.title"
                    :maxLength="15"
                    placeholder="请输入属性名称"
                    @change="configInfoChange('title')"
                  />
                </a-form-item>
                <a-form-item
                  label="属性名"
                  :required="true"
                  :validate-status="rules.key.validateStatus"
                  :help="rules.key.errorMsg"
                >
                  <a-input
                    v-model:value="tempConfigInfo.key"
                    :maxLength="15"
                    placeholder="请输入属性名"
                    @change="configInfoChange('key')"
                  />
                </a-form-item>
                <a-form-item
                  label="请求地址"
                  :required="true"
                  :validate-status="rules.requestUrl.validateStatus"
                  :help="rules.requestUrl.errorMsg"
                >
                  <a-input
                    v-model:value="tempConfigInfo.requestUrl"
                    placeholder="请输入请求地址"
                    @change="configInfoChange('requestUrl')"
                  />
                </a-form-item>
                <a-form-item label="请求参数">
                  <div
                    v-for="(item, index) in tempConfigInfo.requestParam"
                    style="display: flex; align-items: center; margin-bottom: 10px"
                  >
                    <a-input v-model:value="item.key" placeholder="参数key" style="min-width: 100px" />
                    <div style="padding: 0 10px; color: #bfbfbf; font-size: 18px">:</div>
                    <a-input v-model:value="item.value" placeholder="参数值" style="min-width: 230px" />
                    <DeleteOutlined
                      :style="{ fontSize: '16px', color: '#8F9BB3', marginLeft: '8px' }"
                      @click="deleteRequestParam(index)"
                    ></DeleteOutlined>
                  </div>
                  <a-button @click="addRequestParam">
                    <template #icon><PlusOutlined></PlusOutlined></template>
                    添加
                  </a-button>
                </a-form-item>
                <a-form-item label="请求方式" :required="true">
                  <a-select v-model:value="tempConfigInfo.requestMethod">
                    <a-select-option value="GET">GET</a-select-option>
                    <a-select-option value="POST">POST</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="超时时长(毫秒)">
                  <a-input-number v-model:value="tempConfigInfo.timeout" :min="0" :max="30000" />
                </a-form-item>
                <a-form-item label="数据处理函数">
                  <a-textarea v-model:value="tempConfigInfo.eventHandler" :rows="4" placeholder="请输入数据处理函数" />
                </a-form-item>
              </a-form>
            </a-modal>
          </div>
        </a-config-provider>
        `,
    setup() {
      const pageId = ref<any>(null);
      const projectId = ref<any>(null);
      const loading = ref(false);
      const tabsActiveKey = ref("staticConfig");
      const tabs = reactive([
        { key: "staticConfig", title: "静态属性" },
        { key: "dynamicConfig", title: "动态属性" },
      ]);

      interface staticConfigOptions {
        title: string;
        key: string;
        value: string;
      }
      interface dynamicConfigOptions {
        title: string;
        key: string;
        requestUrl: string;
        requestParam: any[];
        requestMethod: string;
        timeout: number;
        eventHandler: string;
      }
      interface projectConfigOptions {
        staticConfig: staticConfigOptions[];
        dynamicConfig: dynamicConfigOptions[];
      }

      /**
       * 项目数据
       */
      const projectConfig = ref<projectConfigOptions>({
        staticConfig: [],
        dynamicConfig: [],
      });
      const tempConfig = reactive<any>({
        staticConfig: [],
        dynamicConfig: [],
      });

      /**
       * 获取项目id
       */
      async function getProjectId() {
        if (!pageId.value) return;
        // const token = getUserToken();
        // if (!token) {
        //   message.destroy();
        //   message.error("属性配置元件: 未找到用户信息, 无法获取项目数据!");
        //   return;
        // }
        const request = await getPageInfo(Number(pageId.value), root.domain);
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
       * 获取动态属性
       */
      function getDynamicConfig() {
        projectConfig.value.dynamicConfig.forEach((item) => {
          const body = {
            url: item.requestUrl,
            method: item.requestMethod,
            timeout: item.timeout,
          };
          const requestParam = {};
          item.requestParam.forEach((param) => {
            requestParam[param.key] = param.value;
          });
          if (body.method === "GET") {
            body["params"] = requestParam;
          } else {
            body["data"] = requestParam;
          }
          try {
            // 使用designer的代理，请求UIB-server的代理接口
            const request = axios({
              url: root.domain + "/ui-builder/http-proxy",
              method: "POST",
              data: {
                config: body,
              },
            });
            request?.then((res) => {
              const data = res.data.data;
              try {
                const handle = (data: any) => {
                  return data;
                };
                eval(`handle=${item.eventHandler}`);
                if (!handle) return;
                const handleData = handle(data);
                if (Array.isArray(handleData) && handleData.length) {
                  root.attribute = root.attribute.concat(handleData);
                }
              } catch (error) {}
            });
          } catch (error) {}
        });
      }

      /**
       * 获取项目数据
       * @returns
       */
      async function getProjectData() {
        if (!projectId.value) return;
        // const token = getUserToken();
        // if (!token) {
        //   message.destroy();
        //   message.error("属性配置元件: 未找到用户信息, 无法获取项目数据!");
        //   return;
        // }
        const request = await getProjectInfo(Number(projectId.value), root.domain);
        if (request?.data?.data) {
          const {
            results,
            info: { msg = "" },
          } = request.data.data;
          if (msg !== "success") return;
          if (results[0]) {
            try {
              const data = JSON.parse(results[0].data);
              data?.staticConfig
                ? (projectConfig.value.staticConfig = data.staticConfig)
                : (projectConfig.value.staticConfig = []);
              data?.dynamicConfig
                ? (projectConfig.value.dynamicConfig = data.dynamicConfig)
                : (projectConfig.value.dynamicConfig = []);
            } catch (error) {
              projectConfig.value = {
                staticConfig: [],
                dynamicConfig: [],
              };
            }
            root.attribute = cloneDeep(projectConfig.value.staticConfig);
            getDynamicConfig();
            onSearch();
          }
        }
      }
      onMounted(async () => {
        pageId.value = getRouteVariable("id");
        await getProjectId();
        await getProjectData();
      });

      /**
       * 更新project数据
       */
      async function updateProjectInfo(data: projectConfigOptions) {
        if (!projectId.value) {
          message.destroy();
          message.error("项目id不存在, 无法进行操作!");
          return;
        }
        const token = getUserToken();
        if (!token) {
          message.destroy();
          message.error("属性配置元件: 未找到用户信息, 无法进行更新操作!");
          return;
        }
        confirmLoading.value = true;
        const config = {
          url: root.domain + "/ui-builder/update-project",
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
          },
          data: {
            id: projectId.value,
            data,
          },
          timeout: 5000,
        };
        await axios(config)
          .then((res: any) => {
            const {
              info: { msg = "" },
            } = res.data.data;
            if (msg !== "success") {
              message.destroy();
              message.error("属性更新失败!");
              return;
            }
            getProjectData();
          })
          .finally(() => {
            confirmLoading.value = false;
          });
      }

      /**
       * 表单数据校验
       */
      const rules: { [key: string]: any } = reactive({
        title: { validateStatus: "", errorMsg: "" },
        key: { validateStatus: "", errorMsg: "" },
        requestUrl: { validateStatus: "", errorMsg: "" },
      });
      const checkFun = (data: string, { msg1, msg2 }: { [key: string]: string }, rulesKey: string) => {
        const reg = new RegExp("[`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？\\s]");
        if (!data || data === "" || reg.test(data)) {
          rules[rulesKey].validateStatus = "error";
          rules[rulesKey].errorMsg = reg.test(data) ? msg1 : msg2;
          return false;
        }
        return true;
      };
      const checkConfig = (type: string) => {
        switch (type) {
          case "title":
            return checkFun(
              tempConfigInfo.value.title,
              {
                msg1: "不允许包含特殊字符",
                msg2: "请输入属性名称",
              },
              "title"
            );
          case "key":
            return checkFun(tempConfigInfo.value.key, { msg1: "不允许包含特殊字符", msg2: "请输入属性名" }, "key");
          case "requestUrl":
            if (!tempConfigInfo.value.requestUrl) {
              rules.requestUrl.validateStatus = "error";
              rules.requestUrl.errorMsg = "请输入请求地址";
            }
            return tempConfigInfo.value.requestUrl !== "";
        }
        return false;
      };
      const configInfoChange = (type: string) => {
        switch (type) {
          case "title":
            if (checkConfig("title")) {
              rules.title = { validateStatus: "", errorMsg: "" };
            }
            break;
          case "key":
            if (checkConfig("key")) {
              rules.key = { validateStatus: "", errorMsg: "" };
            }
            break;
          case "requestUrl":
            if (checkConfig("requestUrl")) {
              rules.requestUrl = { validateStatus: "", errorMsg: "" };
            }
            break;
        }
      };
      const resetForm = () => {
        rules.title = { validateStatus: "", errorMsg: "" };
        rules.key = { validateStatus: "", errorMsg: "" };
        rules.requestUrl = { validateStatus: "", errorMsg: "" };
        tempConfigInfo.value = {};
      };

      /**
       * 弹窗操作数据
       */
      const modalType = ref("");
      const modalTitle = ref("");
      const handleDataIndex = ref(-1);
      const configVisible = ref(false);
      const confirmLoading = ref(false);
      const defaultStatic: staticConfigOptions = {
        title: "",
        key: "",
        value: "",
      };
      const defaultDynamic: dynamicConfigOptions = {
        title: "",
        key: "",
        requestUrl: "",
        requestParam: [],
        requestMethod: "GET",
        timeout: 5000,
        eventHandler: "function(data){ return data }",
      };
      const tempConfigInfo = ref();

      /**
       * 打开modal
       * @param type
       * @param id
       */
      function openModal(type: string, key: string) {
        if (tabsActiveKey.value === "staticConfig") {
          handleDataIndex.value = projectConfig.value.staticConfig.findIndex((item: any) => item.key === key);
        } else {
          handleDataIndex.value = projectConfig.value.dynamicConfig.findIndex((item: any) => item.key === key);
        }
        switch (type) {
          case "add":
            setModalInfo("add", "创建属性");
            break;
          case "see":
            if (handleDataIndex.value === -1) return;
            setModalInfo("see", "查看属性");
            break;
          case "edit":
            if (handleDataIndex.value === -1) return;
            setModalInfo("edit", "编辑属性");
            break;
          case "delete":
            if (handleDataIndex.value === -1) return;
            Modal.confirm({
              title: "确定要删除吗?",
              okText: "确定",
              cancelText: "取消",
              onOk() {
                const data = cloneDeep(projectConfig.value);
                if (tabsActiveKey.value === "staticConfig") {
                  data.staticConfig.splice(handleDataIndex.value, 1);
                } else {
                  data.dynamicConfig.splice(handleDataIndex.value, 1);
                }
                updateProjectInfo(data);
              },
            });
            break;
          case "copy":
            if (handleDataIndex.value === -1) return;
            setModalInfo("copy", "复制属性");
            break;
        }
      }

      /**
       * 设置弹窗modal的数据
       * @param type
       * @param title
       */
      function setModalInfo(type: string, title: string) {
        if (tabsActiveKey.value === "staticConfig") {
          type === "add"
            ? (tempConfigInfo.value = cloneDeep(defaultStatic))
            : (tempConfigInfo.value = cloneDeep(projectConfig.value.staticConfig[handleDataIndex.value]));
        } else {
          type === "add"
            ? (tempConfigInfo.value = cloneDeep(defaultDynamic))
            : (tempConfigInfo.value = cloneDeep(projectConfig.value.dynamicConfig[handleDataIndex.value]));
        }
        modalType.value = type;
        modalTitle.value = title;
        configVisible.value = true;
      }

      /**
       * modal确认操作
       */
      async function handleStaticConfig() {
        if (!checkConfig("title") || !checkConfig("key") || !checkConfig("requestUrl")) return;
        let repeatId = false;
        const tempList =
          tabsActiveKey.value === "staticConfig"
            ? cloneDeep(projectConfig.value.staticConfig)
            : cloneDeep(projectConfig.value.dynamicConfig);
        const data = cloneDeep(projectConfig.value);
        switch (modalType.value) {
          case "add":
          case "copy":
            repeatId = false;
            tempList.forEach((item) => {
              if (item.key === tempConfigInfo.value.key) repeatId = true;
            });
            if (repeatId) {
              rules.key.validateStatus = "error";
              rules.key.errorMsg = "属性名重复";
              return;
            }
            tabsActiveKey.value === "staticConfig"
              ? data.staticConfig.push(tempConfigInfo.value)
              : data.dynamicConfig.push(tempConfigInfo.value);
            await updateProjectInfo(data);
            configVisible.value = false;
            break;
          case "edit":
            repeatId = false;
            tempList.splice(handleDataIndex.value, 1);
            tempList.forEach((item) => {
              if (item.key === tempConfigInfo.value.key) repeatId = true;
            });
            if (repeatId) {
              rules.key.validateStatus = "error";
              rules.key.errorMsg = "属性名重复";
              return;
            }
            tabsActiveKey.value === "staticConfig"
              ? (data.staticConfig[handleDataIndex.value] = tempConfigInfo.value)
              : (data.dynamicConfig[handleDataIndex.value] = tempConfigInfo.value);
            await updateProjectInfo(data);
            configVisible.value = false;
            break;
          default:
            configVisible.value = false;
        }
      }

      /**
       * 关闭操作弹窗
       */
      function closeConfigModel() {
        if (confirmLoading.value) {
          configVisible.value = true;
          message.destroy();
          message.warning("正在保存中, 请稍后再试!");
          return;
        }
        resetForm();
      }

      /**
       * 添加请求参数
       */
      function addRequestParam() {
        tempConfigInfo.value.requestParam.push({
          key: "",
          value: "",
        });
      }
      /**
       * 删除请求参数
       */
      function deleteRequestParam(index: number) {
        tempConfigInfo.value.requestParam.splice(index, 1);
      }

      /**
       * 搜索数据
       */
      const searchText = ref("");
      function onSearch() {
        tempConfig.staticConfig = [];
        tempConfig.dynamicConfig = [];
        const search = (data: any[], text: string) => {
          const results: any = [];
          data.forEach((item) => {
            const temp = { ...item };
            if (temp.title.indexOf(text) > -1 || temp.key.indexOf(text) > -1) {
              const replaceReg = new RegExp(text, "g"); // 匹配关键字正则
              const replaceString = '<span style="color: red">' + text + "</span>"; // 高亮替换v-html值
              if (text && temp.title.indexOf(text) > -1) {
                temp.title = temp.title.replace(replaceReg, replaceString);
              }
              if (text && temp.key.indexOf(text) > -1) {
                temp.key = temp.key.replace(replaceReg, replaceString);
              }
              results.push(temp);
            }
          });
          return results;
        };
        tempConfig.staticConfig = search(cloneDeep(projectConfig.value.staticConfig), searchText.value);
        tempConfig.dynamicConfig = search(cloneDeep(projectConfig.value.dynamicConfig), searchText.value);
      }

      return {
        zhCN,
        loading,
        searchText,
        tabsActiveKey,
        tabs,
        tempConfig,
        configVisible,
        modalTitle,
        confirmLoading,
        rules,
        tempConfigInfo,
        onSearch,
        openModal,
        handleStaticConfig,
        closeConfigModel,
        configInfoChange,
        addRequestParam,
        deleteRequestParam,
      };
    },
  });

  root.componentInstance = createApp(component);
  root.componentInstance.use(ConfigProvider);
  root.componentInstance.use(Tabs);
  root.componentInstance.use(Form);
  root.componentInstance.use(Select);
  root.componentInstance.use(Input);
  root.componentInstance.use(Button);
  root.componentInstance.use(InputNumber);
  root.componentInstance.use(Textarea);
  root.componentInstance.use(Modal);
  root.componentInstance.use(Tooltip);
  root.componentInstance.use(Spin);
  root.componentInstance.use(message);
  root.componentInstance.use("axios", axios);
  root.componentInstance.component("EyeOutlined", EyeOutlined);
  root.componentInstance.component("FormOutlined", FormOutlined);
  root.componentInstance.component("DeleteOutlined", DeleteOutlined);
  root.componentInstance.component("CopyOutlined", CopyOutlined);
  root.componentInstance.component("PlusOutlined", PlusOutlined);
  root.componentInstance.mount(root.container);
};

import { css, html, unsafeCSS } from "lit";
import { customElement, query } from "lit/decorators.js";
import { Component } from "../../types/runtime/Component";
import { isArray } from "lodash-es";
import { getUserToken, getUserId, unmountInstance } from "../../util/utils";
import { createApp, defineComponent, ref, onMounted, createVNode, onUnmounted } from "vue";
import { Modal, message, Radio, ConfigProvider, Upload, Spin, Checkbox, Row, Col, Empty, Button } from "ant-design-vue";
import { CloudUploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { DOMEmit } from "../../util/reactivity/Emit";
import { getFormatTime } from "./utils";
import type { UploadChangeParam } from "ant-design-vue";
import axios from "axios";
import antdCss from "ant-design-vue/dist/antd.css?inline";
import zhCN from "ant-design-vue/lib/locale/zh_CN";
import "../q-code-editor/q-code-editor";

@customElement("q-custom-warehouse")
export class QCustomWarehouse extends Component {
  constructor() {
    super();
  }

  static styles = [
    css`
      ${unsafeCSS(antdCss)}
    `,
  ];
  /**
   * 挂载节点.
   */
  @query("#container")
  container!: HTMLElement;

  /**
   * 组件实例
   */
  componentInstance: any = null;

  private createVueComponent = () => {
    const self = this;
    const component = defineComponent({
      template: `
        <a-config-provider :locale="zhCN">
        <a-modal 
          v-model:visible="importVisible"
          v-if="importVisible"
          title="导入元件"
          :maskClosable="false" width="80%"
          :bodyStyle="{ maxHeight: '700px', overflow: 'auto' }" :closable="false"
          :confirmLoading="confirmLoading"
          @ok="handleOk" 
          @cancel="handleCancel"
        >
          <div>
            <a-radio-group v-model:value="radioType" button-style="solid">
              <a-radio-button value="user">我的元件</a-radio-button>
              <a-radio-button value="public">公共元件</a-radio-button>
            </a-radio-group>
          </div>
          <div v-if="!importValue" style="width: 100%;height: 300px;margin-top: 20px;">
            <a-upload-dragger
              accept="application/json"
              :showUploadList="false"
              :beforeUpload="() => false"
              @change="uploadChange"
              @drop="fileDrop"
              style="width: 100%;height: 100%"
            >
              <div 
                style="
                  width: 100%;
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                "
              >
                <cloud-upload-outlined :style="{fontSize: '42px', color: '#40a9ff' }" />
                <br />
                <span style="margin-left: 20px;font-size: 16px">单击或拖动文件到此区域</span>
              </div>
            </a-upload-dragger>
          </div>
          <q-code-editor v-else ref="codeEditor" :value="importValue" language="json" style="width: 100%;height: 550px;margin-top: 20px;display: block"></q-code-editor>
        </a-modal>
        <a-modal 
          v-model:visible="exportDeleteVisible"
          v-if="exportDeleteVisible"
          :title="exportDeleteTitle"
          :maskClosable="false"
          width="80%"
          :bodyStyle="{ maxHeight: '700px', overflow: 'auto' }"
          :closable="false"
          :confirmLoading="confirmLoading"
        >
          <template #footer>
            <div style="width: 100%;display: flex;align-items: center">
              <a-button @click="selectAll">全选</a-button>
              <a-button style="margin-left: auto" @click="exportDeleteCancel">取消</a-button>
              <a-button type="primary" @click="exportDeleteOK" :loading="btnLoading">确定</a-button>
            </div>
          </template>
          <a-spin :spinning="spinning" tip="Loading...">
            <div>
              <a-radio-group v-model:value="radioType" button-style="solid" @change="radioChange">
                <a-radio-button value="user">我的元件</a-radio-button>
                <a-radio-button value="public">公共元件</a-radio-button>
              </a-radio-group>
            </div>
            <div v-if="combinationList.length" style="width: 100%;height: 400px;margin-top: 20px;overflow-y: auto;">
              <a-checkbox-group v-model:value="listValue" style="width: 100%">
                <a-row>
                  <a-col v-for="item in combinationList" :span="4">
                    <a-checkbox :value="item.id" style="margin-top: 10px">{{ item.text }}</a-checkbox>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </div>
            <div v-else style="width: 100%;height: 420px;display: flex;flex-direction: column;justify-content: center;">
              <a-empty />
            </div>
          </a-spin>
        </a-modal>
        </a-config-provider>
      `,
      setup() {
        const importVisible = ref(false);
        const radioType = ref("user");
        const importValue = ref("");

        function showImportModal() {
          radioType.value = "user";
          importValue.value = "";
          importVisible.value = true;
        }

        function fileDrop(e: any) {
          e.stopPropagation();
          e.preventDefault();
          const files = e.dataTransfer.files;
          if (!files.length) {
            message.error("文件出错, 无法获取到文件!");
            return;
          }
          if (files[0].type !== "application/json") {
            message.error("文件类型错误, 请上传JSON文件!");
            return;
          }
        }

        function uploadChange(info: UploadChangeParam) {
          const fileType = info?.file?.type;
          if (!fileType || fileType !== "application/json") {
            message.destroy();
            message.error("文件类型错误, 请上传JSON文件!");
            return;
          }
          const reader = new FileReader();
          reader.readAsText(info.file as unknown as Blob);
          reader.onload = () => {
            if (!reader.result) {
              message.error("读取JSON文件内容出错!");
              return;
            }
            importValue.value = reader.result as string;
          };
        }

        /**
         * 导入数据
         */
        const codeEditor = ref();
        const confirmLoading = ref(false);

        function handleOk() {
          if (!codeEditor.value) {
            message.error("代码编辑器实例获取失败!");
            return;
          }
          const jsonStr = (codeEditor.value as any).getValue();
          try {
            const combinationList = JSON.parse(jsonStr);
            if (checkComponentList(combinationList)) return;
            checkCombination(combinationList);
          } catch (error) {
            message.error("JSON解析错误, 请检查代码编辑器内容!");
            console.error(error);
          }
        }

        function handleCancel() {
          if (confirmLoading.value) {
            importVisible.value = true;
            message.destroy();
            message.warning("正在导入中, 请稍后再试!");
            return;
          }
          radioType.value = "user";
          importValue.value = "";
        }

        // 校验数据
        function checkComponentList(combinationList: any) {
          if (!isArray(combinationList)) {
            message.error("JSON数据错误, 请检查!");
            return true;
          }
          let isError = false;
          combinationList.forEach((item) => {
            if (!item.componentName || !item.text || !item.type || !item.group || !item.options || !item.children)
              isError = true;
          });
          if (isError) {
            message.error("JSON数据错误或数据缺失, 请检查!");
          }
          return isError;
        }

        // 检查数据是否重复
        // @ts-ignore
        async function checkCombination(combinationList: any) {
          const token = getUserToken();
          const userId = getUserId();
          if (radioType.value === "user" && (!token || !userId)) {
            message.error("未找到用户信息, 无法进行数据校验!");
            return false;
          }
          let requestError = false;
          const repeatInfo = <any>[];
          const config = {
            url: "/v-uibuilder-server/ui-builder/search-combination",
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
            params: {
              userId: "",
              text: "",
            },
          };
          const getInfo = async (config: any) => {
            await axios(config)
              .then((res) => {
                const {
                  info: { msg = "" },
                  results = [],
                } = res.data.data;
                if (msg === "success") {
                  results[0] ? repeatInfo.push(results[0].text) : void 0;
                } else {
                  requestError = true;
                }
              })
              .catch((err) => {
                requestError = true;
                console.log(err);
              });
          };
          for (const item of combinationList) {
            if (radioType.value === "user") {
              config.params.userId = userId;
              config.params.text = item.text;
            } else {
              config.params.userId = "";
              config.params.text = item.text;
            }
            await getInfo(config);
          }
          if (requestError) {
            message.error("元件集合数据请求失败, 无法校验数据!");
            return;
          }
          if (repeatInfo.length) {
            Modal.confirm({
              title: "是否要覆盖已有数据?",
              icon: createVNode(ExclamationCircleOutlined),
              content: createVNode(
                "div",
                { style: "color:red;" },
                `${repeatInfo.join(", ")} 等${repeatInfo.length}个元件集合已存在`
              ),
              onOk() {
                importCombination(combinationList);
              },
            });
          } else {
            importCombination(combinationList);
          }
        }

        // 导入数据
        async function importCombination(combinationList: any) {
          const token = getUserToken();
          const config = {
            url: "/v-uibuilder-server/ui-builder/save-combination",
            method: "POST",
            headers: {
              Authorization: "Bearer " + token,
            },
            data: {
              userId: "",
              data: [],
            },
          };
          if (radioType.value === "user") {
            config.data.userId = getUserId();
            const temp = combinationList.map((item: any) => {
              item.group = ["我的元件"];
              return item;
            });
            config.data.data = temp;
          } else {
            config.data.userId = "";
            const temp = combinationList.map((item: any) => {
              item.group = ["公共元件"];
              return item;
            });
            config.data.data = temp;
          }
          await axios(config)
            .then((res) => {
              console.log(res);
              const {
                info: { msg = "" },
              } = res.data.data;
              if (msg === "success") {
                message.success("导入数据成功");
                // 刷新元件仓库
                initCombination();
              } else {
                message.error("导入数据失败!");
                console.log(msg);
              }
            })
            .catch((err) => {
              message.error("导入数据失败!");
              console.log(err);
            });
          // 重置数据
          radioType.value = "user";
          importValue.value = "";
          importVisible.value = false;
        }

        /**
         * 导出/删除
         */
        const exportDeleteVisible = ref(false);
        const exportDeleteTitle = ref("");
        const exportDeleteType = ref("");
        const spinning = ref(false);
        const btnLoading = ref(false);
        const combinationList = ref<any[]>([]);
        const listValue = ref<number[]>([]);
        function showExportDeleteModal(type: string) {
          exportDeleteType.value = type;
          type === "export" ? (exportDeleteTitle.value = "导出元件") : (exportDeleteTitle.value = "删除元件");
          radioType.value = "user";
          exportDeleteVisible.value = true;
          getCombination();
        }

        // 获取元件集合列表
        // @ts-ignore
        async function getCombination() {
          const token = getUserToken();
          const userId = getUserId();
          if (radioType.value === "user" && (!token || !userId)) {
            message.error("未找到用户信息, 无法获取元件集合数据!");
            return false;
          }
          spinning.value = true;
          const config = {
            url: "/v-uibuilder-server/ui-builder/get-combination",
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
            params: {
              userId: "",
              simple: true,
            },
          };
          switch (radioType.value) {
            case "user":
              config.params.userId = userId;
              break;
            case "public":
              config.params.userId = "";
              break;
          }
          await axios(config)
            .then((res) => {
              const {
                info: { msg = "" },
                results = [],
              } = res.data.data;
              if (msg === "success") {
                combinationList.value = results;
              } else {
                message.error("获取元件集合数据失败!");
              }
            })
            .catch((err) => {
              message.error("获取元件集合数据失败!");
              console.log(err);
            });
          spinning.value = false;
        }

        // radio切换，重新请求数据
        function radioChange() {
          listValue.value = [];
          getCombination();
        }

        /**
         * 确定导出/删除操作
         * @returns
         */
        async function exportDeleteOK() {
          if (!listValue.value.length) {
            message.destroy();
            message.warning("请选择元件集合!");
            return;
          }
          btnLoading.value = true;
          if (exportDeleteType.value === "delete") {
            deleteCombination();
            return;
          }
          exportCombination();
        }
        async function exportCombination() {
          const token = getUserToken();
          const userId = getUserId();
          if (radioType.value === "user" && (!token || !userId)) {
            message.error("未找到用户信息, 无法获取元件集合数据!");
            btnLoading.value = false;
            return;
          }
          const config = {
            url: "/v-uibuilder-server/ui-builder/find-combination",
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
            params: {
              ids: listValue.value,
            },
          };
          await axios(config)
            .then((res) => {
              const {
                info: { msg = "" },
                results = [],
              } = res.data.data;
              if (msg === "success") {
                const firstName = results?.[0]?.text;
                const length = results.length;
                const fileName = `${firstName || "combination"}...等(共${length}个复合元件)_${getFormatTime()}`;
                downloadByData(JSON.stringify(results), fileName, "application/json");
                exportDeleteVisible.value = false;
                resetExportDeleteInfo();
                // 刷新元件仓库
                initCombination();
              } else {
                message.error("获取元件集合数据失败!");
              }
            })
            .catch((err) => {
              message.error("获取元件集合数据失败!");
              console.log(err);
            });
          btnLoading.value = false;
        }

        /**
         * 全选数据
         */
        function selectAll() {
          listValue.value = combinationList.value.map((item) => {
            return item.id;
          });
        }

        /**
         * 取消操作
         * @returns
         */
        function exportDeleteCancel() {
          if (confirmLoading.value) {
            exportDeleteVisible.value = true;
            message.destroy();
            message.warning(`正在${exportDeleteType.value === "export" ? "导出" : "删除"}中, 请稍后再试!`);
            return;
          }
          resetExportDeleteInfo();
          exportDeleteVisible.value = false;
        }

        /**
         * 重置弹窗数据
         */
        function resetExportDeleteInfo() {
          radioType.value = "user";
          exportDeleteType.value = "";
          combinationList.value = [];
          listValue.value = [];
        }

        // 导出数据为文件
        function downloadByData(data: BlobPart, filename: string, mime?: string, bom?: BlobPart) {
          const blobData = typeof bom !== "undefined" ? [bom, data] : [data];
          const blob = new Blob(blobData, { type: mime || "application/octet-stream" });

          const blobURL = window.URL.createObjectURL(blob);
          const tempLink = document.createElement("a");
          tempLink.style.display = "none";
          tempLink.href = blobURL;
          tempLink.setAttribute("download", filename);
          if (typeof tempLink.download === "undefined") {
            tempLink.setAttribute("target", "_blank");
          }
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
          window.URL.revokeObjectURL(blobURL);
        }

        // delete combination
        async function deleteCombination() {
          const token = getUserToken();
          const userId = getUserId();
          if (radioType.value === "user" && (!token || !userId)) {
            message.error("未找到用户信息, 无法进行删除操作!");
            btnLoading.value = false;
            return;
          }
          const config = {
            url: "/v-uibuilder-server/ui-builder/delete-combination",
            method: "POST",
            headers: {
              Authorization: "Bearer " + token,
            },
            data: {
              userId: "",
              ids: listValue.value,
            },
          };
          radioType.value === "user" ? (config.data.userId = userId) : (config.data.userId = "");
          await axios(config)
            .then((res) => {
              const {
                info: { msg = "" },
              } = res.data.data;
              if (msg === "success") {
                message.success("删除成功");
                exportDeleteVisible.value = false;
                resetExportDeleteInfo();
                // 刷新元件仓库
                initCombination();
              } else {
                message.error("删除元件集合数据失败!");
              }
            })
            .catch((err) => {
              message.error("删除元件集合数据失败!");
              console.log(err);
            });
          btnLoading.value = false;
        }

        // 获取初始化combination仓库数据
        async function initCombination() {
          const token = getUserToken();
          const userId = getUserId();
          if (!token) return;
          let userCombination = [] as any;
          let publicCombination = [] as any;
          const config = {
            url: "/v-uibuilder-server/ui-builder/get-combination",
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
            params: {
              userId: "",
              simple: true,
            },
          };
          if (userId) {
            config.params.userId = userId;
            await axios(config).then((res) => {
              const {
                info: { msg = "" },
                results = [],
              } = res.data.data;
              if (msg === "success") {
                userCombination = results;
              }
            });
          }
          config.params.userId = "";
          await axios(config).then((res) => {
            const {
              info: { msg = "" },
              results = [],
            } = res.data.data;
            if (msg === "success") {
              publicCombination = results;
            }
          });
          const temp = [...userCombination, ...publicCombination];
          self.children[0]?.setAttribute("list", JSON.stringify(temp));
          DOMEmit(self, "change", null);
        }

        const _handler = (e: any) => {
          switch (e.detail.type) {
            case "REFRESH":
              initCombination();
              break;
            case "IMPORT":
              showImportModal();
              break;
            case "EXPORT":
              showExportDeleteModal("export");
              break;
            case "DELETE":
              showExportDeleteModal("delete");
              break;
          }
        };

        onMounted(() => {
          // 获取初始化combination仓库数据
          initCombination();
          // 监听CustomEvent
          window.addEventListener("user", _handler);
        });

        onUnmounted(() => {
          window.removeEventListener("user", _handler);
        });

        return {
          importVisible,
          radioType,
          importValue,
          zhCN,
          codeEditor,
          confirmLoading,
          exportDeleteVisible,
          exportDeleteTitle,
          spinning,
          listValue,
          combinationList,
          btnLoading,
          fileDrop,
          uploadChange,
          handleOk,
          handleCancel,
          radioChange,
          exportDeleteOK,
          exportDeleteCancel,
          selectAll,
        };
      },
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(Modal);
    this.componentInstance.use(Radio);
    this.componentInstance.use(Upload);
    this.componentInstance.use(Spin);
    this.componentInstance.use(Checkbox);
    this.componentInstance.use(Row);
    this.componentInstance.use(Col);
    this.componentInstance.use(Empty);
    this.componentInstance.use(ConfigProvider);
    this.componentInstance.use(Button);
    this.componentInstance.component("CloudUploadOutlined", CloudUploadOutlined);
    this.componentInstance.component("ExclamationCircleOutlined", ExclamationCircleOutlined);
    this.componentInstance.mount(this.container);
  };

  public render() {
    return html`
      <div id="container"></div>
    `;
  }

  disconnectedCallback(): void {
    if (!this.isConnected) {
      // 断开文档连接，说明元件已被删除
      unmountInstance(this);
    }
    super.disconnectedCallback();
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    if (!this.componentInstance && this.container) {
      this.createVueComponent();
    }
  }

  protected updated(): void {
    if (this.container) {
      unmountInstance(this);
      this.createVueComponent();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-custom-warehouse": QCustomWarehouse;
  }
}

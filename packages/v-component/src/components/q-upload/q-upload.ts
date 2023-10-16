import { css, html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { isEqual } from "lodash-es";
import { ISchema, EComponentType, EComponentGroup } from "../../types/runtime/IModelSchema";
import { Component } from "../../types/runtime/Component";
import { createVueComponent } from "./component";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { unmountInstance } from "../../util/utils";
import antdCss from "ant-design-vue/dist/antd.min.css?inline";
import cssIndex from "./index.scss?inline?inline";
// import { IMessage } from "../../types/runtime/IMessage";

/**
 * 折叠面板
 */
@customElement("q-upload")
export class QUpload extends Component {
  constructor() {
    super();
    this.initModel();
  }
  static styles = [
    css`
      ${unsafeCSS(antdCss)}
    `,
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];
  // 请求头
  @property({ type: String })
  public headers =
    '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE1LCJ1c2VybmFtZSI6InJvb3QiLCJpYXQiOjE2Nzc4MzIzMzksImV4cCI6MTY3Nzg2MTEzOX0.vFNGDASIgtiTCl5HAjhfas2ZyRxsyLVnng2nUzSJgTw"}';
  // 请求头
  @property({ type: String })
  public requestData = "{}";
  // 请求地址
  @property({ type: String })
  public action = "/v-file-server/fileman/upload/mock";
  // 文件参数名
  @property({ type: String })
  public name = "file[]";
  // 触发文字
  @property({ type: String })
  public btnTxt = "上传";
  // 触发文字描述
  @property({ type: String })
  public btnDescribe =
    '<p class="ant-upload-text">单击或拖动文件到此区域进行上传</p> <p class="ant-upload-hint"> 支持单个或批量上传。一次尽量不要上传太多或太大的文件</p>';
  // 类型
  @property({ type: String })
  public listType = "文字按钮"; // text, picture picture-card, drop
  // 上传数量
  @property({ type: Number })
  public maxCount = 8;
  // 上传数量
  @property({ type: String })
  public accept = "";
  // 文件取值路径
  @property({ type: String })
  public filePath = "data.file";

  /**
   * 文件列表 fileList
   */
  @property({ type: Array, attribute: "fileList" })
  fileList = [];

  /**
   * 挂载节点.
   */
  @query("#container")
  container!: HTMLElement;

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  /**
   * 组件实例
   */
  componentInstance: any = null;

  render() {
    // 初始化数据
    return html`
      <div id="container" class="q-upload-container"></div>
    `;
  }

  // dropEcho(DragDrop: any) {
  //   DragDrop.dropEventMount(this)
  // }

  // dropCreated(DragDrop: any) {
  //   DragDrop.dropEventMount(this)
  // }

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
      createVueComponent(this);
    }
  }

  protected updated(): void {
    if (this.container) {
      unmountInstance(this);
      createVueComponent(this);
    }
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-upload";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "上传";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "用于数据录入";
          },
          eventSpecification: {
            inputMessage: [],
            outputMessage: [
              {
                text: "上传数据变更",
                eventType: "onChange",
                messageSchema: "",
                messageDemo: "",
              },
            ],
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                action: {
                  type: "string",
                  description: "请求地址",
                },
                headers: {
                  type: "string",
                  description: "请求头",
                },
                requestData: {
                  type: "string",
                  description: "请求参数",
                },
                name: {
                  type: "string",
                  description: "文件参数名",
                },
                fileList: {
                  type: "array",
                  description: "文件列表",
                  // disabled: true,
                  items: {
                    type: "object",
                    description: "项",
                    properties: {
                      uid: {
                        type: "string",
                        description: "ID",
                        disabled: true,
                      },
                      name: {
                        type: "string",
                        description: "文件名",
                        disabled: true,
                      },
                      url: {
                        type: "string",
                        description: "文件地址",
                      },
                      // response: {
                      //   type: "string",
                      //   description: "请求响应"
                      // }
                    },
                  },
                },
                btnTxt: {
                  type: "string",
                  description: "触发文字",
                },
                btnDescribe: {
                  type: "string",
                  description: "触发文字描述",
                },
                listType: {
                  type: "string",
                  description: "上传样式",
                  enum: ["文字按钮", "图片列表", "照片墙", "头像展示", "区域拖拽"],
                },
                maxCount: {
                  type: "string",
                  description: "上传数量",
                },
                accept: {
                  type: "string",
                  description: "上传数量:如(image/png, image/jpeg)",
                },
                filePath: {
                  type: "string",
                  description: "文件取值路径",
                },
              },
            },
          },
        },
        get iovSchema() {
          return this["_iovSchema"];
        },
        set iovSchema(value) {
          if (value === this["_iovSchema"] || isEqual(value, this["_iovSchema"])) {
            return;
          }
          this["_iovSchema"] = value;
        },
        _initStyle: "width: 200px; height: 32px;",
        _onMessageMeta: {},
        _onDOMEvent: {},
        _lifeCycle: {
          created: function () {
            console.log("created");
          },
          updated: function () {
            console.log("updated");
          },
          destroy: function () {
            console.log("destroy");
          },
          beforeUpload: function (file: any, fileList: any[]) {
            console.log("beforeUpload", file, fileList);
            return true;
            // 支持boolean | Promise
            // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            // if (!isJpgOrPng) {
            //   message.error('You can only upload JPG file!');
            // }
            // const isLt2M = file.size / 1024 / 1024 < 2;
            // if (!isLt2M) {
            //   message.error('Image must smaller than 2MB!');
            // }
            // return isJpgOrPng && isLt2M;
          },
        },
        get headers() {
          return self.headers;
        },
        set headers(value) {
          self.headers = value;
          self.requestUpdate("headers");
        },
        get requestData() {
          return self.requestData;
        },
        set requestData(value) {
          self.requestData = value;
          self.requestUpdate("requestData");
        },
        get action() {
          return self.action;
        },
        set action(value) {
          self.action = value;
          self.requestUpdate("action");
        },
        get name() {
          return self.name;
        },
        set name(value) {
          self.name = value;
          self.requestUpdate("name");
        },
        get fileList() {
          // console.log('get:', self.fileList)
          // self.fileList.map((v:any) => {v.response = JSON.stringify(v.response)})
          return self.fileList;
        },
        set fileList(value) {
          // console.log('set:', value)
          // value["response"] = JSON.stringify(value["response"])
          self.fileList = value;
          self.requestUpdate("fileList");
        },
        get btnTxt() {
          return self.btnTxt;
        },
        set btnTxt(value) {
          self.btnTxt = value;
          self.requestUpdate("btnTxt");
        },
        get btnDescribe() {
          return self.btnDescribe;
        },
        set btnDescribe(value) {
          self.btnDescribe = value;
          self.requestUpdate("btnDescribe");
        },
        get listType() {
          return self.listType;
        },
        set listType(value) {
          console.log(value);
          self.listType = value;
          self.requestUpdate("listType");
        },
        get maxCount() {
          return self.maxCount;
        },
        set maxCount(value) {
          self.maxCount = value;
          self.requestUpdate("maxCount");
        },
        get accept() {
          return self.accept;
        },
        set accept(value) {
          self.accept = value;
          self.requestUpdate("accept");
        },
        get filePath() {
          return self.filePath;
        },
        set filePath(value) {
          self.filePath = value;
          self.requestUpdate("filePath");
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-upload": QUpload;
  }
}

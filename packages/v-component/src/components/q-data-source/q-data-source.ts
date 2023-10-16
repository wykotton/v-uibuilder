import { css, html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { isEqual, isString } from "lodash-es";
import { ISchema, EComponentType, EComponentGroup } from "../../types/runtime/IModelSchema";
import { Component } from "../../types/runtime/Component";
import { createVueComponent } from "./component";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { unmountInstance } from "../../util/utils";
import { IApiSource, IDatabase } from "../../types/runtime/IDataSource";
import { IMessage } from "../../types/runtime/IMessage";
import antdCss from "ant-design-vue/dist/antd.min.css?inline";
import cssIndex from "./index.scss?inline";
import $ from "jquery";

// 内|部变更，不需要重新渲染
const insideChange = new Proxy({ value: false }, {});

/**
 * 数据源
 */
@customElement("q-data-source")
export class QDataSource extends Component {
  constructor() {
    super();
    this.initModel();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
    css`
      ${unsafeCSS(antdCss)}
    `,
  ];

  /**
   * 请求源数据
   */
  @property({
    type: Object,
    hasChanged() {
      if (insideChange.value) {
        insideChange.value = false;
        return insideChange.value;
      }
      return true;
    },
  })
  source: IApiSource[] | IDatabase[] = [];

  /**
   * 请求域名
   */
  @property({ type: String })
  domain = "/v-uibuilder-server";

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
      createVueComponent(this, insideChange);
    }
    this.createStyleElement();
  }

  // 抽屉内样式在body上需要手动添加样式才能生效
  createStyleElement() {
    const noBgStyle = $(`#data-source-drawer`);
    if (!noBgStyle.length) {
      $("head").append(`
      <style id="data-source-drawer">
        .request-item {
          display: flex;
          align-items: center;
          padding-top: 20px;
        }
        
          .item-content {
            flex: 1;
            margin-left: 5px;
          }
        
           .item-title {
            width: 120px;
            min-width: 120px;
            text-align: right;
          }
      </style>
    `);
    }
  }

  protected updated(): void {
    if (this.container) {
      unmountInstance(this);
      createVueComponent(this, insideChange);
    }
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-data-source";
          },
          get type() {
            return EComponentType.PLUGIN;
          },
          get text() {
            return "API数据源";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "API数据源组件";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "发起数据请求",
                eventType: "initiateRequest",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "修改请求参数",
                eventType: "updateRequestParams",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "开启/关闭轮询",
                eventType: "switchPolling",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "数据请求完成",
                eventType: "requestCompletion",
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
                domain: {
                  type: "string",
                  description: "数据请求代理地址",
                  placeholder: "默认代理地址: /v-uibuilder-server",
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
        _initStyle: "height:200px;width:300px;",
        _onMessageMeta: {
          initiateRequest: [
            function (e: IMessage) {
              // @ts-ignore
              this.componentInstance?._instance?.proxy?.initiateRequest(e.body);
            },
          ],
          updateRequestParams: [
            function (e: IMessage) {
              // @ts-ignore
              this.componentInstance?._instance?.proxy?.updateRequestParams(e.body);
            },
          ],
          switchPolling: [
            function (e: IMessage) {
              // @ts-ignore
              this.componentInstance?._instance?.proxy?.switchPolling(e.body);
            },
          ],
        },
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
        },
        get source() {
          return self.source;
        },
        set source(value) {
          if (isString(value)) {
            try {
              self.source = JSON.parse(value);
            } catch (error) {
              self.source = [];
            }
          } else {
            self.source = value;
          }
        },
        get domain() {
          return self.domain;
        },
        set domain(value) {
          self.domain = String(value);
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-data-source": QDataSource;
  }
}

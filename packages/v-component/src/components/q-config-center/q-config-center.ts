import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createVueComponent } from "./component";
import { unmountInstance } from "../../util/utils";
import antdCss from "ant-design-vue/dist/antd.min.css?inline";
import cssIndex from "./index.scss?inline";

/**
 * 配置中心(以项目为维度进行功能配置管理).
 *
 */
@customElement("q-config-center")
export class QConfigCenter extends LitElement {
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
   * 绑定配置数据
   */
  @property({ type: Object })
  config = [];

  /**
   * 请求域名
   */
  @property({ type: String })
  domain = "/v-uibuilder-server";

  /**
   * 属性列表
   */
  @property({
    type: Array,
    hasChanged: () => {
      return false;
    },
  })
  attribute: any = [];

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
            return "q-config-center";
          },
          get type() {
            return EComponentType.TEXT;
          },
          get text() {
            return "配置中心";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "配置中心,可以设置项目配置信息";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "更改组件数据",
                eventType: "changeInfo",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "组件点击数据",
                eventType: "click",
                messageSchema: "",
                messageDemo: "文本数据1",
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
                  description: "请求域名",
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
        _onMessageMeta: {
          changeInfo: [
            function (e: IMessage) {
              console.log(e, self);
            },
          ],
        },
        _initStyle: "height:200px;width:300px;",
        _onWatchSetting: {
          config: [
            function (newVal: any, oldVal: any, context: any) {
              console.log(newVal, oldVal, context);
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
        get config() {
          return self.config;
        },
        set config(value) {
          if (value === self.config) {
            return;
          }
          self.config = value;
        },
        get domain() {
          return self.domain;
        },
        set domain(value) {
          if (value === self.domain) {
            return;
          }
          self.domain = value;
        },
        get attribute() {
          return self.attribute;
        },
      } as unknown as ISchema,
    });
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "q-config-center": QConfigCenter;
  }
}

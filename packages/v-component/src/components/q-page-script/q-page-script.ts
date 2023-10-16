import { css, html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { Component } from "../../types/runtime/Component";
import { isEqual, isString } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createVueComponent } from "./component";
import { unmountInstance } from "../../util/utils";
import antdCss from "ant-design-vue/dist/antd.min.css?inline";
import cssIndex from "./index.scss?inline";

// 内|部变更，不需要重新渲染
const insideChange = new Proxy({ value: false }, {});

/**
 * 路由配置组件
 */
@customElement("q-page-script")
export class QPageScript extends Component {
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

  // 脚本数据
  @property({
    type: Array,
    hasChanged() {
      if (insideChange.value) {
        insideChange.value = false;
        return insideChange.value;
      }
      return true;
    },
  })
  value = [];

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
            return "q-router-config";
          },
          get type() {
            return EComponentType.PLUGIN;
          },
          get text() {
            return "脚本配置";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "脚本配置组件";
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {},
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
        get value() {
          return self.value;
        },
        set value(value) {
          if (isString(value)) {
            try {
              self.value = JSON.parse(value);
            } catch (error) {
              self.value = [];
            }
          } else {
            self.value = value;
          }
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-page-script": QPageScript;
  }
}

import { css, html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { Component } from "../../types/runtime/Component";
import { cloneDeep, isArray, isBoolean, isEqual, isString } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createVueComponent } from "./component";
import { ChangeConfigInfo, IRouterInfo, IRouterTypesSort } from "../../types/runtime/IRouterConfig";
import { unmountInstance } from "../../util/utils";
import antdCss from "ant-design-vue/dist/antd.min.css?inline";
import cssIndex from "./index.scss?inline";

// 内|部变更，不需要重新渲染
const insideChange = new Proxy({ value: false }, {});

/**
 * 路由配置组件
 */
@customElement("q-router-config")
export class QRouterConfig extends Component {
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

  // 路由数据
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
  value = {};

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
   * 路由分组排序
   */
  typeSortList: IRouterTypesSort[] = [];

  // 临时数据，用于路由测试功能
  testValue!: IRouterInfo | null;

  // 综合数据，用于事件总线
  get allValue() {
    const tempValue = cloneDeep(this.value);
    if (this.testValue?.src) {
      tempValue[this.testValue.src]?.length
        ? tempValue[this.testValue.src].push(cloneDeep(this.testValue))
        : (tempValue[this.testValue.src] = [cloneDeep(this.testValue)]);
    }
    return tempValue;
  }

  /**
   * 运行/设计状态
   */
  get contextType() {
    return this.componentModel.model.contextType;
  }
  set contextType(value) {
    this.componentInstance?._instance?.ctx?.changeContextType?.(value);
  }

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  /**
   * 组件实例
   */
  componentInstance: any = null;

  // 供元件外部更改源
  set src(value: string) {
    this.componentInstance?._instance?.ctx?.changeSelectedComponent?.(value);
  }

  // 供元件外部更改配置项
  set config(value: ChangeConfigInfo) {
    // this.componentInstance?._instance?.ctx?.changeConfig(value);
  }

  // 供元件外部选择配置项
  set select(value: string) {
    // this.componentInstance?._instance?.ctx?.selectConfig(value);
  }

  // 供元件外部删除配置项
  set delete(value: ChangeConfigInfo) {
    // this.componentInstance?._instance?.ctx?.deleteConfig(value);
  }

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
            return "路由配置";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "路由配置组件";
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
        get contextType() {
          return this["_contextType"];
        },
        set contextType(value) {
          if (!isBoolean(value)) {
            throw new Error("contextType必须是boolean类型");
          }
          this["_contextType"] = value;
          self.contextType = value;
        },
        get value() {
          return self.value;
        },
        set value(value) {
          if (isString(value)) {
            try {
              self.value = JSON.parse(value);
            } catch (error) {
              console.log(error);
              self.value = {};
            }
          } else {
            self.value = cloneDeep(value);
          }
        },
        get domain() {
          return self.domain;
        },
        set domain(value) {
          self.domain = String(value);
        },
        get typeSortList() {
          return self.typeSortList;
        },
        set typeSortList(value) {
          if (!isArray(value)) return;
          self.typeSortList = value;
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-router-config": QRouterConfig;
  }
}

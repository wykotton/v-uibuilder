import { IMessage } from "@zzjz/v-uibuilder-types";
import { css, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { isBoolean, isEqual } from "lodash-es";
import { Component } from "../../types/runtime/Component";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { customHasElement } from "../../types/runtime/decorators/decorators";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import {
  changePluginSource,
  changeRouterAndAttrBind,
  changeValue,
  checkRepeat,
  childPageClassName,
  createChildPage,
  getProjectData,
  getProjectId,
} from "./utils";
import cssIndex from "./index.scss?inline";
import $ from "jquery";

/**
 * 子页面容器
 */
@customHasElement("q-child-page")
export class QChildPage extends Component {
  constructor() {
    super();
    this.initModel();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];

  /**
   * 子页面id
   */
  @property({ type: String, attribute: "child_page_id" })
  public childPageId = "";

  /**
   * 子页面数据
   */
  @property({ type: String })
  public value = "{}";

  /**
   * 请求域名
   */
  @property({ type: String })
  domain = "/v-uibuilder-server";

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  /**
   * 组件实例
   */
  componentInstance: any = null;

  // 临时变量，用于对比变更
  tempChildPageId = "";
  tempValue = "{}";

  // 页面id
  pageId = "";
  // 项目id
  projectId = "";
  // 子页面数据
  childPageList = [];
  // 子页面元件id映射关系
  mappingId = {};

  async getChildPage() {
    if (!this.domain) return;
    const { pageId, projectId } = await getProjectId(this.domain);
    this.pageId = pageId;
    this.projectId = projectId;
    if (!this.projectId) return;
    const childPageList = await getProjectData(this.projectId, this.domain);
    try {
      this.childPageList = JSON.parse(childPageList);
      this.pageRender();
    } catch (error) {}
  }

  /**
   * 子页面渲染
   * @returns
   */
  pageRender() {
    try {
      this.innerHTML = "";
      const index = this.childPageList.findIndex((item: Record<string, any>) => item.id === this.childPageId);
      if (index === -1 || checkRepeat(this)) return;
      const childPageInfo = this.childPageList[index] as Record<string, any>;
      createChildPage(childPageInfo.innerDropzone, childPageInfo.bottomDropzone, this).then((res) => {
        this.mappingId = res;
        changeRouterAndAttrBind(this);
        changeValue(this);
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 渲染项目子页面
   * @param data
   */
  renderChildPage(data: Record<string, any>) {
    try {
      const { childPageId, value, domain } = data;
      childPageId ? (this.childPageId = childPageId) : void 0;
      value ? (this.value = value) : void 0;
      domain ? (this.domain = domain) : void 0;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 代理inside元件点击，更新插件元件配置源
   */
  eventIndex = 0;
  clickInsideEvent(e: any) {
    e.stopPropagation();
    const element = e.currentTarget;
    const id = element.id || "";
    changePluginSource(id);
  }
  addInsideClick() {
    if (this.eventIndex !== 0) return;
    $(this).on("mousedown", ".child-page-children", this.clickInsideEvent);
    $(this).on("click", ".child-page-children", this.clickInsideEvent);
    this.eventIndex += 1;
  }

  /**
   * 变更元件运行时状态
   * @param type
   */
  _contextType = false;
  changeContextType(value: boolean) {
    if (!isBoolean(value)) return;
    this._contextType = value;
    Array.from(document.querySelectorAll(`.${childPageClassName}`)).forEach((component: any) => {
      const contextType = component?.componentModel?.model?.contextType;
      if (!isBoolean(contextType)) return;
      component.componentModel.model.contextType = value;
    });
  }

  /**
   * 初始化
   * @returns
   */
  init() {
    if (!this.childPageId) {
      this.innerHTML = "";
      return;
    }
    // 子页面id变更，重新渲染子页面
    if (this.tempChildPageId !== this.childPageId) {
      this.tempChildPageId = this.childPageId;
      this.pageRender();
      return;
    }
    // 子页面数据变更，只更新元件数据
    if (this.tempValue !== this.value) {
      this.tempValue = this.value;
      changeValue(this);
    }
  }

  public render() {
    return html`
      <div class="q-child-page">
        <div id="inner-canvas"><slot name="inner"><div class="tips"><span>子页面容器</span><div></slot></div>
        <div id="bottom-canvas"><slot name="bottom"></slot></div>
      </div>
    `;
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    this.getChildPage();
    this.addInsideClick();
  }

  protected updated(): void {
    this.init();
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-child-page";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "子页面容器";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "子页面容器,可以渲染和展示项目子页面";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "渲染项目子页面",
                eventType: "renderChildPage",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [],
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                childPageId: {
                  type: "string",
                  description: "子页面id",
                },
                value: {
                  type: "string",
                  description: "子页面数据",
                  format: "code",
                },
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
        get contextType() {
          return this["_contextType"];
        },
        set contextType(value) {
          if (!isBoolean(value)) {
            throw new Error("contextType必须是boolean类型");
          }
          this["_contextType"] = value;
          self.changeContextType?.(value);
        },
        _onMessageMeta: {
          renderChildPage: [
            function (e: IMessage) {
              if (typeof e.body === "object") {
                // @ts-ignore
                this.renderChildPage(e.body);
              }
            },
          ],
        },
        _onDOMEvent: {},
        _initStyle: "height:300px;width:300px;z-index: 999;overflow:auto;background-color:#ffffff;",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function () {},
          updated: function () {},
          destroy: function () {},
        },
        get childPageId() {
          return self.childPageId;
        },
        set childPageId(value) {
          if (value === self.childPageId) {
            return;
          }
          self.childPageId = value;
        },
        get value() {
          return self.value;
        },
        set value(value) {
          if (value === self.value) {
            return;
          }
          self.value = value;
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
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-child-page": QChildPage;
  }
}

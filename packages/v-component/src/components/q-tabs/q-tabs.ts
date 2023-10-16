import { html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { isEqual, isArray } from "lodash-es";
import { Component } from "../../types/runtime/Component";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import cssIndex from "./index.scss?inline";
import "../q-container-mask/q-container-mask";

/**
 * 选项卡组件.
 *
 * @slot - slot 为选项卡提供内容
 */
@customElement("q-tabs")
export class QTabs extends Component {
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
   * The name to say "Hello" to.
   */
  @property({ type: Array })
  tabs = [
    { title: "功能一", id: "test1" },
    { title: "功能二", id: "test2" },
  ];

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  public menuStart(shadowDom: HTMLElement = document.body) {
    const content = shadowDom.querySelector("#content") as HTMLElement;

    const contentDIV = content.children as never as Array<HTMLElement>;
    [...contentDIV].forEach((el) => {
      el.style.display = "none";
    });
    const tabsA = shadowDom.querySelector("#tabs li>a") as HTMLElement;
    const tabsDIV = shadowDom.querySelector("#content > div") as HTMLElement;
    tabsA.id = "current";
    tabsDIV.style.display = "block";
  }

  public clickTitle(e: Event, index: number) {
    if (!this.tabs[index]) return;
    const clickTab = this?.shadowRoot?.querySelector("#tabs")?.children[index].children[0] as HTMLElement;
    const resetTabs = () => {
      this?.shadowRoot?.querySelectorAll("#tabs a").forEach((el) => {
        el.id = "";
      });
      this?.shadowRoot?.querySelectorAll(".content-panel").forEach((el) => {
        const element = el as HTMLElement;
        element.style.display = "none";
      });
    };
    resetTabs();
    const targetDOM = this?.shadowRoot?.querySelector(`#${this.tabs[index].id}`) as HTMLElement;
    if (targetDOM) {
      targetDOM.style.display = "block";
    }

    clickTab.id = "current";
    this.onSendMessage(e, this.tabs, index);
  }

  render() {
    return html`
      <div class="q-tabs-container">
        <ul id="tabs">
          ${this.tabs.map((item, index) => {
            const { title } = item;
            return html`
              <li>
                <a
                  href="javascript:void(0);"
                  id="${index === 0 ? "current" : ""}"
                  @click="${(e: Event) => {
                    this.clickTitle(e, index);
                  }}"
                >
                  ${title}
                </a>
              </li>
            `;
          })}
        </ul>
        <div id="content">
          ${this.tabs.map(
            ({ id }, index) =>
              html`
                <div class="content-panel" id=${id} style="display: ${index === 0 ? "block" : "none"}">
                  <slot name="${id}" class="dropzone">
                    <q-container-mask text="组件降落区"></q-container-mask>
                  </slot>
                </div>
              `
          )}
        </div>
      </div>
    `;
  }

  onSendMessage(e: Event, node: any, index: number | string) {
    const message: IMessage = {
      header: {
        src: this.id,
        dst: "",
        srcType: e.type,
        dstType: "",
      },
      body: {
        ...e,
        node,
        index,
      },
    };
    this.sendMessage(message);
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-tabs";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "选项卡";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "选项卡组件,可以切换不同显示内容";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "设置选项卡数据",
                eventType: "changeInfo",
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
                tabs: {
                  type: "array",
                  description: "选项卡数据",
                  items: {
                    type: "object",
                    description: "子项数据",
                    properties: {
                      title: {
                        type: "string",
                        description: "选项卡名称",
                      },
                      id: {
                        type: "string",
                        description: "选项卡id",
                      },
                    },
                  },
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
        _onDOMEvent: {},
        _initStyle: "height:300px;width:300px;background-color:#ffffff",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function () {},
          updated: function () {},
          destroy: function () {},
        },
        get tabs() {
          return self.tabs;
        },
        set tabs(value) {
          if (!isArray(value) || isEqual(value, self.tabs)) return;
          self.tabs = value;
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-tabs": QTabs;
  }
}

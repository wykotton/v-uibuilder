import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { DOMEmit } from "../../util/reactivity/Emit";
import cssIndex from "./index.scss?inline";

@customElement("q-tab")
export class QTab extends LitElement {
  constructor() {
    super();
    this.initModel();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];

  @property({ type: String, attribute: "backgoundColor" })
  public backgoundColor = "#ffffff";

  @property({ type: String, attribute: "width" })
  public width = "18%";

  @property({ type: String, attribute: "backgroundUrl" })
  public backgroundUrl = "";

  @property({ type: String, attribute: "backgroundSize" })
  public backgroundSize = "";

  @property({ type: String, attribute: "color" })
  public color = "#000";

  @property({ type: String, attribute: "activeColor" })
  public activeColor = "#1890ff";

  @property({ type: Number, attribute: "active" })
  public activeKey = 0;

  @property({ type: Object, attribute: "data" })
  public data: any = [];

  @property({ type: String, attribute: "director" })
  public director = "left";

  @property({ type: String, attribute: "marginRight" })
  public marginRight = "0";

  @property({ type: String, attribute: "marginTop" })
  public marginTop = "0";

  @property({ type: String, attribute: "activeBackgroundUrl" })
  public activeBackgroundUrl = "";

  @property({ type: String, attribute: "marginLeft" })
  public marginLeft = "25";

  @property({ type: String, attribute: "marginBottom" })
  public marginBottom = "0";

  @property({ type: String, attribute: "lineHeight" })
  public lineHeight = "25";

  public targetList: any = [];

  public target = null;

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  public handleSelect(e: any) {
    if (this.data && typeof this.data === "string") {
      this.data = JSON.parse(this.data);
    }
    const text = e.target.textContent || e.target.__text;
    if (text === "") return;
    const key = e.target.getAttribute("data-key");

    this.activeKey = this.data.filter((item: any) => item.name === text)[0].key;

    // if (!this.activeKey) return;
    this.targetList.map((item: any) => {
      item.style.display = "none";
      item.style.color = "#000000";
    });
    // this.targetList
    //   ? (this.targetList[this.activeKey].style.display = "block")
    //   : null;
    this.targetList[this.activeKey] ? (this.targetList[this.activeKey].style.display = "block") : null;
    this.targetList[this.activeKey] ? (this.targetList[this.activeKey].style.color = this.activeColor) : null;
    // this.targetList
    //   ? (this.targetList[this.activeKey].style.color = this.activeColor)
    //   : null;
    if (key) {
      DOMEmit(this, "change", {
        detail: key,
      });
    }
  }
  public handleSlotchange(e: any) {
    const childNodes = e.target.assignedNodes({ flatten: true });
    this.targetList = childNodes;
    if (this.activeKey !== null) {
      childNodes.map((item: any) => (item.style.display = "none"));
      childNodes[this.activeKey].style.display = "block";
    }
    childNodes
      .map((node: any) => {
        return node.textContent ? node.textContent : "";
      })
      .join("");
  }
  public handleItemSlotchange(e: any) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const childNodes = e.target.assignedNodes({ flatten: true });
    if (this.backgroundUrl.length === 0) {
      if (this.activeKey !== null) {
        if (childNodes[this.activeKey].style.border && e.target.style.border !== "none") {
          childNodes[this.activeKey].style.background = `${this.activeColor}`;
          childNodes[this.activeKey].style.color = `${this.color}`;
        } else {
          childNodes[this.activeKey].style.borderBottom = `2px solid ${this.activeColor}`;
          childNodes[this.activeKey].style.color = `${this.activeColor}`;
        }
      }

      childNodes.map((item: any) => {
        // item.style.margin = "5px";
        item.style.color = this.color;
        if (e.target.style.border && e.target.style.border !== "none") {
          item.style.background = this.backgoundColor;
        }

        item.addEventListener("click", (e: any) => {
          if (e.target.style.border && e.target.style.border !== "none") {
            childNodes.forEach((element: any) => {
              element.style.background = this.backgoundColor;
            });
            e.target.style.background = `${this.activeColor}`;
            e.target.style.color = `${this.color}`;
          } else {
            childNodes.forEach((element: any) => {
              element.style.border = "none";
              element.style.color = this.color;
            });

            e.target.style.borderBottom = `2px solid ${this.activeColor}`;

            e.target.style.color = `${this.activeColor}`;
          }
        });
      });
    } else {
      childNodes.map((item: any) => {
        item.style.background = `url(${this.backgroundUrl})`;
        item.style.backgroundSize = this.backgroundSize;
        item.style.backgroundRepeat = "no-repeat";
        item.style.color = this.color;
        item.addEventListener("click", function () {
          childNodes.map((subItem: any) => {
            item.style.backgroundRepeat = "no-repeat";
            item.style.backgroundSize = that.backgroundSize;
            subItem.style.background = `url(${that.backgroundUrl})`;
            item.style.background = `url(${that.activeBackgroundUrl})`;
          });
        });
      });
    }
  }

  public render() {
    const styleObject = {
      width: "",
      display: "",
      flexDirection: "",
      itemFlexDirection: "",
      borderRight: "",
      borderBottom: "",
    };
    if (this.director === "left") {
      styleObject.width = this.width;
      styleObject.display = "flex";
      styleObject.flexDirection = "initial";
      styleObject.itemFlexDirection = "column";
      styleObject.borderRight = "0px solid #DDE1E6";
    } else {
      styleObject.width = "100%";
      styleObject.display = "flex";
      styleObject.flexDirection = "column";
      styleObject.itemFlexDirection = "initial";
      styleObject.borderBottom = "0px solid #DDE1E6";
    }
    return html`
      <div class="list" style="display:flex;flex-direction:${styleObject.flexDirection};height:100%">
        <div
          class="selectItem"
          style="width:${styleObject.width};cursor:pointer;line-height:${this
            .lineHeight}px;text-align:center;display:${styleObject.display};flex-direction: ${styleObject.itemFlexDirection};margin-right:${this
            .marginRight}px;margin-top:${this.marginTop}px;margin-bottom:${this.marginBottom}px;margin-left:${this
            .marginLeft};
        border-right:${styleObject.borderRight};border-bottom:${styleObject.borderBottom}"
          @click=${this.handleSelect}
        >
          <slot name="selectItem" @slotchange=${this.handleItemSlotchange}></slot>
        </div>
        <div class="content" style="width:100%;height:100%;z-index:999;">
          <slot @slotchange=${this.handleSlotchange} name="active"></slot>
        </div>
      </div>
    `;
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        get iovSchema() {
          return {
            get componentName() {
              return "q-tab";
            },
            get type() {
              return EComponentType.CONTAINER;
            },
            get text() {
              return "选项卡容器";
            },
            get group() {
              return [EComponentGroup.BASIC];
            },
            get image() {
              return "";
            },
            get description() {
              return "选项卡容器,可以容纳其它组件";
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
                  text: {
                    type: "string",
                    description: "组件文本数据",
                  },
                },
              },
            },
          };
        },
        _onMessageMeta: {
          changeInfo: [
            function (e: IMessage) {
              console.log(e, self);
            },
          ],
        },
        _onDOMEvent: {
          onclick: [
            function (e: Event) {
              console.log(e);
            },
          ],
        },
        _initStyle: "height:150px;width:150px;",
        _onWatchSetting: {
          prop: [
            function (newVal: any, oldVal: any, context: any) {
              console.log(newVal, oldVal, context);
            },
          ],
          text: [
            function (newVal: any, oldVal: any, context: any) {
              console.log(newVal, oldVal, context);
            },
          ],
          text2: [
            function (newVal: any, oldVal: any, context: any) {
              console.log(newVal, oldVal, context);
            },
          ],
          onDOMEvent: [
            function (newVal: any, oldVal: any, context: any) {
              console.log(newVal, oldVal, context, "onDOMEvent");
            },
          ],
        },
      } as unknown as ISchema,
    });
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "q-tab": QTab;
  }
}

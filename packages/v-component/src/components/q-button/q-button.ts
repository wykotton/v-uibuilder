import { customHasElement } from "../../types/runtime/decorators/decorators";
import { css, html, svg, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { isBoolean, isEqual } from "lodash-es";
import { extractClass } from "../../common";
import { Component } from "../../types/runtime/Component";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { DOMEmit } from "../../util/reactivity/Emit";
import { booleanTransform } from "../../util/utils";
import cssIndex from "./index.scss?inline";
type QButtonType = "primary" | "success" | "warning" | "danger" | "info" | "text";
type NativeType = "button" | "submit" | "reset";
type UISize = "medium" | "small" | "mini";

@customHasElement("q-button")
export class QButton extends Component {
  componentModel!: ComponentModel;
  constructor() {
    super();
    this.initModel();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];

  //按钮类型
  @property({ type: String, attribute: "type" })
  public type: QButtonType = "primary";

  // 按钮大小
  @property({ type: String, attribute: "size" })
  public size: UISize = "mini";

  // 按钮plain
  @property({ type: Boolean })
  public plain!: boolean;

  // 按钮圆角
  @property({ type: Boolean })
  public round!: boolean;

  // 按钮circle
  @property({ type: Boolean })
  public circle!: boolean;

  // 按钮加载
  @property({ type: Boolean })
  public loading!: boolean;

  // 按钮可选中
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public disabled = false;

  // 按钮图标
  @property({ type: String })
  public icon = "";

  // 按钮原生类型
  @property({ type: String })
  public nativeType!: NativeType;

  // 按钮文字
  @property({ type: String })
  public text = "";

  // 按钮背景色
  @property({ type: String })
  public background = "";

  public btnClick(e: Event) {
    e?.stopPropagation?.();
    if (this.disabled) return;
    DOMEmit(this, "click", { detail: { e, text: this.text } });
    this.onSendMessage("click", this.text);
  }

  public render() {
    return html`
      <button
        ?disabled=${this.disabled}
        class=${extractClass(
          {},
          {
            "is-plain": this.plain,
            "is-round": this.round,
            "is-circle": this.circle,
            "is-disabled": this.disabled,
          },
          "q-button"
        )}
        style=${this.background ? "background-color: " + this.background + ";border-color: " + this.background : void 0}
        @click=${(e: Event) => {
          this.btnClick(e);
        }}
        type=${this.nativeType}
      >
        ${this.loading && [
          svg`<svg
          class="loading"
          viewBox="0 0 1024 1024"
          focusable="false"
          data-icon="loading"
          width="1em"
          height="1em"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z" />
        </svg>`,
          " ",
        ]}
        <slot name="leftIcon">${this.icon && unsafeSVG(this.icon)}</slot>
        ${this.text
          ? unsafeHTML(this.text)
          : html`
              <slot></slot>
            `}
      </button>
    `;
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-button";
          },
          get type() {
            return EComponentType.TEXT;
          },
          get text() {
            return "按钮";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "点击事件";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "触发按钮点击事件",
                eventType: "clickTrigger",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "组件点击数据",
                eventType: "click",
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
                text: {
                  type: "string",
                  description: "按钮显示文字",
                },
                icon: {
                  type: "string",
                  description: "按钮图标,请使用SVG图像",
                },
                disabled: {
                  type: "boolean",
                  description: "是否禁用",
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
          clickTrigger: [
            function (e: IMessage) {
              // @ts-ignore
              this.btnClick(e);
            },
          ],
          click: [
            function (e: IMessage) {
              // @ts-ignore
              typeof e.body === "string" && (this.value = e.body);
            },
          ],
        },
        _onDOMEvent: {
          click: [
            function (e: Event) {
              console.log(e);
            },
          ],
          dblclick: [
            function (e: Event) {
              console.log(e, "dblclick");
            },
          ],
        },
        _initStyle: "height:32px;width:78px;background-color: #1994ed;color:#fff;",
        _onWatchSetting: {
          value: [function (newVal: any, oldVal: any, context: any) {}],
        },
        _lifeCycle: {
          created: function () {},
          updated: function () {},
          destroy: function () {},
        },
        get type() {
          return self.type;
        },
        set type(value) {
          if (value === self.type) {
            return;
          }
          self.type = value;
        },
        get size() {
          return self.size;
        },
        set size(value) {
          if (value === self.size) {
            return;
          }
          self.size = value;
        },
        get plain() {
          return self.plain;
        },
        set plain(value) {
          if (value === self.plain) {
            return;
          }
          self.plain = value;
        },
        get round() {
          return self.round;
        },
        set round(value) {
          if (value === self.round) {
            return;
          }
          self.round = value;
        },
        get circle() {
          return self.circle;
        },
        set circle(value) {
          if (value === self.circle) {
            return;
          }
          self.circle = value;
        },
        get loading() {
          return self.loading;
        },
        set loading(value) {
          if (isBoolean(value) && value === self.loading) {
            return;
          }
          self.loading = value;
        },
        get disabled() {
          return self.disabled;
        },
        set disabled(value) {
          if (value === self.disabled) {
            return;
          }
          self.disabled = value;
        },
        get icon() {
          return self.icon;
        },
        set icon(value) {
          if (value === self.icon) {
            return;
          }
          self.icon = value;
        },
        get nativeType() {
          return self.nativeType;
        },
        set nativeType(value) {
          if (value === self.nativeType) {
            return;
          }
          self.nativeType = value;
        },
        get text() {
          return self.text;
        },
        set text(value) {
          if (value === self.text) {
            return;
          }
          self.text = value;
        },
      } as unknown as ISchema,
    });
  }

  onSendMessage(type: string, value: any) {
    const message: IMessage = {
      header: {
        src: this.id,
        dst: "",
        srcType: type,
        dstType: "",
      },
      body: value,
    };
    this.componentModel.sendMessage(message);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-button": QButton;
  }
}

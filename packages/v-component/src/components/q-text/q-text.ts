import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { changeProperty, DOMEmit } from "../../types/runtime/decorators/decorators";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import cssIndex from "./index.scss?inline";

/**
 * 文本组件
 *
 */
@customElement("q-text")
export class QText extends LitElement {
  static styles = css`
    ${unsafeCSS(cssIndex)}
  `;
  /**
   * 绑定data数据
   */
  @changeProperty()
  @property({ type: String, attribute: "text" })
  text = "文本数据1";
  @property({ type: String, attribute: "text2" })
  text2 = { a: 123 };

  lineClamp = 1;

  testDeepWatch = {
    data: {
      data2: {
        data3: {
          data4: "1111",
        },
        test: "1111",
      },
      test: "1111",
    },
  };

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;
  constructor() {
    super();
    this.initModel();
  }
  @DOMEmit("test-click")
  testClick() {
    return { test: 123123 };
  }

  render() {
    return html`
      <p 
        @click=${this.clickFont}
        @dblclick=${this.clickFont}
        style="-webkit-line-clamp:${this.lineClamp};"
      >
        ${this.text
          ? unsafeHTML(this.text)
          : html`
              <slot></slot>
            `}
      </p>
    `;
  }

  clickFont(e: Event) {
    const message: IMessage = {
      header: {
        src: this.id,
        dst: "",
        srcType: e.type,
        dstType: "",
      },
      body: this.text,
    };
    this.componentModel.sendMessage(message);
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-text";
          },
          get type() {
            return EComponentType.TEXT;
          },
          get text() {
            return "文本组件";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "文本组件,可以编写文字信息";
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
                text: {
                  type: "string",
                  description: "组件文本数据",
                },
                lineClamp: {
                  type: "number",
                  description: "展示行数",
                  minimum: 0,
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
              // @ts-ignore
              this.text = typeof e.body !== "string" ? JSON.stringify(e.body) : e.body;
              // @ts-ignore
              return this.text;
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
        _initStyle: "height:150px;width:150px;overflow:hidden",
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
          onDOMEvent: [
            function (newVal: any, oldVal: any, context: any) {
              console.log(newVal, oldVal, context, "onDOMEvent");
            },
          ],
          testDeepWatch: [
            function (newVal: any, oldVal: any, context: any) {
              console.log(newVal, oldVal, context, "testDeepWatch");
            },
          ],
          "testDeepWatch.data": [
            function (newVal: any, oldVal: any, context: any) {
              console.log(newVal, oldVal, context, "testDeepWatch.data");
            },
          ],
          "testDeepWatch.data.data2": [
            function (newVal: any, oldVal: any, context: any) {
              console.log(newVal, oldVal, context, "testDeepWatch.data.data2");
            },
          ],
          "testDeepWatch.data.data2.data3": [
            function (newVal: any, oldVal: any, context: any) {
              console.log(newVal, oldVal, context, "testDeepWatch.data.data2.data3");
            },
          ],
          "testDeepWatch.data.data2.data3.data4": [
            function (newVal: any, oldVal: any, context: any) {
              console.log(newVal, oldVal, context, "testDeepWatch.data.data2.data3.data4");
            },
          ],
        },
        _lifeCycle: {
          created: function () {},
          updated: function () {},
          destroy: function () {},
        },
        get text() {
          return self.text;
        },
        set text(value) {
          if (String(value) === self.text) {
            return;
          }
          self.text = String(value);
        },
        get lineClamp() {
          return self.lineClamp;
        },
        set lineClamp(value) {
          if (value === self.lineClamp) {
            return;
          }
          self.lineClamp = value;
          self.requestUpdate();
        },
        get testDeepWatch() {
          return self.testDeepWatch;
        },
        set testDeepWatch(value) {
          if (isEqual(value, self.testDeepWatch)) {
            return;
          }
          self.testDeepWatch = value;
        },
        _eventInterception: {},
      } as unknown as ISchema,
    });
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "q-text": QText;
  }
}

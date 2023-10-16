import { css, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { isEqual } from "lodash-es";
import { Component } from "../../types/runtime/Component";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import "../q-button/q-button";
import "../q-container-mask/q-container-mask";
import cssIndex from "./index.scss?inline";

@customElement("q-scroll-box")
export class QScrollBox extends Component {
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
   * 数据模型
   */
  componentModel!: ComponentModel;

  public render() {
    return html`
      <div class="q-scroll-box">
        <div class="q-scroll-box-content">
          <slot id="q-scroll-box-slot" class="dropzone">
            <q-container-mask text="组件降落区"></q-container-mask>
          </slot>
        </div>
      </div>
    `;
  }

  initModel(): void {
    // const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-scroll-box";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "滚动盒子容器";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "滚动盒子容器组件,可以在固定宽高内使用滚动效果";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "获取表单数据",
                eventType: "getScrollBoxData",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "抛出表单数据",
                eventType: "throwScrollBoxData",
                messageSchema: "",
                messageDemo: "",
              },
            ],
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
        _onMessageMeta: {
          getFormData: [
            function (e: IMessage) {
              // @ts-ignore
              this.getFormData();
            },
          ],
          resetFormData: [
            function (e: IMessage) {
              // @ts-ignore
              this.resetFormData();
            },
          ],
          setFormData: [
            function (e: IMessage) {
              // @ts-ignore
              this.setFormData(e.body);
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
      } as unknown as ISchema,
    });
  }

  onSendMessage() {
    const message: IMessage = {
      header: {
        src: this.id,
        dst: "",
        srcType: "throwFormData",
        dstType: "",
      },
      body: null,
    };
    this.componentModel.sendMessage(message);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-scroll-box": QScrollBox;
  }
}

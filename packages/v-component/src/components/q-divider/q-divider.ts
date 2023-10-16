import { css, LitElement, unsafeCSS, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { cloneDeep, isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createApp, defineComponent, ref } from "vue";
import antdCss from "ant-design-vue/dist/antd.css?inline";
import cssIndex from "./index.scss?inline";
import { DividerProps, Divider } from "ant-design-vue";
import $ from "jquery";
import { booleanTransform } from "../../util/utils";
/**
 * 步骤条
 */
@customElement("q-divider")
export class QDivider extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
    css`
      ${unsafeCSS(antdCss)}
    `,
  ];

  @query(".vue-com-container")
  vueComWrapper!: HTMLDivElement;


  // 是否虚线
  @property({type: Boolean,  converter(value) {
      return booleanTransform(value);
    }})
  dashed: DividerProps["dashed"] = false;

  // 分割线标题的位置
  @property({type: String})
  orientation: DividerProps["orientation"] = "center";

  // 标题和最近 left/right 边框之间的距离，去除了分割线，同时 orientation 必须为 left 或 right
  @property({type: Number})
  orientationMargin: DividerProps["orientationMargin"] = 0;

  // 文字是否显示为普通正文样式
  @property({type: Boolean,  converter(value) {
      return booleanTransform(value);
    }})
  plain: DividerProps["plain"] = false;

  // 水平还是垂直类型
  @property({type: String})
  type: DividerProps["type"] = "horizontal";

 // 水平还是垂直类型
  @property({type: String})
  dividerStyle = "margin:0px;";

  // 分割线文字
  @property({type: String})
  text = "Text";

  /**
   * 组件实例
   */
  componentInstance: any = null;

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  constructor() {
    super();
    this.initModel();
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    if (!this.componentInstance && this.vueComWrapper) {
      this.createVueComponent();
    }
  }

  /**
   * 同步设置属性编辑器里属性
   * @param type
   * @param value
   */
  setWebcomponentData(type: string, value: any) {
    this[type] = value;
  }

  /**
   * 创建树VUE组件
   */
  createVueComponent = () => {
    const self = this;
    const component = defineComponent({
      template: `
        <a-divider :style="dividerStyle" :dashed="dashed" :orientation="orientation" :orientationMargin="orientationMargin" :plain="plain" :type="type">
        {{text}}
        </a-divider>
      `,
      name: "q-affix",
      props: {},
      components: {},
      setup(props: any, context: any) {
        const id = ref(self.id);
        const dashed = ref(self.dashed);
        const orientation = ref(self.orientation);
        const orientationMargin = ref(self.orientationMargin);
        const plain = ref(self.plain);
        const dividerStyle = ref(self.dividerStyle);
        const text = ref(self.text);
        const type = ref(self.type);

        /**
         * 监听timeline属性变更
         */
        function watchAttributeChange(type: string, value: any) {
          console.log("触发更新");
          // @ts-ignore
          this[type] = value;
        }

        return {
          props,
          dashed,
          text,
          type,
          id,
          orientation,
          orientationMargin,
          plain,
          dividerStyle,
          watchAttributeChange,
        };
      },
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(Divider);
    this.componentInstance.mount(this.vueComWrapper);
  };

  /**
   * 数据路由
   * @param type
   * @param value
   */
  onSendMessage(type: string, value: any): void {
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

  /**
   * 更新vue组件实例数据
   * @param type
   * @param value
   */
  setVueComponentData(type: string, value: any) {
    if (this.componentInstance && this.componentInstance?._instance?.proxy?.watchAttributeChange) {
      this.componentInstance._instance.proxy.watchAttributeChange(type, value);
    }
  }

  render() {
    return html`
      <div class="vue-com-container" style="width: 100%;height:100%;display: flex;justify-content: center;align-items: center;"></div>
    `;
  }

  anchorTrigger(el: string) {
    $(this.shadowRoot as any)
      .find("[href]")
      .each((i, it) => {
        it.getAttribute("href") === `#${el}` && $(it).trigger("click");
      });
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-divider";
          },
          get type() {
            return EComponentType.TEXT;
          },
          get text() {
            return "分割线";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "区隔内容的分割线。";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {
            inputMessage: [

            ],
            outputMessage: [

            ],
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                dashed: {
                  description: "是否虚线",
                  type: "boolean",
                },
                text: {
                  description: "分割线文字",
                  type: "string",
                },
                orientation: {
                  description: "分割线标题的位置",
                  type: "string",
                  enum: [{value: "left",label: "左"},{value: "right",label: "右"},{value: "center",label: "中"}]
                },
                orientationMargin: {
                  description: "标题和最近 left/right 边框之间的距离，去除了分割线，同时 orientation 必须为 left 或 right",
                  type: "string",
                },
                plain: {
                  description: "文字是否显示为普通正文样式",
                  type: "boolean",
                },
                type: {
                  description: "水平还是垂直类型",
                  type: "string",
                  enum: [{value: "horizontal",label: "水平"},{value: "vertical",label: "垂直"}]
                },
                dividerStyle: {
                  description: "分割线样式",
                  type: "string",
                  format: "style"
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
        _initStyle: "height:100px;width:100px;overflow:auto;background-color: #FFFFFF",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function () {},
          updated: function () {},
          destroy: function () {},
        },
        _eventInterception: {},
        get dashed() {
          return self.dashed;
        },
        set dashed(value) {
          if (value !== self.dashed) {
            self.dashed = value;
            self.setVueComponentData("dashed", cloneDeep(value));
          }
          self.dashed = value;
          self.setVueComponentData("dashed", self.dashed);
        },
        get orientation() {
          return self.orientation;
        },
        set orientation(value) {
          if (value !== self.orientation) {
            self.orientation = value;
            self.setVueComponentData("orientation", cloneDeep(value));
          }
          self.orientation = value;
          self.setVueComponentData("orientation", self.orientation);
        },
        get orientationMargin() {
          return self.orientationMargin;
        },
        set orientationMargin(value) {
          if (value !== self.orientationMargin) {
            self.orientationMargin = value;
            self.setVueComponentData("orientationMargin", cloneDeep(value));
          }
        },
        get plain() {
          return self.plain;
        },
        set plain(value) {
          if (value !== self.plain) {
            self.plain = value;
            self.setVueComponentData("plain", cloneDeep(value));
          }
        },
        get type() {
          return self.type;
        },
        set type(value) {
          if (value !== self.type) {
            self.type = value;
            self.setVueComponentData("type", cloneDeep(value));
          }
        },
        get dividerStyle() {
          return self.dividerStyle;
        },
        set dividerStyle(value) {
          if (value !== self.dividerStyle) {
            self.dividerStyle = value;
            self.setVueComponentData("dividerStyle", cloneDeep(value));
          }
        },
        get text() {
          return self.text;
        },
        set text(value) {
          if (value !== self.text) {
            self.text = value;
            self.setVueComponentData("text", cloneDeep(value));
          }
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-divider": QDivider;
  }
}

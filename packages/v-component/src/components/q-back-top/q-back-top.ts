import { css, LitElement, unsafeCSS, html, PropertyValues} from "lit";
import { customElement, query, property } from "lit/decorators.js";
import { cloneDeep, isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createApp, defineComponent, ref, watch} from "vue";
import { BackTop } from "ant-design-vue";
import antdCss from "ant-design-vue/dist/antd.css?inline";
import cssIndex from "./index.scss?inline";
import { changeProperty } from "../../types/runtime/decorators/decorators";
/**
 * 步骤条
 */
@customElement("q-back-top")
export class QBackTop extends LitElement {
  static styles = [css`
    ${unsafeCSS(cssIndex)}
  `,
    css`
      ${unsafeCSS(antdCss)}
    `];

  @query(".vue-com-container")
  vueComWrapper!: HTMLDivElement;

  // DOM 元素的函数
  @changeProperty()
  @property({ type: String })
  target = ".auto-size-inner-dropzone"

  @property({ type: String })
  styleMapping = ""

  // 按钮内|部样式
  backTopSlot = "<svg t=\"1673859965372\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2662\" width=\"16\" height=\"16\"><path d=\"M838.116 732.779 877.7 693.195 511.979 327.549 146.3 693.195 185.883 732.779 512.003 406.652Z\" p-id=\"2663\" fill=\"#ffffff\"></path></svg>"


  @property({ type: Number })
  // 滚动条出现值
  visibilityHeight = 50;

  // 左右位置
  @property({ type: String })
  leftOrRight = "left"

  @property({ type: Number })
  // 偏移大小
  aroundSize = 100
  @property({ type: Number })
  // 底部偏移大小
  bottomSize = 100
  @property({ type: String })
  backTopStyle = "height: 100%; width: 100%;line-height: 40px;border-radius: 4px;background-color: #1088e9;color: #fff;text-align: center;font-size: 20px;"


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
    this.createVueComponent();
  }

  /**
   * 同步设置属性编辑器里属性
   * @param type
   * @param value
   */
  setWebcomponentData(type: string, value: any) {
    this[type] = value;
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    super.attributeChangedCallback(name, _old, value);
    // 同步更新到 vue组件内
    this.setVueComponentData(name, this[name])
  }

  /**
   * 创建树VUE组件
   */
  createVueComponent = () => {
    const self = this;
    const component = defineComponent({
      template: `
        <a-back-top :visibilityHeight="visibilityHeight" :target="tempTarget" :style="styleMapping" @click="backTopClick">
          <div class="ant-back-top-inner" :style="backTopStyle" v-html="backTopSlot"></div>
        </a-back-top>
      `,
      name: "q-back-top",
      props: {},
      components: {},
      setup(props: any, context: any) {

        const visibilityHeight = ref(self.visibilityHeight);
        const backTopSlot = ref(self.backTopSlot);
        const backTopStyle = ref(self.backTopStyle);
        const bottomSize = ref(self.bottomSize);
        const aroundSize = ref(self.aroundSize);
        const leftOrRight = ref(self.leftOrRight);
        const styleMapping = ref(self.styleMapping)
        const target = ref(self.target)
        const tempTarget = ref(() => {})
        watch(target,(v: any) => {
          try {
            if(!v) return
            document.querySelector(v)
            tempTarget.value = () => document.querySelector(v)
            console.log(v);
          }catch (e) {
            console.error("请输入正确的选择器")
          }

        },{immediate: true,deep: true})

        /**
         * 监听timeline属性变更
         */
        function watchAttributeChange(type: string, value: any) {
          console.log("触发更新");
          // @ts-ignore
          this[type] = value;
        }

        function backTopClick() {
          self.onSendMessage("click", "")
        }


        return {
          props,
          tempTarget,
          target,
          backTopSlot,
          backTopStyle,
          styleMapping,
          visibilityHeight,
          bottomSize,
          aroundSize,
          leftOrRight,
          backTopClick,
          watchAttributeChange
        };
      }
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(BackTop);
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
        dstType: ""
      },
      body: value
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

  protected async firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    await this.updateComplete
    this.setBackTopStyle(this.style.cssText)
  }

  setBackTopStyle(style: any) {
    const div = document.createElement("div")
    div.style.cssText = style
    div.style.setProperty("left", "0")
    div.style.setProperty("top", "0")
    this.styleMapping = div.style.cssText
    this.setVueComponentData("styleMapping",  div.style.cssText)
  }


  render() {
    return html`
      <div class="vue-com-container" style="position: relative;width: 100%;height: 100%"></div>
    `;
  }


  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-back-top";
          },
          get type() {
            return EComponentType.TEXT;
          },
          get text() {
            return "回到顶部";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "返回页面顶部的操作按钮。。";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {
            inputMessage: [

            ],
            outputMessage: [
              {
                text: "点击事件",
                eventType: "click",
                messageSchema: "",
                messageDemo: ""
              }
            ]
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                target: {
                  type: "string",
                  description: "监听滚动事件的元素",
                },
                backTopSlot: {
                  type: "string",
                  description: "按钮内容",
                  format: "code"
                },
                visibilityHeight: {
                  type: "number",
                  description: "出现该按钮的高度",
                  minimum: 0
                },
                // leftOrRight: {
                //   type: "string",
                //   description: "按钮位置",
                //   enum: [{value: "left", label: "左"},{value: "right", label: "右"}]
                // },
                // aroundSize: {
                //   type: "number",
                //   description: "左/右偏移距离",
                //   minimum: 0
                // },
                // bottomSize: {
                //   type: "number",
                //   description: "底部偏移距离",
                //   minimum: 0
                // },
                backTopStyle: {
                  type: "string",
                  description: "内|部样式",
                  format: "style"
                },

              }
            }
          }
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
          setStepsCurrent: [
            function(e: IMessage) {
              // @ts-ignore
              this.updateStepsCurrent("set", e.body);
            }
          ],
          setStepsData: [
            function(e: IMessage) {
              // @ts-ignore
              this.setStepsData(e.body);
            }
          ],
          stepsNext: [
            function(e: IMessage) {
              // @ts-ignore
              this.updateStepsCurrent("next", e.body);
            }
          ],
          stepsPrevious: [
            function(e: IMessage) {
              // @ts-ignore
              this.updateStepsCurrent("previous", e.body);
            }
          ],
          updateStepsStatus: [
            function(e: IMessage) {
              // @ts-ignore
              this.updateStepsStatus(e.body);
            }
          ]
        },
        _onDOMEvent: {
          click: [
            function(e: Event) {
              console.log(e);
            }
          ],
          dblclick: [
            function(e: Event) {
              console.log(e, "dblclick");
            }
          ]
        },
        _initStyle: "height:50px;width:50px;overflow:auto",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function() {
          },
          updated: function() {
          },
          destroy: function() {
          }
        },
        _eventInterception: {},
        get target() {
          return self.target;
        },
        set target(value) {
          if (value !== self.target) {
            self.target = value;
            self.setVueComponentData("target", cloneDeep(value));
          }
        },
        get leftOrRight() {
          return self.leftOrRight;
        },
        set leftOrRight(value) {
          if (value !== self.leftOrRight) {
            self.leftOrRight = value;
            self.setVueComponentData("leftOrRight", cloneDeep(value));
          }
        },
        get aroundSize() {
          return self.aroundSize;
        },
        set aroundSize(value) {
          if (value !== self.aroundSize) {
            self.aroundSize = value;
            self.setVueComponentData("aroundSize", cloneDeep(value));
          }
        },
        get bottomSize() {
          return self.bottomSize;
        },
        set bottomSize(value) {
          if (value !== self.bottomSize) {
            self.bottomSize = value;
            self.setVueComponentData("bottomSize", cloneDeep(value));
          }
        },
        get backTopStyle() {
          return self.backTopStyle;
        },
        set backTopStyle(value) {
          if (value !== self.backTopStyle) {
            self.setVueComponentData("backTopStyle", cloneDeep(value));
            self.backTopStyle = value;
          }
        },
        get backTopSlot() {
          return self.backTopSlot;
        },
        set backTopSlot(value) {
          if (value !== self.backTopSlot) {
            self.setVueComponentData("backTopSlot", cloneDeep(value));
            self.backTopSlot = value;
          }
        },
        get visibilityHeight() {
          return self.visibilityHeight;
        },
        set visibilityHeight(value) {
          if (value !== self.visibilityHeight) {
            self.setVueComponentData("visibilityHeight", value);
            self.visibilityHeight = value;
          }
        },
        get initStyle() {
          // @ts-ignore
          return this._initStyle;
        },
        set initStyle(value) {

          // @ts-ignore
          this._initStyle = value;
          self.setBackTopStyle(self.style.cssText)
          self.style.cssText = value;
        }
      } as unknown as ISchema
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-back-top": QBackTop;
  }
}

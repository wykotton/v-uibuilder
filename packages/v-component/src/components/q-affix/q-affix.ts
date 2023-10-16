import { css, LitElement, unsafeCSS, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { cloneDeep, isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createApp, defineComponent, ref, onMounted, nextTick, watch } from "vue";
import antdCss from "ant-design-vue/dist/antd.css?inline";
import cssIndex from "./index.scss?inline";
import { Affix, AffixProps} from "ant-design-vue";
import $ from "jquery";
/**
 * 步骤条
 */
@customElement("q-affix")
export class QAffix extends LitElement {
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


  // 固定模式
  @property()
  affixOffsetBottom: AffixProps["offsetBottom"] = 0;

  // 锚点区域边界
  @property({type: Number, attribute: "affix-offset-top"})
  affixOffsetTop = 40;

  // 滚动区容器
  @property()
  target = ".auto-size-inner-dropzone";

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
          <a-affix :target="tempTarget" :offsetTop="affixOffsetTop" :offsetBottom="affixOffsetBottom" >
            <div :id="id + '-slot-wrapper'" style="position: relative; width: 100%; height: 100%;"></div>
          </a-affix>
      `,
      name: "q-affix",
      props: {},
      components: {},
      setup(props: any, context: any) {
        const id = ref(self.id);
        const affixOffsetBottom = ref(self.affixOffsetBottom);
        const affixOffsetTop = ref(self.affixOffsetTop);

        const target = ref(self.target);
        const tempTarget = ref(() => {})
        watch(target,(v: any) => {
          try {
            document.querySelector(v)
            tempTarget.value = () => document.querySelector(v)
            console.log(v);
          }catch (e) {
            console.error("请输入正确的选择器")
          }

        },{immediate: true,deep: true})
        onMounted(async () => {
          await nextTick()
          $(self.shadowRoot?.querySelector(`#${id.value}-slot-wrapper`) as any).append(
            `
            <slot class="dropzone"  id="${id.value}-slot" style=" width: 100%; height: 100%;display: block;">
               <q-container-mask text="组件降落区" ></q-container-mask>
            </slot>
            `
          );
        });

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
          affixOffsetBottom,
          id,
          affixOffsetTop,
          target,
          tempTarget,
          watchAttributeChange,
        };
      },
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(Affix);
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
      <style>
        .vue-com-container > div, .vue-com-container > div > div {
          height: 100%;
        }
      </style>
      <div class="vue-com-container"  style="width: 100%; height: 100%;">
      </div>
    `;
  }



  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-affix";
          },
          get type() {
            return EComponentType.TEXT;
          },
          get text() {
            return "固钉";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "用于跳转到页面指定位置。";
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
                target: {
                  description: "设置 Affix 需要监听其滚动事件的元素",
                  type: "string",
                },
                offsetBottom: {
                  description: "距离窗口底部达到指定偏移量后触发",
                  type: "number",
                  minimum: 0
                },
                affixOffsetTop: {
                  description: "距离窗口顶部达到指定偏移量后触发",
                  type: "number",
                  minimum: 0
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
          trigger: [
            function (e: IMessage) {
              // @ts-ignore
              this.anchorTrigger(e.body);
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
        _initStyle: "height:100px;width:200px;overflow:auto",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function () {},
          updated: function () {},
          destroy: function () {},
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
          self.target = value;
          self.setVueComponentData("target", self.target);
        },
        get affixOffsetBottom() {
          return self.affixOffsetBottom;
        },
        set affixOffsetBottom(value) {
          if (value !== self.affixOffsetBottom) {
            self.affixOffsetBottom = value;
            self.setVueComponentData("affixOffsetBottom", cloneDeep(value));
          }
          self.affixOffsetBottom = value;
          self.setVueComponentData("affixOffsetBottom", self.affixOffsetBottom);
        },
        get affixOffsetTop() {
          return self.affixOffsetTop;
        },
        set affixOffsetTop(value) {
          if (value !== self.affixOffsetTop) {
            self.affixOffsetTop = value;
            self.setVueComponentData("affixOffsetTop", cloneDeep(value));
          }
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-affix": QAffix;
  }
}

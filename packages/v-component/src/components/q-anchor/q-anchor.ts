import { css, LitElement, unsafeCSS, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { cloneDeep, isArray, isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createApp, defineComponent, ref, watch } from "vue";
import antdCss from "ant-design-vue/dist/antd.css?inline";
import cssIndex from "./index.scss?inline";
import { Anchor, AnchorLink } from "ant-design-vue";
import $ from "jquery";
import { booleanTransform } from "../../util/utils";
/**
 * 步骤条
 */
@customElement("q-anchor")
export class QAnchor extends LitElement {
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

  @property()
  anchorData = [
    { href: `${this.id}`, title: "锚点1", target: "" },
    { href: `${this.id + 1}`, title: "锚点2", target: "" },
  ];

  // 固定模式
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  affix = true;

  // 锚点区域边界
  @property()
  bounds = 5;

  // 滚动区容器
  @property()
  getContainer = ".auto-size-inner-dropzone";

  // 自定义高亮锚点
  @property()
  getCurrentAnchor = () => String;

  // 距离窗口底部达到指定偏移量后触发
  @property()
  anchorOffsetBottom = 0;

  @property()
  anchorOffsetTop = 0;

  // :affix="false" 时是否显示小圆点
  @property()
  showInkInFixed = false;

  // 锚点滚动偏移量，默认与 offsetTop 相同
  @property()
  targetOffset = window.innerHeight / 2;

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
      // :bounds="bounds"
      // :getContainer="() => getContainer()"
      // :getCurrentAnchor="getCurrentAnchor"
      // :offsetBottom="offsetBottom"
      // :showInkInFixed="showInkInFixed"
      // :targetOffset="targetOffset"
      template: `
        <a-anchor @click="handleAnchorClick" :affix="affix" :getContainer="() => this.getContainerFun()" @change="handleAnchorChange" :offset-bottom="anchorOffsetBottom" :offset-top="anchorOffsetTop">
        <a-anchor-link v-for="(anc,a) in anchorData" :key="a" :title="anc.title" :href="'#' + anc.href" :target="anc.target"  />
        </a-anchor>
      `,
      name: "q-skeleton",
      props: {},
      components: {},
      setup(props: any, context: any) {
        const anchorData = ref(self.anchorData);
        const affix = ref(self.affix);
        const bounds = ref(self.bounds);
        const getContainer = ref(self.getContainer);
        const getCurrentAnchor = ref(self.getCurrentAnchor);
        const anchorOffsetBottom = ref(self.anchorOffsetBottom);
        const anchorOffsetTop = ref(self.anchorOffsetTop);
        const showInkInFixed = ref(self.showInkInFixed);
        const targetOffset = ref(self.targetOffset);
        const getContainerFun = ref(() => {})
        watch(getContainer,(v: any) => {
          try {
            if(!v) return
            document.querySelector(v)
            getContainerFun.value = () => document.querySelector(v)
            console.log(v);
          }catch (e) {
            console.error("请输入正确的选择器")
          }

        },{immediate: true,deep: true})
        function handleAnchorClick(e: Event, link: any) {
          e.preventDefault();
          const { target } = e.target as any;
          if (target) {
            window.open((e.target as any).target);
          }
          self.onSendMessage("click", link);
        }

        function handleAnchorChange(currentActiveLink: string) {
          self.onSendMessage("change", { href: currentActiveLink });
        }

        // watch(percent, (v) => {
        //   self.onSendMessage("change", v)
        // })
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
          anchorData,
          affix,
          bounds,
          getContainer,
          getCurrentAnchor,
          anchorOffsetBottom,
          anchorOffsetTop,
          showInkInFixed,
          targetOffset,
          getContainerFun,
          handleAnchorClick,
          handleAnchorChange,
          watchAttributeChange,
        };
      },
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(Anchor);
    this.componentInstance.use(AnchorLink);
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
      <div class="vue-com-container" style="width: 100%;height:100%;padding: 10px"></div>
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
            return "q-anchor";
          },
          get type() {
            return EComponentType.TEXT;
          },
          get text() {
            return "锚点";
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
              {
                text: "锚点触发",
                eventType: "trigger",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "锚点点击",
                eventType: "click",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "锚点变更",
                eventType: "change",
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
                anchorData: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: {
                        description: "显示标题",
                        type: "string",
                      },
                      href: {
                        description: "锚点ID",
                        type: "string",
                      },
                      target: {
                        description: "跳转地址",
                        type: "string",
                      },
                    },
                  },
                  description: "锚点数据",
                },
                getContainer: {
                  description: "滚动容器",
                  type: "string",
                },
                affix: {
                  description: "固定模式",
                  type: "boolean",
                },
                showInkInFixed: {
                  description: "是否显示小圆点",
                  type: "boolean",
                },
                bounds: {
                  description: "锚点区域边界",
                  type: "number",
                  minimum: 0
                },
                anchorOffsetBottom: {
                  description: "距离窗口底部达到指定偏移量后触发",
                  type: "number",
                  minimum: 0
                },
                anchorOffsetTop: {
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
        get anchorData() {
          return self.anchorData;
        },
        set anchorData(value) {
          if (!isArray(value) || isEqual(value, self.anchorData)) {
            self.setVueComponentData("anchorData", self.anchorData);
            return;
          }
          self.anchorData = value;
          self.setVueComponentData("anchorData", self.anchorData);
        },
        get getContainer() {
          return self.getContainer;
        },
        set getContainer(value) {
          if (value !== self.getContainer) {
            self.getContainer = value;
            self.setVueComponentData("getContainer", cloneDeep(value));
          }
        },
        get affix() {
          return self.affix;
        },
        set affix(value) {
          if (value !== self.affix) {
            self.affix = value;
            self.setVueComponentData("affix", cloneDeep(value));
          }
        },
        get showInkInFixed() {
          return self.showInkInFixed;
        },
        set showInkInFixed(value) {
          if (value !== self.showInkInFixed) {
            self.showInkInFixed = value;
            self.setVueComponentData("showInkInFixed", cloneDeep(value));
          }
        },
        get bounds() {
          return self.bounds;
        },
        set bounds(value) {
          if (value !== self.bounds) {
            self.bounds = value;
            self.setVueComponentData("bounds", cloneDeep(value));
          }
        },
        get anchorOffsetBottom() {
          return self.anchorOffsetBottom;
        },
        set anchorOffsetBottom(value) {
          if (value !== self.anchorOffsetBottom) {
            self.anchorOffsetBottom = value;
            self.setVueComponentData("anchorOffsetBottom", cloneDeep(value));
          }
        },
        get anchorOffsetTop() {
          return self.anchorOffsetTop;
        },
        set anchorOffsetTop(value) {
          if (value !== self.anchorOffsetTop) {
            self.anchorOffsetTop = value;
            self.setVueComponentData("anchorOffsetTop", cloneDeep(value));
          }
        }
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-anchor": QAnchor;
  }
}

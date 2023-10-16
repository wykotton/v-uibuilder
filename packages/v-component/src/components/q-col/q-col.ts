import { css, LitElement, unsafeCSS, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createApp, defineComponent, onMounted, ref, nextTick } from "vue";
import antdCss from "ant-design-vue/dist/antd.css?inline";
import cssIndex from "./index.scss?inline";
import { Col, ColProps } from "ant-design-vue";
import $ from "jquery";
import { changeProperty } from "../../types/runtime/decorators/decorators";
import { containerPropsIgnore } from "../../util/utils";
import { ColSize } from "ant-design-vue/lib/grid/Col";

/**
 * 步骤条
 */
@customElement("q-col")
export class QCol extends LitElement {
  static styles = [css`
    ${unsafeCSS(cssIndex)}
  `,
    css`
      ${unsafeCSS(antdCss)}
    `];

  @query(".vue-com-container")
  vueComWrapper!: HTMLDivElement;

  // flex 布局填充
  @changeProperty()
  @property({ type: String })
  flex: ColProps["flex"] = "";

  // 栅格左侧的间隔格数，间隔内不可以有栅格
  @property({ type: Number })
  offset: ColProps["offset"] = 0;


  // 栅格顺序 flex 布局模式下有效
  @property({ type: Number })
  order: ColProps["order"] = 0;

  // 栅格向左移动格数
  @property({ type: Number })
  pull: ColProps["pull"] = 0;

  // 栅格向右移动格数
  @property({ type: Number })
  push: ColProps["push"] = 0;

  // 栅格占位格数，为 0 时相当于 display: none
  @property({ type: Number })
  span: ColProps["span"] = 8;

  // ≥2000px 响应式栅格，可为栅格数或一个包含其他属性的对象
  @property({ type: Number })

  xxxl!: string | number | ColSize

  // <576px 响应式栅格，可为栅格数或一个包含其他属性的对象
  @property({ type: Number })

  xs!: string | number | ColSize

  // ≥576px 响应式栅格，可为栅格数或一个包含其他属性的对象
  @property({ type: Number })

  sm!: string | number | ColSize

  // ≥768px 响应式栅格，可为栅格数或一个包含其他属性的对象
  @property({ type: Number })

  md!: string | number | ColSize

  // ≥992px 响应式栅格，可为栅格数或一个包含其他属性的对象
  @property({ type: Number })

  lg!: string | number | ColSize

  // ≥1200px 响应式栅格，可为栅格数或一个包含其他属性的对象
  @property({ type: Number })

  xl!: string | number | ColSize

  // ≥1600px 响应式栅格，可为栅格数或一个包含其他属性的对象
  @property({ type: Number })

  xxl!: string | number | ColSize

  /**
   * 组件实例
   */
  componentInstance: any = null;

  ob!: MutationObserver;

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  constructor() {
    super();
    this.initModel();
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    super.attributeChangedCallback(name, _old, value);
    this.setVueComponentData(name, this[name]);
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    this.createVueComponent();
    this.setClass()
    // 解决pull push偏移 背景色问题
    this.createStyleElement()
  }

  createStyleElement() {
    const noBgStyle = $(`#no-bg-style`);
    if (!noBgStyle.length) {
      $("head").append(`
      <style id="no-bg-style">
       .no-bg {
          background-color: transparent !important;
        }
      </style>
    `);

    }
  }

  // 设置class
  setClass() {
    // ant-col-offset-${this.offset}
    // ant-col-push-${this.push}
    // ant-col-pull-${this.pull}
    // ant-col
    const node = $(`#${this.id}`)
    const className = Array.from(node[0].classList).filter((it) => it !== "draggable2")
      node[0].classList.remove(...className)
      node[0].classList.add(...[
        "no-bg",
        `ant-col-${this.span}`,
        `ant-col-order-${this.order}`,
        `ant-col-xs-${this.xs}`,
        `ant-col-sm-${this.sm}`,
        `ant-col-md-${this.md}`,
        `ant-col-lg-${this.lg}`,
        `ant-col-xl-${this.xl}`,
        `ant-col-xxl-${this.xxl}`,
        `ant-col-xxxl-${this.xxxl}`
      ])



    if(this.flex){
      node.css("flex", `${this.flex} ${this.flex} auto`)
    }else {
      node.css("flex", "")
    }
  }

  createObserve() {
    this.ob = containerPropsIgnore(document.getElementById(this.id)!, ["position", "left", "top"], (mutationsList: MutationRecord[], observer: MutationObserver, el: HTMLElement) => {
      // console.log("弹力盒子MutationObserver");
      mutationsList.forEach((mutation) => {
        switch (mutation.type) {
          case "childList":
            break;
          case "attributes":

            break;
        }
      });
    });
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
        <a-col
          :flex="flex"
          :offset="offset"
          :order="order"
          :pull="pull"
          :push="push"
          :span="span"
          :xxxl="xxxl"
          :xs="xs"
          :sm="sm"
          :md="md"
          :lg="lg"
          :xl="xl"
          :xxl="xxl"
          style="height: 100%;position: relative;max-width: 100%;" 
          :id="id + '-col'">
        </a-col>
      `,
      name: "q-skeleton",
      props: {},
      components: {},
      setup(props: any, context: any) {
        const id = ref(self.id);
        const flex = ref(self.flex);
        const offset = ref(self.offset);
        const order = ref(self.order);
        const pull = ref(self.pull);
        const push = ref(self.push);
        const span = ref(self.span);
        const xxxl = ref(self.xxxl);
        const xs = ref(self.xs);
        const sm = ref(self.sm);
        const md = ref(self.md);
        const lg = ref(self.lg);
        const xl = ref(self.xl);
        const xxl = ref(self.xxl);


        onMounted(async () => {
          await nextTick();
          $(self.shadowRoot?.querySelector(`#${id.value}-col`) as any).append(
            `
            <slot class="dropzone"  id="${id.value}-slot">
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
          id,
          flex,
          offset,
          order,
          pull,
          push,
          span,
          xs,
          sm,
          md,
          lg,
          xl,
          xxl,
          xxxl,
          watchAttributeChange
        };
      }
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(Col);
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
    this.setClass()
  }

  render() {
    return html`
      <div class="vue-com-container" ></div>
    `;
  }

  anchorTrigger(el: string) {
    $(this.shadowRoot as any).find("[href]").each((i, it) => {
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
            return "q-col";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "col";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "布局工具";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {},
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                flex: {
                  type: "string",
                  description: "flex 布局填充"
                },
                offset: {
                  type: "number",
                  description: "栅格左侧的间隔格数",
                  minimum: 0
                },
                order: {
                  type: "number",
                  description: "栅格顺序，flex 布局模式下有效",
                  minimum: 0
                },
                pull: {
                  type: "number",
                  description: "栅格向左移动格数",
                  minimum: 0
                },
                push: {
                  type: "number",
                  description: "栅格向右移动格数",
                  minimum: 0
                },
                span: {
                  type: "number",
                  description: "栅格占位格数，为 0 时相当于 display: none",
                  minimum: 0
                },
                xxxl: {
                  type: "number",
                  description: "≥2000px 响应式栅格",
                  minimum: 0
                },
                xs: {
                  type: "number",
                  description: "<576px 响应式栅格",
                  minimum: 0
                },
                sm: {
                  type: "number",
                  description: "≥576px 响应式栅格",
                  minimum: 0
                },
                md: {
                  type: "number",
                  description: "≥768px 响应式栅格",
                  minimum: 0
                },
                lg: {
                  type: "number",
                  description: "≥992px 响应式栅格",
                  minimum: 0
                },
                xl: {
                  type: "number",
                  description: "≥1200px 响应式栅格",
                  minimum: 0
                },
                xxl: {
                  type: "number",
                  description: "≥1600px 响应式栅格",
                  minimum: 0
                }
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
        _onMessageMeta: {},
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
        publicAPI: {
          moveable: {}
        },
        _initStyle: "height:150px;overflow: hidden;max-width:unset",
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
        get flex() {
          return self.flex;
        },
        set flex(value) {
          if (value === self.flex) {
            return;
          }
          self.flex = value;
          // @ts-ignore
          self.setVueComponentData("flex", self.flex);
        },
        get offset() {
          return self.offset;
        },
        set offset(value) {
          if (value === self.offset) {
            return;
          }
          self.offset = value;
          self.setVueComponentData("offset", self.offset);
        },
        get order() {
          return self.order;
        },
        set order(value) {
          if (value === self.order) {
            return;
          }
          self.order = value;
          self.setVueComponentData("order", self.order);
        },
        get pull() {
          return self.pull;
        },
        set pull(value) {
          if (value === self.pull) {
            return;
          }
          self.pull = value;
          self.setVueComponentData("pull", self.pull);
        },
        get push() {
          return self.push;
        },
        set push(value) {
          if (value === self.push) {
            return;
          }
          self.push = value;
          self.setVueComponentData("push", self.push);
        },
        get span() {
          return self.span;
        },
        set span(value) {
          if (value === self.span) {
            return;
          }
          self.span = value;
          self.setVueComponentData("span", self.span);
        },
        get xxxl() {
          return self.xxxl;
        },
        set xxxl(value) {
          if (value === self.xxxl) {
            return;
          }
          self.xxxl = value;
          self.setVueComponentData("xxxl", self.xxxl);
        },
        get xs() {
          return self.xs;
        },
        set xs(value) {
          if (value === self.xs) {
            return;
          }
          self.xs = value;
          self.setVueComponentData("xs", self.xs);
        },
        get sm() {
          return self.sm;
        },
        set sm(value) {
          if (value === self.sm) {
            return;
          }
          self.sm = value;
          self.setVueComponentData("sm", self.sm);
        },
        get md() {
          return self.md;
        },
        set md(value) {
          if (value === self.md) {
            return;
          }
          self.md = value;
          self.setVueComponentData("md", self.md);
        },
        get lg() {
          return self.lg;
        },
        set lg(value) {
          if (value === self.lg) {
            return;
          }
          self.lg = value;
          self.setVueComponentData("lg", self.lg);
        },
        get xl() {
          return self.xl;
        },
        set xl(value) {
          if (value === self.xl) {
            return;
          }
          self.xl = value;
          self.setVueComponentData("xl", self.xl);
        },
        get xxl() {
          return self.xxl;
        },
        set xxl(value) {
          if (value === self.xxl) {
            return;
          }
          self.xxl = value;
          self.setVueComponentData("xxl", self.xxl);
        },
        get initStyle() {
          // @ts-ignore
          return this._initStyle;
        },
        set initStyle(value) {
          const div = document.createElement("div")
          div.style.cssText = value
          if(self.flex){
            div.style.flex = ` ${self.flex} ${self.flex} auto`
          }else {
            div.style.removeProperty("flex")
          }
          // 给slot设置颜色并取消
          const slotNode = $(self?.shadowRoot?.querySelector(`#${self.id}-slot`) as any)
          if(slotNode){
            slotNode.css("backgroundColor", div.style.backgroundColor)
          }
          // @ts-ignore
          this._initStyle = div.style.cssText;
          self.style.cssText = div.style.cssText;
        }

      } as unknown as ISchema
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-col": QCol;
  }
}

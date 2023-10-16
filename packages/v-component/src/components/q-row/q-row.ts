import { css, LitElement, unsafeCSS, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createApp, defineComponent, onMounted, ref, nextTick } from "vue";
import antdCss from "ant-design-vue/dist/antd.css?inline";
import cssIndex from "./index.scss?inline";
import { Row, RowProps } from "ant-design-vue";
import $ from "jquery";
import { changeProperty } from "../../types/runtime/decorators/decorators";
import { booleanTransform, containerPropsIgnore } from "../../util/utils";

/**
 * 步骤条
 */
@customElement("q-row")
export class QRow extends LitElement {
  static styles = [css`
    ${unsafeCSS(cssIndex)}
  `,
    css`
      ${unsafeCSS(antdCss)}
    `];

  @query(".vue-com-container")
  vueComWrapper!: HTMLDivElement;

  // tag 数据
  @changeProperty()
  @property({ type: String })
  align: RowProps["align"] = "top";

  @property({ type: Number })
  gutter = 0;

  @property({ type: String })
  justify: RowProps["justify"] = "start";

  @property({
    type: Boolean, converter(value) {
      return booleanTransform(value);
    }
  })
  wrap: RowProps["wrap"] = false;

  /**
   * 组件实例
   */
  componentInstance: any = null;

  ob!: MutationObserver;

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;


  contextType = false;

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
    // this.setClass()
    this.createObserve();
    this.setChildColStyle()
  }

  setChildColStyle() {
    const styleNode = $(`#${this.id}-row`);
    if(styleNode.length) styleNode.remove()
    $("head").append(`
      <style id="${this.id}-row">
        .children-col {
           padding-left: ${(this.gutter / 2) + 'px'};
          padding-right: ${(this.gutter / 2) + 'px'};
        }
      </style>`)
    const children = this.querySelectorAll("q-col")
    if(children.length){
      // const arr = []
      Array.from(children).map(it => {
        it.classList.add("children-col")
      })
    }

  }



  createObserve() {
    this.ob = containerPropsIgnore(document.getElementById(this.id)!, ["position", "left", "top"], (mutationsList: MutationRecord[], observer: MutationObserver, el: HTMLElement) => {
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


  async distroyObserve() {
    await this.updateComplete;
    setTimeout(() => {
      this.ob?.disconnect();
      this.ob = null as any;
    }, 1500);
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
        <a-row :align="align" :gutter="gutter" :justify="justify" :wrap="wrap" style="height: 100%;position: relative;"
               :id="id + '-row'">
        </a-row>
      `,
      name: "q-skeleton",
      props: {},
      components: {},
      setup(props: any, context: any) {
        const id = ref(self.id);
        const align = ref(self.align);
        const gutter = ref(self.gutter);
        const justify = ref(self.justify);
        const wrap = ref(self.wrap);


        onMounted(async () => {
          await nextTick();
          $(self.shadowRoot?.querySelector(`#${id.value}-row`) as any).append(
            `
            <slot class="dropzone row-slot" style="position: relative;width:100%;height:100%;display: flex;justify-content: inherit;align-items:inherit;flex-flow: inherit;flex-wrap: inherit;">
               <q-container-mask text="组件降落区" style="width:100%;height:100%;"></q-container-mask>
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
          align,
          id,
          gutter,
          justify,
          wrap,
          watchAttributeChange
        };
      }
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(Row);
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

  render() {
    return html`
      <div class="vue-com-container" style="width: 100%;height:100%;"></div>
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
            return "q-row";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "row";
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
                wrap: {
                  type: "boolean",
                  description: "是否自动换行"
                },
                gutter: {
                  type: "number",
                  description: "栅格间隔",
                },
                justify: {
                  type: "string",
                  enum: [{ label: "从左往右", value: "start" }, {
                    label: "从右往左",
                    value: "end"
                  }, { label: "水平居中", value: "center" }, {
                    label: "首行/行尾对齐，均匀分配",
                    value: "space-between"
                  }, { label: "均匀分配", value: "space-around" }],
                  description: "水平对齐方式"
                },
                align: {
                  type: "string",
                  enum: [{ label: "上", value: "top" }, { label: "中", value: "middle" }, {
                    label: "下",
                    value: "bottom"
                  }],
                  description: "垂直对齐方式"
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
        _initStyle: "height:150px;width:100%",
        _onWatchSetting: {
          contextType: [
            function (newVal: any, oldVal: any, context: any) {
              if(newVal){
                self.distroyObserve().then();
              }else {
                self.createObserve();
              }
            },
          ]
        },
        _lifeCycle: {
          created: function() {
          },
          updated: function(el: any, model: any) {
            if(self.contextType !== model.contextType)  self.contextType = model.contextType;
          },
          destroy: function() {
          }
        },
        _eventInterception: {},
        get wrap() {
          return self.wrap;
        },
        set wrap(value) {
          if (value === self.wrap) {
            return;
          }
          self.wrap = value;
          self.setVueComponentData("wrap", self.wrap);
        },
        get gutter() {
          return self.gutter;
        },
        set gutter(value) {
          if (value === self.gutter) {
            return;
          }
          self.gutter = value
          self.setVueComponentData("gutter", self.gutter);
          self.setChildColStyle()
        },
        get justify() {
          return self.justify;
        },
        set justify(value) {
          if (value === self.justify) {
            return;
          }
          self.justify = value;
          self.setVueComponentData("justify", self.justify);
        },
        get align() {
          return self.align;
        },
        set align(value) {
          if (value === self.align) {
            return;
          }
          self.align = value;
          self.setVueComponentData("align", self.align);
        },
        // get initStyle() {
        //   // @ts-ignore
        //   return this._initStyle;
        // },
        // set initStyle(value) {
        //   // @ts-ignore
        //   this._initStyle = value;
        // },
        get contextType() {
          return self.contextType;
        },
        set contextType(value) {
          if (value === self.contextType) {
            return;
          }
          self.contextType = value;
        },

      } as unknown as ISchema
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-row": QRow;
  }
}

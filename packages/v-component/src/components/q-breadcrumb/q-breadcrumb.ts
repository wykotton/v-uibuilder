import { css, LitElement, unsafeCSS, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { isArray, isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createApp, defineComponent, ref } from "vue";
import antdCss from "ant-design-vue/dist/antd.css?inline";
import cssIndex from "./index.scss?inline";
import {
  Menu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem } from "ant-design-vue";
import $ from "jquery";
// import { booleanTransform } from "../../util/utils";

interface BreadData {
  path: string
  breadcrumbName: string
  href: string
  children: Array<BreadData>
}
/**
 * 步骤条
 */
@customElement("q-breadcrumb")
export class QBreadcrumb extends LitElement {
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

@property({type: Array})
  breadData:  Array<BreadData> = [
    {
      path: "",
      breadcrumbName: "Home",
      href: "javascript:void(0);",
      children: []
    },
    {
      path: "",
      breadcrumbName: "Application Center",
      href: "javascript:void(0);",
      children: [
        {
          breadcrumbName: "Application List",
          href: "javascript:void(0);",
          path: "",
          children: []
        }
      ]
    },
    {
      path: "",
      breadcrumbName: "An Application",
      href: "javascript:void(0);",
      children: []
    },
  ]
  // // 是否虚线
  // @property({type: Boolean,  converter(value) {
  //     return booleanTransform(value);
  //   }})
  // dashed: DividerProps["dashed"] = false;


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
        <a-breadcrumb>
          <a-breadcrumb-item v-for="(item,i) in breadData" :key="i" @click="handleCilck(item)">
            <a :href="item.href">{{item.breadcrumbName}}</a>
            <template #overlay v-if="item.children && item.children.length">
              <a-menu>
                <a-menu-item v-for="(menu,m) in item.children" :key="menu.breadcrumbName + m">
                  <a  :href="menu.href">{{menu.breadcrumbName}}</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-breadcrumb-item>
        </a-breadcrumb>
      `,
      name: "q-affix",
      props: {},
      components: {},
      setup(props: any, context: any) {
        const id = ref(self.id);
        const breadData = ref(self.breadData);

        /**
         * 监听timeline属性变更
         */
        function watchAttributeChange(type: string, value: any) {
          console.log("触发更新");
          // @ts-ignore
          this[type] = value;
        }

        function handleCilck(value: any) {
          self.onSendMessage("click", value)
        }

        return {
          props,
          id,
          breadData,
          handleCilck,
          watchAttributeChange,
        };
      },
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(Breadcrumb);
    this.componentInstance.use(BreadcrumbItem);
    this.componentInstance.use(Menu);
    this.componentInstance.use(MenuItem);
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
      <div class="vue-com-container" style="width: 100%;height:100%;"></div>
    `;
  }

  anchorTrigger(el: string) {
    $(this.shadowRoot as any)
      .find("[href]")
      .each((i, it) => {
        it.getAttribute("href") === `#${el}` && $(it).trigger("click");
      });
  }

  setValue(data: Array<BreadData>) {
    this.breadData = data
    this.setVueComponentData("breadData", data)
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-breadcrumb";
          },
          get type() {
            return EComponentType.TEXT;
          },
          get text() {
            return "面包屑";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "显示当前页面在系统层级结构中的位置，并能向上返回。";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "设置组件数据",
                eventType: "setValue",
                messageSchema: "",
                messageDemo: ""
              },
              {
                text: "重置组件数据",
                eventType: "resetValue",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "更新组件数据",
                eventType: "updateValue",
                messageSchema: "",
                messageDemo: ""
              }
            ],
            outputMessage: [
              {
                text: "点击事件",
                eventType: "click",
                messageSchema: "",
                messageDemo: ""
              }
            ],
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                breadData: {
                  type: "array",
                  description: "面包屑数据",
                  items: {
                    type: "object",
                    description: "子项数据",
                    properties: {
                      path: {
                        type: "string",
                        description: "路径",
                      },
                      breadcrumbName: {
                        type: "string",
                        description: "面包屑标题",
                      },
                      href: {
                        type: "string",
                        description: "跳转地址",
                      },
                      children: {
                        type: "array",
                        description: "子项数据",
                        items: {
                          type: "object",
                          description: "子项数据",
                          properties: {
                            path: {
                              type: "string",
                              description: "路径",
                            },
                            breadcrumbName: {
                              type: "string",
                              description: "面包屑标题",
                            },
                            href: {
                              type: "string",
                              description: "跳转地址",
                            },
                          },
                        },
                      }
                    },
                  },
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
          setValue: [
            function (e: IMessage) {
              // @ts-ignore
              this.setValue(e.body);
            },
          ],
          updateValue: [
            function (e: IMessage) {
              // @ts-ignore
              this.setValue(e.body);
            },
          ],
          resetInfo: [
              function (e: IMessage) {
              // @ts-ignore
                this.setValue(e.body);
              }
            ]
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
        _initStyle: "height:30px;width:400px;overflow:auto;background-color: #FFFFFF",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function () {},
          updated: function () {},
          destroy: function () {},
        },
        _eventInterception: {},
        get breadData() {
          return self.breadData;
        },
        set breadData(value) {
          if (!isArray(value) || isEqual(value, self.breadData)) return;
          self.breadData = value;
          self.setVueComponentData("breadData",value)
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-breadcrumb": QBreadcrumb;
  }
}

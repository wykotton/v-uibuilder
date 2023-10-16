import { css, LitElement, unsafeCSS, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { cloneDeep, isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createApp, defineComponent, ref} from "vue";
import antdCss from "ant-design-vue/dist/antd.css?inline";
import cssIndex from "./index.scss?inline";
import { Pagination, ConfigProvider} from "ant-design-vue";
import $ from "jquery";
import { booleanTransform } from "../../util/utils";
import zhCN from "ant-design-vue/lib/locale/zh_CN";
import { changeProperty } from "../../types/runtime/decorators/decorators";
/**
 * 步骤条
 */
@customElement("q-paginationly")
export class QPaginationly extends LitElement {
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


  // 当前页数
  @property({type: Number})
  current = 0

  // 默认的每页条数
  @property({type: Number})
  defaultPageSize = 	10

  // 禁用分页
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  disabled = false;

  // 只有一页时是否隐藏分页器
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  hideOnSinglePage = false;

  // 锚点区域边界
  @changeProperty()
  @property({type: Number})
  pageSize = 10

  // 锚点区域边界
  @property({type: Number})
  pageSizeOptions = ['10', '20', '30', '40']


  // 当 size 未指定时，根据屏幕宽度自动调整尺寸
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  responsive = false



  // 是否显示较少页面内容
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  showLessItems = false;

  // 是否可以快速跳转至某页
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  showQuickJumper = false;

  // 是否可以改变 pageSize
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  showSizeChanger = false;

  // 简单分页
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  simple = false;

  // 锚点区域边界
  @property({type: String})
  size = ""

  // 锚点区域边界
  @property({type: Number})
  total = 0

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
        <a-config-provider :locale="locale">
        <a-pagination
          v-model:current="current"
          :total="total"
          :show-less-items="showLessItems"
          :defaultPageSize="defaultPageSize"
          :disabled="disabled"
          :hideOnSinglePage="hideOnSinglePage"
          :pageSize="pageSize"
          :pageSizeOptions="pageSizeOptions"
          :responsive="responsive"
          :showQuickJumper="showQuickJumper"
          :showSizeChanger="showSizeChanger"
          :simple="simple"
          :size="size"
          @change="handleChange"
          @showSizeChange="handleShowSizeChange"
        />
        </a-config-provider>
      `,
      name: "q-pagination",
      props: {},
      components: {},
      setup(props: any, context: any) {
        const current = ref(self.current)
        const defaultPageSize = ref(self.defaultPageSize)
        const disabled = ref(self.disabled)
        const hideOnSinglePage = ref(self.hideOnSinglePage)
        const pageSize = ref(self.pageSize)
        const pageSizeOptions = ref(self.pageSizeOptions)
        const responsive = ref(self.responsive)
        const showLessItems = ref(self.showLessItems)
        const showQuickJumper = ref(self.showQuickJumper)
        const showSizeChanger = ref(self.showSizeChanger)
        const simple = ref(self.simple)
        const size = ref(self.size)
        const total = ref(self.total)
        const locale = zhCN
        /**
         * 监听timeline属性变更
         */
        function watchAttributeChange(type: string, value: any) {
          console.log("触发更新");
          // @ts-ignore
          this[type] = value;
        }

        /**
         * 变更事件
         * @param current
         * @param size
         */
        function handleChange(current: number, size: number) {
          self.pageSize = size
          pageSize.value = size
          self.onSendMessage("change", {current, size})
        }

        /**
         *
         * @param page
         * @param pageSize
         */
        function handleShowSizeChange(page: number, pageSize: number) {
          // self.onSendMessage("showSizeChange", {current, size})
        }

        return {
          props,
          current,
          defaultPageSize,
          locale,
          disabled,
          hideOnSinglePage,
          pageSize,
          pageSizeOptions,
          responsive,
          showLessItems,
          showQuickJumper,
          showSizeChanger,
          simple,
          size,
          total,
          handleChange,
          handleShowSizeChange,
          watchAttributeChange,
        };
      },
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(Pagination);
    this.componentInstance.use(ConfigProvider);
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
                current: {
                  type: "number",
                  description: "当前页数",
                },
                defaultPageSize: {
                  description: "默认的每页条数",
                  type: "number",
                  minimum: 0
                },
                pageSize: {
                  description: "每页条数",
                  type: "number",
                  minimum: 0
                },
                total: {
                  description: "数据总数",
                  type: "number",
                  minimum: 0
                },
                pageSizeOptions: {
                  description: "指定每页可以显示多少条",
                  type: "string"
                },

                size: {
                  description: "当为「small」时，是小尺寸分页",
                  type: "string",
                  minimum: 0
                },
                responsive: {
                  description: "指定每页可以显示多少条",
                  type: "boolean"
                },
                disabled: {
                  description: "禁用分页",
                  type: "boolean",
                },
                hideOnSinglePage: {
                  description: "只有一页时是否隐藏分页器",
                  type: "boolean",
                },
                showLessItems: {
                  description: "是否显示较少页面内容",
                  type: "boolean",
                },
                showQuickJumper: {
                  description: "是否可以快速跳转至某页",
                  type: "boolean",
                },
                showSizeChanger: {
                  description: "是否可以改变 pageSize",
                  type: "boolean",
                },
                simple: {
                  description: "当添加该属性时，显示为简单分页",
                  type: "boolean",
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
        get current() {
          return self.current;
        },
        set current(value) {
          if (value !== self.current) {
            self.current = value;
            self.setVueComponentData("current", cloneDeep(value));
          }
        },
        get defaultPageSize() {
          return self.defaultPageSize;
        },
        set defaultPageSize(value) {
          if (value !== self.defaultPageSize) {
            self.defaultPageSize = value;
            self.setVueComponentData("defaultPageSize", cloneDeep(value));
          }
        },
        get disabled() {
          return self.disabled;
        },
        set disabled(value) {
          if (value !== self.disabled) {
            self.disabled = value;
            self.setVueComponentData("disabled", cloneDeep(value));
          }
        },
        get hideOnSinglePage() {
          return self.hideOnSinglePage;
        },
        set hideOnSinglePage(value) {
          if (value !== self.hideOnSinglePage) {
            self.hideOnSinglePage = value;
            self.setVueComponentData("hideOnSinglePage", cloneDeep(value));
          }
        },
        get pageSize() {
          return self.pageSize;
        },
        set pageSize(value) {
          if (value !== self.pageSize) {
            self.pageSize = value;
            self.setVueComponentData("pageSize", cloneDeep(value));
          }
        },
        get pageSizeOptions() {
          return JSON.stringify(self.pageSizeOptions);
        },
        set pageSizeOptions(value) {
          if (value !== JSON.stringify(self.pageSizeOptions)) {
            self.pageSizeOptions = JSON.parse(value);
            self.setVueComponentData("pageSizeOptions", cloneDeep(value));
          }
        },
        get responsive() {
          return self.responsive;
        },
        set responsive(value) {
          if (value !== self.responsive) {
            self.responsive = value;
            self.setVueComponentData("responsive", cloneDeep(value));
          }
        },
        get showLessItems() {
          return self.showLessItems;
        },
        set showLessItems(value) {
          if (value !== self.showLessItems) {
            self.showLessItems = value;
            self.setVueComponentData("showLessItems", cloneDeep(value));
          }
        },
        get showQuickJumper() {
          return self.showQuickJumper;
        },
        set showQuickJumper(value) {
          if (value !== self.showQuickJumper) {
            self.showQuickJumper = value;
            self.setVueComponentData("showQuickJumper", cloneDeep(value));
          }
        },
        get showSizeChanger() {
          return self.showSizeChanger;
        },
        set showSizeChanger(value) {
          if (value !== self.showSizeChanger) {
            self.showSizeChanger = value;
            self.setVueComponentData("showSizeChanger", cloneDeep(value));
          }
        },
        get simple() {
          return self.simple;
        },
        set simple(value) {
          if (value !== self.simple) {
            self.simple = value;
            self.setVueComponentData("simple", cloneDeep(value));
          }
        },
        get size() {
          return self.size;
        },
        set size(value) {
          if (value !== self.size) {
            self.size = value;
            self.setVueComponentData("size", cloneDeep(value));
          }
        },
        get total() {
          return self.total;
        },
        set total(value) {
          if (value !== self.total) {
            self.total = value;
            self.setVueComponentData("total", cloneDeep(value));
          }
        },
        _eventInterception: {},
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-paginationly": QPaginationly;
  }
}

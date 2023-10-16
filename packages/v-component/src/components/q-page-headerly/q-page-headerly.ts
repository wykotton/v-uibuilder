import { css, LitElement, unsafeCSS, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { cloneDeep, isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createApp, defineComponent, ref } from "vue";
import antdCss from "ant-design-vue/dist/antd.css?inline";
import cssIndex from "./index.scss?inline";
import {  PageHeader} from "ant-design-vue";
/**
 * 步骤条
 */
@customElement("q-page-headerly")
export class QPageHeaderly extends LitElement {
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
  pageHeaderStyle = "";

  // 锚点区域边界
  @property()
  title = "title";

  // 滚动区容器
  @property()
  subTitle = "a sub title";

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
        <a-page-header
          :style="pageHeaderStyle"
          :title="title"
          :sub-title="subTitle"
          @back="handleBack"
        >
        
        </a-page-header>
      `,
      name: "q-page-header",
      props: {},
      components: {},
      setup(props: any, context: any) {
        const id = ref(self.id);
        const pageHeaderStyle = ref(self.pageHeaderStyle);
        const title = ref(self.title);
        const subTitle = ref(self.subTitle);

        function handleBack() {
          self.onSendMessage("click",{title,subTitle})
        }

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
          pageHeaderStyle,
          id,
          title,
          subTitle,
          handleBack,
          watchAttributeChange,
        };
      },
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(PageHeader);
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
      <div class="vue-com-container"  style="position: relative;width: 100%;height: 100%;">
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
            return "q-page-headerly";
          },
          get type() {
            return EComponentType.TEXT;
          },
          get text() {
            return "页头";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "页头位于页容器中，页容器顶部，起到了内容概览和引导页级操作的作用。包括由面包屑、标题、页面内容简介、页面级操作等、页面级导航组成。";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {
            inputMessage: [

            ],
            outputMessage: [
              {
                text: "组件点击数据",
                eventType: "click",
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
                title: {
                  description: "标题",
                  type: "string",
                },
                subTitle: {
                  description: "子标题",
                  type: "string",
                },
                pageHeaderStyle: {
                  description: "自定义样式",
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
        get pageHeaderStyle() {
          return self.pageHeaderStyle;
        },
        set pageHeaderStyle(value) {
          if (value !== self.pageHeaderStyle) {
            self.pageHeaderStyle = value;
            self.setVueComponentData("pageHeaderStyle", cloneDeep(value));
          }
        },
        get title() {
          return self.title;
        },
        set title(value) {
          if (value !== self.title) {
            self.title = value;
            self.setVueComponentData("title", cloneDeep(value));
          }
        },
        get subTitle() {
          return self.subTitle;
        },
        set subTitle(value) {
          if (value !== self.subTitle) {
            self.subTitle = value;
            self.setVueComponentData("subTitle", cloneDeep(value));
          }
        }
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-page-headerly": QPageHeaderly;
  }
}

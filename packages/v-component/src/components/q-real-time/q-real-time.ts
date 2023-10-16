import { css, html, unsafeCSS } from "lit";
import { customElement, query } from "lit/decorators.js";
import { isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { Component } from "../../types/runtime/Component";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import cssIndex from "./index.scss?inline";
import { createApp, defineComponent, onMounted, ref } from "vue";
import { unmountInstance } from "../../util/utils";

@customElement("q-real-time")
export class QRealTime extends Component {
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
   * 挂载节点.
   */
  @query("#container")
  container!: HTMLElement;

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  /**
   * 组件实例
   */
  componentInstance: any = null;

  render() {
    return html`
      <div id="container"></div>
    `;
  }

  createVueComponent = () => {
    const component = defineComponent({
      template: `
            <div class="real-time">{{ time }}</div>
        `,
      setup() {
        const time = ref("");
        function realTime() {
          const date = new Date();
          const hour = date.getHours();
          const minutes = date.getMinutes();
          const seconds = date.getSeconds();
          time.value = `${hour}h:${minutes}m:${seconds}s`;
          setTimeout(() => {
            realTime();
          }, 1000);
        }
        onMounted(() => {
          realTime();
        });

        return {
          time,
          realTime,
        };
      },
    });

    this.componentInstance = createApp(component);
    this.componentInstance.mount(this.container);
  };

  disconnectedCallback(): void {
    if (!this.isConnected) {
      // 断开文档连接，说明元件已被删除
      unmountInstance(this);
    }
    super.disconnectedCallback();
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    if (!this.componentInstance && this.container) {
      this.createVueComponent();
    }
  }

  protected updated(): void {
    if (this.container) {
      unmountInstance(this);
      this.createVueComponent();
    }
  }

  initModel(): void {
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-real-time";
          },
          get type() {
            return EComponentType.TEXT;
          },
          get text() {
            return "实时时间";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "实时时间组件,用于显示当前时间";
          },
          eventSpecification: {
            inputMessage: [],
            outputMessage: [],
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
        _onMessageMeta: {},
        _onDOMEvent: {},
        _initStyle: "height:80px;width:150px;",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function () {},
          updated: function () {},
          destroy: function () {},
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-real-time": QRealTime;
  }
}

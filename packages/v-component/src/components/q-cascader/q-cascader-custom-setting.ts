import antdCss from "ant-design-vue/dist/antd.css?inline";
import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { createApp, defineComponent, ref } from "vue";
import { DOMEmit } from "../../util/reactivity/Emit";
import cssIndex from "./index.scss?inline";
import custom from "./index.vue";
import { booleanTransform } from "../../util/utils";
import { CascaderProps } from "ant-design-vue";
import { unmountInstance } from "../../util/utils";

interface ITreeData extends CascaderProps {}

/**
 * 折叠菜单
 */
@customElement("q-cascader-custom-setting")
export class QCascaderCustomSetting extends LitElement {
  static styles = css`
    ${unsafeCSS(cssIndex)}
    ${unsafeCSS(antdCss)}
  `;

  /**
   * 绑定data数据
   */
  @property({ type: Array, attribute: "value" })
  @property({
    type: Boolean,
    converter(value) {
      return booleanTransform(value);
    },
  })
  showCheckBox = false;

  @property({
    type: Boolean,
    converter(value) {
      return booleanTransform(value);
    },
  })
  showLine = false;

  @property({
    type: Boolean,
    converter(value) {
      return booleanTransform(value);
    },
  })
  showIcon = false;

  @property({ type: Array, attribute: "value" })
  options: ITreeData["options"] = [
    {
      value: "zhejiang",
      label: "Zhejiang",
      children: [
        {
          value: "hangzhou",
          label: "Hangzhou",
          children: [
            {
              value: "hangzhou1",
              label: "Hangzhou1",
              children: [
                {
                  value: "hangzhou2",
                  label: "Hangzhou2",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      value: "jiangsu",
      label: "Jiangsu",
      children: [
        {
          value: "nanjing",
          label: "Nanjing",
          children: [
            {
              value: "zhonghuamen",
              label: "Zhong Hua Men",
            },
          ],
        },
      ],
    },
  ];

  /**
   * 挂载节点.
   */
  @query("#container")
  container!: HTMLElement;

  constructor() {
    super();
    this.initModel();
  }

  /**
   * 组件实例
   */
  componentInstance: any = null;

  render() {
    return html`
      <div id="container"></div>
    `;
  }

  initModel(): void {}

  createVueComponent = () => {
    const self = this;
    const component = defineComponent({
      template: `
        <menuData 
                  :options="options"
                  @optionsChange="optionsChange"></menuData>`,
      setup() {
        const options = ref(self.options as any);
        function optionsChange(e: ITreeData["options"]) {
          self.options = e;
          DOMEmit(self, "change", { detail: { data: self.options } });
        }

        return {
          options,
          optionsChange,
        };
      },
    });

    this.componentInstance = createApp(component);
    this.componentInstance.component("menuData", custom);
    this.componentInstance.mount(this.container);
  };

  disconnectedCallback(): void {
    if (!this.isConnected) {
      // 断开文档连接，说明元件已被删除
      unmountInstance(this);
    }
    super.disconnectedCallback();
  }

  connectedCallback(): void {
    if (!this.componentInstance && this.container) {
      this.createVueComponent();
    }
    super.connectedCallback();
  }

  protected updated(): void {
    if (this.container) {
      unmountInstance(this);
      this.createVueComponent();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-cascader-custom-setting": QCascaderCustomSetting;
  }
}

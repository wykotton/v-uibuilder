import antdCss from "ant-design-vue/dist/antd.css?inline";
import { css, html, LitElement, unsafeCSS } from "lit";
import { property, query } from "lit/decorators.js";
import { createApp, defineComponent, ref } from "vue";
import { DOMEmit } from "../../../util/reactivity/Emit";
import { unmountInstance } from "../../../util/utils";
import { ITabsData } from "./types";
import { customHasElement } from "../../../types/runtime/decorators/decorators";
import custom from "./index.vue";
import "../../q-color-picker/q-color-picker";

/**
 * 选项卡tabs数据设置器
 */
@customHasElement("q-dynamic-tabs-setting")
export class QDynamicTabsSetting extends LitElement {
  static styles = css`
    ${unsafeCSS(antdCss)}
  `;

  /**
   * 绑定data数据
   */
  @property({ type: Array, attribute: "value" })
  options: ITabsData[] = [];

  /**
   * 挂载节点.
   */
  @query("#container")
  container!: HTMLElement;

  constructor() {
    super();
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

  createVueComponent = () => {
    const self = this;
    const component = defineComponent({
      template: `
            <tabsData :options="options" @optionsChange="optionsChange"></tabsData>`,
      setup() {
        const options = ref(self.options);

        function optionsChange(e: ITabsData[]) {
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
    this.componentInstance.component("tabsData", custom);
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
}

declare global {
  interface HTMLElementTagNameMap {
    "q-dynamic-tabs-setting": QDynamicTabsSetting;
  }
}

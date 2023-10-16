import antdCss from "ant-design-vue/dist/antd.css?inline";
import { css, html, LitElement, unsafeCSS } from "lit";
import { property, query } from "lit/decorators.js";
import { createApp, defineComponent, ref } from "vue";
import { DOMEmit } from "../../../util/reactivity/Emit";
import { unmountInstance } from "../../../util/utils";
import { customHasElement } from "../../../types/runtime/decorators/decorators";
import { menuTreeData } from "@zzjz/v-uibuilder-types";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { Tree } from "ant-design-vue";
import MenuSetting from "./index.vue";
import "../../q-color-picker/q-color-picker";

/**
 * 选项卡tabs数据设置器
 */
@customHasElement("q-dropdown-setting")
export class QDropdownSetting extends LitElement {
  static styles = css`
    ${unsafeCSS(antdCss)}
  `;

  /**
   * 绑定data数据
   */
  @property({ type: Array, attribute: "value" })
  menuData: menuTreeData[] = [];

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
        <menu-setting :menu-data="menuData" @dataChange="dataChange"></menu-setting>
      `,
      setup() {
        const menuData = ref(self.menuData);

        function dataChange(e: menuTreeData[]) {
          self.menuData = e;
          DOMEmit(self, "change", { detail: { data: self.menuData } });
        }

        return {
          menuData,
          dataChange,
        };
      },
    });

    this.componentInstance = createApp(component);
    this.componentInstance.component("Tree", Tree);
    this.componentInstance.component("MenuSetting", MenuSetting);
    this.componentInstance.component("DeleteOutlined", DeleteOutlined);
    this.componentInstance.component("EditOutlined", EditOutlined);
    this.componentInstance.component("PlusOutlined", PlusOutlined);
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
    "q-dropdown-setting": QDropdownSetting;
  }
}

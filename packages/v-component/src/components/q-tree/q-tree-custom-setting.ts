import antdCss from "ant-design-vue/dist/antd.css?inline";
import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { createApp, defineComponent, reactive, ref } from "vue";
import { DOMEmit } from "../../util/reactivity/Emit";
import { booleanTransform, unmountInstance } from "../../util/utils";
import cssIndex from "./index.scss?inline";
import custom from "./index.vue";

interface ITreeData {
  title: string;
  key: string;
  customIcon: string;
  children: ITreeData[];
  disableCheckbox: boolean;
  disabled?: boolean;
}

/**
 * 折叠菜单
 */
@customElement("q-tree-custom-setting")
export class QTreeCustomSetting extends LitElement {
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
  options: ITreeData[] = [];

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
        <menuData :checkable="showCheckBox"
                  :show-line="showLine"
                  :show-icon="showIcon"
                  :options="options"
                  @optionsChange="optionsChange"></menuData>`,
      setup() {
        const options = reactive(self.options);
        const showCheckBox = ref(self.showCheckBox);
        const showLine = ref(self.showLine);
        const showIcon = ref(self.showIcon);

        function optionsChange(e: ITreeData[]) {
          self.options = e;
          DOMEmit(self, "change", { detail: { data: self.options } });
        }

        return {
          options,
          showCheckBox,
          showLine,
          showIcon,
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
    "q-tree-custom-setting": QTreeCustomSetting;
  }
}

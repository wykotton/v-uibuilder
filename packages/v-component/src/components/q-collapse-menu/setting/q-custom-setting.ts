import antdCss from "ant-design-vue/dist/antd.css?inline";
import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { createApp, defineComponent, ref } from "vue";
import { DOMEmit } from "../../../util/reactivity/Emit";
import { unmountInstance } from "../../../util/utils";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons-vue";
import cssIndex from "./index.scss?inline";
import custom from "./index.vue";

interface IMenuData {
  title: string;
  key: string;
  icon: string;
  children: IMenuData[];
}

/**
 * 折叠菜单
 */
@customElement("q-custom-setting")
export class QCustomSetting extends LitElement {
  static styles = css`
    ${unsafeCSS(cssIndex)}
    ${unsafeCSS(antdCss)}
  `;

  /**
   * 绑定data数据
   */
  @property({ type: Array, attribute: "value" })
  options: IMenuData[] = [
    {
      title: "menu1",
      key: "menu-19wcsddb8h9s",
      children: [],
      icon: "<svg t='1669882576357' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='1957' width='16' height='16'><path d='M779.3152 892.0064H251.8016c-64.9216 0-117.76-52.8384-117.76-117.76V225.2288c0-64.9216 52.8384-117.76 117.76-117.76H779.264c64.9216 0 117.76 52.8384 117.76 117.76v549.0176c0.0512 64.9216-52.7872 117.76-117.7088 117.76zM251.8016 158.6688c-36.7104 0-66.56 29.8496-66.56 66.56v549.0176c0 36.7104 29.8496 66.56 66.56 66.56H779.264c36.7104 0 66.56-29.8496 66.56-66.56V225.2288c0-36.7104-29.8496-66.56-66.56-66.56H251.8016z' fill='#231815' p-id='1958'></path><path d='M512 543.5904c-103.1168 0-187.0336-83.8656-187.0336-186.9824 0-14.1312 11.4688-25.6 25.6-25.6s25.6 11.4688 25.6 25.6c0 74.9056 60.928 135.7824 135.8336 135.7824s135.7824-60.928 135.7824-135.7824c0-14.1312 11.4688-25.6 25.6-25.6s25.6 11.4688 25.6 25.6c0 103.1168-83.8656 186.9824-186.9824 186.9824z' fill='#FF3355' p-id='1959'></path></svg>",
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
            <menuData :options="options" @optionsChange="optionsChange"></menuData>`,
      setup() {
        const options = ref(self.options);

        function optionsChange(e: IMenuData[]) {
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
    "q-custom-setting": QCustomSetting;
  }
}

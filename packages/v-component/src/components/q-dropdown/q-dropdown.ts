import { css, html, unsafeCSS } from "lit";
import { property, query } from "lit/decorators.js";
import { Component } from "../../types/runtime/Component";
import { customHasElement } from "../../types/runtime/decorators/decorators";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { menuTreeData } from "@zzjz/v-uibuilder-types";
import { isArray, isEqual, isNumber } from "lodash-es";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { defineComponent, provide, ref, createApp } from "vue";
import { unmountInstance } from "../../util/utils";
import { IMessage } from "../../types/runtime/IMessage";
import { DOMEmit } from "../../util/reactivity/Emit";
import { EllipsisOutlined } from "@ant-design/icons-vue";
import cssIndex from "./index.scss?inline";
import SubMenu from "./index.vue";
import "../q-popover/q-popover";
import "./setting/q-dropdown-setting";

@customHasElement("q-dropdown")
export class QDropdown extends Component {
  constructor() {
    super();
    this.initModel();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];

  @property({ type: Array })
  public menu: menuTreeData[] = [
    {
      key: "contextmenu-ugk5ccr8",
      title: "菜单1",
      children: [
        {
          key: "contextmenu-3uoz55mw",
          title: "菜单1-1",
          children: [
            {
              key: "contextmenu-r4ta57aw",
              title: "菜单1-1-1",
              children: [],
              fontSize: 0,
              fontWeight: "",
              icon: "",
              bgImage: "",
              hoverBgImage: "",
              bgColor: "",
              hoverBgColor: "",
              color: "",
              hoverColor: "",
            },
          ],
          fontSize: 0,
          fontWeight: "",
          icon: "",
          bgImage: "",
          hoverBgImage: "",
          bgColor: "",
          hoverBgColor: "",
          color: "",
          hoverColor: "",
        },
        {
          key: "contextmenu-kv6lko72",
          title: "菜单1-2",
          children: [],
          fontSize: 0,
          fontWeight: "",
          icon: "",
          bgImage: "",
          hoverBgImage: "",
          bgColor: "",
          hoverBgColor: "",
          color: "",
          hoverColor: "",
        },
      ],
      fontSize: 0,
      fontWeight: "",
      icon: '<svg class="icon" width="20px" height="20.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#1296db" d="M380.74364 480.939335H100.195695A100.195695 100.195695 0 0 1 0 380.74364V100.195695A100.195695 100.195695 0 0 1 100.195695 0h280.547945a100.195695 100.195695 0 0 1 100.195695 100.195695v280.547945a100.195695 100.195695 0 0 1-100.195695 100.195695zM100.195695 80.156556a20.039139 20.039139 0 0 0-20.039139 20.039139v280.547945a20.039139 20.039139 0 0 0 20.039139 20.039139h280.547945a20.039139 20.039139 0 0 0 20.039139-20.039139V100.195695a20.039139 20.039139 0 0 0-20.039139-20.039139zM923.804305 480.939335H643.25636a100.195695 100.195695 0 0 1-100.195695-100.195695V100.195695A100.195695 100.195695 0 0 1 643.25636 0h280.547945a100.195695 100.195695 0 0 1 100.195695 100.195695v280.547945a100.195695 100.195695 0 0 1-100.195695 100.195695zM643.25636 80.156556a20.039139 20.039139 0 0 0-20.039139 20.039139v280.547945a20.039139 20.039139 0 0 0 20.039139 20.039139h280.547945a20.039139 20.039139 0 0 0 20.039139-20.039139V100.195695a20.039139 20.039139 0 0 0-20.039139-20.039139zM380.74364 1024H100.195695A100.195695 100.195695 0 0 1 0 923.804305V643.25636a100.195695 100.195695 0 0 1 100.195695-100.195695h280.547945a100.195695 100.195695 0 0 1 100.195695 100.195695v280.547945a100.195695 100.195695 0 0 1-100.195695 100.195695zM100.195695 623.217221a20.039139 20.039139 0 0 0-20.039139 20.039139v280.547945a20.039139 20.039139 0 0 0 20.039139 20.039139h280.547945a20.039139 20.039139 0 0 0 20.039139-20.039139V643.25636a20.039139 20.039139 0 0 0-20.039139-20.039139zM827.616438 1024H643.25636a100.195695 100.195695 0 0 1-100.195695-100.195695V643.25636a100.195695 100.195695 0 0 1 100.195695-100.195695h280.547945a100.195695 100.195695 0 0 1 100.195695 100.195695v175.342466a40.078278 40.078278 0 0 1-80.156556 0V643.25636a20.039139 20.039139 0 0 0-20.039139-20.039139H643.25636a20.039139 20.039139 0 0 0-20.039139 20.039139v280.547945a20.039139 20.039139 0 0 0 20.039139 20.039139h184.360078a40.078278 40.078278 0 0 1 0 80.156556z"  /></svg>',
      bgImage: "",
      hoverBgImage: "",
      bgColor: "",
      hoverBgColor: "",
      color: "",
      hoverColor: "",
    },
    {
      key: "contextmenu-4k8t51ol",
      title: "菜单2",
      children: [],
      fontSize: 0,
      fontWeight: "",
      icon: "",
      bgImage: "",
      hoverBgImage: "",
      bgColor: "",
      hoverBgColor: "",
      color: "",
      hoverColor: "",
    },
  ];

  @property({ type: String })
  public trigger = "click";

  /**
   * 菜单背景色
   */
  @property({ type: String, attribute: "menu_bg_color" })
  menuBgColor = "";

  /**
   * 菜单背景色
   */
  @property({ type: String, attribute: "menu_bg_image" })
  menuBgImage = "";

  /**
   * 菜单内边距
   */
  @property({ type: String, attribute: "menu_padding" })
  menuPadding = "";

  /**
   * 字体大小
   */
  @property({ type: Number })
  fontSize = 14;

  /**
   * 字体粗细
   */
  @property({ type: String })
  fontWeight = "";

  /**
   * icon图标
   */
  @property({ type: String })
  icon = "";

  /**
   * 背景图
   */
  @property({ type: String, attribute: "bg_image" })
  bgImage = "";

  /**
   * 鼠标移入背景图
   */
  @property({ type: String, attribute: "hover_bg_image" })
  hoverBgImage = "";

  /**
   * 背景色
   */
  @property({ type: String, attribute: "bg_color" })
  bgColor = "#fafafa";

  /**
   * 鼠标移入背景色
   */
  @property({ type: String, attribute: "hover_bg_color" })
  hoverBgColor = "#e6f7ff";

  /**
   * 文字颜色
   */
  @property({ type: String })
  color = "#000000";

  /**
   * 鼠标移入文字颜色
   */
  @property({ type: String, attribute: "hover_color" })
  hoverColor = "";

  @query(".input")
  inputElement!: HTMLElement;

  @query(".menu-container")
  menuContainer!: HTMLElement;

  /**
   * 组件实例
   */
  componentInstance: any = null;

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  // designer变更,有实例则不再重新渲染
  set _menu(menu: any) {
    if (!this.checkAttr(menu)) return;
    try {
    } catch (error) {}
  }

  /**
   *  校验menu正确性
   * @returns
   */
  checkAttr(data: any) {
    const validity = isArray(data);
    return validity;
  }

  /**
   * 菜单项点击
   * @param item
   */
  menuItemClick(item: menuTreeData) {
    DOMEmit(this, "itemClick", { detail: { value: item } });
    this.onSendMessage("menuItemClick", item);
  }

  /**
   * 发送总线消息
   * @param type
   * @param data
   */
  onSendMessage(type: string, data: any) {
    const message: IMessage = {
      header: {
        src: this.id,
        dst: "",
        srcType: type,
        dstType: "",
      },
      body: data,
    };
    this.componentModel.sendMessage(message);
  }

  public override render() {
    return html`
      <div id="q-dropdown">
        <q-popover trigger=${this.trigger} show_arrow="false" block="false" style="width: 100%;height:100%">
          <div class="content">
            <slot id="q-dropdown-slot" class="dropzone">
              <q-container-mask text="组件降落区"></q-container-mask>
            </slot>
          </div>
          <div slot="popover" tip="popover" class="menu-container"></div>
        </q-popover>
      </div>
    `;
  }

  createVueComponent = () => {
    if (!this.menu.length) return;
    const self = this;
    const component = defineComponent({
      template: `
				<sub-menu :menu-data="menuData"></sub-menu>
			`,
      setup() {
        const menuData = ref(self.menu);
        const instance = ref(self);
        provide("instance", instance);

        return { menuData };
      },
    });

    this.componentInstance = createApp(component);
    this.componentInstance.component("SubMenu", SubMenu);
    this.componentInstance.component("EllipsisOutlined", EllipsisOutlined);
    this.componentInstance.mount(this.menuContainer);
  };

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (!this.isConnected) {
      // 断开文档连接，说明元件已被删除
      unmountInstance(this);
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    if (this.menuContainer) {
      unmountInstance(this);
      this.createVueComponent();
    }
  }

  protected updated(): void {
    if (!this.checkAttr(this.menu)) return;
    if (this.menuContainer) {
      unmountInstance(this);
      this.createVueComponent();
    }
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-dropdown";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "下拉菜单";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "下拉菜单";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "更改菜单数据",
                eventType: "changeMenu",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "菜单项点击",
                eventType: "menuItemClick",
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
                menu: {
                  type: "array",
                  description: "菜单数据",
                  format: "custom",
                  setter: "q-dropdown-setting",
                },
                trigger: {
                  type: "string",
                  description: "触发下拉的行为",
                  enum: [
                    { label: "点击", value: "click" },
                    { label: "鼠标移入", value: "hover" },
                  ],
                },
                menuBgColor: {
                  type: "string",
                  description: "菜单背景色",
                  format: "color",
                },
                menuBgImage: {
                  type: "string",
                  description: "菜单背景图(base64图像或图片链接)",
                  format: "resource",
                },
                menuPadding: {
                  type: "string",
                  description: "菜单内边距",
                },
                fontSize: {
                  type: "number",
                  description: "菜单项字体大小",
                  minimum: 10,
                },
                fontWeight: {
                  type: "string",
                  description: "菜单项字体粗细",
                  enum: [
                    {
                      label: "100 Thin",
                      value: "100",
                    },
                    {
                      label: "200 Extra Light",
                      value: "200",
                    },
                    {
                      label: "300 Light",
                      value: "300",
                    },
                    {
                      label: "400 Normal",
                      value: "400",
                    },
                    {
                      label: "500 Medium",
                      value: "500",
                    },
                    {
                      label: "600 Semi Bold",
                      value: "600",
                    },
                    {
                      label: "700 Bold",
                      value: "700",
                    },
                    {
                      label: "800 Extra Bold",
                      value: "800",
                    },
                    {
                      label: "900 Black",
                      value: "900",
                    },
                  ],
                },
                icon: {
                  type: "string",
                  description: "菜单项icon(SVG图像)",
                },
                bgImage: {
                  type: "string",
                  description: "菜单项背景图(base64图像或图片链接)",
                  format: "resource",
                },
                hoverBgImage: {
                  type: "string",
                  description: "菜单项鼠标移入背景图(base64图像或图片链接)",
                  format: "resource",
                },
                bgColor: {
                  type: "string",
                  description: "菜单项背景色",
                  format: "color",
                },
                hoverBgColor: {
                  type: "string",
                  description: "菜单项鼠标移入背景色",
                  format: "color",
                },
                color: {
                  type: "string",
                  description: "菜单项文字颜色",
                  format: "color",
                },
                hoverColor: {
                  type: "string",
                  description: "菜单项鼠标移入文字颜色",
                  format: "color",
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
          changeMenu: [
            function (e: IMessage) {
              if (!Array.isArray(e.body)) return;
              // @ts-ignore
              this.menu = e.body;
            },
          ],
        },
        _onDOMEvent: {},
        _initStyle: "height:150px;width:150px;background-color:#ffffff",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function () {},
          updated: function () {},
          destroy: function () {},
        },
        get menu() {
          return self.menu;
        },
        set menu(value) {
          if (!self.checkAttr(value)) return;
          self.menu = value;
        },
        get trigger() {
          return self.trigger;
        },
        set trigger(value) {
          if (value !== "click" && value !== "hover") return;
          self.trigger = value;
        },
        get menuBgColor() {
          return self.menuBgColor;
        },
        set menuBgColor(value) {
          self.menuBgColor = String(value);
        },
        get menuBgImage() {
          return self.menuBgImage;
        },
        set menuBgImage(value) {
          self.menuBgImage = String(value);
        },
        get menuPadding() {
          return self.menuPadding;
        },
        set menuPadding(value) {
          self.menuPadding = String(value);
        },
        get fontSize() {
          return self.fontSize;
        },
        set fontSize(value) {
          if (!isNumber(value)) return;
          self.fontSize = value;
        },
        get fontWeight() {
          return self.fontWeight;
        },
        set fontWeight(value) {
          self.fontWeight = String(value);
        },
        get icon() {
          return self.icon;
        },
        set icon(value) {
          self.icon = String(value);
        },
        get bgImage() {
          return self.bgImage;
        },
        set bgImage(value) {
          self.bgImage = String(value);
        },
        get hoverBgImage() {
          return self.hoverBgImage;
        },
        set hoverBgImage(value) {
          self.hoverBgImage = String(value);
        },
        get bgColor() {
          return self.bgColor;
        },
        set bgColor(value) {
          self.bgColor = String(value);
        },
        get hoverBgColor() {
          return self.hoverBgColor;
        },
        set hoverBgColor(value) {
          self.hoverBgColor = String(value);
        },
        get color() {
          return self.color;
        },
        set color(value) {
          self.color = String(value);
        },
        get hoverColor() {
          return self.hoverColor;
        },
        set hoverColor(value) {
          self.hoverColor = String(value);
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-dropdown": QDropdown;
  }
}

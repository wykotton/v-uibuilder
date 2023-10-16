import { css, html, LitElement, TemplateResult, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import _, { isArray, isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { changeProperty } from "../../types/runtime/decorators/decorators";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createHash } from "../../util/utils";
import { classMap } from "lit/directives/class-map.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { CollapseMenuData } from "@zzjz/v-uibuilder-types";
import MetisMenu from "metismenujs";
import $ from "jquery";
import cssIndex from "./index.scss?inline";
import "./setting/q-custom-setting";
import "../q-popover/q-popover";

/**
 * 折叠菜单
 */
@customElement("q-collapse-menu")
export class QCollapseMenu extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    p {
      margin: 0;
      word-break: break-all;
    }
    ${unsafeCSS(cssIndex)}
  `;

  /**
   * 绑定data数据
   */
  @changeProperty()
  @property({ type: Array, attribute: "menu-data" })
  menuData: CollapseMenuData[] = [
    {
      title: "menu1",
      key: "menu-jvrnyhjv2a7t",
      children: [],
      icon: "<svg t='1669882576357' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='1957' width='16' height='16'><path d='M779.3152 892.0064H251.8016c-64.9216 0-117.76-52.8384-117.76-117.76V225.2288c0-64.9216 52.8384-117.76 117.76-117.76H779.264c64.9216 0 117.76 52.8384 117.76 117.76v549.0176c0.0512 64.9216-52.7872 117.76-117.7088 117.76zM251.8016 158.6688c-36.7104 0-66.56 29.8496-66.56 66.56v549.0176c0 36.7104 29.8496 66.56 66.56 66.56H779.264c36.7104 0 66.56-29.8496 66.56-66.56V225.2288c0-36.7104-29.8496-66.56-66.56-66.56H251.8016z' fill='#231815' p-id='1958'></path><path d='M512 543.5904c-103.1168 0-187.0336-83.8656-187.0336-186.9824 0-14.1312 11.4688-25.6 25.6-25.6s25.6 11.4688 25.6 25.6c0 74.9056 60.928 135.7824 135.8336 135.7824s135.7824-60.928 135.7824-135.7824c0-14.1312 11.4688-25.6 25.6-25.6s25.6 11.4688 25.6 25.6c0 103.1168-83.8656 186.9824-186.9824 186.9824z' fill='#FF3355' p-id='1959'></path></svg>",
    },
    {
      title: "menu2",
      key: "menu-5hwcqh3hw4gg",
      icon: "",
      children: [
        {
          title: "menu2-1",
          key: "menu-d2gzr5kyqvlw",
          children: [
            {
              title: "menu2-1-1",
              key: "menu-y1dj2xd9k77s",
            },
          ],
        },
      ],
      moreChildren: [
        {
          title: "moreMenu2-1",
          key: "menu-zhdkfl2n2x2t",
          children: [
            {
              title: "moreMenu2-1-1",
              key: "menu-2xq4mc2eqb1b",
            },
          ],
        },
        {
          title: "moreMenu2-2",
          key: "menu-wpwfd1z8z6uc",
          children: [
            {
              title: "moreMenu2-2-1",
              key: "menu-kjf8qvrn15xa",
            },
          ],
        },
        {
          title: "moreMenu2-3",
          key: "menu-ardhf0ue7f2n",
          children: [
            {
              title: "moreMenu2-3-1",
              key: "menu-eo5w0pasd8i6",
            },
          ],
        },
      ],
    },
  ];

  /**
   * 字体高亮颜色
   */
  @property({ type: String, attribute: "active-font-color" })
  activeFontColor = "#ffffff";

  /**
   * 选中高亮颜色
   */
  @property({ type: String, attribute: "active-select-color" })
  activeSelectColor = "#409eff";

  /**
   * hover高亮颜色
   */
  @property({ type: String, attribute: "hover-select-color" })
  hoverSelectColor = "#ecf5ff";

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  metismenu: MetisMenu = null as any;

  constructor() {
    super();
    this.initModel();
  }

  // 首次挂载到dom上
  async connectedCallback() {
    super.connectedCallback();
    if (this.metismenu) {
      await this.updateComplete;
      this.metismenu.update();
    }
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    super.attributeChangedCallback(name, _old, value);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.metismenu) this.metismenu.dispose();
  }

  async updated() {
    if (this.metismenu) {
      await this.updateComplete;
      this.metismenu.update();
    }
  }

  // 您可以在组件初始渲染后（例如 in firstUpdated）查询内|部 DOM
  public rootNode: HTMLElement | null = null;

  public curSelMenu: { e?: EventTarget; key?: any } = {};

  firstUpdated(): void {
    this.rootNode = this.renderRoot.querySelector(".metismenu");
    if (this.rootNode) {
      this.metismenu = new MetisMenu(this.rootNode);
    }
  }

  /**
   * 菜单点击事件
   */
  public menuClick(e: Event) {
    e.preventDefault();
    this.renderRoot.querySelectorAll("a").forEach((it: HTMLElement) => {
      it.classList.remove("a-active");
    });
    if (e.currentTarget) {
      $(e.currentTarget as any).toggleClass("a-active");
      this.curSelMenu = { e: e.currentTarget, key: (e.currentTarget as HTMLElement).getAttribute("key") };
      this.onSendMessage(e, this.curSelMenu);
    }
  }

  /**
   * 更多项点击事件
   */
  public moreMenuClick(e: Event, popoverKey: string) {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget) {
      this.curSelMenu = { e: e.currentTarget, key: (e.currentTarget as HTMLElement).getAttribute("key") };
      this.onSendMessage(e, this.curSelMenu);
    }
    const popover: any = this.shadowRoot?.querySelector(`#${popoverKey}`);
    if (popover) {
      popover.leave?.();
    }
  }

  /**
   * 子菜单
   */
  renderSubMenu(data: CollapseMenuData): TemplateResult {
    if (!data) return html``;
    const { key, title, children, icon, moreChildren } = data;
    const hasChildren = Boolean(children && children.length);
    const hasMoreChildren = Boolean(moreChildren && moreChildren.length);
    return html`
      <li>
        <a
          href="#"
          :aria-disabled="ariaDisabled"
          aria-expanded="false"
          @click=${(e: Event) => this.menuClick(e)}
          class=${classMap({ "has-arrow": hasChildren, "has-more": hasMoreChildren })}
          key="${key}"
        >
          <div>${icon && unsafeSVG(icon)} ${title}</div>
          ${hasMoreChildren
            ? html`
                <q-popover
                  class="more-children"
                  trigger="hover"
                  show_arrow="false"
                  block="false"
                  position="right-start"
                  id=${`popover-${key}`}
                >
                  <div class="children-content"></div>
                  <div slot="popover" tip="popover">
                    ${moreChildren &&
                    moreChildren.map(
                      (it: CollapseMenuData) =>
                        html`
                          ${this.renderMoreMenu(it, `popover-${key}`)}
                        `
                    )}
                  </div>
                </q-popover>
              `
            : ""}
        </a>
        ${hasChildren
          ? html`
              <ul aria-expanded="false">
                ${children &&
                children.map(
                  (it: CollapseMenuData) =>
                    html`
                      ${this.renderSubMenu(it)}
                    `
                )}
              </ul>
            `
          : html``}
      </li>
    `;
  }

  /**
   * 菜单更多选项
   * @param data
   */
  renderMoreMenu(data: CollapseMenuData, popoverKey: string): TemplateResult {
    if (!data) return html``;
    const { key, title, children, icon } = data;
    const hasChildren = Boolean(children && children.length);
    return html`
      <div class="more-children-item">
        <div
          @click=${(e: Event) => this.moreMenuClick(e, popoverKey)}
          class=${classMap({ "item-content": true, "has-more": hasChildren })}
          key="${key}"
        >
          <div>${icon && unsafeSVG(icon)} ${title}</div>
          ${hasChildren
            ? html`
                <q-popover
                  class="more-children"
                  trigger="hover"
                  show_arrow="false"
                  block="false"
                  position="right-start"
                  id=${`popover-${key}`}
                >
                  <div class="children-content"></div>
                  <div slot="popover" tip="popover">
                    ${children &&
                    children.map(
                      (it: CollapseMenuData) =>
                        html`
                          ${this.renderMoreMenu(it, `popover-${key}`)}
                        `
                    )}
                  </div>
                </q-popover>
              `
            : ""}
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <style>
        /* 选中 */
        .sidebar-nav .metismenu .a-active {
          background-color: ${this.activeSelectColor} !important;
          color: ${this.activeFontColor} !important;
        }

        /* hover */
        .sidebar-nav .metismenu a:hover {
          background-color: ${this.hoverSelectColor};
          color: ${this.activeSelectColor};
        }

        .more-children-item:hover {
          background-color: ${this.hoverSelectColor};
          color: ${this.activeSelectColor};
        }
      </style>
      <nav class="sidebar-nav">
        <ul class="metismenu">
          ${this.menuData.map((it) => this.renderSubMenu(it))}
        </ul>
      </nav>
    `;
  }

  // 设置组件数据
  setMenuData(data: CollapseMenuData[]) {
    this.menuData = data;
  }

  onSendMessage(e: Event, value: any) {
    const message: IMessage = {
      header: {
        src: this.id,
        dst: "",
        srcType: e.type,
        dstType: "",
      },
      body: value,
    };

    this.componentModel.sendMessage(message);
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-collapse-menu";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "折叠菜单";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "折叠菜单";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "设置组件数据",
                eventType: "setMenuData",
                messageSchema: "",
                messageDemo: "",
              },
              // {
              //   text: "设置组件选中",
              //   eventType: "setMenuSelected",
              //   messageSchema: "",
              //   messageDemo: "",
              // }
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
                menuData: {
                  type: "object",
                  description: "菜单数据",
                  format: "custom",
                  setter: "q-custom-setting",
                },
                activeFontColor: {
                  type: "string",
                  description: "字体高亮颜色",
                  format: "color",
                },
                activeSelectColor: {
                  type: "string",
                  description: "菜单选中颜色",
                  format: "color",
                },
                hoverSelectColor: {
                  type: "string",
                  description: "菜单hover颜色",
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
          click: [
            function (e: IMessage) {
              // @ts-ignore
              this.onSendMessage("click", this.curSelMenu);
            },
          ],
          setMenuData: [
            function (e: IMessage) {
              // @ts-ignore
              this.setMenuData(e.body);
            },
          ],
          setMenuSelected: [
            function (e: IMessage) {
              // @ts-ignore
              this.onSendMessage("click", this.curSelMenu);
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
        _initStyle: "height:150px;width:150px;",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function () {},
          updated: function () {},
          destroy: function () {},
        },
        get menuData() {
          // const data = _.cloneDeep(self.menuData);
          return self.menuData;
        },
        set menuData(value) {
          if (!isArray(value) || isEqual(value, self.menuData)) return;
          const mapTree = (org: any) => {
            if (!org) org = { title: "", key: `menu-${createHash()}`, children: [] };
            const haveChildren = Array.isArray(org.children) && org.children.length > 0;
            const hasMoreChildren = Array.isArray(org.moreChildren) && org.moreChildren.length > 0;
            return {
              key: org.key || `menu-${createHash()}`,
              icon: org.icon || "",
              title: org.title,
              children: haveChildren ? org.children.map((i: any) => mapTree(i)) : [],
              moreChildren: hasMoreChildren ? org.moreChildren.map((i: any) => mapTree(i)) : [],
            };
          };
          self.menuData = value.map((org) => mapTree(org));
        },
        get activeFontColor() {
          return self.activeFontColor;
        },
        set activeFontColor(value) {
          self.activeFontColor = value;
        },
        get activeSelectColor() {
          return self.activeSelectColor;
        },
        set activeSelectColor(value) {
          self.activeSelectColor = value;
        },
        get hoverSelectColor() {
          return self.hoverSelectColor;
        },
        set hoverSelectColor(value) {
          self.hoverSelectColor = value;
        },
      } as unknown as ISchema,
    });
  }

  public readNodes(nodes: CollapseMenuData[], arr: CollapseMenuData[] = []) {
    for (const child of nodes) {
      arr.push(child);
      if (child.children && child.children.length) {
        this.readNodes(child.children, arr);
      }
    }
    return arr;
  }

  // public compareArr(arr1: CollapseMenuData[], arr2: CollapseMenuData[], key: string, childrenKey: string): Boolean {
  //   if (_.differenceBy(arr1, arr2, key).length) return false;
  //   arr1.map((child: any, c: number) => {
  //     this.compareArr(child[childrenKey], arr2[c][childrenKey], key, childrenKey);
  //   });
  //   return true;
  // }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-collapse-menu": QCollapseMenu;
  }
}

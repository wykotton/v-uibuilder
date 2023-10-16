import { html, css, unsafeCSS } from "lit";
import { property, query } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { isEqual, isArray, isBoolean } from "lodash-es";
import { Component } from "../../types/runtime/Component";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { booleanTransform, createHash } from "../../util/utils";
import { ITabsData } from "./setting/types";
import { QPopover } from "../q-popover/q-popover";
import { classMap } from "lit/directives/class-map.js";
import { customHasElement } from "../../types/runtime/decorators/decorators";
import cssIndex from "./index.scss?inline";
import "../q-popover/q-popover";
import "../q-container-mask/q-container-mask";
import "./setting/q-dynamic-tabs-setting";
import "../q-child-page/q-child-page";

/**
 * 动态选项卡组件
 */
@customHasElement("q-dynamic-tabs")
export class QDynamicTabs extends Component {
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
   * 标签数据
   */
  @property({ type: Array })
  tabs: ITabsData[] = [
    {
      id: "fk49p3ao7hgu",
      title: "标签1",
      icon: "",
      bgImage: "",
      hoverImage: "",
      selectedImage: "",
      bgColor: "",
      hoverBgColor: "",
      selectedBgColor: "",
      color: "",
      hoverColor: "",
      selectedColor: "",
      closeable: false,
    },
    {
      id: "gip58y4o2cak",
      title: "标签2",
      icon: "",
      bgImage: "",
      hoverImage: "",
      selectedImage: "",
      bgColor: "",
      hoverBgColor: "",
      selectedBgColor: "",
      color: "",
      hoverColor: "",
      selectedColor: "",
      closeable: false,
    },
  ];

  /**
   * 选中标签
   */
  @property({ type: String })
  selected = "fk49p3ao7hgu";

  /**
   * 显示tab列表
   */
  @property({
    type: Boolean,
    attribute: "show-list",
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  showList = true;

  /**
   * 标签icon图标
   */
  @property({ type: String })
  icon = "";

  /**
   * 标签背景图
   */
  @property({ type: String, attribute: "bg-image" })
  bgImage = "";

  /**
   * 鼠标移入标签背景图
   */
  @property({ type: String, attribute: "hover-bg-image" })
  hoverBgImage = "";

  /**
   * 选中标签背景图
   */
  @property({ type: String, attribute: "selected-bg-image" })
  selectedBgImage = "";

  /**
   * 标签背景色
   */
  @property({ type: String, attribute: "bg-color" })
  bgColor = "#fafafa";

  /**
   * 鼠标移入标签背景色
   */
  @property({ type: String, attribute: "hover-bg-color" })
  hoverBgColor = "#e6f7ff";

  /**
   * 选中标签背景色
   */
  @property({ type: String, attribute: "selected-bg-color" })
  selectedBgColor = "#1890ff";

  /**
   * 标签文字颜色
   */
  @property({ type: String })
  color = "#000000";

  /**
   * 标签文字颜色
   */
  @property({ type: String, attribute: "hover-color" })
  hoverColor = "";

  /**
   * 选中标签文字颜色
   */
  @property({ type: String, attribute: "selected-color" })
  selectedColor = "#ffffff";

  @query("q-popover")
  public popoverRef!: QPopover;

  @query(".tabs-nav")
  public tabsNav!: HTMLElement;

  @query(".nav-warp")
  public navWarp!: HTMLElement;

  @query(".tabs-content")
  public tabsContent!: HTMLElement;

  // tab位置
  @property()
  public tabLocation = "top";

  // 隐藏tab标签
  @property()
  public showTabs = true;

  // 调换tabs位置
  @property()
  public changeTabsPos = false;

  // 开启左右位置时字体垂直布局
  @property()
  public fontVertical = true;

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  // 动态tabs数据
  public dynamicTabs: ITabsData[] = [];

  // 新增标签默认数据
  public defaultTabs() {
    return {
      id: createHash(),
      title: "新建标签",
      icon: "",
      bgImage: "",
      hoverImage: "",
      selectedImage: "",
      bgColor: "",
      hoverBgColor: "",
      selectedBgColor: "",
      color: "",
      hoverColor: "",
      selectedColor: "",
      closeable: true,
    };
  }

  // @changeProperty()
  @property({ type: Number, attribute: "tab-width" })
  tabsWidth = 20;

  // @changeProperty()
  @property({ type: Number, attribute: "tab-height" })
  tabsHeight = 6;

  // 开启自定义tab宽高
  _customSize = false;

  // nav滚动位置
  public navScroll = {
    x: 0,
    y: 0,
  };

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
  }

  /**
   * 点击标签
   * @param id
   * @returns
   */
  public tabClick(id: string, index?: number) {
    if (!id && !index) return;
    if (id) {
      this.selected = id;
    } else if (!id && index !== undefined) {
      this.selected = this?.tabsNav?.querySelectorAll(".tabs")[index - 1]?.id?.split("-")[1];
    }

    this.popoverRef?.leave?.();
    const tabItem = [...this.tabs, ...this.dynamicTabs].find((item) => item.id === this.selected);
    this.onSendMessage("tabClick", tabItem);
    setTimeout(() => {
      this.tabScroll();
    }, 0);
  }

  /**
   * 导航栏自动居中
   */
  public tabScroll() {
    if (!this.selected || !this.tabsNav || !this.navWarp) return;
    const tabElement = this.navWarp.querySelector(`#tab-${this.selected}`) as HTMLElement;
    if (!tabElement) return;
    const viewWidth = this.tabsNav.offsetWidth;
    const left = tabElement.offsetLeft;
    const width = tabElement.offsetWidth;
    this.navWarp.scrollLeft = left + width / 2 - viewWidth / 2;
  }

  /**
   * 关闭标签
   * @param id
   */
  public tabClose(id: string) {
    const index = this.dynamicTabs.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.dynamicTabs.splice(index, 1);
      if (id === this.selected) {
        this.selected = this.dynamicTabs[index - 1]?.id || this.tabs[this.tabs.length - 1]?.id || "";
      }
      this.requestUpdate();
    }
  }

  /**
   * 检查selected是否在tabs数据中存在
   */
  public checkUpSelected() {
    const index = this.tabs.findIndex((item) => item.id === this.selected);
    if (index === -1) {
      this.selected = this.tabs[0]?.id || "";
    }
  }

  /**
   * 添加动态tab
   * @param data
   */
  public addTabs(data: Record<string, any>) {
    try {
      if (!this.tabsContent) return;
      const { tabs = {}, childPage: { childPageId = "", value = "{}", domain = "" } = {} } = data;
      const temp = { ...this.defaultTabs(), ...tabs };
      const index = this.dynamicTabs.findIndex((item) => item.title === temp.title);
      if (index > -1) {
        this.tabClick(this.dynamicTabs[index].id);
        return;
      }
      this.dynamicTabs.push(temp);
      this.requestUpdate();
      setTimeout(() => {
        const content = this.tabsContent.querySelector(`#content-${temp.id}`) as HTMLElement;
        if (!content) return;
        const childPage = document.createElement("q-child-page");
        childPage.slot = temp.id;
        childPage.childPageId = childPageId;
        childPage.value = value;
        domain ? (childPage.domain = domain) : void 0;
        childPage.setAttribute("dynamic", "true");
        if (childPage.componentModel) {
          childPage.componentModel.updateModelEntity(
            JSON.stringify({ initStyle: "width: 100%;height:100%;overflow:hidden" })
          );
        }
        this.append(childPage);
        this.tabClick(temp.id);
      }, 0);
    } catch (error) {
      console.log(error);
    }
  }

  createVerticalFont(value: string) {
    let temp = ``;
    if (this.fontVertical) {
      for (let i = 0; i < value.length; i++) {
        temp += `${value[i]}<br/>`;
      }
    } else {
      temp = value;
    }
    return temp;
  }

  render() {
    return html`
      <div
        class="${classMap({
          "tabs-container": true,
          ["tabs-" + this.tabLocation]: true,
        })}"
      >
        <div
          class="${classMap({
            ["tabs-hide"]: !this.showTabs,
            "tabs-nav": true,
          })}"
          style="width: ${this.tabLocation === "right" || this.tabLocation === "left"
            ? this.tabsWidth + "px"
            : "unset"}"
        >
          <div
            class="${classMap({
              "nav-warp": true,
              "has-order": this.changeTabsPos,
            })}"
          >
            <div
              class="${classMap({
                "nav-tabs": true,
                "flex-auto": this.changeTabsPos,
              })}"
            >
              ${this.tabs.map(
                (item) =>
                  html`
                    <div
                      class="tabs"
                      id="tab-${item.id}"
                      style=" 
                        background-color: ${item.id === this.selected
                        ? item.selectedBgColor || this.selectedBgColor
                        : item.bgColor || this.bgColor};
                        background-image: ${item.id === this.selected
                        ? `url("${item.selectedImage || this.selectedBgImage}")`
                        : `url("${item.bgImage || this.bgImage}")`};
                        color: ${item.id === this.selected
                        ? item.selectedColor || this.selectedColor
                        : item.color || this.color};
                        padding: ${this.tabLocation === "top" || this.tabLocation === "bottom"
                        ? `${this.tabsHeight}px ${this.tabsWidth}px`
                        : `0 0`};
                        height: ${this.tabLocation === "left" || this.tabLocation === "right"
                        ? `${this.tabsHeight}px`
                        : `100%`};
                      "
                      @click=${() => {
                        this.tabClick(item.id);
                      }}
                    >
                      ${item.icon || this.icon
                        ? html`
                            <div class="icon">${unsafeHTML(item.icon || this.icon)}</div>
                          `
                        : ""}
                      <div
                        class="${classMap({
                          title: true,
                          "line-height-1": this.tabLocation === "left" || this.tabLocation === "right",
                        })}"
                      >
                        ${this.tabLocation === "left" || this.tabLocation === "right"
                          ? unsafeHTML(this.createVerticalFont(item.title || "未命名标签"))
                          : item.title || "未命名标签"}
                      </div>
                      ${item.closeable
                        ? html`
                            <div class="closeable">
                              <svg
                                class="q-input_clear"
                                fill="currentColor"
                                width="1em"
                                height="1em"
                                focusable="false"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                @click=${(e: any) => {
                                  e.stopPropagation();
                                  this.tabClose(item.id);
                                }}
                              >
                                <path
                                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                                />
                              </svg>
                            </div>
                          `
                        : ""}
                    </div>
                  `
              )}
              ${this.dynamicTabs.map(
                (item) =>
                  html`
                    <div
                      class="tabs"
                      id="tab-${item.id}"
                      style=" 
                        background-color: ${item.id === this.selected
                        ? item.selectedBgColor || this.selectedBgColor
                        : item.bgColor || this.bgColor};
                        background-image: ${item.id === this.selected
                        ? `url("${item.selectedImage || this.selectedBgImage}")`
                        : `url("${item.bgImage || this.bgImage}")`};
                        color: ${item.id === this.selected
                        ? item.selectedColor || this.selectedColor
                        : item.color || this.color};
                        padding: ${this.tabLocation === "top" || this.tabLocation === "bottom"
                        ? `${this.tabsHeight}px ${this.tabsWidth}px`
                        : `0 0`} ;
                        height: ${this.tabLocation === "left" || this.tabLocation === "right"
                        ? `${this.tabsHeight}px`
                        : `100%`};
                      "
                      @click=${() => {
                        this.tabClick(item.id);
                      }}
                    >
                      ${item.icon || this.icon
                        ? html`
                            <div class="icon">${unsafeHTML(item.icon || this.icon)}</div>
                          `
                        : ""}
                      <div
                        class="${classMap({
                          title: true,
                          "line-height-1": this.tabLocation === "left" || this.tabLocation === "right",
                        })}"
                      >
                        ${this.tabLocation === "left" || this.tabLocation === "right"
                          ? unsafeHTML(this.createVerticalFont(item.title || "未命名标签"))
                          : item.title || "未命名标签"}
                      </div>
                      ${item.closeable
                        ? html`
                            <div class="closeable">
                              <svg
                                class="q-input_clear"
                                fill="currentColor"
                                width="1em"
                                height="1em"
                                focusable="false"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                                @click=${(e: any) => {
                                  e.stopPropagation();
                                  this.tabClose(item.id);
                                }}
                              >
                                <path
                                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                                />
                              </svg>
                            </div>
                          `
                        : ""}
                    </div>
                  `
              )}
            </div>
          </div>
          <div class="nav-list">
            ${this.showList
              ? html`
                  <q-popover position="bottom" trigger="hover" showArrow="false">
                    <div class="list-icon">
                      <svg class="icon" width="1em" height="1em" viewBox="0 0 1024 1024">
                        <path
                          fill="#333333"
                          d="M223.962372 607.897867c-52.980346 0-95.983874-43.003528-95.983874-95.983874s43.003528-95.983874 95.983874-95.983874 95.983874 43.003528 95.983874 95.983874S276.942718 607.897867 223.962372 607.897867z"
                        />
                        <path
                          fill="#333333"
                          d="M511.913993 607.897867c-52.980346 0-95.983874-43.003528-95.983874-95.983874s43.003528-95.983874 95.983874-95.983874 95.983874 43.003528 95.983874 95.983874S564.894339 607.897867 511.913993 607.897867z"
                        />
                        <path
                          fill="#333333"
                          d="M800.037628 607.897867c-52.980346 0-95.983874-43.003528-95.983874-95.983874s43.003528-95.983874 95.983874-95.983874 95.983874 43.003528 95.983874 95.983874S852.84596 607.897867 800.037628 607.897867z"
                        />
                      </svg>
                    </div>
                    <div class="list-content" slot="popover">
                      ${this.tabs.map(
                        (item) => html`
                          <div
                            class="items"
                            style="
                              background-color: ${item.id === this.selected
                              ? item.selectedBgColor || this.selectedBgColor
                              : item.bgColor || this.bgColor};
                              color: ${item.id === this.selected
                              ? item.selectedColor || this.selectedColor
                              : item.color || this.color};
                            "
                            @click=${() => {
                              this.tabClick(item.id);
                            }}
                          >
                            ${item.title || "未命名标签"}
                          </div>
                        `
                      )}
                      ${this.dynamicTabs.map(
                        (item) => html`
                          <div
                            class="items"
                            style="
                              background-color: ${item.id === this.selected
                              ? item.selectedBgColor || this.selectedBgColor
                              : item.bgColor || this.bgColor};
                              color: ${item.id === this.selected
                              ? item.selectedColor || this.selectedColor
                              : item.color || this.color};
                            "
                            @click=${() => {
                              this.tabClick(item.id);
                            }}
                          >
                            ${item.title || "未命名标签"}
                          </div>
                        `
                      )}
                    </div>
                  </q-popover>
                `
              : ""}
          </div>
        </div>
        <div class="tabs-content">
          ${this.tabs.map(
            (item) =>
              html`
                <div
                  class="content-panel"
                  id="content-${item.id}"
                  style="display: ${item.id === this.selected ? "block" : "none"};"
                >
                  <slot name="${item.id}" class="dropzone">
                    <q-container-mask text="组件降落区"></q-container-mask>
                  </slot>
                </div>
              `
          )}
          ${this.dynamicTabs.map(
            (item) =>
              html`
                <div
                  class="content-panel"
                  id="content-${item.id}"
                  style="display: ${item.id === this.selected ? "block" : "none"};"
                >
                  <slot name="${item.id}"></slot>
                </div>
              `
          )}
        </div>
      </div>
    `;
  }

  onSendMessage(type: string, body: any) {
    const message: IMessage = {
      header: {
        src: this.id,
        dst: "",
        srcType: type,
        dstType: "",
      },
      body,
    };
    this.sendMessage(message);
  }

  setTabLocation() {
    setTimeout(() => {
      if (this._customSize) return;
      if (this.tabLocation === "left" || this.tabLocation === "right") {
        if (this.fontVertical) {
          this.componentModel.model.tabsWidth = 30;
          this.componentModel.model.tabsHeight = 90;
        } else {
          this.componentModel.model.tabsWidth = 70;
          this.componentModel.model.tabsHeight = 30;
        }
      } else {
        this.componentModel.model.tabsWidth = 20;
        this.componentModel.model.tabsHeight = 6;
      }
    }, 50);
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-dynamic-tabs";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "动态选项卡";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "动态选项卡组件,可以动态创建模板内容,切换不同内容";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "创建动态选项卡",
                eventType: "createDynamicTabs",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "选中选项卡",
                eventType: "clickTabs",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "选项卡点击",
                eventType: "tabClick",
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
                tabs: {
                  type: "object",
                  description: "tabs数据",
                  format: "custom",
                  setter: "q-dynamic-tabs-setting",
                },
                tabLocation: {
                  description: "tabs位置",
                  type: "string",
                  enum: [
                    { label: "上", value: "top" },
                    { label: "下", value: "bottom" },
                    { label: "左", value: "left" },
                    { label: "右", value: "right" },
                  ],
                },
                showTabs: {
                  type: "boolean",
                  description: "显示tabs标签",
                },
                showList: {
                  type: "boolean",
                  description: "显示tabs侧边列表",
                },
                changeTabsPos: {
                  type: "boolean",
                  description: "调换tabs位置",
                },
                fontVertical: {
                  type: "boolean",
                  description: "文字是否垂直显示(位置为左或右时生效)",
                },
                customSize: {
                  type: "boolean",
                  description: "自定义tab宽高",
                  fn: function (config: any) {
                    if (!config?.parentSchema) return;
                    if (typeof config.value === "boolean") {
                      config.parentSchema.properties.tabsWidth.display = config.value;
                      config.parentSchema.properties.tabsHeight.display = config.value;
                    }
                  },
                },
                tabsWidth: {
                  type: "number",
                  description: "tabs宽",
                  minimum: 0,
                  display: false,
                },
                tabsHeight: {
                  type: "number",
                  description: "tabs高",
                  minimum: 0,
                  display: false,
                },
                icon: {
                  type: "string",
                  description: "标签icon",
                },
                bgImage: {
                  type: "string",
                  description: "标签背景图",
                },
                selectedBgImage: {
                  type: "string",
                  description: "标签选中背景图",
                },
                bgColor: {
                  type: "string",
                  description: "标签背景色",
                  format: "color",
                },
                selectedBgColor: {
                  type: "string",
                  description: "标签选中背景色",
                  format: "color",
                },
                color: {
                  type: "string",
                  description: "标签文字颜色",
                  format: "color",
                },
                selectedColor: {
                  type: "string",
                  description: "标签选中文字颜色",
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
          createDynamicTabs: [
            function (e: IMessage) {
              if (typeof e.body === "object") {
                // @ts-ignore
                this.addTabs(e.body);
              }
            },
          ],
          clickTabs: [
            function (e: IMessage) {
              if (typeof e.body === "string") {
                // @ts-ignore
                this.tabClick(e.body);
              }
              if (typeof e.body === "number") {
                // @ts-ignore
                this.tabClick("", e.body);
              }
            },
          ],
        },
        _onDOMEvent: {},
        _initStyle: "height:300px;width:300px;background-color:#ffffff;font-size: 12px",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function () {},
          updated: function () {},
          destroy: function () {},
        },
        get customSize() {
          return self._customSize;
        },
        set customSize(value) {
          if (!isBoolean(value)) return;
          self._customSize = value;
        },
        get tabs() {
          return self.tabs;
        },
        set tabs(value) {
          if (!isArray(value) || isEqual(value, self.tabs)) return;
          self.tabs = value;
          self.checkUpSelected();
        },
        get selected() {
          return self.selected;
        },
        set selected(value) {
          self.selected = String(value);
          self.checkUpSelected();
        },
        get showList() {
          return self.showList;
        },
        set showList(value) {
          if (!isBoolean(value)) return;
          self.showList = value;
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
        get selectedBgImage() {
          return self.selectedBgImage;
        },
        set selectedBgImage(value) {
          self.selectedBgImage = String(value);
        },
        get bgColor() {
          return self.bgColor;
        },
        set bgColor(value) {
          self.bgColor = String(value);
        },
        get selectedBgColor() {
          return self.selectedBgColor;
        },
        set selectedBgColor(value) {
          self.selectedBgColor = String(value);
        },
        get color() {
          return self.color;
        },
        set color(value) {
          self.color = String(value);
        },
        get selectedColor() {
          return self.selectedColor;
        },
        set selectedColor(value) {
          self.selectedColor = String(value);
        },
        get tabLocation() {
          return self.tabLocation;
        },
        set tabLocation(value) {
          if (value !== self.tabLocation) {
            self.tabLocation = value;
            self.setTabLocation();
          }
        },
        get showTabs() {
          return self.showTabs;
        },
        set showTabs(value) {
          if (value !== self.showTabs) self.showTabs = value;
        },
        get tabsWidth() {
          return self.tabsWidth;
        },
        set tabsWidth(value) {
          if (value !== self.tabsWidth) self.tabsWidth = value;
        },
        get tabsHeight() {
          return self.tabsHeight;
        },
        set tabsHeight(value) {
          if (value !== self.tabsHeight) self.tabsHeight = value;
        },
        get changeTabsPos() {
          return self.changeTabsPos;
        },
        set changeTabsPos(value) {
          if (value !== self.changeTabsPos) {
            self.changeTabsPos = value;
            self.setTabLocation();
          }
        },
        get fontVertical() {
          return self.fontVertical;
        },
        set fontVertical(value) {
          if (value !== self.fontVertical) {
            self.fontVertical = value;
            self.setTabLocation();
          }
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-dynamic-tabs": QDynamicTabs;
  }
}

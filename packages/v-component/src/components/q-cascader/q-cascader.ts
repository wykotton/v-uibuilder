import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { cloneDeep, isArray, isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createApp, defineComponent, ref, watch } from "vue";
import { Cascader } from "ant-design-vue";
import { TYPE_NAME } from "../q-attribute-setting/type/type";
import locale from "ant-design-vue/lib/date-picker/locale/zh_CN";
import antdCss from "ant-design-vue/dist/antd.css?inline";
import cssIndex from "./index.scss?inline";
import { changeProperty } from "../../types/runtime/decorators/decorators";
import "./q-cascader-custom-setting";
import type { CascaderProps } from "ant-design-vue";
import { styleToObj, unmountInstance, sendFormMsg } from "../../util/utils";
import $ from "jquery";
import type { ShowSearchType } from "ant-design-vue/es/cascader";
import { classMap } from "lit/directives/class-map.js";
/**
 * 树形组件
 */
@customElement("q-cascader")
export class QCascader extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
    css`
      ${unsafeCSS(antdCss)}
    `,
  ];

  @query(".q-cascader")
  treeContainer!: HTMLDivElement;

  /**
   * 组件实例
   */
  componentInstance: any = null;

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  @changeProperty()
  @property({ type: Array, attribute: "options" })
  options: CascaderProps["options"] = [
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

  @changeProperty()
  @property({ type: Array })
  value = [] as Array<string>;

  cascsderStyle = {
    background: "#FFFFFF",
    color: "rgba(0, 0, 0, 0.85)",
    fontSize: "14px",
  };

  // 是否支持清除
  allowClear = true;
  // 自动获取焦点
  autofocus = false;

  dropdownStyle = `width:600px`;
  // 是否有边框
  bordered = true;
  // 单选时生效
  changeOnSelect = false;
  // 默认选中值
  defaultValue = [];
  // 禁用
  disabled = false;

  getPopupContainer = function () {
    return document.body;
  };

  // 选择后的渲染
  displayRender = function ({ labels, selectedOptions }: { labels: any[]; selectedOptions: CascaderProps["options"] }) {
    return labels.join(" / ");
  };
  // 次级菜单的展开方式
  expandTrigger = "click";
  // 自定义字段
  fieldNames = { label: "label", value: "value", children: "children" };
  // 最多显示多少个 tag
  maxTagCount = 1;

  // 隐藏 tag 时显示的内容
  maxTagPlaceholder = function (omittedValues: any) {
    return `+${omittedValues.length}`;
  };
  // 多选节点
  multiple = false;
  // 下拉为空时显示内容
  notFoundContent = "not Found";

  @changeProperty()
  // 控制浮层显影
  open = false;

  // 输入框占位符
  placeholder = "请选择";

  // 浮层预设位置
  placement = "bottomLeft"; //bottomLeft | bottomRight | topLeft | topRight


  // 搜索值
  // @property()
  // searchValue = "";

  // 在选择框中显示搜索框
  showSearch = false;

  // 接收 inputValue path 两个参数，当 path 符合筛选条件时，应返回 true，反之则返回 false。
  filter: ShowSearchType["filter"] = function (inputValue: any, path: any): boolean {
    return path.some((option: any) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  };

  // 搜索结果展示数量
  limit = 50;

  // 搜索结果列表是否与输入框同宽
  matchInputWidth = true;

  // 输入框大小
  size = "default"; // large | default | small

  // 自定义tag类型
  tagRenderSlot: any;

  // 高亮颜色
  @property({ type: String })
  hoverColor = "#f5f5f5";

  @property({ type: String })
  name = "QCascader";

  constructor() {
    super();
    this.initModel();
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    if (!this.componentInstance && this.treeContainer) {
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
    // this.messageData = { type, value };
    // this.onSendMessage("eventInput");
  }

  /**
   * 创建树VUE组件
   */
  createVueComponent = () => {
    const self = this;
    const component = defineComponent({
      template: `
        <a-cascader
          v-model:value="value"
          :options="options"
          :placeholder="placeholder"
          :dropdownStyle="tempDropdownStyle"
          :getPopupContainer="getPopupContainer"
          :allowClear="allowClear"
          :bordered="bordered"
          :changeOnSelect="changeOnSelect"
          :defaultValue="defaultValue"
          :disabled="disabled"
          :displayRender="displayRender"
          :expandTrigger="expandTrigger"
          :fieldNames="fieldNames"
          :maxTagCount="maxTagCount"
          :maxTagPlaceholder="maxTagPlaceholder"
          :multiple="multiple"
          :notFoundContent="notFoundContent"
          :open="open"
          :placement="placement"
          :show-search="tempShowSearch"
          :size="size"
          :dropdownClassName="id"
          @change="handleChange"
          :name="name"
          @dropdownVisibleChange="handleDropdownVisibleChange"
          @search="handleSearch"
        />
      `,
      name: "q-cascader",
      props: {},
      components: {},
      setup(props: any, context: any) {
        const options = ref(self.options);
        const value = ref(self.value);
        const name = ref(self.name);
        const dropdownStyle = ref(self.dropdownStyle);
        const getPopupContainer = ref(self.getPopupContainer);
        const allowClear = ref(self.allowClear);
        const autofocus = ref(self.autofocus);
        const bordered = ref(self.bordered);
        const changeOnSelect = ref(self.changeOnSelect);
        const defaultValue = ref(self.defaultValue);
        const disabled = ref(self.disabled);
        const displayRender = ref(self.displayRender);
        const expandTrigger = ref(self.expandTrigger);
        const fieldNames = ref(self.fieldNames);
        const maxTagCount = ref(self.maxTagCount);
        const maxTagPlaceholder = ref(self.maxTagPlaceholder);
        const multiple = ref(self.multiple);
        const notFoundContent = ref(self.notFoundContent);
        const open = ref(self.open);
        const placeholder = ref(self.placeholder);
        const placement = ref(self.placement);
        // const searchValue = ref(self.searchValue);
        const showSearch = ref(self.showSearch);
        const filter = ref(self.filter);
        const limit = ref(self.limit);
        const matchInputWidth = ref(self.matchInputWidth);
        const tagRenderSlot = ref(self.tagRenderSlot);
        const size = ref(self.size);
        const id = ref(self.id);
        const tempShowSearch = ref();
        const tempDropdownStyle = ref();

        /**
         * 监听tree属性变更
         */
        function watchAttributeChange(type: string, value: any) {
          console.log("触发更新");
          // @ts-ignore
          this[type] = value;
        }

        watch(
          dropdownStyle,
          (v) => {
            tempDropdownStyle.value = v ? styleToObj(v) : {};
          },
          { immediate: true }
        );

        watch(
          showSearch,
          (v) => {
            tempShowSearch.value = v && { filter };
          },
          { immediate: true }
        );

        function handleChange(value: Array<string>, selectedOptions: CascaderProps) {
          self.value = value
          sendFormMsg(self)
          self.onSendMessage("change", { value, selectedOptions });
        }

        function handleDropdownVisibleChange(value: Array<string>) {
          self.onSendMessage("dropdownVisibleChange", value);
        }

        function handleSearch(value: Array<string>) {

          self.onSendMessage("search", value);
        }

        return {
          props,
          id,
          name,
          tempShowSearch,
          tempDropdownStyle,
          TYPE_NAME,
          locale,
          dropdownStyle,
          getPopupContainer,
          options,
          value,
          allowClear,
          autofocus,
          bordered,
          changeOnSelect,
          defaultValue,
          disabled,
          displayRender,
          expandTrigger,
          fieldNames,
          maxTagCount,
          maxTagPlaceholder,
          multiple,
          notFoundContent,
          open,
          placeholder,
          placement,
          // searchValue,
          showSearch,
          filter,
          limit,
          matchInputWidth,
          tagRenderSlot,
          size,
          watchAttributeChange,
          handleChange,
          handleDropdownVisibleChange,
          handleSearch,
        };
      },
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(Cascader);
    this.componentInstance.mount(this.treeContainer);
  };

  /**
   * 数据路由
   * @param e
   * @param value
   */
  onSendMessage(type: string, value: any) {
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

  disconnectedCallback() {
    super.disconnectedCallback();
    const cascadePopStyle = $(`#${this.id}-pop-style`);
    if (cascadePopStyle.length) cascadePopStyle.remove();
    if (!this.isConnected) {
      // 断开文档连接，说明元件已被删除
      unmountInstance(this);
    }
  }

  // 修改弹出层 hover颜色
  createStyleElement() {
    const cascadePopStyle = $(`#${this.id}-pop-style`);
    if (cascadePopStyle.length) {
      cascadePopStyle.html(`
       .${this.id} .ant-cascader-menu-item:hover {
          background: ${this.hoverColor} !important;
        }
      `);
    } else {
      $("head").append(`
      <style id="${this.id}-pop-style">
        .${this.id} .ant-cascader-menu-item:hover {
          background: ${this.hoverColor} !important;
        }
      </style>
    `);
    }
  }

  /**
   * 修改级联选择器option
   * @param data
   */
  changeOptions(data: CascaderProps["options"]) {
    try {
      this.options = data;
      this.setVueComponentData("options", data);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * 获取级联选择器的值
   */
  getValue() {
    return this.value;
  }

  public resetValue() {
    this.changeValue();
  }

  /**
   * 设置value值
   */
  public setValue(data: Array<string>) {
    this.changeValue(data);
  }

  /**
   * 修改级联选择器值
   * @param data
   */
  changeValue(data: Array<string> = this.defaultValue) {
    try {
      this.value = data;
      this.setVueComponentData("value", data);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * 设置树组件的值
   */
  setTreeData(e: IMessage) {
    try {
      if (!isArray(e.body)) throw "传入的数据与树组件不匹配";
      this.options = e.body;
      this.setVueComponentData("options", e.body);
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return html`
      <style>
        :host .ant-cascader {
          background-color: ${this.cascsderStyle.background};
          color: ${this.cascsderStyle.color};
          font-size: ${this.cascsderStyle.fontSize};
        }
      </style>
      <div
        class=${classMap({
          "q-cascader": true,
          [`q-cascader-${this.id}`]: true,
        })}
      ></div>
    `;
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-cascader";
          },
          get type() {
            return EComponentType.FROM;
          },
          get text() {
            return "级联选择器";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "级联选择器组件";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "更改组件可选项数据",
                eventType: "changeOptions",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "更改组件选中值",
                eventType: "changeValue",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "重置组件选中值",
                eventType: "resetInfo",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "设置组件选中值",
                eventType: "setInfo",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "级联选择值变化",
                eventType: "change",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "弹窗显隐",
                eventType: "dropdownVisibleChange",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "搜索回调",
                eventType: "search",
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
                treeData: {
                  type: "object",
                  description: "级联选择器数据",
                  format: "custom",
                  setter: "q-cascader-custom-setting",
                },
                name: {
                  type: "string",
                  description: "唯一标识",
                },
                expandTrigger: {
                  type: "string",
                  description: "菜单展开方式",
                  enum: [
                    { value: "click", label: "点击" },
                    { value: "hover", label: "鼠标移入/移出" },
                  ],
                },
                value: {
                  type: "string",
                  description: "值",
                },
                defaultValue: {
                  type: "string",
                  description: "默认值",
                },
                getPopupContainer: {
                  type: "string",
                  description: "弹出层父容器",
                  format: "code",
                },
                displayRender: {
                  type: "string",
                  description: "自定义输入框内容",
                  format: "code",
                },
                fieldNames: {
                  type: "string",
                  description: "自定义展示字段",
                  format: "textarea",
                },
                multiple: {
                  type: "boolean",
                  description: "开启多选",
                },
                maxTagCount: {
                  type: "number",
                  description: "展示标签数 (请在开启多选前修改，开启多选后静止修改)",
                  minimum: 0,
                },
                maxTagPlaceholder: {
                  type: "string",
                  description: "隐藏 tag 时显示的内容",
                },
                allowClear: {
                  type: "boolean",
                  description: "清除按钮",
                },
                autofocus: {
                  type: "boolean",
                  description: "自动聚焦",
                },
                bordered: {
                  type: "boolean",
                  description: "是否有边框",
                },
                changeOnSelect: {
                  type: "boolean",
                  description: "单选也生效",
                },
                disabled: {
                  type: "boolean",
                  description: "禁用",
                },
                open: {
                  type: "boolean",
                  description: "控制浮层显隐",
                },
                notFoundContent: {
                  type: "string",
                  description: "当下拉列表为空时显示的内容",
                },
                placeholder: {
                  type: "string",
                  description: "输入框占位文本",
                },
                placement: {
                  type: "string",
                  description: "浮层预设位",
                  enum: [
                    { value: "bottomLeft", label: "左下" },
                    {
                      value: "bottomRight",
                      label: "右下",
                    },
                    { value: "topLeft", label: "左上" },
                    { value: "topRight", label: "右上" },
                  ],
                },

                size: {
                  type: "string",
                  description: "输入框尺寸",
                  enum: [
                    { value: "large", label: "大" },
                    { value: "default", label: "默认" },
                    {
                      value: "small",
                      label: "小",
                    },
                  ],
                },
                tagRenderSlot: {
                  type: "string",
                  description: "自定义 tag 内容，多选时生效",
                  format: "code",
                },
                dropdownStyle: {
                  type: "string",
                  description: "弹出层样式",
                  format: "style",
                },
                hoverColor: {
                  type: "string",
                  description: "弹出层hover颜色",
                  format: "color",
                },
                showSearch: {
                  type: "boolean",
                  description: "开启搜索(以下配置需要开启搜索才生效)",
                },
                // searchValue: {
                //   type: "string",
                //   description: "搜索值",
                // },
                filter: {
                  type: "string",
                  description: "搜索过滤",
                  format: "code",
                },
                limit: {
                  type: "number",
                  description: "搜索结果展示数量",
                  minimum: 0,
                },
                matchInputWidth: {
                  type: "boolean",
                  description: "搜索结果列表是否与输入框同宽",
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
          changeOptions: [
            function (e: IMessage) {
              // @ts-ignore
              this.changeOptions(e.body);
            },
          ],
          changeValue: [
            function (e: IMessage) {
              // @ts-ignore
              this.changeValue(e.body);
            },
          ],
          resetInfo: [
            function (e: IMessage) {
              // @ts-ignore
              this.resetInfo(self.defaultValue);
            },
          ],
          setInfo: [
            function (e: IMessage) {
              // @ts-ignore
              this.setInfo(e.body);
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
        _initStyle: "height:32px;width:180px;overflow:auto",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function () {},
          updated: function () {
            console.log("update");
          },
          destroy: function () {},
        },
        _eventInterception: {},
        get treeData() {
          // const data = _.cloneDeep(self.menuData);
          return self.options;
        },
        set treeData(value) {
          if (!isArray(value) || isEqual(value, self.options)) {
            self.setVueComponentData("options", self.options);
            return;
          }
          self.options = value;
          self.setVueComponentData("options", self.options);
        },
        get dropdownStyle() {
          return self.dropdownStyle;
        },
        set dropdownStyle(value: string) {
          if (value !== self.dropdownStyle) {
            self.setVueComponentData("dropdownStyle", cloneDeep(value));
            self.dropdownStyle = value;
          }
        },
        get hoverColor() {
          return self.hoverColor;
        },
        set hoverColor(value: string) {
          if (value !== self.hoverColor) {
            self.hoverColor = value;
            self.createStyleElement();
          }
        },
        get allowClear() {
          return self.allowClear;
        },
        set allowClear(value) {
          if (value !== self.allowClear) {
            self.allowClear = value;
            self.setVueComponentData("allowClear", cloneDeep(value));
          }
        },
        get autofocus() {
          return self.autofocus;
        },
        set autofocus(value) {
          if (value !== self.autofocus) {
            self.autofocus = value;
            self.setVueComponentData("autofocus", cloneDeep(value));
          }
        },
        get bordered() {
          return self.bordered;
        },
        set bordered(value) {
          if (value !== self.bordered) {
            self.bordered = value;
            self.setVueComponentData("bordered", cloneDeep(value));
          }
        },
        get changeOnSelect() {
          return self.changeOnSelect;
        },
        set changeOnSelect(value) {
          if (value !== self.changeOnSelect) {
            self.changeOnSelect = value;
            self.setVueComponentData("changeOnSelect", cloneDeep(value));
          }
        },
        get value() {
          return JSON.stringify(cloneDeep(self.value));
        },
        set value(value) {
          if(!value) return
          const temp = typeof value === "string" ? JSON.parse(value) : value;
          if (temp !== self.value) {
            self.value = temp;
            // self.searchValue = "";
            self.setVueComponentData("value", cloneDeep(temp));
          }
        },
        get defaultValue() {
          return JSON.stringify(cloneDeep(self.defaultValue));
        },
        set defaultValue(value) {
          const temp = JSON.parse(value);
          if (temp !== self.defaultValue) {
            self.defaultValue = temp;
            self.setVueComponentData("defaultValue", cloneDeep(temp));
          }
        },
        get disabled() {
          return self.disabled;
        },
        set disabled(value) {
          if (value !== self.disabled) {
            self.disabled = value;
            self.setVueComponentData("disabled", cloneDeep(value));
          }
        },
        get getPopupContainer() {
          return self.getPopupContainer;
        },
        set getPopupContainer(value) {
          if (value !== self.getPopupContainer) {
            self.getPopupContainer = value;
            self.setVueComponentData("getPopupContainer", cloneDeep(value));
          }
        },
        get displayRender() {
          return self.displayRender;
        },
        set displayRender(value) {
          if (value !== self.displayRender) {
            self.displayRender = value;
            self.setVueComponentData("displayRender", cloneDeep(value));
          }
        },
        get expandTrigger() {
          return self.expandTrigger;
        },
        set expandTrigger(value) {
          if (value !== self.expandTrigger) {
            self.expandTrigger = value;
            self.setVueComponentData("expandTrigger", cloneDeep(value));
          }
        },
        get fieldNames() {
          return JSON.stringify(cloneDeep(self.fieldNames));
        },
        set fieldNames(value) {
          if (value !== JSON.stringify(cloneDeep(self.fieldNames))) {
            self.fieldNames = JSON.parse(value);
            self.setVueComponentData("fieldNames", cloneDeep(self.fieldNames));
          }
        },
        get maxTagCount() {
          return self.maxTagCount;
        },
        set maxTagCount(value) {
          if (value !== self.maxTagCount) {
            if (self.multiple) {
              return;
            }
            self.maxTagCount = value;
            self.setVueComponentData("maxTagCount", cloneDeep(value));
          }
        },
        get maxTagPlaceholder() {
          return self.maxTagPlaceholder;
        },
        set maxTagPlaceholder(value) {
          if (value !== self.maxTagPlaceholder) {
            self.maxTagPlaceholder = value;
            self.setVueComponentData("maxTagPlaceholder", cloneDeep(value));
          }
        },
        get multiple() {
          return self.multiple;
        },
        set multiple(value) {
          if (value !== self.multiple) {
            self.multiple = value;
            self.setVueComponentData("multiple", cloneDeep(value));
          }
        },
        get notFoundContent() {
          return self.notFoundContent;
        },
        set notFoundContent(value) {
          if (value !== self.notFoundContent) {
            self.notFoundContent = value;
            self.setVueComponentData("notFoundContent", cloneDeep(value));
          }
        },
        get open() {
          return self.open;
        },
        set open(value) {
          if (value !== self.open) {
            self.open = value;
            self.setVueComponentData("open", cloneDeep(value));
          }
        },
        get placeholder() {
          return self.placeholder;
        },
        set placeholder(value) {
          if (value !== self.placeholder) {
            self.placeholder = value;
            self.setVueComponentData("placeholder", cloneDeep(value));
          }
        },
        get placement() {
          return self.placement;
        },
        set placement(value) {
          if (value !== self.placement) {
            self.placement = value;
            self.setVueComponentData("placement", cloneDeep(value));
          }
        },
        // get searchValue() {
        //   return self.searchValue;
        // },
        // set searchValue(value) {
        //   if (value !== self.searchValue) {
        //     self.searchValue = value;
        //     self.setVueComponentData("searchValue", cloneDeep(value));
        //   }
        // },
        get showSearch() {
          return self.showSearch;
        },
        set showSearch(value) {
          if (value !== self.showSearch) {
            self.showSearch = value;
            self.setVueComponentData("showSearch", cloneDeep(value));
          }
        },
        get filter() {
          return self.filter;
        },
        set filter(value) {
          if (value !== self.filter) {
            self.filter = value;
            self.setVueComponentData("filter", cloneDeep(value));
          }
        },
        get limit() {
          return self.limit;
        },
        set limit(value) {
          if (value !== self.limit) {
            self.limit = value;
            self.setVueComponentData("limit", cloneDeep(value));
          }
        },
        get matchInputWidth() {
          return self.matchInputWidth;
        },
        set matchInputWidth(value) {
          if (value !== self.matchInputWidth) {
            self.matchInputWidth = value;
            self.setVueComponentData("matchInputWidth", cloneDeep(value));
          }
        },
        get size() {
          return self.size;
        },
        set size(value) {
          if (value !== self.size) {
            self.size = value;
            self.setVueComponentData("size", cloneDeep(value));
          }
        },
        get tagRenderSlot() {
          return self.tagRenderSlot;
        },
        set tagRenderSlot(value) {
          if (value !== self.tagRenderSlot) {
            self.tagRenderSlot = value;
            self.setVueComponentData("tagRenderSlot", cloneDeep(value));
          }
        },
        get name() {
          return self.name;
        },
        set name(value) {
          if (value !== self.name) {
            self.name = value;
          }
        },

        get initStyle() {
          // @ts-ignore
          return this._initStyle;
        },
        set initStyle(value) {
          const div = document.createElement("div");
          div.style.cssText = value;
          console.log("style更新");
          // @ts-ignore
          this._initStyle = value;
          self.cascsderStyle = {
            background: div.style.backgroundColor || "#FFFFFF",
            color: div.style.color || "rgba(0, 0, 0, 0.85)",
            fontSize: div.style.fontSize || "14px",
          };
          self.requestUpdate();
          self.style.cssText = value;
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-cascader": QCascader;
  }
}

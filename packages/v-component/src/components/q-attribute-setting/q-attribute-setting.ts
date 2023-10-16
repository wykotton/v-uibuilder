import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import {
  BgColorsOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
  CloseOutlined,
  CodeOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  RightCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  Modal,
  Row,
  Select,
  Switch,
  Tabs,
  Tooltip,
} from "ant-design-vue";
import antdCss from "ant-design-vue/dist/antd.css?inline";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { css, html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { cloneDeep, isEqual, isObject, isString } from "lodash-es";
import { createApp, defineComponent, onMounted, provide, reactive, ref, watch } from "vue";
import { Component } from "../../types/runtime/Component";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { DOMEmit } from "../../util/reactivity/Emit";
import { unmountInstance } from "../../util/utils";
import "../q-code-editor/q-code-editor";
import "../q-style-setting/q-style-setting";
import cssIndex from "./index.scss?inline";
import JsonSchemaEditor from "./index.vue";
dayjs.locale("zh-cn");

enum ChangeType {
  SCHEMA = "schema",
  VALUE = "value",
}

/**
 * 属性设置器
 */
@customElement("q-attribute-setting")
export class QAttributeSetting extends Component {
  constructor() {
    super();
    this.initModel();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
    css`
      ${unsafeCSS(antdCss)}
    `,
  ];

  @property({ type: Object })
  public value = {};

  @property({ type: Object })
  public schema = {};

  @property({ type: Array })
  public blackList = [
    "initStyle",
    "onDOMEvent",
    "onMessageMeta",
    "onWatchSetting",
    "lifeCycle",
    "_initStyle",
    "_onDOMEvent",
    "_onMessageMeta",
    "_onWatchSetting",
    "_lifeCycle",
  ];

  // 语言
  @property({ type: String })
  public lang = "zh_CN";

  // 左侧文字宽度
  @property({ type: String, attribute: "label_width" })
  public labelWidth = "";

  /**
   * 挂载节点.
   */
  @query("#container")
  container!: HTMLElement;

  /**
   * 组件实例
   */
  componentInstance: any = null;

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  // designer变更,有实例则不再重新渲染
  set _schema(schema: any) {
    if (!this.checkAttr(schema)) return;
    try {
      let tempSchema = cloneDeep(schema);
      isString(tempSchema) ? (tempSchema = JSON.parse(tempSchema)) : void 0;
      if (this.componentInstance?._instance?.proxy?.changeSchemaAndValue) {
        this.ignoreSchema = true;
        this.componentInstance._instance.proxy.changeSchemaAndValue(ChangeType.SCHEMA, tempSchema);
      } else {
        this.schema = tempSchema;
      }
    } catch (error) {}
  }
  set _value(value: any) {
    if (!this.checkAttr(value)) return;
    try {
      let tempValue = cloneDeep(value);
      isString(tempValue) ? (tempValue = JSON.parse(tempValue)) : void 0;
      if (this.componentInstance?._instance?.proxy?.changeSchemaAndValue) {
        this.ignoreValue = true;
        this.componentInstance._instance.proxy.changeSchemaAndValue(ChangeType.VALUE, tempValue);
      } else {
        this.value = tempValue;
      }
    } catch (error) {}
  }
  set _labelWidth(value: string) {
    if (this.componentInstance?._instance?.proxy?.changeLabelWidth) {
      this.componentInstance._instance.proxy.changeLabelWidth(value);
    }
  }

  /**
   *  校验schema|value正确性
   * @returns
   */
  checkAttr(data: any) {
    const validity = isObject(data) && Object.keys(data).length;
    return validity;
  }

  render() {
    return html`
      <div id="container"></div>
    `;
  }

  attributeChange(body: { schema: any; value: any }) {
    const message: IMessage = {
      header: {
        src: this.id,
        srcType: "attributeChange",
        dst: "",
        dstType: "",
      },
      body,
    };
    this.componentModel.sendMessage(message);
  }

  /**
   * 切换组件时忽略更新
   */
  ignoreSchema = false;
  ignoreValue = false;

  createVueComponent = () => {
    if (!Object.keys(this.schema) || !Object.keys(this.value)) return;
    const self = this;
    const component = defineComponent({
      template: `
				<json-schema-editor class="schema" :schema="schema" :value="value" lang="zh_CN"></json-schema-editor>
			`,
      setup() {
        typeof self.schema === "string" ? (self.schema = JSON.parse(self.schema)) : void 0;
        typeof self.value === "string" ? (self.value = JSON.parse(self.value)) : void 0;
        const schema: any = ref(cloneDeep(self.schema));
        const value: any = ref(cloneDeep(self.value));
        const labelWidth = ref("");
        const component = reactive<any>({ value: null });
        provide("componentModel", value);
        provide("optionsView", schema);
        provide("component", component);
        provide("labelWidth", labelWidth);
        watch(
          [schema],
          (newValue) => {
            // 忽略切换组件时造成的更新
            if (self.ignoreSchema) {
              self.ignoreSchema = false;
            } else {
              value.value.model.iovSchema.optionsView.model = cloneDeep(newValue[0].model);
            }
          },
          { deep: true }
        );
        watch(
          [value],
          (newValue) => {
            // 忽略切换组件时造成的更新
            if (self.ignoreValue) {
              self.ignoreValue = false;
            } else {
              const model = handleSchemaBlackList(cloneDeep(newValue[0].model));
              DOMEmit(self, "change", { detail: { value: model } });
              self.attributeChange({ schema: cloneDeep(schema.value), value: cloneDeep(value.value) });
            }
          },
          { deep: true }
        );

        /**
         * 外部进行数据更新
         * @param type
         * @param info
         */
        function changeSchemaAndValue(type: string, info: any) {
          switch (type) {
            case ChangeType.SCHEMA:
              schema.value = info;
              break;
            case ChangeType.VALUE:
              value.value = info;
              getComponent();
              break;
          }
        }

        /**
         * 属性设置器黑名单
         * 元件model的某些属性不允许从属性设置器修改
         */
        function handleSchemaBlackList(model: ISchema) {
          try {
            self.blackList.forEach((key: string) => {
              Reflect.deleteProperty(model, key);
            });
          } catch (error) {
            console.log(error);
          }
          return model;
        }

        /**
         * 获取元件实例
         */
        function getComponent() {
          try {
            component.value = document.querySelector(`#${value.value.model.id}`) || null;
          } catch (error) {}
        }

        /**
         * 左侧文字宽度
         * @param value
         */
        function changeLabelWidth(value: string) {
          labelWidth.value = value;
        }

        onMounted(() => {
          getComponent();
        });

        return {
          schema,
          value,
          labelWidth,
          changeSchemaAndValue,
          changeLabelWidth,
        };
      },
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(Row);
    this.componentInstance.use(Col);
    this.componentInstance.use(Button);
    this.componentInstance.use(Input);
    this.componentInstance.use(InputNumber);
    this.componentInstance.use(Checkbox);
    this.componentInstance.use(Select);
    this.componentInstance.use(Tooltip);
    this.componentInstance.use(Modal);
    this.componentInstance.use(Form);
    this.componentInstance.use(Switch);
    this.componentInstance.use(DatePicker);
    this.componentInstance.use(Menu);
    this.componentInstance.use(Dropdown);
    this.componentInstance.use(Tabs);
    this.componentInstance.component("JsonSchemaEditor", JsonSchemaEditor);
    this.componentInstance.component("CaretRightOutlined", CaretRightOutlined);
    this.componentInstance.component("CaretDownOutlined", CaretDownOutlined);
    this.componentInstance.component("SettingOutlined", SettingOutlined);
    this.componentInstance.component("PlusOutlined", PlusOutlined);
    this.componentInstance.component("CloseOutlined", CloseOutlined);
    this.componentInstance.component("CodeOutlined", CodeOutlined);
    this.componentInstance.component("ExclamationCircleOutlined", ExclamationCircleOutlined);
    this.componentInstance.component("BgColorsOutlined", BgColorsOutlined);
    this.componentInstance.component("EllipsisOutlined", EllipsisOutlined);
    this.componentInstance.component("RightCircleOutlined", RightCircleOutlined);
    this.componentInstance.mount(this.container);
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
    if (!this.componentInstance && this.container) {
      this.createVueComponent();
    }
  }

  protected updated(): void {
    if (!this.checkAttr(this.schema) || !this.checkAttr(this.value)) return;
    if (!this.componentInstance && this.container) {
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
            return "q-attribute-setting";
          },
          get type() {
            return EComponentType.PLUGIN;
          },
          get text() {
            return "属性设置器";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "属性设置器,可以根据属性schema和value进行编辑";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "更新属性",
                eventType: "changeInfo",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "属性变更",
                eventType: "attributeChange",
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
                labelWidth: {
                  type: "string",
                  description: "左侧文字宽度(遵循CSS语法), 例如: 20px、calc(100% - 10px)",
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
          changeInfo: [
            function (e: IMessage) {
              console.log(e);
              const _schema = e.body.schema;
              const _value = e.body.value;
              if (!_schema || !_value) return;
              // @ts-ignore
              Object.assign(this, { _schema, _value });
            },
          ],
        },
        _onDOMEvent: {},
        _initStyle: "height:300px;width:300px;background-color:#ffffff;overflow:hidden",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function () {},
          updated: function () {},
          destroy: function () {},
        },
        get labelWidth() {
          return self.labelWidth;
        },
        set labelWidth(value) {
          self.labelWidth = String(value);
          self._labelWidth = String(value);
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-attribute-setting": QAttributeSetting;
  }
}

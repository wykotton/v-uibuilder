import { css, html, LitElement, unsafeCSS } from "lit";
import { property, query } from "lit/decorators.js";
import { isArray, isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createApp, defineComponent, onMounted, reactive, ref } from "vue";
import { Select } from "ant-design-vue";
import { booleanTransform, unmountInstance, focusSelectCom, blurSelectCom } from "../../util/utils";
import { customHasElement } from "../../types/runtime/decorators/decorators";
import { DOMEmit } from "../../util/reactivity/Emit";
import { ReloadOutlined } from "@ant-design/icons-vue";
import antdCss from "ant-design-vue/dist/antd.css?inline";
import cssIndex from "./index.scss?inline";

/**
 * 树形组件
 */
@customHasElement("q-component-list")
export class QComponentList extends LitElement {
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

  @property({ type: String })
  value = "";

  /**
   * 组件实例
   */
  componentInstance: any = null;

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  @query(".q-component-list")
  container!: HTMLElement;

  /**
   * 元件选择器列表
   */
  @property({ type: Array })
  selector: string[] = [".draggable2", ".child-page-children"];

  /**
   * 禁用
   */
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  disabled = false;

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

  /**
   * 创建Vue组件
   */
  createVueComponent = () => {
    const self = this;
    const component = defineComponent({
      template: `
        <a-select
          v-model:value="selected"
          :disabled="disabled"
          show-search
          :filter-option="filterComponent"
          placeholder="请选择"
          style="width: 100%"
          @change="changeSelected"
        >
          <template #suffixIcon><reload-outlined title="刷新列表" @click="getComponentsList" /></template>
          <a-select-opt-group
            v-for="(components, componentsKey) in componentsArr.value"
            :key="componentsKey"
            :label="componentsKey"
          >
            <a-select-option
              v-for="component in components"
              :key="component.id"
              :value="String(component.id)"
              :text="component.text"
              :componentAliasName="component.componentAliasName"
              @mouseenter="focusSelectCom(component.id)"
              @mouseleave="blurSelectCom"
            >
              {{ component.componentAliasName || component.text || "未命名元件" }}
              <br />
              <span style="font-size: 12px">ID: {{ component.id }}</span>
            </a-select-option>
          </a-select-opt-group>
        </a-select>
      `,
      setup() {
        const selected = ref(self.value);
        const selector = self.selector;
        const componentsArr = reactive({ value: <any>{} });
        const disabled = ref(self.disabled);

        /**
         * 获取可选列表
         */
        function getComponentsList() {
          const tempList: ISchema[] = [];
          selector.forEach((name: string) => {
            Array.from(document.querySelectorAll(name)).forEach((element: any) => {
              const model = element?.componentModel?.model;
              if (model?.id) {
                tempList.push(model);
              }
            });
          });
          componentsArr.value = transformGroup(tempList);
        }

        /**
         * 对组件数据进行分组
         * @param components
         * @returns
         */
        function transformGroup(components: ISchema[]) {
          const list = {};
          components.forEach((item: ISchema) => {
            const iovSchema = item?.iovSchema;
            const componentAliasName = item?.componentAliasName || "";
            const text = item?.iovSchema?.text || "";
            const id = item.id;
            const info = { id, text, componentAliasName, iovSchema };
            if (id) {
              list?.[text] ? void 0 : (list[text] = []);
              list[text].push(info);
            }
          });
          return list;
        }

        /**
         * 下拉框搜索元件
         * @param input
         * @param option
         * @returns
         */
        function filterComponent(input: string, option: any) {
          if (option.componentAliasName) {
            return (
              option.componentAliasName.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              `ID: ${option.value}`.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
          } else if (option.text) {
            return (
              option.text.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              `ID: ${option.value}`.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
          } else {
            return (
              "未命名元件".toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
              `ID: ${option.value}`.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
          }
        }

        /**
         * 选择变更
         * @param value
         */
        function changeSelected(value: string) {
          self.onSendMessage(value);
          DOMEmit(self, "change", { detail: { data: value } });
        }

        onMounted(() => {
          getComponentsList();
        });

        return {
          selected,
          componentsArr,
          disabled,
          getComponentsList,
          filterComponent,
          changeSelected,
          focusSelectCom,
          blurSelectCom,
        };
      },
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(Select);
    this.componentInstance.component("ReloadOutlined", ReloadOutlined);
    this.componentInstance.mount(this.container);
  };

  /**
   * 数据路由
   * @param e
   * @param value
   */
  onSendMessage(body: string) {
    const message: IMessage = {
      header: {
        src: this.id,
        srcType: "selectComponent",
        dst: "",
        dstType: "",
      },
      body,
    };
    this.componentModel.sendMessage(message);
  }

  render() {
    return html`
      <div class="q-component-list"></div>
    `;
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-component-list";
          },
          get type() {
            return EComponentType.PLUGIN;
          },
          get text() {
            return "元件选择器";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "元件选择器, 可选择当前页面所有可交互元件";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "设置选择器",
                eventType: "setSelector",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "选择元件",
                eventType: "selectComponent",
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
                selector: {
                  type: "string",
                  description: "元件选择器",
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
          setSelector: [
            function (e: IMessage) {
              if (isArray(e.body)) {
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                this.selector = e.body;
              }
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
        _initStyle: "",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function () {},
          updated: function () {},
          destroy: function () {},
        },
        _eventInterception: {},
        get selector() {
          return JSON.stringify(self.selector);
        },
        set selector(value) {
          try {
            const tempValue = JSON.parse(value);
            if (isArray(tempValue)) {
              self.selector = tempValue;
            }
          } catch (error) {}
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-component-list": QComponentList;
  }
}

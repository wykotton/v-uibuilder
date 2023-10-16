import { css, LitElement, unsafeCSS, html } from "lit";
import { property, query } from "lit/decorators.js";
import { customHasElement } from "../../types/runtime/decorators/decorators";
import { cloneDeep, isArray, isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createApp, defineComponent, ref } from "vue";
import { changeProperty } from "../../types/runtime/decorators/decorators";
import { unmountInstance } from "../../util/utils";
import { Tag, CheckableTag } from "ant-design-vue";
import antdCss from "ant-design-vue/dist/antd.css?inline";
import cssIndex from "./index.scss?inline";
import $ from "jquery";

interface TagData {
  closable: boolean;
  visible: boolean;
  checked: boolean | null;
  color: string;
  icon: string;
  title: string;
  titleSlot: string;

  type: any;
}

/**
 * 步骤条
 */
@customHasElement("q-tag")
export class QTag extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
    css`
      ${unsafeCSS(antdCss)}
    `,
  ];

  @query(".vue-com-container")
  vueComWrapper!: HTMLDivElement;

  // tag 数据
  @changeProperty()
  @property({ type: Array })
  tagData: Array<TagData> = [
    {
      closable: false,
      visible: true,
      checked: false,
      type: "Tag",
      color: "success",
      icon: "",
      title: "Tag1",
      titleSlot: "",
    },
  ];

  typeMapping: any = { Tag, CheckableTag };

  /**
   * 组件实例
   */
  componentInstance: any = null;

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  constructor() {
    super();
    this.initModel();
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    super.attributeChangedCallback(name, _old, value);
    this.setVueComponentData(name, this[name]);
  }

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
    if (!this.componentInstance && this.vueComWrapper) {
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
  }

  /**
   * 创建树VUE组件
   */
  createVueComponent = () => {
    const self = this;
    const component = defineComponent({
      template: `
        <template v-for="(item,index) in tagData" :key="index">
          <component 
            v-bind:is="typeMapping[item.type]"
            :color="item.color"
            :closable="item.closable"
            v-model:visible="item.visible"
            v-model:checked="item.checked"
            @close="handleClose($event,index)"
            @click="handleClick($event,index)"
            @change="handleChange($event,index)"
            style="width:100%;height:100%;display:flex;align-items: center"
          >
            <template #icon>
              <div v-html="item.icon" style="display: flex;align-items: center;float: left;height: 90%; margin-right: 5px"></div>
            </template>
            <template v-if="!item.titleSlot">{{ item.title }}</template>
            <template v-else v-html="item.titleSlot">{{ item.title }}</template>
          </component>
        </template>

      `,
      name: "q-skeleton",
      props: {},
      components: {},
      setup(props: any, context: any) {
        const tagData = ref(self.tagData);
        const typeMapping = ref(self.typeMapping);

        /**
         * 关闭事件回调
         * @param e
         */
        function handleClose(e: any, index: number) {
          self.onSendMessage("close", self.tagData[index]);
        }

        /**
         * 点击事件回调
         * @param e
         */
        function handleClick(e: any, index: number) {
          self.onSendMessage("click", self.tagData[index]);
        }

        /**
         * 点击事件回调
         * @param e
         */
        function handleChange(e: any, index: number) {
          self.onSendMessage("change", self.tagData[index]);
        }

        /**
         * 监听timeline属性变更
         */
        function watchAttributeChange(type: string, value: any) {
          console.log("触发更新");
          // @ts-ignore
          this[type] = value;
        }

        return {
          props,
          tagData,
          typeMapping,
          handleClose,
          handleClick,
          handleChange,
          watchAttributeChange,
        };
      },
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(Tag);
    this.componentInstance.use(CheckableTag);
    this.componentInstance.mount(this.vueComWrapper);
  };

  /**
   * 数据路由
   * @param type
   * @param value
   */
  onSendMessage(type: string, value: any): void {
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

  getValue() {
    return this.tagData;
  }

  setValue(data: TagData) {
    try {
      if (Array.isArray(data)) {
        this.tagData = data;
        this.setVueComponentData("tagData", cloneDeep(data));
      }
    } catch (e) {
      console.log("数据不匹配");
    }
  }
  changeValue({ data, index }: { data: any; index: number }) {
    try {
      if (index) {
        this.tagData[index] = data;
        this.setVueComponentData("tagData", cloneDeep(this.tagData));
      }
    } catch (e) {
      console.log("数据不匹配");
    }
  }
  resetValue(data: TagData) {
    this.setValue(data);
  }
  setSelectedValue({ checked, index }: { checked: boolean; index: number }) {
    try {
      if (index) {
        this.tagData[index].checked = checked;
        this.setVueComponentData("tagData", cloneDeep(this.tagData));
      }
    } catch (e) {
      console.log("数据不匹配");
    }
  }

  render() {
    return html`
      <div class="vue-com-container" style="width: 100%;height:100%;display: flex"></div>
    `;
  }

  anchorTrigger(el: string) {
    $(this.shadowRoot as any)
      .find("[href]")
      .each((i, it) => {
        it.getAttribute("href") === `#${el}` && $(it).trigger("click");
      });
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-tag";
          },
          get type() {
            return EComponentType.TEXT;
          },
          get text() {
            return "tag";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "进行标记和分类的小标签。";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "设置Tag值",
                eventType: "setValue",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "修改Tag值",
                eventType: "changeValue",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "重置Tag值",
                eventType: "resetValue",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "设置选中值",
                eventType: "setSelectedValue",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "获取组件值",
                eventType: "getValue",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "Tag点击",
                eventType: "click",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "Tag关闭",
                eventType: "close",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "Tag选中",
                eventType: "change",
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
                tagData: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      closable: {
                        description: "开启关闭按钮",
                        type: "boolean",
                      },
                      visible: {
                        description: "显示/隐藏",
                        type: "boolean",
                      },
                      type: {
                        description: "标签类型",
                        type: "string",
                        enum: [
                          { label: "可选中标签", value: "CheckableTag" },
                          { label: "普通标签", value: "Tag" },
                        ],
                      },
                      checked: {
                        description: "可选中标签 （类型为可选中时才生效）",
                        type: "boolean",
                      },
                      color: {
                        description: "标签颜色",
                        type: "string",
                        format: "color",
                      },
                      icon: {
                        description: "标签图标",
                        type: "string",
                      },
                      title: {
                        description: "标签名",
                        type: "string",
                      },
                      // titleSlot: {
                      //   description: "自定义标签名",
                      //   type: "string"
                      // }
                    },
                  },
                  description: "Tag数据",
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
          setValue: [
            function (e: IMessage) {
              // @ts-ignore
              this.setValeu(e.body);
            },
          ],
          changeValue: [
            function (e: IMessage) {
              // @ts-ignore
              this.changeValeu(e.body);
            },
          ],
          resetValue: [
            function (e: IMessage) {
              // @ts-ignore
              this.resetValue(e.body);
            },
          ],
          setSelectedValue: [
            function (e: IMessage) {
              // @ts-ignore
              this.setSelectedValue(e.body);
            },
          ],
          getValue: [
            function (e: IMessage) {
              // @ts-ignore
              this.getValue(e.body);
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
        _initStyle: "width:50px;height:25px;",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function () {},
          updated: function () {},
          destroy: function () {},
        },
        _eventInterception: {},
        get tagData() {
          return self.tagData;
        },
        set tagData(value) {
          if (!isArray(value) || isEqual(value, self.tagData)) {
            self.setVueComponentData("tagData", self.tagData);
            return;
          }
          self.tagData = value;
          self.setVueComponentData("tagData", self.tagData);
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-tag": QTag;
  }
}

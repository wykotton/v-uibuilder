import { css, LitElement, unsafeCSS, html } from "lit";
import { customElement, query, property} from "lit/decorators.js";
import { cloneDeep, isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createApp, defineComponent, ref } from "vue";
import {
  SkeletonButton,
  SkeletonAvatar,
  SkeletonInput,
  SkeletonImage,
  Space,
  SkeletonTitle,
  Skeleton
} from "ant-design-vue";
import antdCss from "ant-design-vue/dist/antd.css?inline";
import { booleanTransform, createHash } from "../../util/utils";
import cssIndex from "./index.scss?inline";
import { styleMap } from "lit/directives/style-map.js";

/**
 * 步骤条
 */
@customElement("q-skeleton")
export class QSkeleton extends LitElement {
  static styles = [css`
    ${unsafeCSS(cssIndex)}
  `,
    css`
      ${unsafeCSS(antdCss)}
    `];

  @query(".vue-com-container")
  vueComWrapper!: HTMLDivElement;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    }, reflect: true
  })

  loading = false;
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    }, reflect: true
  })
  avatar = true;
  @property({type: Number, converter(value) {
      return Number(value);
    },reflect: true})
  rows = 3;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    }, reflect: true
  })
  active = true;

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
    this.setVueComponentData(name, this[name])
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    this.createVueComponent();
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
      // :loading="loading"  :paragraph="{ rows: rows }"
      template: `
        <a-skeleton :loading="loading" :avatar="avatar" :active="active" :paragraph="{ rows }">
        </a-skeleton>
      `,
      name: "q-skeleton",
      props: {},
      components: {},
      setup(props: any, context: any) {

        const loading = ref(self.loading);
        const avatar = ref(self.avatar);
        const rows = ref(Number(self.rows));
        const active = ref(self.active);

        /**
         * 监听timeline属性变更
         */
        function watchAttributeChange(type: string, value: any) {
          console.log("触发更新");
          // @ts-ignore
          this[type] = value;
        }

        function backTopClick() {
          self.onSendMessage("click", "");
        }


        return {
          props,
          loading,
          avatar,
          rows,
          active,
          backTopClick,
          watchAttributeChange
        };
      }
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(Space);
    this.componentInstance.use(Skeleton);
    this.componentInstance.use(SkeletonButton);
    this.componentInstance.use(SkeletonAvatar);
    this.componentInstance.use(SkeletonInput);
    this.componentInstance.use(SkeletonImage);
    this.componentInstance.use(SkeletonTitle);
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
        dstType: ""
      },
      body: value
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

  updateStatus() {
    this.loading = !this.loading;
    this.setVueComponentData("loading", cloneDeep(this.loading));
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="q-skeleton">
        <div class="vue-com-container" style="${styleMap({
          visibility: this.loading ? 'visible' : 'hidden'
        })}"></div>
        <div class="q-skeleton-content"  style="${styleMap({
          display: this.loading ? 'none' : 'block'
        })}">
          <slot id="${'q-skeleton' + createHash()}" name="q-skeleton" class="dropzone">
            <q-container-mask text="组件降落区"></q-container-mask>
          </slot>
        </div>
      </div>
    `;
  }


  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-skeleton";
          },
          get type() {
            return EComponentType.TEXT;
          },
          get text() {
            return "骨架屏";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "在需要等待加载内容的位置提供一个占位图形组合。";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "更改状态",
                eventType: "changeStatue",
                messageSchema: "",
                messageDemo: ""
              }
            ],
            outputMessage: [

            ]
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                active: {
                  type: "boolean",
                  description: "开启动画"
                },
                avatar: {
                  type: "boolean",
                  description: "头像占位符"
                },
                loading: {
                  type: "boolean",
                  description: "显示/隐藏"
                },
                rows: {
                  type: "number",
                  description: "行数",
                  minimum: 0
                }
              }
            }
          }
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
          changeStatue: [
            function(e: IMessage) {
              // @ts-ignore
              this.updateStatus()
            }
          ],
        },
        _onDOMEvent: {
          click: [
            function(e: Event) {
              console.log(e);
            }
          ],
          dblclick: [
            function(e: Event) {
              console.log(e, "dblclick");
            }
          ]
        },
        _initStyle: "height:100px;width:200px;overflow:auto",
        _onWatchSetting: {

        },
        _lifeCycle: {
          created: function() {
          },
          updated: function() {
          },
          destroy: function() {
          }
        },
        _eventInterception: {},
        get active() {
          return self.active;
        },
        set active(value) {
          if (value !== self.active) {
            self.active = value;
            self.setVueComponentData("active", cloneDeep(value));
          }
        },
        get avatar() {
          return self.avatar;
        },
        set avatar(value) {
          if (value !== self.avatar) {
            self.avatar = value;
            self.setVueComponentData("avatar", cloneDeep(value));
          }
        },
        get rows() {
          return self.rows;
        },
        set rows(value) {
          if (value !== self.rows) {
            self.rows = value;
            self.setVueComponentData("rows", cloneDeep(value));
          }
        },
        get loading() {
          return self.loading;
        },
        set loading(value) {
          if (value !== self.loading) {
            self.loading = value;
            self.setVueComponentData("loading", cloneDeep(value));
            self.requestUpdate();
          }
        }

      } as unknown as ISchema
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-skeleton": QSkeleton;
  }
}

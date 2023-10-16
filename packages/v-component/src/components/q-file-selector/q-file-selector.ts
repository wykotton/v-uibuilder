import { css, html, LitElement, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import { isEqual } from "lodash-es";
import cssIndex from "./index.scss?inline";
import "../q-container-mask/q-container-mask";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { customHasElement } from "../../types/runtime/decorators/decorators";
import { ISchema, EComponentType, EComponentGroup } from "../../types/runtime/IModelSchema";
import { IMessage } from "../../types/runtime/IMessage";
import { booleanTransform, openFileSelector, onSendMessage } from "../../util/utils";

@customHasElement("q-file-selector")
export class qFileSelector extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];
  
  // 判断是否运行模式
  @property({ type: Boolean })
  public contextType = false;

  /**
   * 挂载节点.
   */
  // @query("#container")
  // container!: HTMLElement;
  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  /**
   * 组件实例
   */
  // componentInstance: any = null;

  constructor() {
    super();
    this.initModel();
  }

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public visible = false;
  // 打开文件选择器
  openSelector(visible: boolean) {
    if (this.visible) return
    this.visible = visible;
    // window["picselector"] = (val: string) => {
    //   // @ts-ignore
    //   onSendMessage(this, { secected: val }, { srcType: "Select" });
    // };
    openFileSelector("default", {
      selected: (val: string) => {
        console.log("picselector");
        // @ts-ignore
        onSendMessage(this, { secected: val }, { srcType: "Select" });
      },
      closed: () => {
        this.visible = false;
        console.log("closed")
      }
    });
  }

  // disconnectedCallback(): void {
  //   this.componentInstance.unmount();
  //   super.disconnectedCallback();
  // }

  // connectedCallback(): void {
  //   fsInit()
  //   super.connectedCallback();
  //   // @ts-ignore
  //   this.onload()
  //   this.getFiles(this.filelist["my"].query)
  //   // this.getFiles(this.filelist["sys"].query)
  //   this.getTag({page:1, size: 20})
  // }

  // protected updated(): void {
  //   createVueComponent(this);
  // }

  render() {
    // let pageMyHtml = '<span class="current">1</span>'
    // const pageSize
    // for (let i = 0; i < this.filelist[this.type].totle / this.filelist[this.type].query.size; i++) {
    //   const element = array[i];

    // }initial
    return html`
      <div class="q-file-selector-container">
        ${this.contextType ? null : html`<div class="hack-mask"></div>`}
        <iframe
          src="/v-component/q-file-selector/temp.html?selected=picselector"
          width="800"
          height="480"
        ></iframe>
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
            return "q-file-selector";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "文件选择器";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "文件选择器,用于选择和管理文件资源";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "弹出文件选择器",
                eventType: "openSelector",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "选中",
                eventType: "Select",
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
                userid: {
                  type: "string",
                  description: "用户",
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
          openSelector: [
            function (e: IMessage) {
              // const _this = this;
              // @ts-ignore
              this.openSelector(true);
            },
          ],
        },
        _onDOMEvent: {},
        _initStyle: "width:800px;height:480px;",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function () {},
          updated: function () {},
          destroy: function () {},
        },
        get contextType() {
          // @ts-ignore
          return this._contextType;
        },
        set contextType(value) {
          // @ts-ignore
          this._contextType = value;
          self.contextType = value;
          self.requestUpdate("contextType");
        },
      } as unknown as ISchema,
    });
  }
}

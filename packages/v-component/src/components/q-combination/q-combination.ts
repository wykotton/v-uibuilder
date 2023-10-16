import { css, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { Component } from "../../types/runtime/Component";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import cssIndex from "./index.scss?inline";
import "../q-container-mask/q-container-mask";

@customElement("q-combination")
export class QCombination extends Component {
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
   * 数据模型
   */
  componentModel!: ComponentModel;

  public render() {
    return html`
      <div class="q-combination">
        <div class="q-combination-content">
          <slot id="q-combination-slot" class="dropzone">
            <q-container-mask text="组件降落区"></q-container-mask>
          </slot>
        </div>
      </div>
    `;
  }

  initModel(): void {
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-combination";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "元件集合";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "元件集合组件,用于包裹组件集合";
          },
          eventSpecification: {
            inputMessage: [],
            outputMessage: [],
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "组件id",
                  disabled: true,
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
        _onMessageMeta: {},
        _onDOMEvent: {},
        _initStyle: "height:300px;width:300px;",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function () {},
          updated: function () {},
          destroy: function () {},
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-combination": QCombination;
  }
}

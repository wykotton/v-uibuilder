import { css, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { Component } from "../../types/runtime/Component";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { useMutationObserver } from "@vueuse/core";
import styleParse from "style-to-object";
import cssIndex from "./index.scss?inline";
import "../q-button/q-button";
import "../q-container-mask/q-container-mask";

/**
 * 百分比容器
 */
@customElement("q-percentage")
export class QPercentage extends Component {
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

  /**
   * 变更回调
   * 将元件变更为百分比
   * @param mutationsList
   */
  public async observerCallback(mutationsList: MutationRecord[]) {
    setTimeout(() => {
      mutationsList.forEach((mutation) => {
        switch (mutation.type) {
          case "childList":
            mutation.addedNodes.forEach((component: any) => {
              this.changeComponentStyle(component);
            });
            break;
        }
      });
    }, 0);
  }

  /**
   * 变更元件style
   * @param component
   * @returns
   */
  changeComponentStyle(component: any) {
    const parentElement = component.assignedSlot || component.parentElement;
    if (!parentElement) return;
    const styleReg = new RegExp("^(\\-|\\+)?\\d+(\\.\\d+)?(\\px)$");
    const { offsetWidth: parentWidth, offsetHeight: parentHeight } = parentElement;
    const {
      offsetLeft: componentLeft,
      offsetTop: componentTop,
      offsetWidth: componentWidth,
      offsetHeight: componentHeight,
    } = component;
    if (component?.componentModel) {
      const cssObject = {
        left: `${((componentLeft / parentWidth) * 100).toFixed(3)}%`,
        top: `${((componentTop / parentHeight) * 100).toFixed(3)}%`,
        width: `${((componentWidth / parentWidth) * 100).toFixed(3)}%`,
        height: `${((componentHeight / parentHeight) * 100).toFixed(3)}%`,
      };
      const initStyle = component.componentModel.model.initStyle;
      const initStyleObject = (styleParse(initStyle) as any) ?? {};
      ["left", "top", "width", "height"].forEach((key) => {
        // 不处理非px格式
        if (!initStyleObject[key] || styleReg.test(initStyleObject[key])) {
          cssObject[key] ? (initStyleObject[key] = cssObject[key]) : void 0;
        }
      });
      let styleStr = "";
      for (const key in initStyleObject) {
        styleStr += `${key}: ${initStyleObject[key]};`;
      }
      component.componentModel.updateModelEntity?.(JSON.stringify({ initStyle: styleStr }));
    }
  }

  public render() {
    return html`
      <div class="q-percentage">
        <div class="q-percentage-content">
          <slot id="q-percentage-slot" class="dropzone">
            <q-container-mask text="组件降落区"></q-container-mask>
          </slot>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    useMutationObserver(this, this.observerCallback.bind(this), {
      childList: true,
      attributes: false,
      subtree: true,
      characterDataOldValue: false,
      attributeOldValue: false,
    });
  }

  initModel(): void {
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-percentage";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "百分比容器";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "百分比容器组件,可以进行百分比布局";
          },
          eventSpecification: {
            inputMessage: [],
            outputMessage: [],
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {},
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
        _initStyle: "height:20%;width:20%;background-color:#ffffff",
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
    "q-percentage": QPercentage;
  }
}

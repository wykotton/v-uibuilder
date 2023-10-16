import { css, html, unsafeCSS } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { isEqual } from "lodash-es";
import { extractClass } from "../../common";
import { Component } from "../../types/runtime/Component";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { changeProperty } from "../../types/runtime/decorators/decorators";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { errorImg } from "./IQImage";
import cssIndex from "./index.scss?inline";
import css1 from "./viewer/viewer.css?inline";
// @ts-ignore
import Viewer from "./viewer/viewer.esm.js";

type TypeEnums = "fill" | "contain" | "cover" | "none" | "scale-down" | "";

const isSupportObjectFit = () => document.documentElement.style.objectFit !== undefined;

const ObjectFit = {
  NONE: "none",
  CONTAIN: "contain",
  COVER: "cover",
  FILL: "fill",
  SCALE_DOWN: "scale-down",
};

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement("q-image")
export class QImage extends Component {
  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
    css`
      ${unsafeCSS(css1)}
    `,
  ];

  public viewer!: any;

  public imageWidth = 0;

  public imageHeight = 0;

  public showViewer!: boolean;

  @property({ type: String })
  public text!: string;

  @changeProperty()
  @property({ type: String, attribute: "src", reflect: true })
  public src = "";

  @property({ type: String })
  public fit: TypeEnums = "";

  @property({ type: Boolean })
  public lazy!: boolean;

  @property({ type: Array, attribute: "preview-src-list", reflect: true })
  public previewSrcList: string[] = [];

  @property({ type: Number })
  public zIndex = 2000;

  @property({ type: String })
  public alt = "";

  @state()
  public loading = true;

  @state()
  public error = false;

  @state()
  public show = true;

  @query(".q-image")
  qImage!: HTMLElement;

  get imageStyle() {
    const { fit } = this as never;
    if (fit) {
      return isSupportObjectFit() ? { "object-fit": fit } : this.getImageStyle(fit);
    }
    return {};
  }

  get alignCenter() {
    return !isSupportObjectFit() && this.fit !== ObjectFit.FILL;
  }

  get preview() {
    const { previewSrcList } = this as any;

    return Array.isArray(previewSrcList) && previewSrcList.length > 0;
  }

  get imageIndex() {
    let previewIndex = 0;
    const srcIndex = this.previewSrcList.indexOf(this.src);
    if (srcIndex >= 0) {
      previewIndex = srcIndex;
    }
    return previewIndex;
  }

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  constructor() {
    super();
    this.initModel();
  }

  /**
   * 图片加载完成
   * @param e
   * @param img
   */
  public handleLoad(e: any, img: ImageData) {
    this.imageWidth = img.width;
    this.imageHeight = img.height;
    this.loading = false;
    this.error = false;
  }

  public handleError(e: Error) {
    this.loading = false;
    this.error = true;
    return { err: e };
  }

  /**
   * simulate object-fit behavior to compatible with IE11 and other browsers which not support object-fit
   */
  public getImageStyle(fit: any) {
    const { imageWidth, imageHeight, rootNode } = this as any;
    const { clientWidth: containerWidth, clientHeight: containerHeight } = rootNode;

    if (!imageWidth || !imageHeight || !containerWidth || !containerHeight) return {};

    const imageAspectRatio = imageWidth / imageHeight;
    const containerAspectRatio = containerWidth / containerHeight;

    if (fit === ObjectFit.SCALE_DOWN) {
      const isSmaller = imageWidth < containerWidth && imageHeight < containerHeight;
      fit = isSmaller ? ObjectFit.NONE : ObjectFit.CONTAIN;
    }

    switch (fit) {
      case ObjectFit.NONE:
        return { width: "auto", height: "auto" };
      case ObjectFit.CONTAIN:
        return imageAspectRatio < containerAspectRatio ? { width: "auto" } : { height: "auto" };
      case ObjectFit.COVER:
        return imageAspectRatio < containerAspectRatio ? { height: "auto" } : { width: "auto" };
      default:
        return {};
    }
  }

  /**
   * 加载图片
   */
  public loadImage() {
    this.loading = true;
    this.error = false;
    const img = new Image();
    img.src = this.src;
    img.onload = (e) => this.handleLoad(e, img as any);
    img.onerror = this.handleError.bind(this) as any;
  }

  /**
   * 图片点击
   */
  public clickHandler() {
    if (!this.preview || !this.componentModel.model.contextType) {
      return;
    }
    this.showViewer = true;
    Promise.resolve().then(() => {
      this.viewer = new Viewer(this.qImage, {
        container: this.qImage,
      });
    });
  }

  /**
   * 关闭图片查看器
   */
  public closeViewer() {
    this.showViewer = false;
  }

  public disconnectedCallback() {
    this.viewer?.destroy?.();
  }

  protected firstUpdated(): void {
    this.loadImage();
  }

  public render() {
    return html`
      <div class="q-image">
        ${this.loading
          ? html`
              <slot name="placeholder">
                <div class="q-image_placeholder"></div>
              </slot>
            `
          : null}
        ${this.error
          ? html`
              <slot name="error">
                <div class="q-image_error">
                  <img src=${errorImg} style="width: 60%" />
                </div>
              </slot>
            `
          : null}
        ${!this.error && !this.loading
          ? html`
              <img
                style=${styleMap(this.imageStyle)}
                @click=${this.clickHandler}
                src=${this.src}
                id="__imageTag__"
                class=${extractClass({}, "", {
                  "q-image_inner": true,
                  "q-image_inner-center": this.alignCenter,
                  "q-image_preview": this.preview,
                })}
                alt=${this.alt}
              />
            `
          : null}
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
            return "q-image";
          },
          get type() {
            return EComponentType.MEDIA;
          },
          get text() {
            return "图片";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "媒体组件,可以显示图像信息";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "更改组件数据",
                eventType: "changeInfo",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "组件点击数据",
                eventType: "click",
                messageSchema: "",
                messageDemo: "文本数据1",
              },
            ],
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                src: {
                  type: "string",
                  format: "resource",
                  description: "图片链接",
                },
                previewSrcList: {
                  type: "array",
                  description: "组件src数据",
                  items: {
                    type: "string",
                    format: "resource",
                    description: "图片链接",
                  },
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
              console.log(e, self);
            },
          ],
        },
        _onDOMEvent: {
          onclick: [
            function (e: Event) {
              console.log(e);
            },
          ],
          ondblclick: [
            function (e: Event) {
              console.log(e, "dblclick");
            },
          ],
        },
        _initStyle: "height:150px;width:150px;",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function () {
            console.log("created");
          },
          updated: function () {
            console.log("updated");
          },
          destroy: function () {
            console.log("destroy");
          },
        },
        get src() {
          return self.src;
        },
        set src(value: string) {
          if (value !== self.src) self.src = value;
          self.loadImage();
        },
        get previewSrcList() {
          return self.previewSrcList;
        },
        set previewSrcList(value: string[]) {
          self.previewSrcList = value;
          Promise.resolve().then(() => {
            self.viewer = new Viewer(self.qImage, {
              container: self.qImage,
            });
          });
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-image": QImage;
  }
}

import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Component } from "../../types/runtime/Component";
import { ISchema } from "../../types/runtime/IModelSchema";
import { domAssemblyCustomEvents } from "../../util/base-method";
import { DOMEmit } from "../../util/reactivity/Emit";


/**
 * 文本组件
 */
@customElement("q-video")
export class QVideo extends Component {
    static styles = css`
      :host {
        display: block;
      }

      p {
        margin: 0;
      }
    `;

    /**
     * 自动播放
     */
    @property({ type: Boolean, attribute: "autoplay" })
    autoplay = false;

    /**
     * 画中画
     */
    // @property({type: String, attribute: "autoplay"})
    // autoPicture= false;

    /**
     * 是否显示控制面板
     */
    @property({ type: Boolean, attribute: "controls" })
    controls = false;

    /**
     * 指定了 controls 属性，择在控制面板上显示哪些控件
     */
    // @property({type: String, attribute: "controls"})
    // controlsList: string[] = []

    /**
     * height
     */
    @property({ type: String, attribute: "height" })
    height = "100%"

    /**
     * 视频地址
     */
    @property({ type: String, attribute: "width" })
    width = "100%"

    /**
     * width
     */
    @property({ type: String, attribute: "src" })
    src = ""

    /**
     * loop 开启循环播放
     */
    @property({ type: Boolean, attribute: "loop" })
    loop = false


    /**
     * 静音播放默认false
     */
    @property({ type: Boolean, attribute: "muted" })
    muted = false

    /**
     * 禁用默认鼠标事件
     */
    @property({ type: Boolean, attribute: "disabled-pointer-events" })
    disabledPointerEvents = false

    /**
     * 当前播放时间
     */
    @property({ type: Number, attribute: "currentTime" })
    currentTime = 0


    /**
     * 数据模型
     */
    model!: ISchema;

    constructor() {
        super();
        domAssemblyCustomEvents(this, this.model.onDOMEvent);
    }

    private _handlerPlay = () => {
        DOMEmit(this, "played", { detail: {} })
    }

    private _handlerPaused = () => {
        DOMEmit(this, "paused", { detail: {} })
    }



    connectedCallback() {
        super.connectedCallback()
        this.addEventListener("play", this._handlerPlay);
        this.addEventListener("pause", this._handlerPaused);
    }

    disconnectedCallback() {
        // 移除document的鼠标监听事件
        this.removeEventListener("play", this._handlerPlay);
        this.removeEventListener("pause", this._handlerPaused);
        super.disconnectedCallback();
    }



    render() {
        if (!this.src) return html`<span style="color: red">缺少src属性!</span>`
        const tempType = this.src.split(".")
        return html`
            <video style=xxxxxxxxxx autoplay=${this.autoplay} controls=${this.controls} height=${this.height} width=${this.width}
                muted=${this.muted} loop=${this.loop}>
                <source src=${this.src} type=${"video/" + tempType[tempType.length - 1]}>
            </video>
        `;
    }


}

declare global {
    interface HTMLElementTagNameMap {
        "q-video": QVideo;
    }
}

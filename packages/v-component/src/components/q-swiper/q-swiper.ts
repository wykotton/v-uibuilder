import {css, html} from "lit";
import {customElement, property} from "lit/decorators.js";
import {Component} from "../../types/runtime/Component";
import {ISchema} from "../../types/runtime/IModelSchema";
import {domAssemblyCustomEvents} from "../../util/base-method";
import {unsafeHTML} from "lit/directives/unsafe-html.js";
import {DOMEmit} from "../../util/reactivity/Emit";
import {classMap} from "lit/directives/class-map.js";

/**
 * 文本组件
 */
@customElement("q-swiper")
export class QSwiper extends Component {

    /**
     * 轮播图片
     */
    @property({type: Array, attribute: "img-arr"})
    imgArr = ["https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg", "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg", "https://picsum.photos/seed/picsum/200/300"];

    /**
     * 播放时间间隔
     */
    @property({type: Number, attribute: "time-interval"})
    timeInterval = 2000;

    /*
    * 圆点高亮样式
    * */
    @property({type: String, attribute: "dot-position"})
    dotPosition = "center";

    static styles = css`
      * {
        padding: 0;
        margin: 0;
        list-style: none;
        border: 0;
      }

      .q-swiper {
        width: 100%;
        height: 100%;
        position: relative;
      }

      .q-swiper-screen {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
      }

      .q-swiper-screen li {
        overflow: hidden;
        float: left;
      }

      .q-swiper-screen ul {
        position: absolute;
        left: 0;
        top: 0;
      }

      .q-swiper ol {
        position: absolute;
        bottom: 10px;
        line-height: 20px;
        text-align: center;
      }

      .q-swiper ol li {
        float: left;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #fff;
        border: 1px solid #ccc;
        margin-left: 10px;
        cursor: pointer;
      }

      .q-swiper ol li.current {
        background: yellow;
      }

      .q-swiper .dot-center {
        display: flex;
        justify-content: center;
        align-items: end;
      }

      .q-swiper .dot-left {
        display: flex;
        justify-content: flex-start;
        align-items: end;
        left: 10px
      }

      .q-swiper .dot-right {
        display: flex;
        justify-content: flex-end;
        align-items: end;
        right: 10px;
      }

      .q-swiper-btn-wrapper {
        display: none;
      }

      .q-swiper-btn-wrapper span {
        width: 40px;
        height: 40px;
        position: absolute;
        left: 5px;
        top: 50%;
        margin-top: -20px;
        background: #000;
        cursor: pointer;
        line-height: 40px;
        text-align: center;
        font-weight: bold;
        font-size: 30px;
        color: #fff;
        opacity: 0.3;
        border: 1px solid #fff;
      }

      .q-swiper-btn-wrapper .right {
        right: 5px;
        left: auto;
      }
    `;


    index = 0;
    fk = 0;
    timer: any = null;
    box: any = null;
    screen: any = null;
    ul: any = null;
    ulList: any = null;
    ol: any = null;
    arr: any = null;
    leftArr: any = null;
    rightArr: any = null;
    olList: any = null;
    pictureWidth = 0;
    pictureHeight = 0;
    /**
     * 数据模型
     */
    model!: ISchema;

    constructor() {
        super();
        this.index = 0
        domAssemblyCustomEvents(this, this.model.onDOMEvent);
    }


    async connectedCallback() {
        super.connectedCallback()
        await this.updateComplete;
        this.box = this.renderRoot.querySelector(".q-swiper");
        this.screen = this.renderRoot.querySelector(".q-swiper-screen");
        this.ul = this.screen.children[0];
        this.ulList = this.ul.children;
        this.ol = this.screen.children[1];
        this.olList = this.ol.children;
        this.olList[0].className = "current";
        this.arr = this.renderRoot.querySelector(".q-swiper-btn-wrapper");
        this.leftArr = this.arr.querySelector(".left");
        this.rightArr = this.arr.querySelector(".right");
        this.pictureWidth = this.screen.offsetWidth;
        this.pictureHeight = this.screen.offsetHeight;
        this.renderRoot.querySelectorAll("img").forEach((it) => {
            it.width = this.pictureWidth
            it.height = this.pictureHeight
        })
        this.renderRoot.querySelectorAll("ul").forEach((it) => {
            it.style.width = (this.pictureWidth * this.imgArr.length + this.pictureWidth) + "px"
        })
        this.timer = setInterval(this.rightArrClick.bind(this), this.timeInterval)
    }

    public rightArrClick() {
        //如果已经到了最后一张假图片，让ul瞬移到第一张真图片
        if (this.index == this.olList.length) {
            this.ul.style.left = 0;
            this.index = 0;
        }
        this.index++;//记录出去的图片张数

        this.fk++;
        if (this.fk == this.olList.length) {
            this.fk = 0;
        }
        for (let i = 0; i < this.olList.length; i++) {
            this.olList[i].className = "";
        }
        this.olList[this.fk].className = "current";
        const target = -this.index * this.pictureWidth;
        this.animates(this.ul, target);
    }

    public dotClick(index: number, e: MouseEvent) {
        for (let i = 0; i < this.olList.length; i++) {
            this.olList[i].className = "";
        }
        const curNode = e.target as HTMLElement
        curNode.className = "current";
        const target = -index * this.pictureWidth;
        this.animates(this.ul, target);

        this.index = this.fk = index
        DOMEmit(this, "onSwiperChange", {detail: {index}})
    }

    public animates(element: any, target: any) {
        if (element.timer) {
            clearInterval(element.timer);
        }
        element.timer = setInterval(function () {
            let leader = element.offsetLeft;
            let step = 20;
            if (target < leader) {
                step = -step;
            }
            if (Math.abs(target - leader) >= Math.abs(step)) {
                leader = leader + step;
                element.style.left = leader + "px";
            } else {
                clearInterval(element.timer);
                element.style.left = target + "px";
            }
        }, 15);
    }


    render() {
        return html`
            <div class="q-swiper" @mousemove=${() => {
                // this.arr.style.display = "block";
                clearInterval(this.timer);
            }} @mouseleave=${() => {
                // this.arr.style.display = "none";
                this.timer = setInterval(this.rightArrClick.bind(this), this.timeInterval)
            }}>
                <div class="q-swiper-screen">
                    <ul>
                        ${this.imgArr.map(it => {
                            return unsafeHTML(`<li><a href="javascript:;"><img alt=""  class="img" src=${it}></a></li>`)
                        })}
                        <li><a href="javascript:;"><img alt="" class="img" src=${this.imgArr[0]}></a></li>
                    </ul>
                    <ol class=${classMap({
                        "dot-center": this.dotPosition === "center",
                        "dot-right": this.dotPosition === "right",
                        "dot-left": this.dotPosition === "left"
                    })}>
                        ${this.imgArr.map((value, index) => {
                            return html`
                                <li data-value=${value} @click=${(e: MouseEvent) => this.dotClick(index, e)}></li>`
                        })}
                    </ol>
                </div>
                <div class="q-swiper-btn-wrapper"><span class="left">&lt;</span><span class="right">&gt;</span></div>
            </div>
        `;
    }


}

declare global {
    interface HTMLElementTagNameMap {
        "q-swiper": QSwiper;
    }
}

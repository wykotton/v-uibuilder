import {css, html} from "lit";
import {classMap} from "lit/directives/class-map.js";
import {property} from "lit/decorators.js";
import { customHasElement } from "../../types/runtime/decorators/decorators";
import {Component} from "../../types/runtime/Component";
import {IMessage} from "../../types/runtime/IMessage";
import {ISchema} from "../../types/runtime/IModelSchema";
import {domAssemblyCustomEvents} from "../../util/base-method";
import {deepWatchModelProxy, mergeModel} from "../../util/utils";
import {DOMEmit} from "../../util/reactivity/Emit";

/**
 * 文本组件
 *
 */
@customHasElement("q-pagination")
export class QPagination extends Component {
    static styles = css`
      .q-pagination {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
      }

      .q-pagination li {
        list-style-type: none;
        display: inline-block;
        position: relative;
      }

      .q-pagination-btn {
        background: none;
        margin: 0 0.3em;
        width: 2.3em;
        height: 2.3em;
        padding: 1px;
        font-size: inherit;
        box-sizing: content-box;
        user-select: none;
        cursor: unset;
      }

      .q-pagination-btn button {
        background: none;
        outline: 0;
        border: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }

      .q-pagination-btn:hover {
        background: #409eff;
        border-radius: 5px;
        opacity: .5;
        transition: .3s;
      }

      .q-pagination-btn:hover button {
        color: #FFF;
      }

      .centered {
        justify-content: center;
        align-items: center;
        display: flex;
      }

      .q-pagination-btn-wrapper {

      }

      .icon {
        width: 1em;
        height: 1em;
        fill: currentColor;
      }

      .q-pagination-btn button[disabled = disabled] {
        cursor: not-allowed;
        pointer-events: all;
      }

      .q-pagination .active {
        background: #409eff;
        border-radius: 5px;
        transition: .3s;
      }

      .q-pagination .active button {
        color: #FFFFFF;
      }

      .q-pagination .more {
        border: none;
        cursor: default;
      }
      
      .q-pagination .display-none {
        display: none;
      }
      
      .q-pagination .quick-jump-wrapper {
        margin-left: 5px;
        line-height: 36px;
      }

    `;

    /*
    * 当前页
    * */
    @property({type: Number, attribute: "current", reflect: true})
    current = 1

    /*
   * 分页大小
   * */
    @property({type: Number, attribute: "page-size", reflect: true})
    pageSize = 15

    @property({type: Array, attribute: "page-size-options", reflect: true})
    pageSizeOptions = [
        {"value": 10,"label": "10条/页"},
        {"value": 20,"label": "20条/页"},
        {"value": 30,"label": "30条/页"}
    ]

    @property({type: Boolean, attribute: "show-size-changer", reflect: true})
    showSizeChanger = false

    /*
    * 总数
    * */
    @property({type: Number, attribute: "total", reflect: true})
    total = 20

    /*
    * 显示数目
    * */
    @property({type: Number, attribute: "num-display", reflect: true})
    numDisplay = 5

    /*
    * 显示数目
    * */
    @property({type: Number, attribute: "num-edge", reflect: true})
    numEdge = 3

    /*
    *
    * */
    @property({type: String, attribute: "ellipse-text", reflect: true})
    ellipseText = "..."

    /*
    * 跳转
    * */
    @property({type: Boolean, attribute: "show-quick-jumper", reflect: true})
    showQuickJumper = false

   /*
    * 是否显示总数
    * */
    @property({type: Boolean, attribute: "show-total", reflect: true})
    showTotal = false


    /**
     * 数据模型
     */
    model!: ISchema;

    constructor() {
        super();
        this.initModel();
        domAssemblyCustomEvents(this, this.model.onDOMEvent);
    }


    public render() {
        const pageNum = Math.ceil(this.total / this.pageSize)
        const arr = [],
            interval = this.getInterval();
        if (interval[0] > 0 && this.numEdge > 0) {
            const end = Math.min(this.numEdge, interval[0]);
            for (let i = 0; i < end; i++) {
                arr.push(this.getItem(i+1, i+1));
            }
            if (this.numEdge < interval[0] && this.ellipseText) {
                arr.push(html`
                    <li class="more">${this.ellipseText}</li>`);
            }
        }

        for (let i = interval[0]; i < interval[1]; i++) {
            arr.push(this.getItem(i+1, i+1));
        }

        if (interval[1] < pageNum && this.numEdge > 0) {
            if (pageNum - this.numEdge > interval[1] && this.ellipseText) {
                arr.push(html`
                    <li class="more">${this.ellipseText}</li>`);
            }
            const begin = Math.max(pageNum - this.numEdge, interval[1]);
            for (let i = begin; i < pageNum; i++) {
                arr.push(this.getItem(i+1, i+1));
            }
        }
        return html`
            <div class="q-pagination">
                <div class=${classMap({"total-wrapper": true,"display-none": !this.showTotal})}>
                    共
                   ${this.total}
                    条
                </div>
                <ui style="display: flex">
                    <li class="q-pagination-btn centered"
                        @click=${(e: MouseEvent) => this.current !== 1 && this.goto(this.current - 1, e)}>
                        <button class="centered" disabled=${this.current === 1 && "disabled"}>
                            <svg class="icon" viewBox="0 0 1024 1024">
                                <path
                                        d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8c-16.4 12.8-16.4 37.5 0 50.3l450.8 352.1c5.3 4.1 12.9 0.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
                            </svg>
                        </button>
                    </li>
                    ${
                            arr.map(p => {
                                return p;
                            })
                    }
                    <li class="q-pagination-btn centered"
                        @click=${(e: MouseEvent) => this.current !== pageNum && this.goto(this.current + 1, e)}>
                        <button class="centered" disabled=${this.current === pageNum && "disabled"}>
                            <svg class="icon" viewBox="0 0 1024 1024">
                                <path
                                        d="M765.7 486.8L314.9 134.7c-5.3-4.1-12.9-0.4-12.9 6.3v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1c16.4-12.8 16.4-37.6 0-50.4z"></path>
                            </svg>
                        </button>
                    </li>
                </ui>
                <div class="page-size-change-wrapper">
                    <q-select
                            @change=${this.pageSizeChange}
                            class=${classMap({"draggable2": true,"display-none": !this.showSizeChanger})}
                            style="width: 100px; height: 36px;"
                            options=${JSON.stringify(this.pageSizeOptions)}
                            placeholder="请选择"
                            value=${this.pageSize}
                    ></q-select>
                </div>
                <div class=${classMap({"quick-jump-wrapper": true,"display-none": !this.showQuickJumper})}>
                    跳转
                    <q-input style="width: 50px" @onChange=${this.inputChange} size="medium"></q-input>
                    页
                </div>
            </div>
        `;
    }

    initModel(): void {
        // const self = this;

        this.model = deepWatchModelProxy(
            mergeModel(this.model, {
                get componentName() {
                    return "q-pagination";
                },
                get type() {
                    return "容器";
                },
                get text() {
                    return "容器";
                },
                get group() {
                    return ["容器"];
                },
                get image() {
                    return "";
                },
                get description() {
                    return "分页组件";
                },
                get schema() {
                    return {
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
                            list: [
                                {
                                    type: "number",
                                    label: "当前页",
                                    options: {
                                        type: "number",
                                        width: "100%",
                                        defaultValue: 0,
                                        placeholder: "请输入",
                                        clearable: false,
                                        maxLength: 0,
                                        prepend: "",
                                        append: "",
                                        tooltip: "",
                                        hidden: false,
                                        disabled: false,
                                        dynamicHide: false,
                                        dynamicHideValue: "",
                                    },
                                    model: "current",
                                    key: "current",
                                    rules: [
                                        {
                                            required: true,
                                            message: "必填项",
                                            trigger: ["blur"],
                                        },
                                    ],
                                },
                                {
                                    type: "number",
                                    label: "分页大小",
                                    options: {
                                        type: "number",
                                        width: "100%",
                                        defaultValue: 15,
                                        placeholder: "请输入",
                                        clearable: false,
                                        maxLength: 0,
                                        prepend: "",
                                        append: "",
                                        tooltip: "",
                                        hidden: false,
                                        disabled: false,
                                        dynamicHide: false,
                                        dynamicHideValue: "",
                                    },
                                    model: "pageSize",
                                    key: "pageSize",
                                    rules: [
                                        {
                                            required: true,
                                            message: "必填项",
                                            trigger: ["blur"],
                                        },
                                    ],
                                },
                                {
                                    type: "number",
                                    label: "数据总数",
                                    options: {
                                        type: "number",
                                        width: "100%",
                                        defaultValue: 20,
                                        placeholder: "请输入",
                                        clearable: false,
                                        maxLength: 0,
                                        prepend: "",
                                        append: "",
                                        tooltip: "",
                                        hidden: false,
                                        disabled: false,
                                        dynamicHide: false,
                                        dynamicHideValue: "",
                                    },
                                    model: "total",
                                    key: "total",
                                    rules: [
                                        {
                                            required: true,
                                            message: "必填项",
                                            trigger: ["blur"],
                                        },
                                    ],
                                },
                                {
                                    type: "number",
                                    label: "显示数量",
                                    options: {
                                        type: "text",
                                        width: "100%",
                                        defaultValue: 5,
                                        placeholder: "请输入",
                                        clearable: false,
                                        maxLength: 0,
                                        prepend: "",
                                        append: "",
                                        tooltip: "",
                                        hidden: false,
                                        disabled: false,
                                        dynamicHide: false,
                                        dynamicHideValue: "",
                                    },
                                    model: "numDisplay",
                                    key: "numDisplay",
                                    rules: [
                                        {
                                            required: false,
                                            message: "必填项",
                                            trigger: ["blur"],
                                        },
                                    ],
                                },
                                {
                                    type: "number",
                                    label: "输入框",
                                    options: {
                                        type: "text",
                                        width: "100%",
                                        defaultValue: 3,
                                        placeholder: "请输入",
                                        clearable: false,
                                        maxLength: 0,
                                        prepend: "",
                                        append: "",
                                        tooltip: "",
                                        hidden: false,
                                        disabled: false,
                                        dynamicHide: false,
                                        dynamicHideValue: "",
                                    },
                                    model: "numEdge",
                                    key: "numEdge",
                                    rules: [
                                        {
                                            required: false,
                                            message: "必填项",
                                            trigger: ["blur"],
                                        },
                                    ],
                                },
                                {
                                    type: "input",
                                    label: "输入框",
                                    options: {
                                        type: "text",
                                        width: "100%",
                                        defaultValue: "...",
                                        placeholder: "请输入",
                                        clearable: false,
                                        maxLength: 0,
                                        prepend: "",
                                        append: "",
                                        tooltip: "",
                                        hidden: false,
                                        disabled: false,
                                        dynamicHide: false,
                                        dynamicHideValue: "",
                                    },
                                    model: "ellipseText",
                                    key: "ellipseText",
                                    rules: [
                                        {
                                            required: false,
                                            message: "必填项",
                                            trigger: ["blur"],
                                        },
                                    ],
                                }
                            ],
                        },
                    };
                },
                _onMessageMeta: {
                    changeInfo: [
                        function (e: IMessage) {
                            console.log(e)
                        },
                    ],
                },
                _onDOMEvent: {},
                _onWatchSetting: {
                    data: [
                        function (newVal: any, oldVal: any, context: any) {
                            console.log(newVal, oldVal, context);
                        },
                    ],
                },
            })
        );
    }
    public pageSizeChange(e: MouseEvent){
        this.pageSize = (e.detail as any).value
        DOMEmit(this, "pageSizeChange", {detail: {pageSize:  (e.detail as any).value}})
    }

    public inputChange(e: any){
        const pageNum = Math.ceil(this.total / this.pageSize)
        let {value} = e.detail
        value = parseInt(value)
        if(typeof value === "number"){
            const result = Math.abs(value) > pageNum ? pageNum : Math.abs(value)
            this.goto(result, e)
        }
    }

    public change(index: number, e: MouseEvent) {
        e.stopPropagation();
        DOMEmit(this, "pageChange", {detail: {current: index}})
    }

    private goto(index: number, e: MouseEvent) {
        this.current = index
        this.change(index, e);
    }

    private getInterval() {
        const pageNum = Math.ceil(this.total / this.pageSize)
        const neHalf = Math.ceil(this.numDisplay / 2);
        const upperLimit = pageNum - this.numDisplay;
        const start =
            this.current > neHalf
                ? Math.max(Math.min(this.current - neHalf, upperLimit), 0)
                : 0;
        const end =
            this.current > neHalf
                ? Math.min(this.current + neHalf, pageNum)
                : Math.min(this.numDisplay, pageNum);
        return [start, end];
    }

    private getItem(pageIndex: number, text: number) {
        if (this.current === pageIndex) {
            return html`
                <li class="q-pagination-btn centered active">
                    <button>${text}</button>
                </li>`;
        }
        return html`
            <li
                    class="q-pagination-btn centered"
                    @click=${(e: MouseEvent) => {
                        this.goto(pageIndex, e);
                    }}
            >
                <button>${text}</button>
            </li>`
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "q-pagination": QPagination;
    }
}

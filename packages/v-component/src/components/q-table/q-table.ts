import {css, html, PropertyValues, unsafeCSS} from "lit";
import {customElement, property} from "lit/decorators.js";
import {unsafeHTML} from "lit/directives/unsafe-html.js";
import {classMap} from "lit/directives/class-map.js";
import {choose} from "lit/directives/choose.js";
import {Component} from "../../types/runtime/Component";
import {EComponentGroup, EComponentType, ISchema} from "../../types/runtime/IModelSchema";
import {domAssemblyCustomEvents} from "../../util/base-method";
import {ColumnType} from "./IQTable";
import {classNames} from "../../common";
import {DOMEmit} from "../../util/reactivity/Emit";
import {find, isEqual, omit} from "lodash-es";
import {IQPaginationOptions} from "../q-pagination/IQPagination";
import cssIndex from "../q-table/index.scss?inline";
import {booleanTransform} from "../../util/utils";
import {ComponentModel} from "../../types/runtime/ComponentModel";
import {IMessage} from "../../types/runtime/IMessage";

/**
 * 文本组件
 *
 */
@customElement("q-table")
export class QTable extends Component {

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];

  /**
   * 表头
   */
  @property({
    attribute: "table-columns", reflect: true, hasChanged: (value, oldValue) => {
      return value !== oldValue
    }, converter: {
      fromAttribute: (value: string) => {
        return JSON.parse(value, (k, v) => {
          if (k === "customRender") return eval(v)
          return v
        })
      },
      toAttribute: (value) => {
        return JSON.stringify(value, (k, v) => {
          if (k === "customRender") return v.toString()
          return v
        })
      }
    }
  })
  columns: ColumnType = [
    {title: "名称", key: "appName", dataIndex: "appName",align: "left"},
    {title: "版本", key: "appVersion", dataIndex: "appVersion",align: "left"},
    {"customRender":"function customRender () {\n    return `<q-button type=\"text\"><svg viewBox=\"64 64 896 896\" data-icon=\"upload\" width=\"1em\" height=\"1em\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\" class=\"\"><path d=\"M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 0 0-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z\"></path></svg>打开App</q-button><q-button style=\"margin-left: 5px;\" type=\"text\"><svg viewBox=\"64 64 896 896\" data-icon=\"edit\" width=\"1em\" height=\"1em\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\" class=\"\"><path d=\"M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z\"></path></svg>编辑</q-button> <q-popover class=\"table-popover\" trigger=\"click\"><q-button style=\"margin-left: 5px\" type=\"text\"><svg viewBox=\"64 64 896 896\" data-icon=\"delete\" width=\"1em\" height=\"1em\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\" class=\"\"><path d=\"M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z\"></path></svg>删除</q-button><div style=\"width: 120px;padding: 10px;text-align: unset;\" slot=\"popover\" tip=\"popover\">真的要删除吗？<q-button type=\"info\" class=\"popoverCancel\">取消</q-button><q-button class=\"popoverConfirm\" style=\"margin-left: 5px\" type=\"primary\">确定</q-button></div></q-popover>`\n}","title":"操作","dataIndex":"operate","key":"operate","width":"200px"}
  ]


  /*
  * 数据
  * */
  @property({type: Array, attribute: "data-source", reflect: true})
  dataSource = [{
    appName: "uiBuilder",
    appVersion: "new"
  }, {
    appName: "uiBuilder",
    appVersion: "new"
  }, {
    appName: "uiBuilder",
    appVersion: "new"
  }]

  /**
   * 开启分页
   */
  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public pagination = false;

  /*
  * 分页
  * */
  @property({type: Object, attribute: "table-pagination", reflect: true})
  tablePagination = {
    "current": 1,
    "pageSize": 10,
    "total": 3,
    "numDisplay": 5,
    "numEdge": 3,
    "ellipseText": "...",
    "style": "text-align: center;"
  } as IQPaginationOptions

  /*
  * 自定义表头样式
  * */
  @property({type: String, attribute: "custom-header-style", reflect: true})
  customHeaderStyle = ""

  /*
  * 自定义行样式
  * */
  @property({type: String, attribute: "custom-header-style", reflect: true})
  customRowStyle = ""

  /*
  * 表格顶部工具栏
  * */
  @property({type: String, attribute: "toolbar-style", reflect: true})
  toolbarStyle = "justify-content: space-between;align-items: center;"

  @property({type: String, attribute: "toolbar-html", reflect: true})
  toolbarHtml = "<q-button type=\"primary\" @click=\"test\">新增</q-button> <q-input style=\"width: 280px;\" placeholder=\"请输入\" type=\"input\" value=\"\"></q-input>"

  /*
  * 是否支持编辑
  * */
  @property({type: Boolean, attribute: "editable", reflect: true})
  editable = false

  /*
  * 开启的编辑行
  * */
  @property({type: Object, attribute: "editable-data", reflect: true})
  editableData = {}

  /*
  * 显示遮罩
  * */
  @property({
    type: Boolean, attribute: "loading", reflect: true, converter(value, type?) {
      return booleanTransform(value);
    }
  })
  loading = false

  /**
   * 数据模型
   */
  model!: ISchema;

  constructor() {
    super();
    this.initModel();
    domAssemblyCustomEvents(this, this.model.onDOMEvent);
  }


  @property({type: Function, attribute: "rowClassName", reflect: true})
  rowClassName: Function = (_record: object, index: number): string | null => (index % 2 === 1 ? "q-table-striped" : null)

  // @queryAll('.q-table-tbody-tr')
  // _trNodeArr!: NodeListOf<HTMLButtonElement>;

  /*
   * 行点击方法
   * */
  public onTdClick(row: any, column: any, index: number, event: MouseEvent) {
    event = Array.isArray(event) && event.length ? event[0] : event;
    const target = event.target as HTMLElement;
    const colIndex = Number(target?.getAttribute("data-table-col"));
    const columns = column[colIndex];
    event.stopPropagation();
    this.onSendMessage("onTdClicked", { row, column: columns, index });
    DOMEmit(this, "onTdClicked", { detail: { row, column: columns, index } });
  }

  /**
   * 操作行事件
   * @param row 点击行
   * @param column  表头
   * @param colIndex 列索引
   * @param rowIndex 行索引
   * @param event 事件
   */
  public onBtnClick(row: any, column: any, colIndex: number, rowIndex: number, event: MouseEvent) {
    event = Array.isArray(event) && event.length ? event[0] : event;
    const target = event.target as HTMLElement;
    event.stopPropagation();
    this.showEditRow({ row, rowIndex, type: target.innerHTML });
    this.onSendMessage("onBtnClicked", { row, column, colIndex, rowIndex, type: target.innerHTML });
    DOMEmit(this, "onBtnClicked", { detail: { row, column, colIndex, rowIndex, type: target.innerHTML } });
  }

  public showEditRow({ row, rowIndex, type }: { row: any; rowIndex: number; type: string }) {
    if (type === "编辑") {
      this.editableData = { ...this.editableData, ...{ [rowIndex]: row } };
    }
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    super.attributeChangedCallback(name, _old, value);
    if (name === "table-pagination") {
      // const dataRange = this.getInterval()
      // this.dataSource = cloneDeep(this.originData).splice(dataRange[0],dataRange[1])
    }
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    DOMEmit(this, "onComplete", {});
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    // const interval = this.getInterval()
    // ${cloneDeep(this.dataSource).splice(interval[0], interval[1]).map((it, rowIndex) => {
    const isPagination = !this.pagination ? "not-pagination" : "pagination"
    let operateCustomRender = find(this.columns, {key: "operate"}) !== undefined ? find(this.columns, {key: "operate"}).customRender : ""
    operateCustomRender = new Function(`return ${operateCustomRender}`)()
    return html`
      <q-spin loading=${this.loading}>
        <div style="position: relative;width: 100%">
          <div
            class="q-table-toolbar"
            @click=${(e: MouseEvent) => this.toolbarClick(e)}
            @onChange=${this.toolbarInput}
            style=${this?.toolbarStyle + `display: ${this.toolbarHtml ? "flex" : "none"}`}
          >
            ${unsafeHTML(this?.toolbarHtml)}
          </div>
          <table class="q-table">
            <thead>
              <tr style=${this.customHeaderStyle}>
                ${this.columns.map((it: ColumnType) => {
                  return html`
                    <th>${it.title}</th>
                  `;
                })}
              </tr>
            </thead>
            <tbody>
              ${this.dataSource?.length &&
              this.dataSource.map((it, rowIndex) => {
                return html`
                  <tr
                    class=${classNames(this.rowClassName?.(it, rowIndex), {
                      tip: false,
                      "q-table-tbody-tr": true,
                    })}
                    style=${this.customRowStyle}
                    @click=${(e: MouseEvent) => this.onTdClick(it, this.columns, rowIndex, e)}
                  >
                    ${this.columns.map((col: any, colIndex: number) => {
                      const align = col?.align || "left";
                      const key = col?.key;
                      const maxWidth = col?.maxWidth;
                      const width = col?.width;
                      const customRender = col["customRender"] || "";
                      // let operateHtml: TemplateResult = html``
                      if (col.key === "operate") {
                        return !(this.editable && this.editableData[rowIndex] !== undefined)
                          ? html`
                              <td @click=${(e: MouseEvent) => this.onBtnClick(it, col, colIndex, rowIndex, e)}>
                                ${unsafeHTML(
                                  `${
                                    operateCustomRender({
                                      colIndex,
                                      column: it,
                                    }) || ""
                                  }`
                                )}
                              </td>
                            `
                          : html`
                              <td>
                                <q-button style="" type="primary" @click=${() => this.editSave(rowIndex)}>
                                  保存
                                </q-button>
                                <q-button
                                  @click=${() => this.editCancel(rowIndex)}
                                  style="margin-left: 5px"
                                  type="danger"
                                >
                                  取消
                                </q-button>
                              </td>
                            `;
                      }
                      return html`
                        <td
                          class=${classMap({
                            "text-align-left": align === "left",
                            "text-align-right": align === "right",
                            "text-align-center": align === "center",
                          })}
                        >
                          ${choose(this.editable && this.editableData[rowIndex] !== undefined, [
                            [
                              true,
                              () => html`
                                <div class="q-table-tbody-cell" data-table-col=${colIndex} data-table-row=${rowIndex}>
                                  <q-input value=${this.editableData[rowIndex][key]} />
                                </div>
                              `,
                            ],
                            [
                              false,
                              () => html`
                                <div
                                  class="q-table-tbody-cell"
                                  data-table-col=${colIndex}
                                  data-table-row=${rowIndex}
                                  style=${(width ? "width:" + width + ";" : "") +
                                  (maxWidth ? "max-width:" + maxWidth + ";" : "")}
                                >
                                  ${customRender
                                    ? unsafeHTML(
                                        customRender({
                                          colIndex,
                                          column: it,
                                        })
                                      )
                                    : it[col.key]}
                                </div>
                              `,
                            ],
                          ])}
                        </td>
                      `;
                    })}
                  </tr>
                `;
              })}
            </tbody>
          </table>
          ${choose(isPagination, [
            [
              "pagination",
              () => html`
                <div class="pagination-wrapper" style=${this.tablePagination?.style}>
                  <div style="display: inline-block">
                    <q-pagination
                      @pageChange=${this.pageChange}
                      @pageSizeChange=${this.pageSizeChange}
                      class="q-pagination"
                      current=${this.tablePagination.current}
                      total=${this.tablePagination.total}
                      show-size-changer
                      show-quick-jumper
                      show-total
                      page-size=${this.tablePagination.pageSize}
                    ></q-pagination>
                  </div>
                </div>
              `,
            ],
            ["not-pagination", () => html``],
          ])}
        </div>
      </q-spin>
    `;
  }

  protected willUpdate(_changedProperties: PropertyValues) {
    super.willUpdate(_changedProperties);
  }

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
  }

  editSaveData = {};
  private editSave(key: number) {
    this.editSaveData = { data: this.editableData[key] };
    this.onSendMessage("onTableEdit", { data: this.editableData[key] });
    DOMEmit(this, "onTableEdit", { detail: { data: this.editableData[key] } });
    this.editableData = omit(this.editableData, key);
  }

  /*
   * 编辑取消
   * */
  private editCancel(key: number): void {
    this.editableData = omit(this.editableData, key);
  }

  private pageChange(e: MouseEvent) {
    this.tablePagination = { ...this.tablePagination, current: (e.detail as any).current };
    this.emitPageChange();
  }

  private pageSizeChange(e: MouseEvent) {
    this.tablePagination = { ...this.tablePagination, pageSize: (e.detail as any).pageSize };
    this.emitPageChange();
  }
  private emitPageChange() {
    this.onSendMessage("onPageChange", {
      current: this.tablePagination.current,
      pageSize: this.tablePagination.pageSize,
    });
    DOMEmit(this, "onPageChange", {
      detail: {
        current: this.tablePagination.current,
        pageSize: this.tablePagination.pageSize,
      },
    });
  }

  private toolbarClick(e: MouseEvent) {
    this.onSendMessage("onToolbarClick", e);
    DOMEmit(this, "onToolbarClick", { detail: { e } });
  }

  private toolbarInput(e: any) {
    const { value } = e.detail;
    this.onSendMessage("onToolbarInput", value);
    DOMEmit(this, "onToolbarInput", { detail: { value, e } });
  }

  /**
   * 设置表格值
   * @param data
   */
  public setValue(data: any[]) {
    if (!Array.isArray(data)) return;
    this.dataSource = data;
  }

  /**
   * 重置表格值
   */
  public resetValue() {
    this.dataSource = [
      {
        appName: "uiBuilder",
        appVersion: "new",
      },
      {
        appName: "uiBuilder",
        appVersion: "new",
      },
      {
        appName: "uiBuilder",
        appVersion: "new",
      },
    ];
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-table";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "表格";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "用于数据展示";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "更改组件数据",
                eventType: "changeInfo",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "重置组件数据",
                eventType: "resetInfo",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "设置组件数据",
                eventType: "setInfo",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "抛出数据",
                eventType: "throwTableData",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "操作台输入框事件",
                eventType: "onToolbarInput",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "操作台点击事件",
                eventType: "onToolbarClick",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "分页点击事件",
                eventType: "onPageChange",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "表格编辑事件",
                eventType: "onTableEdit",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "表格行点击事件",
                eventType: "onTdClicked",
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
                dataSource: {
                  type: "array",
                  description: "表头",
                  items: {
                    type: "string",
                    description: "表格值",
                  },
                },
                columns: {
                  type: "array",
                  description: "表头",
                  items: {
                    type: "object",
                    description: "子项数据",
                    properties: {
                      title: {
                        type: "string",
                        description: "表头名称",
                      },
                      key: {
                        type: "string",
                        description: "表头对应key",
                      },
                      dataIndex: {
                        type: "string",
                        description: "表头索引",
                      },
                      customRender: {
                        type: "string",
                        description: "自定义渲染",
                      },
                      align: {
                        type: "string",
                        description: "对齐方式（left|center|right）",
                      },
                      maxWidth: {
                        type: "string",
                        description: "宽度（支持%、px）",
                      },
                      width: {
                        type: "string",
                        description: "最大宽度（支持%、px）",
                      }
                    },
                  },
                },
                pagination: {
                  type: "boolean",
                  description: "分页",
                },
                tablePagination: {
                  type: "object",
                  description: "分页配置",
                  properties: {
                    current: {
                      type: "number",
                      description: "当前页",
                    },
                    pageSize: {
                      type: "number",
                      description: "分页大小",
                    },
                    total: {
                      type: "number",
                      description: "总条目",
                    },
                    numDisplay: {
                      type: "number",
                      description: "分页大小",
                    },
                    numEdge: {
                      type: "number",
                      description: "分页大小",
                    },
                    ellipseText: {
                      type: "string",
                      description: "分页省略文字",
                    },
                    style: {
                      type: "string",
                      description: "分页样式",
                    },
                  },
                },
                customHeaderStyle: {
                  type: "string",
                  description: "自定义表头样式",
                },
                customRowStyle: {
                  type: "string",
                  description: "自定义行样式",
                },
                toolbarStyle: {
                  type: "string",
                  description: "工具栏样式",
                },
                toolbarHtml: {
                  type: "string",
                  description: "工具栏HTML",
                },
                editable: {
                  type: "boolean",
                  description: "开启编辑",
                },
                loading: {
                  type: "boolean",
                  description: "遮罩",
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
          setInfo: [
            function (e: IMessage) {
              // @ts-ignore
              this.setValue(e.body);
            },
          ],
          changeInfo: [
            function (e: IMessage) {
              // @ts-ignore
              this.setValue(e.body);
            },
          ],
          resetInfo: [
            function (e: IMessage) {
              // @ts-ignore
              this.resetValue();
            },
          ],
        },
        _onDOMEvent: {},
        _initStyle: "height:auto;width:260px;",
        _onWatchSetting: {
          value: [
            function (newVal: any, oldVal: any, context: any) {
              // self.onSendMessage()
            },
          ],
        },
        _lifeCycle: {
          created: function () {},
          updated: function () {
            console.log("update");
          },
          destroy: function () {},
        },
        get columns() {
          return self.columns;
        },
        set columns(value) {
          if (Array.isArray(value) || isEqual(value, self.columns)) return;
          self.columns = value;
        },
        get dataSource() {
          return self.dataSource.map((it) => JSON.stringify(it));
        },
        set dataSource(value) {
          self.dataSource = value.map((it) => it && JSON.parse(it));
        },
        get customHeaderStyle() {
          return self.customHeaderStyle;
        },
        set customHeaderStyle(value) {
          self.customHeaderStyle = value;
        },
        get customRowStyle() {
          return self.customRowStyle;
        },
        set customRowStyle(value) {
          self.customRowStyle = value;
        },
        get toolbarStyle() {
          return self.toolbarStyle;
        },
        set toolbarStyle(value) {
          self.toolbarStyle = value;
        },
        get toolbarHtml() {
          return self.toolbarHtml;
        },
        set toolbarHtml(value) {
          self.toolbarHtml = value;
        },
        get editable() {
          return self.editable;
        },
        set editable(value) {
          self.editable = value;
        },
        get loading() {
          return self.loading;
        },
        set loading(value) {
          self.loading = value;
        },
        get editableData() {
          return self.editableData;
        },
        set editableData(value) {
          self.editableData = value;
        },
        get tablePagination() {
          return self.tablePagination;
        },
        set tablePagination(value) {
          self.tablePagination = value;
        },
        get pagination() {
          return self.pagination;
        },
        set pagination(value) {
          self.pagination = value;
        },
      } as unknown as ISchema,
    });
  }

  onSendMessage(type: string, value: any) {
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

  // private getInterval() {
  //     let interval = [0, this.dataSource.length - 1]
  //     if (Object.keys(this.tablePagination).length !== 0) {
  //         const {pageSize, current} = this.tablePagination
  //         interval = [current * pageSize, pageSize]
  //     }
  //     return interval
  // }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-table": QTable;
  }
}

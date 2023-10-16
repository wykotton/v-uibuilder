import { css, html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { isEqual, isString } from "lodash-es";
import { ISchema, EComponentType, EComponentGroup } from "../../types/runtime/IModelSchema";
import { Component } from "../../types/runtime/Component";
import { createVueComponent } from "./component";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { unmountInstance } from "../../util/utils";
import antdCss from "ant-design-vue/dist/antd.min.css?inline";
import cssIndex from "./index.scss?inline?inline";
import { IMessage } from "../../types/runtime/IMessage";
import { comData, Common, Pagination, OperationBar, SearchBar, OperationCol, Appearance } from "./IQTablely";

// 内|部变更，不需要重新渲染
const insideChange = new Proxy({ value: false }, {});

/**
 * 表格
 */
@customElement("q-tablely")
export class QTablely extends Component {
  constructor() {
    super();
    this.initModel();
  }
  static styles = [
    css`
      ${unsafeCSS(antdCss)}
    `,
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];
  /**
   * 表头数据 columns
   */
  @property({ type: Array, attribute: "columns" })
  columns = [
    {
      title: "姓名",
      key: "name",
      dataIndex: "name",
      type: "text",
      required: true,
      message: "请填写姓名",
      resizable: false
    },
    {
      title: "年龄",
      key: "age",
      dataIndex: "age",
      type: "number",
      resizable: false,
    },
    {
      title: "住址",
      key: "address",
      dataIndex: "address",
      type: "text",
      resizable: false,
    },
    {
      title: "标签",
      key: "tags",
      dataIndex: "tags",
      type: "tag",
      mode: "multiple",
      options: [
        {
          label: "帅气",
          value: "帅气",
        },
        {
          label: "开发者",
          value: "开发者",
        },
        {
          label: "失败者",
          value: "失败者",
        },
        {
          label: "酷",
          value: "酷",
        },
        {
          label: "老师",
          value: "老师",
        },
      ],
      resizable: false,
    },
  ];
  /**
   * 操作列 operationcol
   */
  @property({
    type: Object,
    hasChanged(newVal: OperationCol, oldVal: OperationCol) {
      return !insideChange.value;
    },
  })
  operationcol = {
    title: "操作",
    enable: true, // 是否显示该列
    fixed: false, // 是否锁定列
    btn: [
      {
        label: "修改", // 按钮文字
        type: "链接", // 按钮风格
        func: "修改", // 点击按钮后触发的父组件事件
      },
      {
        label: "删除", // 按钮文字
        type: "链接", // 按钮风格
        func: "删除", // 点击按钮后触发的父组件事件
      },
    ],
  };
  /**
   * 操作栏 operationbar
   */
  @property({
    type: Object,
    hasChanged(newVal: OperationBar, oldVal: OperationBar) {
      return !insideChange.value;
    },
  })
  operationbar = {
    visible: false,
    type: "默认", // 按钮风格
    btn: [
      {
        label: "新增", // 按钮文字
        type: "默认", // 按钮风格
        func: "新增", // 点击按钮后触发的父组件事件
      },
      {
        label: "刷新", // 按钮文字
        type: "默认", // 按钮风格
        disabled: false, // 按钮可用
        loading: false, // 按钮加载
        func: "刷新", // 点击按钮后触发的父组件事件
      },
    ],
  };
  /**
   * 搜索栏 searchbar
   */
  @property({
    type: Object,
    hasChanged(newVal: SearchBar, oldVal: SearchBar) {
      return !insideChange.value;
    },
  })
  searchbar = {
    visible: false,
    type: "默认",
    value: "",
    btnTitle: "搜索",
    placeholder: "请输入搜索关键字",
    func: "searchHandleFun",
  };
  /**
   * 选中行 selectedRowKeys
   */
  @property({ type: Array, attribute: "selectedRowKeys" })
  selectedRowKeys = [];

  /**
   * 外观设置
   */
  @property({
    type: Object,
    hasChanged(newVal: Appearance, oldVal: Appearance) {
      return !insideChange.value;
    },
  })
  appearance = {
    striped: {
      enable: true,
      color: "#fafafa",
    },
    bordered: false,
    hSplitline: {
      enable: true,
      color: "#f0f0f0",
    },
    vSplitline: {
      enable: true,
      color: "#f0f0f0",
    },
    text: {
      headcolor: "#000000d9",
      headbgcolor: "#fafafa",
      bodycolor: "#000000d9",
      bodybgcolor: "#ffffff",
    },
    hoverbg: "#f0f0f0",
    size: "默认",
    bg: true,
  };

  /**
   * 表格数据 tdata
   */
  @property({ type: Array, attribute: "tdata" })
  tdata = [
    {
      key: "1",
      name: "约翰·布朗",
      age: 32,
      address: "纽约一号湖公园",
      tags: ["帅气", "开发者"],
    },
    {
      key: "2",
      name: "吉姆·格林",
      age: 42,
      address: "伦敦二号湖公园",
      tags: ["失败者"],
    },
    {
      key: "3",
      name: "乔·布莱克",
      age: 32,
      address: "西德尼三号湖公园",
      tags: ["酷", "老师"],
    },
  ];
  /**
   * 组件指令 common
   */
  @property({
    type: Object,
    hasChanged(newVal: Common, oldVal: Common) {
      return !insideChange.value;
    },
  })
  common = {
    openAddModal: false,
  };
  /**
   * 组件指令 pagination
   */
  @property({
    type: Object,
    hasChanged(newVal: Pagination, oldVal: Pagination) {
      return !insideChange.value;
    },
  })
  pagination = {
    visible: false,
    data: {
      current: "1",
      pageSize: "10",
      showSizeChanger: false,
      showQuickJumper: false,
    },
  };
  /**
   * 组件数据
   */
  @property({
    type: Object,
    hasChanged(newVal: comData, oldVal: comData) {
      if (insideChange.value) {
        insideChange.value = false;
        return insideChange.value;
      }
      return true;
    },
  })
  /**
   * 数据类型 type
   * text: 文本,
   * number: 数字,
   * money: 金额,
   * date: 日期,
   * tel: 手机号,
   * percent: 百分比,
   * progress: 进度条,
   * link: 链接,
   * win: 弹窗,
   * tag: 标签
   */
  comData: comData = {
    columns: this.columns,
    operationcol: this.operationcol,
    // [{
    //   title: "Action",
    //   key: "action",
    //   items: [{
    //     label: "删除", // 按钮文字
    //     Fun: "delHandleFun", // 点击按钮后触发的父组件事件
    //   }]
    // }]

    operationbar: this.operationbar,
    searchbar: this.searchbar,
    // tdata: this.tdata,
    loading: false,
    // pagination: {
    //   visible: false,
    //   data: {
    //     current: 1,
    //     pageSize: 10
    //   }
    // },
    // common: this.common
    selectedRowKeys: this.selectedRowKeys,
    appearance: this.appearance,
  };
  /**
   * 表格加载
   */
  @property({ type: Boolean })
  public loading!: boolean;

  /**
   * 表格选择框
   */
   @property({ type: Boolean })
   public rowSelection!: boolean;

  /**
   * 挂载节点.
   */
  @query("#container")
  container!: HTMLElement;

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  /**
   * 组件实例
   */
  componentInstance: any = null;
  // 渲染模板
  render() {
    // 初始化数据
    this.common.openAddModal = false;
    return html`
      <div id="container" class="q-tablely-container"></div>
    `;
  }
  // 获取数据
  getOrgData() {
    return {
      orgTdata: [
        {
          key: "1",
          name: "约翰·布朗",
          age: 32,
          address: "纽约一号湖公园",
          tags: ["帅气", "开发者"],
        },
        {
          key: "2",
          name: "吉姆·格林",
          age: 42,
          address: "伦敦二号湖公园",
          tags: ["失败者"],
        },
        {
          key: "3",
          name: "乔·布莱克",
          age: 32,
          address: "西德尼三号湖公园",
          tags: ["酷", "老师"],
        },
      ],
      orgColumnsData: [
        {
          title: "姓名",
          key: "name",
          dataIndex: "name",
          type: "text",
          required: true,
          // resizable: true
        },
        {
          title: "年龄",
          key: "age",
          dataIndex: "age",
          type: "number",
          // resizable: true,
        },
        {
          title: "住址",
          key: "address",
          dataIndex: "address",
          type: "text",
          // resizable: true,
        },
        {
          title: "标签",
          key: "tags",
          dataIndex: "tags",
          type: "tag",
          mode: "multiple",
          options: [
            {
              label: "帅气",
              value: "帅气",
            },
            {
              label: "开发者",
              value: "开发者",
            },
            {
              label: "失败者",
              value: "失败者",
            },
            {
              label: "酷",
              value: "酷",
            },
            {
              label: "老师",
              value: "老师",
            },
          ],
          // resizable: true,
        },
      ],
    };
  }
  // 抛出数据
  ThrowTableData(tdata: Array<any>) {
    const ttdmsg: IMessage = {
      header: {
        src: this.id,
        dst: "",
        srcType: "ThrowTableData",
        dstType: "",
      },
      body: tdata,
    };
    this.componentModel.sendMessage(ttdmsg);
  }
  // 创建表格数据
  CreateTableData(tableData: Array<any>) {
    if (tableData && tableData.length) {
      this.columns = [];
      Object.keys(this.tdata[0]).map((v: string, i: number) => {
        this.columns[i] = {
          title: v,
          key: v,
          dataIndex: v,
          type: this.tdata[0][v] instanceof Array ? "tag" : "text",
          resizable: true,
        };
      });
      return tableData;
    } else return [];
  }
  // const { results: { status, data } } = tableData
  // if (status === 200) {
  //   try {
  //     const { code, data: responseData, message } = data
  //     if (code === 200) {

  //     } else {
  //       console.log(message)
  //     }
  //   } catch (error) {

  //   }
  // }
  
  disconnectedCallback(): void {
    if (!this.isConnected) {
      // 断开文档连接，说明元件已被删除
      unmountInstance(this);
    }
    super.disconnectedCallback();
  }

  connectedCallback(): void {
    if (!this.componentInstance && this.container) {
      createVueComponent(this, insideChange);
    }
    super.connectedCallback();
  }

  protected updated(): void {
    if (this.container) {
      unmountInstance(this);
      createVueComponent(this, insideChange);
    }
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-tablely";
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
              {
                text: "抛出表格数据",
                eventType: "throwTableData",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "弹出新增模态",
                eventType: "openAddModal",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "编辑成功",
                eventType: "editedTableData",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "删除成功",
                eventType: "deletedTableData",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "变更分页",
                eventType: "PageChange",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "选中指定行",
                eventType: "SelectionRow",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "抛出表格数据",
                eventType: "ThrowTableData",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "发起编辑",
                eventType: "EditTableData",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "发起自定义事件",
                eventType: "CustomEvents",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "发起删除",
                eventType: "DeleteTableData",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "发起搜索",
                eventType: "SearchTableData",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "分页点击事件",
                eventType: "PageChange",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "点击表头事件",
                eventType: "ClickHeaderRow",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "双击表头事件",
                eventType: "DblclickHeaderRow",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "右键表头事件",
                eventType: "ContextmenuHeaderRow",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "鼠标进入表头事件",
                eventType: "MouseenterHeaderRow",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "鼠标离开表头事件",
                eventType: "MouseleaveHeaderRow",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "点击行事件",
                eventType: "ClickRow",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "双击行事件",
                eventType: "DblclickRow",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "右键行事件",
                eventType: "ContextmenuRow",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "鼠标进入行事件",
                eventType: "MouseenterRow",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "鼠标离开行事件",
                eventType: "MouseleaveRow",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "点击表头单元格事件",
                eventType: "ClickHeaderCell",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "双击表头单元格事件",
                eventType: "DblclickHeaderCell",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "右键表头单元格事件",
                eventType: "ContextmenuHeaderCell",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "鼠标进入表头单元格事件",
                eventType: "MouseenterHeaderCell",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "鼠标离开表头单元格事件",
                eventType: "MouseleaveHeaderCell",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "点击行单元格事件",
                eventType: "ClickCell",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "双击行单元格事件",
                eventType: "DblclickCell",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "右键行单元格事件",
                eventType: "ContextmenuCell",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "鼠标进入行单元格事件",
                eventType: "MouseenterCell",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "鼠标离开行单元格事件",
                eventType: "MouseleaveCell",
                messageSchema: "",
                messageDemo: "",
              },
              // {
              //   text: "表单提交数据",
              //   eventType: "onSubmitData",
              //   messageSchema: "",
              //   messageDemo: "",
              // },
              // {
              //   text: "操作台输入框事件",
              //   eventType: "onToolbarInput",
              //   messageSchema: "",
              //   messageDemo: "",
              // },
              // {
              //   text: "操作台点击事件",
              //   eventType: "onToolbarClick",
              //   messageSchema: "",
              //   messageDemo: "",
              // },
              // {
              //   text: "分页点击事件",
              //   eventType: "onPageChange",
              //   messageSchema: "",
              //   messageDemo: "",
              // },
              // {
              //   text: "表格编辑事件",
              //   eventType: "onTableEdit",
              //   messageSchema: "",
              //   messageDemo: "",
              // },
              // {
              //   text: "表格行点击事件",
              //   eventType: "onTdClicked",
              //   messageSchema: "",
              //   messageDemo: "",
              // },
            ],
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                columns: {
                  type: "array",
                  description: "表头",
                  items: {
                    type: "object",
                    description: "列",
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
                      // customRender: {
                      //   type: "string",
                      //   description: "自定义渲染",
                      // },
                      // align: {
                      //   type: "string",
                      //   description: "对齐方式（left|center|right）",
                      // },
                      // maxWidth: {
                      //   type: "string",
                      //   description: "宽度（支持%、px）",
                      // },
                      width: {
                        type: "string",
                        description: "宽度",
                      }
                    },
                  },
                },
                tdata: {
                  type: "array",
                  description: "数据项",
                  items: {
                    type: "string",
                    description: "表格值",
                  },
                },
                operationcol: {
                  type: "object",
                  description: "操作列",
                  properties: {
                    enable: {
                      type: "boolean",
                      description: "是否显示",
                    },
                    title: {
                      type: "string",
                      description: "标题",
                    },
                    fixed: {
                      type: "boolean",
                      description: "锁定",
                    },
                    btn: {
                      type: "array",
                      description: "按钮",
                      items: {
                        type: "object",
                        description: "列",
                        properties: {
                          label: {
                            type: "string",
                            description: "文字",
                          },
                          type: {
                            type: "string",
                            description: "风格",
                            enum: ["默认", "简约", "虚边", "文字", "链接"],
                          },
                          func: {
                            type: "string",
                            description: "执行事件函数",
                            enum: ["修改", "删除", "自定义"],
                          },
                        },
                      },
                    },
                  },
                },
                operationbar: {
                  type: "object",
                  description: "操作栏",
                  properties: {
                    visible: {
                      type: "boolean",
                      description: "是否启用",
                    },
                    // types: {
                    //   type: "string",
                    //   description: "主题1",
                    //   enum: ['默认', '简约', '虚边', '文字', '链接']
                    // },
                    btn: {
                      type: "array",
                      description: "按钮",
                      items: {
                        type: "object",
                        description: "列",
                        properties: {
                          label: {
                            type: "string",
                            description: "文字",
                          },
                          type: {
                            type: "string",
                            description: "风格",
                            enum: ["默认", "简约", "虚边", "文字", "链接"],
                          },
                          func: {
                            type: "string",
                            description: "执行事件函数",
                            enum: ["新增", "刷新", "自定义"],
                          },
                        },
                      },
                    },
                  },
                },
                searchbar: {
                  type: "object",
                  description: "搜索栏",
                  properties: {
                    visible: {
                      type: "boolean",
                      description: "是否启用",
                    },
                    // types: {
                    //   type: "string",
                    //   description: "主题1",
                    //   enum: ['默认', '简约', '虚边', '文字', '链接']
                    // },
                    value: {
                      type: "string",
                      description: "默认值",
                    },
                    btnTitle: {
                      type: "string",
                      description: "按钮文字",
                    },
                    placeholder: {
                      type: "string",
                      description: "占位符",
                    },
                    func: {
                      type: "string",
                      description: "执行函数",
                    },
                  },
                },
                pagination: {
                  type: "object",
                  description: "分页配置",
                  properties: {
                    visible: {
                      type: "boolean",
                      description: "是否启用",
                    },
                    data: {
                      type: "object",
                      description: "分页参数",
                      properties: {
                        current: {
                          type: "number",
                          description: "当前页",
                        },
                        showSizeChanger: {
                          type: "boolean",
                          description: "是否显示分页大小",
                        },
                        pageSize: {
                          type: "number",
                          description: "每页行数",
                        },
                        showQuickJumper: {
                          type: "boolean",
                          description: "是否显示快速跳转",
                        },
                      },
                    },
                  },
                },
                appearance: {
                  type: "object",
                  description: "外观设置",
                  properties: {
                    striped: {
                      type: "object",
                      description: "斑马线",
                      properties: {
                        enable: {
                          type: "boolean",
                          description: "启用",
                        },
                        color: {
                          type: "string",
                          description: "颜色",
                          format: "color",
                        },
                      }
                    },
                    bordered: {
                      type: "boolean",
                      description: "带边框",
                    },
                    hSplitline: {
                      type: "object",
                      description: "横分割线",
                      properties: {
                        enable: {
                          type: "boolean",
                          description: "启用",
                        },
                        color: {
                          type: "string",
                          description: "颜色",
                          format: "color",
                        },
                      },
                    },
                    vSplitline: {
                      type: "object",
                      description: "竖分割线",
                      properties: {
                        enable: {
                          type: "boolean",
                          description: "启用",
                        },
                        color: {
                          type: "string",
                          description: "颜色",
                          format: "color",
                        },
                      },
                    },
                    text: {
                      type: "object",
                      description: "表格颜色",
                      properties: {
                        headcolor: {
                          type: "string",
                          description: "表头前景色",
                          format: "color",
                        },
                        headbgcolor: {
                          type: "string",
                          description: "表头背景色",
                          format: "color",
                        },
                        bodycolor: {
                          type: "string",
                          description: "表体前景色",
                          format: "color",
                        },
                        bodybgcolor: {
                          type: "string",
                          description: "表体背景色",
                          format: "color",
                        },
                      },
                    },
                    size: {
                      type: "string",
                      description: "尺寸",
                      enum: ["默认", "中等", "紧凑"],
                    },
                    bg: {
                      type: "boolean",
                      description: "原装背景",
                    },
                  },
                },
                loading: {
                  type: "boolean",
                  description: "加载效果",
                },
                rowSelection: {
                  type: "boolean",
                  description: "选择框",
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
        _initStyle: "height:300px;width:760px;",
        _onMessageMeta: {
          resetInfo: [
            (e: IMessage) => {
              console.log("resetInfo", e.body);
              // @ts-ignore
              const _this = this.el;
              _this.tdata = _this.getOrgData().orgTdata;
              _this.columns = _this.getOrgData().orgColumnsData;
              _this.requestUpdate();
            },
          ],
          setInfo: [
            (e: IMessage) => {
              console.log("setInfo", e.body);
              // @ts-ignore
              const _this = this.el;
              // 接口数据
              // e.body.results.data
              // 假定数据
              const mockData = [
                {
                  date: "2016-05-02",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1518 弄",
                },
                {
                  date: "2016-05-04",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1517 弄",
                },
                {
                  date: "2016-05-01",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1519 弄",
                },
                {
                  date: "2016-05-03",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1516 弄",
                },
              ];
              _this.tdata = _this.CreateTableData(mockData); // 塑造表头并返回表格数据
              _this.requestUpdate("tdata");
            },
          ],
          throwTableData: [
            (e: IMessage) => {
              console.log("throwTableData", e);
              // @ts-ignore
              const _this = this.el;
              _this.ThrowTableData(_this.tdata);
            },
          ],
          openAddModal: [
            (e: IMessage) => {
              console.log("openAddModal", e);
              // @ts-ignore
              const _this = this.el;
              _this.componentInstance._instance.setupState.addHandleFun(); // 弹出新增模态窗
            },
          ],
          PageChange: [
            (e: IMessage) => {
              console.log("PageChange", e);
              // @ts-ignore
              const _this = this.el;
              _this.pagination.data.current = e.body.current;
              _this.pagination.data.pageSize = e.body.pageSize;
              _this.requestUpdate("pagination");
            },
          ],
          SelectionRow: [
            (e: IMessage) => {
              console.log("SelectionRow", e);
              // @ts-ignore
              const _this = this.el;
              _this.selectedRowKeys = ["3"]; // 指定行
              _this.requestUpdate("selectedRowKeys");
            },
          ],
          // initiateRequest: [
          //   function (e: IMessage) {
          //     // @ts-ignore
          //     this.componentInstance?._instance?.proxy?.initiateRequest();
          //   },
          // ],
        },

        _onDOMEvent: {
          // onGetPageData: [
          //   function (e: Event) {
          //     console.log(e);
          //   },
          // ],
          // onEditTableData: [
          //   function (e: Event) {
          //     console.log("EditTableData", e)
          //   }
          // ],
          // onDeleteTableData: [
          //   function (e: Event) {
          //     console.log("DeleteTableData", e)
          //   }
          // ],
          // onCustomEvents: [
          //   function (e: Event) {
          //     console.log("CustomEvents", e)
          //   }
          // ],
          // onThrowTableData: [
          //   function (e: Event) {
          //     console.log("ThrowTableData", e)
          //   }
          // ],
          // onSearchTableData: [
          //   function (e: Event) {
          //     console.log("SearchTableData", e)
          //   }
          // ],
          // onPageChange: [
          //   function (e: Event) {
          //     console.log("PageChange", e)
          //   }
          // ],
        },
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
        get columns() {
          return self.columns;
        },
        set columns(value) {
          if (isString(value)) {
            try {
              self.columns = JSON.parse(value);
            } catch (error) {
              self.columns = [];
            }
          } else {
            self.columns = value;
          }
          self.requestUpdate("columns");
        },
        get tdata() {
          return self.tdata.map((v) => JSON.stringify(v));
        },
        set tdata(value) {
          console.log(value);
          // if (isString(value)) {
          //   try {
          //     self.tdata = JSON.parse(value);
          //   } catch (error) {
          //     self.tdata = [];
          //   }
          // } else {
          //   self.tdata = value;
          // }
          try {
            self.tdata = value.map((v) => JSON.parse(v));
          } catch (error) {
            console.log("数据格式有误，请检查数据");
          }
          self.requestUpdate("tdata");
        },
        get operationcol() {
          return self.operationcol;
        },
        set operationcol(value) {
          console.log(value);
          if (value.btn) {
            self.operationcol = value;
            self.requestUpdate("operationcol");
          }
          // if (isString(value)) {
          //   try {
          //     self.comData.operation = JSON.parse(value);
          //   } catch (error) {
          //     self.comData.operation = [];
          //   }
          // } else {
          //   self.comData.operation = value;
          // }
          // self.requestUpdate()
        },
        get operationbar() {
          return self.operationbar;
        },
        set operationbar(value) {
          console.log(value);
          if (value.btn) {
            self.operationbar = value;
            self.requestUpdate("operationbar");
          }
        },
        get searchbar() {
          return self.searchbar;
        },
        set searchbar(value) {
          console.log(value);
          self.searchbar = value;
          self.requestUpdate("searchbar");
        },
        get loading() {
          return self.loading;
        },
        set loading(value) {
          self.loading = value;
          self.requestUpdate("loading");
        },
        get rowSelection() {
          return self.rowSelection;
        },
        set rowSelection(value) {
          self.rowSelection = value;
          self.requestUpdate("rowSelection");
        },
        get pagination() {
          return self.pagination;
        },
        set pagination(value) {
          console.log(value);
          self.pagination = value;
          self.requestUpdate("pagination");
        },
        get appearance() {
          return self.appearance;
        },
        set appearance(value) {
          self.appearance = value;
          self.requestUpdate("appearance");
        },

        // get common() {
        //   return self.common;
        // },
        // set common(value) {
        //   console.log(value)
        //   self.common = value;
        //   self.requestUpdate("common")
        // }
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-tablely": QTablely;
  }
}

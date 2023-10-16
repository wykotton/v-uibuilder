import { css, html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { isEqual, isArray } from "lodash-es";
import { ISchema, EComponentType, EComponentGroup } from "../../types/runtime/IModelSchema";
import { Component } from "../../types/runtime/Component";
import { createVueComponent } from "./component";
import { changeProperty } from "../../types/runtime/decorators/decorators";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { unmountInstance, createHashId, onSendMessage } from "../../util/utils";
import antdCss from "ant-design-vue/dist/antd.min.css?inline";
import cssIndex from "./index.scss?inline?inline";
import { IMessage } from "../../types/runtime/IMessage";
import { panesDataItem } from "./IQSplitPanes"
import "./q-split-panes-setting";
import { message } from "ant-design-vue";

// 内|部变更，不需要重新渲染
// const insideChange = new Proxy({ value: false }, {});

/**
 * 分割面板
 */
@customElement("q-split-panes")
export class qSplitPanes extends Component {
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

  @changeProperty()
  @property({ type: Array, attribute: "sp-data" })
  spData = [{
    key: '0',
    // disabled: true,
    title: "面板1",
    titleEnable: true,
    titleColor: "#333333",
    splitLine: {
      width: 1,
      color: "#1f38581a"
    },
    tbdDir: "top",
    horiz: true,
    size:100,
    minSize: 0,
    maxSize: 100,
    bg: {
      bgcolor: "#f2f2f2",
      bgimg: "",
      bgimgSize: "default"
    },
    list: [{
      key: createHashId(12, "split-"),
      title: "面板1-1",
      titleEnable: true,
      titleColor: "#333333",
      splitLine: {
        width: 1,
        color: "#1f38581a"
      },
      tbdDir: "top",
      full: true,
      horiz:true,
      size:50,
      minSize: 0,
      maxSize: 100,
      bg: {
        bgcolor: "#f2f2f2",
        bgimg: "",
        bgimgSize: "default"
      },
      list: []
    }, {
      key: createHashId(12, "split-"),
      title: "面板1-2",
      titleEnable: true,
      titleColor: "#333333",
      splitLine: {
        width: 1,
        color: "#1f38581a"
      },
      tbdDir: "top",
      full: true,
      horiz:true,
      size:50,
      minSize: 0,
      maxSize: 100,
      bg: {
        bgcolor: "#f2f2f2",
        bgimg: "",
        bgimgSize: "default"
      },
      list: []
    }]
  }]
  // 18 * (22 / 18)
  // [
  //   {
  //     title: "parent 1",
  //     key: "0-0",
  //     customIcon: "<svg t=\"1669882576357\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"1957\" width=\"16\" height=\"16\"><path d=\"M779.3152 892.0064H251.8016c-64.9216 0-117.76-52.8384-117.76-117.76V225.2288c0-64.9216 52.8384-117.76 117.76-117.76H779.264c64.9216 0 117.76 52.8384 117.76 117.76v549.0176c0.0512 64.9216-52.7872 117.76-117.7088 117.76zM251.8016 158.6688c-36.7104 0-66.56 29.8496-66.56 66.56v549.0176c0 36.7104 29.8496 66.56 66.56 66.56H779.264c36.7104 0 66.56-29.8496 66.56-66.56V225.2288c0-36.7104-29.8496-66.56-66.56-66.56H251.8016z\" fill=\"#231815\" p-id=\"1958\"></path><path d=\"M512 543.5904c-103.1168 0-187.0336-83.8656-187.0336-186.9824 0-14.1312 11.4688-25.6 25.6-25.6s25.6 11.4688 25.6 25.6c0 74.9056 60.928 135.7824 135.8336 135.7824s135.7824-60.928 135.7824-135.7824c0-14.1312 11.4688-25.6 25.6-25.6s25.6 11.4688 25.6 25.6c0 103.1168-83.8656 186.9824-186.9824 186.9824z\" fill=\"#FF3355\" p-id=\"1959\"></path></svg>",
  //     children: [
  //       {
  //         title: "parent 1-0",
  //         key: "0-0-0",
  //         disabled: true,
  //         children: [
  //           { title: "leaf", key: "0-0-0-0", disableCheckbox: true },
  //           { title: "leaf", key: "0-0-0-1" }
  //         ]
  //       },
  //       {
  //         title: "parent 1-1",
  //         key: "0-0-1",
  //         children: [{ key: "0-0-1-0", title: "sss" }]
  //       }
  //     ]
  //   }
  // ];

  // 判断是否resize
  @property({ type: Boolean })
  public resize = false;
  // 判断是否运行模式
  @property({ type: Boolean })
  public contextType = false;
  // 标题栏
  @property({ type: Boolean })
  public mutex = true
  // public titleBar:titleBar = { // 标题栏
  //   enable: true, // 是否启用
  //   mutex: true, // 是否互斥
  //   full: true, // 是否启用全屏
  // };
  // 记录全屏前位置
  @property({ type: Object })
  public beforefullpos = {
    top: "0px",
    left: "0px",
    width: "0px",
    height: "0px"
  };

  /**
   * 分割面板数据 paneslist
   */
  // @property({ type: Array })
  // paneslist = [{
  //   title: "",
  //   tbdDir: "top",
  //   horiz: true,
  //   size:100,
  //   list: [{
  //     title: "",
  //     tbdDir: "top",
  //     horiz:true,
  //     size:50,
  //     list: []
  //   }, {
  //     title: "",
  //     tbdDir: "top",
  //     horiz:true,
  //     size:50,
  //     list: []
  //   }]
  // }];

  // 更新vue组件实例数据
  setVueComponentData(type: string, value: any) {
    if (this.componentInstance && this.componentInstance?._instance?.proxy?.watchAttributeChange) {
      this.componentInstance._instance.proxy.watchAttributeChange(type, value);
    }
  }
  // 展开面板
  expand(panseId: string, relatedId?: string) {
    const { tarPanse, list } = this.fingFocusPansex(this.spData, panseId)
    let relatedPanse;
    const result = [] as any;
    if(relatedId) relatedPanse = this.fingFocusPansex(this.spData, relatedId)?.tarPanse
    if (!tarPanse) {
      message.error("找不到事件目标面板，请检测面板ID是否正确！")
    } else {
      let totleMinSize = 0
      list.map((v:any) => {
        totleMinSize += v.minSize
        if (this.mutex) v.size = v.minSize
      })
      if(relatedId && relatedId !== tarPanse.key) relatedPanse.size = 100 - tarPanse.maxSize - (totleMinSize - tarPanse.minSize - relatedPanse.minSize)
      tarPanse.size = tarPanse.maxSize
      list.map((v:any) => {
        result.push({
          min: v.minSize,
          max: v.maxSize,
          size: v.size
        })
      })
      onSendMessage(this, result, { srcType: "AfterChangeSize" })
    }
    this.setVueComponentData("spData", this.spData);
    this.requestUpdate("spData");
  }
  // 收起面板
  shrink(panseId: string, relatedId?: string) {
    const { tarPanse, list } = this.fingFocusPansex(this.spData, panseId)
    let relatedPanse;
    const result = [] as any;
    if(relatedId) relatedPanse = this.fingFocusPansex(this.spData, relatedId)?.tarPanse
    if (!tarPanse) {
      message.error("找不到事件目标面板，请检测面板ID是否正确！")
    } else {
      let totleMinSize = 0
      list.map((v:any) => {
        totleMinSize += v.minSize
        if (this.mutex) v.size = v.minSize
      })
      if(relatedId && relatedId !== tarPanse.key) relatedPanse.size = 100 - (totleMinSize - relatedPanse.minSize)
      tarPanse.size = tarPanse.minSize
      list.map((v:any) => {
        result.push({
          min: v.minSize,
          max: v.maxSize,
          size: v.size
        })
      })
      onSendMessage(this, result, { srcType: "AfterChangeSize" })
    }
    this.setVueComponentData("spData", this.spData);
    this.requestUpdate("spData");
  }
  // 收放面板
  toggle(tarPanse: any, relatedId?: string) {
    const changeDiffSize = tarPanse.size - tarPanse.minSize
    if (!tarPanse) {
      message.error("找不到事件目标面板，请检测面板ID是否正确！")
    } else {
      if (changeDiffSize) this.shrink(tarPanse.key, relatedId)
      else this.expand(tarPanse.key, relatedId)
    }
  }
  // 查找目标面板改
  fingFocusPansex(list:panesDataItem[], panseId: string): any {
    let tarPanse;
    for (let i = 0; i < list.length; i++) {
      if (list[i].key === panseId){
        tarPanse = list[i]
        return { tarPanse, list }
      }
      if (list[i]?.list.length) return this.fingFocusPansex(list[i].list, panseId)
    }
    return { tarPanse, list }
  }
  // 查找目标面板
  fingFocusPanse(list:panesDataItem[], panseId: string): any {
    let tarPanse, broPanse;
    for (let i = 0; i < list.length; i++) {
      if (list[i].key === panseId){
        tarPanse = list[i]
        if (list.length !== 1) {
          if (i === (list.length - 1)) broPanse = list[i - 1]
          else broPanse = list[i + 1]
        }
        return { tarPanse, broPanse }
      }
      if (list[i]?.list.length) return this.fingFocusPanse(list[i].list, panseId)
    }
    return { tarPanse, broPanse }
  }
  // 全屏
  fullScreen(panseId: string) {
    // setFullscreen
    // this.componentInstance._instance.setupState.updateFullPanseId(this.componentInstance._instance.setupState.fullPanseId + "xxx")
    this.componentInstance._instance.setupState.fullPanseId = panseId
  }

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

  render() {
    // 初始化数据
    return html`
      <div id="container" class="q-split-panes-container"></div>
    `;
  }

  disconnectedCallback(): void {
    if (!this.isConnected) {
      // 断开文档连接，说明元件已被删除
      unmountInstance(this);
    }
    super.disconnectedCallback();
  }

  connectedCallback(): void {
    if (!this.componentInstance && this.container) {
      createVueComponent(this);
    }
    super.connectedCallback();
  }

  protected updated(): void {
    if (this.container) {
      unmountInstance(this);
      createVueComponent(this);
    }
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-split-panes";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "分割面板";
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
                text: "展开指定面板",
                eventType: "expand",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "收起指定面板",
                eventType: "shrink",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "切换指定面板状态",
                eventType: "toggle",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "全屏指定面板",
                eventType: "fullScreen",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "面板变化大小之后",
                eventType: "AfterChangeSize",
                messageSchema: "",
                messageDemo: "",
              }
            ],
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                spData: {
                  type: "object",
                  description: "面板结构数据",
                  format: "custom",
                  setter: "q-split-panes-setting"
                },
                mutex: {
                  type: "boolean",
                  description: "启用互斥",
                },
                // titleBar: {
                //   type: "object",
                //   description: "标题栏",
                //   properties: {
                //     enable: {
                //       type: "boolean",
                //       description: "是否启用",
                //     },
                //     // full: {
                //     //   type: "boolean",
                //     //   description: "启用全屏",
                //     // },
                //   }
                // },
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
        _initStyle: "width: 415px; height: 211px;",
        _onMessageMeta: {
          expand: [
            (e: IMessage) => {
              console.log("expand", e.body);
              // @ts-ignore
              const _this = this.el;
              _this.expand("panseId"); // panseId 为受控分割面板ID
            },
          ],
          shrink: [
            (e: IMessage) => {
              console.log("shrink", e.body);
              // @ts-ignore
              const _this = this.el;
              _this.shrink("panseId"); // panseId 为受控分割面板ID
            },
          ],
          toggle: [
            (e: IMessage) => {
              console.log("toggle", e.body);
              // @ts-ignore
              const _this = this.el;
              _this.toggle("panseId"); // panseId 为受控分割面板ID
            },
          ],
          fullScreen: [
            (e: IMessage) => {
              console.log("fullScreen", e.body);
              // @ts-ignore
              const _this = this.el;
              _this.fullScreen("panseId"); // panseId 为受控分割面板ID
            },
          ],
        },

        _onDOMEvent: {},
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
        // publicAPI: {
        //   moveable: {
        //     clearAllTarget: function (arg: IArguments) {
        //       console.log(1, arg)
        //       return false
        //     },
        //     dragMove: function (arg: IArguments) {
        //       return self.resize
        //     }
        //   }
        // },
        get mutex() {
          return self.mutex;
        },
        set mutex(value) {
          self.mutex = value;
          self.requestUpdate("mutex");
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
        // get beforefullpos() {
        //   return self.beforefullpos;
        // },
        // set beforefullpos(value) {
        //   console.log(value)
        //   self.beforefullpos = value;
        //   self.requestUpdate("beforefullpos");
        // },
        get spData() {
          // const data = _.cloneDeep(self.menuData);
          return self.spData;
        },
        set spData(value) {
          if (!isArray(value) || isEqual(value, self.spData)) {
            self.setVueComponentData("spData", self.spData);
            return;
          }
          // const mapTree = (org: any) => {
          //   if (!org) org = { title: "", key: `menu-${createHash()}`, children: [] };
          //   const haveChildren = Array.isArray(org.children) && org.children.length > 0;
          //   return Object.assign(org, {
          //       // scopedSlots: { title: "icon" },
          //       // icon: org.icon ? html`unsafeSVG(org.icon)` : "",
          //       key: org.key || `menu-${createHash()}`,
          //       children: haveChildren ? org.children.map((i: any) => mapTree(i)) : []
          //     }
          //   );
          // };
          // self.spData = value.map((org) => mapTree(org));
          self.spData = value;
          self.setVueComponentData("spData", self.spData);
        },
        
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-split-panes": qSplitPanes;
  }
}

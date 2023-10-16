import { css, LitElement, unsafeCSS, html } from "lit";
import { customElement, query, property } from "lit/decorators.js";
import { cloneDeep, isArray, isEqual, findIndex, isObject, omit } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createApp, defineComponent, ref, watch } from "vue";
import { Steps, Step } from "ant-design-vue";
import antdCss from "ant-design-vue/dist/antd.css?inline";
import cssIndex from "./index.scss?inline";
import { changeProperty } from "../../types/runtime/decorators/decorators";
import * as xss from "xss";
import { styleMap } from "lit/directives/style-map.js";
import { classMap } from "lit/directives/class-map.js";
import { booleanTransform } from "../../util/utils";


type Size = "default" | "small"
type Direction = "horizontal" | "vertical"
type Type = "default" | "navigation"
type Status = "wait" | "process" | "finish" | "error"

interface StepsData {
  title: string;
  subTitle: string;
  description: string;
  titleSlot?: string;
  descriptionSlot?: string;

  iconSlot?: string;

  status?: Status;

  disabled?: boolean;

  [key: string]: any;
}

/**
 * 步骤条
 */
@customElement("q-steps")
export class QSteps extends LitElement {
  static styles = [css`
    ${unsafeCSS(cssIndex)}
  `,
    css`
      ${unsafeCSS(antdCss)}
    `];

  @query(".q-steps-container")
  stepsWrapper!: HTMLDivElement;

  // 当前步骤
  @changeProperty()
  @property({ type: Number })
  current = 0;


  // 步骤条方向
  @property({ type: Boolean })
  special = false;

  // 步骤条方向
  @property({ type: String })
  direction: Direction = "horizontal";

  // 标签放置位置
  @property({ type: String })
  labelPlacement: Direction = "horizontal";

  @property({ type: Boolean,  converter(value, type?) {
      return booleanTransform(value);
    },})
  // 屏幕小于532px时自动变为垂直
  responsive = false;

  @property({ type: String })
  status: Status = "process";

  @property({ type: String })
  // 步骤条类型
  type: Type = "default";

  @property({ type: String })
  // 当前 process 步骤显示的进度条进度
  percent = "";

  @property({ type: Number })
  // 起始序号
  initial = 0;

  @property({ type: String })
  defaultColor = "#e8e8e8"
  @property({ type: String })
  activeColor = "#d0e5f8"
  @property({ type: Number })
  arrowSize = 0
  @property({ type: Number })
  mTop = 0
  @property({ type: Number })
  mLeft = 0
  @property({ type: Number })
  stepsHeight = 30
  @property({ type: Number })
  stepsItemWidth = 200

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    super.attributeChangedCallback(name, _old, value);
    this.setVueComponentData(name, this[name])
  }

  /**
   * 组件实例
   */
  componentInstance: any = null;

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  @changeProperty()
  @property({ type: Array })
  stepsData: Array<StepsData> = [
    {
      title: "带插槽步骤",
      subTitle: "带插槽步骤子标题",
      description: "带插槽步骤描述",
      titleSlot: "<span>带插槽步骤</span>",
      descriptionSlot: "<span>带插槽步骤</span>",
      iconSlot: "<svg t=\"1673494557816\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"1100\" width=\"32\" height=\"32\"><path d=\"M942.7 514.5c0 39.8-80.1 43.4-90.6 79.8-6.8 23.7 10.7 80.8-0.1 102.6-13.3 26.8-65.9 32.4-84.4 55.5-16.7 20.8 49.1 60.2 28.7 77.4-21.6 18.3-45.1 34.4-70.1 47.9-26.1 14.2-96.7-35.4-125.8-27.1-23 6.5-4.1 72.1-28.5 74.6-13.9 1.4-28 2.1-42.2 2.1-31.1 0-61.3-3.4-90.4-9.9-21.5-4.8-42.3-11.3-62.4-19.3-27.2-10.8-21.3-77.5-45.3-93.6-31-20.8-90.6 7.4-114.9-20.7-16.5-19.2-31.3-39.9-44.1-61.8-16.9-28.9 24.1-68.5 14.6-101.4-8.6-29.9-38.8-17-59.9-50-3.8-6-10.7-49-10.7-56.2 0-19.2 68-18 70.5-36.5 5-36.6-25.3-50.3-11.3-83.2 16-37.7 67.6-7 93.5-37.9 17.2-20.5 13.8-111.9 6.9-137.8-6.9-26 39.5-72.1 64.3-83.2 23.1-10.4 99 34 128.2 33.3 32.3-0.8 5.2-19.7 60.9-67.6 15.6-13.4 40.7 1.5 60.4 4.4 24.9 3.7 20.4 84.7 43.7 92.6 30 10.2 65.9-16.4 92.4 0 14.7 9.1 49.4 22.3 62.7 33.1 23 18.7 44.5 1.5 63.1 24.7 14.2 17.7 8.2 47.9 19.3 67.7 12.1 21.6 28.5 70.4 36.6 94.2 14.5 42 34.9 49.5 34.9 96.3z\" fill=\"#65C8D0\" p-id=\"1101\"></path><path d=\"M355.4 511.3c0 91.8 83.9 166.2 187.4 166.2s187.4-74.4 187.4-166.2-83.9-166.2-187.4-166.2-187.4 74.4-187.4 166.2z m0 0\" fill=\"#2B4298\" p-id=\"1102\"></path><path d=\"M721.1 503.4c0 38.3-36.6 69.3-81.7 69.3s24.3-18.1 24.3-56.3c0-38.2-69.5-82.3-24.3-82.3 45.1 0 81.7 31 81.7 69.3z m0 0\" fill=\"#FFFFFF\" p-id=\"1103\"></path></svg>"
    },
    {
      title: "步骤二",
      subTitle: "步骤二子标题",
      description: "步骤二描述",
      titleSlot: "",
      descriptionSlot: "",
      iconSlot: "",
      disabled: true
    }
    ,
    {
      title: "步骤三",
      subTitle: "步骤三子标题",
      description: "步骤三描述",
      titleSlot: "",
      descriptionSlot: "",
      iconSlot: ""
    }
  ];


  @changeProperty()
  @property({ type: String })
  size: Size = "default";

  constructor() {
    super();
    this.initModel();
  }


  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    this.createVueComponent();
    this.changeArrowStyle()
  }

  /**
   * 同步设置属性编辑器里属性
   * @param type
   * @param value
   */
  setWebcomponentData(type: string, value: any) {
    this[type] = value;
  }

  /**
   * 创建树VUE组件
   */
  createVueComponent = () => {
    const self = this;
    const component = defineComponent({
      template: `
        <a-steps :current="current" :size="size" :direction="direction" :initial="initial"
                 :labelPlacement="labelPlacement" :status="status" :type="type">
        <a-step :sub-title="ste.subTitle" :status="ste.status" :disabled="ste.disabled"
                v-for="(ste,s) in stepsData" :key="s" @click="stepsClick(ste,s)">
          <template #title>
            <span v-if="ste.titleSlot" v-html="xssUtil.filterXSS(ste.titleSlot)"></span>
            <span v-else>{{ ste.title }}</span>
          </template>
          <template #icon v-if="ste.iconSlot" v-html="ste.iconSlot">
            <div v-html="ste.iconSlot"></div>
          </template>
          <template #description>
            <span v-if="ste.descriptionSlot" v-html="xssUtil.filterXSS(ste.descriptionSlot)"></span>
            <span v-else>{{ ste.description }}</span>
          </template>
        </a-step>
        </a-steps>
      `,
      name: "q-steps",
      props: {},
      components: {},
      setup(props: any, context: any) {

        const stepsData = ref(self.stepsData);
        const size = ref(self.size);
        const current = ref(self.current);
        const direction = ref(self.direction);
        const initial = ref(self.initial);
        const labelPlacement = ref(self.labelPlacement);
        const status = ref(self.status);
        const xssUtil = xss;
        const type = ref(self.type)

        /**
         * 监听timeline属性变更
         */
        function watchAttributeChange(type: string, value: any) {
          console.log("触发更新");
          // @ts-ignore
          this[type] = value;
        }


        watch(current, (v) => {
          self.onSendMessage("change", v);
        });

        /**
         *
         */
        function stepsClick(step: StepsData, index: number) {
          const temp = omit(cloneDeep(step), ["titleSlot", "descriptionSlot", "iconSlot"]);

          if(!temp?.disabled){
            current.value = index
            self.onSendMessage("click", temp);
          }
        }


        return {
          props,
          stepsData,
          type,
          status,
          xssUtil,
          current,
          direction,
          labelPlacement,
          initial,
          size,
          stepsClick,
          watchAttributeChange
        };
      }
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(Steps);
    this.componentInstance.use(Step);
    this.componentInstance.mount(this.stepsWrapper);
  };


  /**
   * 数据路由
   * @param type
   * @param value
   */
  onSendMessage(type: string, value: any): void {
    const message: IMessage = {
      header: {
        src: this.id,
        dst: "",
        srcType: type,
        dstType: ""
      },
      body: value
    };

    this.componentModel.sendMessage(message);
  }

  /**
   * 更新vue组件实例数据
   * @param type
   * @param value
   */
  setVueComponentData(type: string, value: any) {
    if (this.componentInstance && this.componentInstance?._instance?.proxy?.watchAttributeChange) {
      this.componentInstance._instance.proxy.watchAttributeChange(type, value);
    }
  }

  /**
   * 更新组件步骤
   * @param type
   * @param value
   */
  updateStepsCurrent(type: string, data: number | {value: string, key: string}) {
    switch (type) {
      // 设置
      case "set": {
        if(typeof data === "number"){
          this.current = data;
        }else if(isObject(data)){
          const {value , key} = data
          const index = findIndex(this.stepsData,{[key]: value})
          if(index !== -1){
            this.current = index;
          }else {
            console.warn("未找到对应步骤，请检查传入数据")
          }
        }else {
          console.warn("只支持数字或对象{key:步骤条属性， value: 属性值}格式")
        }
        break;
      }
      // 下一个
      case "next": {
        if (!((this.current + 1) > (this.stepsData.length - 1))) {
          this.current += 1;
        }
        break;
      }
      case "previous": {
        if (!(this.current - 1 < this.initial)) {
          this.current -= 1;
        }
        break;
      }
    }
    this.setVueComponentData("current", this.current);
  }

  setSpecialStyle() {
    if(!this.special) return
    let flag = false
    for (let i = 0;i< this.stepsData.length;i++){
      if(this.stepsData[i].description || this.stepsData[i].descriptionSlot ){
        flag = true
        break;
      }
    }
    // 有子标题
    if(flag){
    //   this.arrowSize = 57
    //   this.mTop = 29
    //   this.mLeft = 26
    //   // 有子标题且为 mini
    //   if(this.size === "small"){
    //     this.arrowSize = 37
    //     this.mTop = 18
    //     this.mLeft = 22
    //   }
    // }else {
    //   this.arrowSize = 45
    //   this.mTop = 22
    //   this.mLeft = 22
    //   if(this.size === "small"){
    //     this.arrowSize = 37
    //     this.mTop = 18
    //     this.mLeft = 19
    //   }
    }
    this.requestUpdate()
  }

  /**
   * 设置步骤条数据
   * @param data
   */
  setStepsData(data: StepsData) {
    try {
      if (Array.isArray(data)) {
        this.stepsData = data;
        this.setVueComponentData("stepsData", data);
      } else {
        console.warn("传入数据与步骤条数据不匹配");
      }
    } catch (e) {
      console.log(e);
    }
  }


  changeArrowStyle() {
    const helfHeight =  this.stepsHeight / 2
    this.arrowSize = (helfHeight) + 8
    this.mTop = helfHeight - 4
    this.mLeft = helfHeight - 3
  }

  /**
   * 设置步骤条状态
   * @param data
   */
  updateStepsStatus(data: {status: Status, current: number}) {
    try {
      const {status , current} = data
      if(!status || !current){
        console.warn("传入数据与步骤条数据不匹配, 需要 {status: wait | process | finish | error, current: number}类型");
      }
      this.stepsData[current].status = status;
      this.setVueComponentData("stepsData", cloneDeep(this.stepsData))
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return html`
      <style>
        .nav-special-style .ant-steps-navigation .ant-steps-item::after{
          width: ${this.arrowSize}px;
          height: ${this.arrowSize}px;
          margin-top: -${this.mTop}px;
          margin-left: -${this.mLeft}px;
          border-top: 4px solid #ffffff;
          border-right: 4px solid #ffffff;
          z-index: 1;
          background-color: ${this.defaultColor}
        }
        .nav-special-style .ant-steps-item {
          background-color: ${this.defaultColor};
          position: relative;
          width: ${this.stepsItemWidth}px;
        }
        .nav-special-style .ant-steps-item-active {
          background-color: ${this.activeColor} !important
        }

        .nav-special-style .ant-steps-item-active::after {
          background-color: ${this.activeColor} !important
        }

        .nav-special-style .ant-steps-navigation .ant-steps-item-container {
          /*padding: 0;*/
          /*margin-right: 10px;*/
        }

        .nav-special-style  .ant-steps-item-content {
          width: 100%;
          position: relative;
          height: 100%;
        }

        .nav-special-style .ant-steps-item-icon {
          width: ${this.stepsHeight - 10}px;
          height: ${this.stepsHeight - 10}px;
          border-radius:  ${this.stepsHeight - 10}px;
          line-height: ${this.stepsHeight - 10}px;
        }
        .nav-special-style .ant-steps-item-icon .ant-steps-icon {
          top: -1.5px
        }
        
        .nav-special-style .ant-steps-navigation {
          padding-top: 0 !important;
        }
        .nav-special-style .ant-steps-navigation .ant-steps-item-container{
          padding: 0 !important;
          margin: 0 !important;
          height: 100%;
          position: relative;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: flex;
          align-items: center;
        }

        .nav-special-style .ant-steps-item-title{
          position: absolute;
          left: 0;
          top: 0;
          z-index: 2;
          width: 100%;
          /*width: calc(100% - ${this.stepsHeight}px + 10px)*/
        }

        .nav-special-style .ant-steps{
          height: ${this.stepsHeight}px;
        }

        .nav-special-style .ant-steps-horizontal:not(.ant-steps-label-vertical) .ant-steps-item {
          /*padding-left: 40px;*/
        }
        

      </style>
      <div class="${classMap({
        "q-steps": true,
        ["is-" + this.direction]: this.direction
      })}">
        <div class="${classMap({
          "q-steps-container": true,
          ["nav-special-style"]: this.special
        })}"></div>
        <div class="q-steps-content">
          ${
            this.stepsData && this.stepsData.map((it, i) => {
              return html`
                <slot name="${`slot` + i}" id="${"q-steps-slot-" + i}" class="dropzone q-steps-content-slot"
                      style=${styleMap({ "display": i === this.current ? "block" : "none" })}>
                  <q-container-mask text="组件降落区"></q-container-mask>
                </slot>
              `;
            })
          }
        </div>
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
            return "q-steps";
          },
          get type() {
            return EComponentType.TEXT;
          },
          get text() {
            return "步骤条";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "引导用户按照流程完成任务的导航条。";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "设置当前步骤",
                eventType: "setStepsCurrent",
                messageSchema: "",
                messageDemo: ""
              },
              {
                text: "设置步骤条数据",
                eventType: "setStepsData",
                messageSchema: "",
                messageDemo: ""
              },
              {
                text: "下一步",
                eventType: "stepsNext",
                messageSchema: "",
                messageDemo: ""
              },
              {
                text: "上一步",
                eventType: "stepsPrevious",
                messageSchema: "",
                messageDemo: ""
              },
              {
                text: "更新状态",
                eventType: "updateStepsStatus",
                messageSchema: "",
                messageDemo: ""
              }
            ],
            outputMessage: [
              {
                text: "点击事件",
                eventType: "click",
                messageSchema: "",
                messageDemo: ""
              },
              {
                text: "步骤切换事件",
                eventType: "change",
                messageSchema: "",
                messageDemo: ""
              }
            ]
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                stepsData: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: {
                        type: "string",
                        description: "标题"
                      },
                      subTitle: {
                        type: "string",
                        description: "子标题"
                      },
                      description: {
                        type: "string",
                        description: "描述"
                      },
                      titleSlot: {
                        type: "string",
                        description: "标题插槽",
                        format: "code"
                      },
                      descriptionSlot: {
                        type: "string",
                        description: "描述插槽",
                        format: "code"
                      },
                      iconSlot: {
                        type: "string",
                        description: "图标插槽",
                        format: "code"
                      },
                      status: {
                        type: "string",
                        description: "当前步骤的状态",
                        enum: [{ value: "wait", label: "等待" }, { value: "process", label: "处理" }, {
                          value: "finish",
                          label: "完成"
                        }, { value: "error", label: "错误" }]
                      },
                      disabled: {
                        type: "boolean",
                        description: "是否禁用"
                      },
                      value: {
                        type: "string",
                        description: "标题值"
                      }
                    }
                  },
                  description: "步骤条数据"
                },
                direction: {
                  type: "string",
                  description: "步骤条方向",
                  enum: [{ value: "horizontal", label: "水平" }, { value: "vertical", label: "竖直" }]
                },
                labelPlacement: {
                  type: "string",
                  description: "标签放置位置",
                  enum: [{ value: "vertical", label: "图标下方" }, { value: "horizontal", label: "图标右侧" }]
                },
                status: {
                  type: "string",
                  description: "当前步骤状态",
                  enum: [{ value: "wait", label: "等待" }, { value: "process", label: "处理" }, {
                    value: "finish",
                    label: "完成"
                  }, { value: "error", label: "错误" }, { value: "", label: "默认" }]
                },
                current: {
                  type: "number",
                  description: "当前步骤",
                  minimum: 0
                  // maximum: this.stepsData.length - 1
                },
                initial: {
                  type: "number",
                  description: "起始序号,默认从0开始",
                  minimum: 0
                },
                type: {
                  type: "string",
                  description: "步骤条类型",
                  enum: [{ value: "default", label: "默认" }, { value: "navigation", label: "导航" }]
                },
                special: {
                  type: "boolean",
                  description: "开启特殊样式",
                },
                defaultColor: {
                  type: "string",
                  description: "默认背景色（导航类型下生效）",
                  format: "color"
                },
                stepsHeight: {
                  type: "number",
                  description: "步骤条高度",
                },
                stepsItemWidth: {
                  type: "number",
                  description: "每个步骤条宽度",
                },
                activeColor: {
                  type: "string",
                  description: "激活背景色（导航类型下生效）",
                  format: "color"
                },
                arrowSize: {
                  type: "number",
                  description: "箭头大小（导航类型下生效）",
                },
                mTop: {
                  type: "number",
                  description: "箭头顶部偏移量（导航类型下生效）",
                },
                mLeft: {
                  type: "number",
                  description: "箭头左侧偏移量（导航类型下生效）",
                },
                size: {
                  type: "string",
                  description: "步骤条尺寸",
                  enum: [{ value: "default", label: "默认" }, { value: "small", label: "迷你" }]
                },
                percent: {
                  type: "string",
                  description: "当前步骤进度条"
                },
                responsive: {
                  type: "boolean",
                  description: "当屏幕宽度小于 532px 时自动变为垂直模式"
                }
              }
            }
          }
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
          setStepsCurrent: [
            function(e: IMessage) {
              // @ts-ignore
              this.updateStepsCurrent("set", e.body);
            }
          ],
          setStepsData: [
            function(e: IMessage) {
              // @ts-ignore
              this.setStepsData(e.body);
            }
          ],
          stepsNext: [
            function(e: IMessage) {
              // @ts-ignore
              this.updateStepsCurrent("next", e.body);
            }
          ],
          stepsPrevious: [
            function(e: IMessage) {
              // @ts-ignore
              this.updateStepsCurrent("previous", e.body);
            }
          ],
          updateStepsStatus: [
            function(e: IMessage) {
              // @ts-ignore
              this.updateStepsStatus(e.body);
            }
          ]
        },
        _onDOMEvent: {
          click: [
            function(e: Event) {
              console.log(e);
            }
          ],
          dblclick: [
            function(e: Event) {
              console.log(e, "dblclick");
            }
          ]
        },
        _initStyle: "height:400px;width:900px;overflow:auto",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function() {
          },
          updated: function() {
          },
          destroy: function() {
          }
        },
        _eventInterception: {},
        get stepsData() {
          return self.stepsData;
        },
        set stepsData(value) {
          if (!isArray(value) || isEqual(value, self.stepsData)) {
            self.setVueComponentData("stepsData", self.stepsData);
            return;
          }
          self.stepsData = value;
          setTimeout(() => {
            self.setSpecialStyle()
          }, 500)

          self.setVueComponentData("stepsData", self.stepsData);
        },
        get current() {
          return self.current;
        },
        set current(value) {
          if (value !== self.current) {
            // if(value < 0) value = 0
            // if(value > self.stepsData.length - 1 + self.initial) value = self.stepsData.length - 1 + self.initial
            self.setVueComponentData("current", value);
            self.current = value;
          }
        },
        get direction() {
          return self.direction;
        },
        set direction(value) {
          if (value !== self.direction) {
            self.setVueComponentData("direction", value);
            self.direction = value;
            self.requestUpdate();
          }
        },
        get labelPlacement() {
          return self.labelPlacement;
        },
        set labelPlacement(value) {
          if (value !== self.labelPlacement) {
            self.setVueComponentData("labelPlacement", value);
            self.labelPlacement = value;
          }
        },
        get responsive() {
          return self.responsive;
        },
        set responsive(value) {
          if (value !== self.responsive) {
            self.setVueComponentData("responsive", value);
            self.responsive = value;
          }
        },
        get status() {
          return self.status;
        },
        set status(value) {
          if (value !== self.status) {
            self.setVueComponentData("status", value);
            self.status = value;
          }
        },
        get type() {
          return self.type;
        },
        set type(value) {
          if (value !== self.type) {
            self.setVueComponentData("type", value);
            self.type = value;
            setTimeout(() => {
              self.setSpecialStyle()
            }, 500)
          }
        },
        get percent() {
          return self.percent;
        },
        set percent(value) {
          if (value !== self.percent) {
            self.setVueComponentData("percent", value);
            self.percent = value;
          }
        },
        get initial() {
          return self.initial;
        },
        set initial(value) {
          if (value !== self.initial) {
            self.setVueComponentData("initial", value);
            self.initial = value;
          }
        },
        get size() {
          return self.size;
        },
        set size(value) {
          if (value !== self.size) {
            self.setVueComponentData("size", value);
            setTimeout(() => {
              self.setSpecialStyle()
            }, 500)
            self.size = value;
          }
        },
        get special() {
          return self.special;
        },
        set special(value) {
          if (value !== self.special) {
            self.special = value;
            setTimeout(() => {
              self.setSpecialStyle()
            }, 500)
          }
        },
        get arrowSize() {
          return self.arrowSize;
        },
        set arrowSize(value) {
          if (value !== self.arrowSize) {
            self.arrowSize = value;
          }
        },
        get mTop() {
          return self.mTop;
        },
        set mTop(value) {
          if (value !== self.mTop) {
            self.mTop = value;
          }
        },
        get mLeft() {
          return self.mLeft;
        },
        set mLeft(value) {
          if (value !== self.mLeft) {
            self.mLeft = value;
          }
        },
        get activeColor() {
          return self.activeColor;
        },
        set activeColor(value) {
          if (value !== self.activeColor) {
            self.activeColor = value;
          } 
        },
        get stepsHeight() {
          return self.stepsHeight;
        },
        set stepsHeight(value) {
          if (value !== self.stepsHeight) {
            self.stepsHeight = value;
            self.changeArrowStyle()
          }
        },
        get stepsItemWidth() {
          return self.stepsItemWidth;
        },
        set stepsItemWidth(value) {
          if (value !== self.stepsItemWidth) {
            self.stepsItemWidth = value;
          }
        },
        get defaultColor() {
          return self.defaultColor;
        },
        set defaultColor(value) {
          if (value !== self.defaultColor) {
            self.defaultColor = value;
          }
        },
      } as unknown as ISchema
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-steps": QSteps;
  }
}

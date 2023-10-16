import { css, LitElement, unsafeCSS, html } from "lit";
import { customElement, query, property } from "lit/decorators.js";
import { cloneDeep, isArray, isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createApp, defineComponent, ref } from "vue";
import { Timeline, TimelineItem } from "ant-design-vue";
import antdCss from "ant-design-vue/dist/antd.css?inline";
import cssIndex from "./index.scss?inline";
import { changeProperty } from "../../types/runtime/decorators/decorators";
import * as xss from "xss";

type Mode = "left" | "alternate" | "right"

interface TimelineSubtitle {
  title: string
  value: any
}
interface TimelineData {
  title: string;
  subtitle: Array<TimelineSubtitle>;
  dot: any;

  dotColor?: string;

  value: any;
}

/**
 * 时间轴
 */
@customElement("q-timeline")
export class QTimeLine extends LitElement {
  static styles = [css`
    ${unsafeCSS(cssIndex)}
  `,
    css`
      ${unsafeCSS(antdCss)}
    `];

  @query(".q-timeline")
  timelineWrapper!: HTMLDivElement;

  /**
   * @private 时间轴的相对位置
   */
  @changeProperty()
  @property({ type: String })
  timelineMode: Mode = "left";


  // 显示幽灵节点
  pending = null;

  // 排序方式 false 为正序
  reverse = false;


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
  timelineData: Array<TimelineData> = [
    {
      title: "这是一个时间轴的标题",
      subtitle: [{title:"这是时间轴的子标题1", value: ""},{title:"这是时间轴的子标题2", value: ""} ],
      dot: "<svg t=\"1673494557816\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"1100\" width=\"32\" height=\"32\"><path d=\"M942.7 514.5c0 39.8-80.1 43.4-90.6 79.8-6.8 23.7 10.7 80.8-0.1 102.6-13.3 26.8-65.9 32.4-84.4 55.5-16.7 20.8 49.1 60.2 28.7 77.4-21.6 18.3-45.1 34.4-70.1 47.9-26.1 14.2-96.7-35.4-125.8-27.1-23 6.5-4.1 72.1-28.5 74.6-13.9 1.4-28 2.1-42.2 2.1-31.1 0-61.3-3.4-90.4-9.9-21.5-4.8-42.3-11.3-62.4-19.3-27.2-10.8-21.3-77.5-45.3-93.6-31-20.8-90.6 7.4-114.9-20.7-16.5-19.2-31.3-39.9-44.1-61.8-16.9-28.9 24.1-68.5 14.6-101.4-8.6-29.9-38.8-17-59.9-50-3.8-6-10.7-49-10.7-56.2 0-19.2 68-18 70.5-36.5 5-36.6-25.3-50.3-11.3-83.2 16-37.7 67.6-7 93.5-37.9 17.2-20.5 13.8-111.9 6.9-137.8-6.9-26 39.5-72.1 64.3-83.2 23.1-10.4 99 34 128.2 33.3 32.3-0.8 5.2-19.7 60.9-67.6 15.6-13.4 40.7 1.5 60.4 4.4 24.9 3.7 20.4 84.7 43.7 92.6 30 10.2 65.9-16.4 92.4 0 14.7 9.1 49.4 22.3 62.7 33.1 23 18.7 44.5 1.5 63.1 24.7 14.2 17.7 8.2 47.9 19.3 67.7 12.1 21.6 28.5 70.4 36.6 94.2 14.5 42 34.9 49.5 34.9 96.3z\" fill=\"#65C8D0\" p-id=\"1101\"></path><path d=\"M355.4 511.3c0 91.8 83.9 166.2 187.4 166.2s187.4-74.4 187.4-166.2-83.9-166.2-187.4-166.2-187.4 74.4-187.4 166.2z m0 0\" fill=\"#2B4298\" p-id=\"1102\"></path><path d=\"M721.1 503.4c0 38.3-36.6 69.3-81.7 69.3s24.3-18.1 24.3-56.3c0-38.2-69.5-82.3-24.3-82.3 45.1 0 81.7 31 81.7 69.3z m0 0\" fill=\"#FFFFFF\" p-id=\"1103\"></path></svg>",
      dotColor: "#1890ff",
      value: ""
    },
    {
      title: "这是一个时间轴的标题",
      subtitle: [{title:"这是时间轴的子标题1", value: ""},{title:"这是时间轴的子标题2", value: ""} ],
      dot: ``,
      dotColor: "#FE0B0B",
      value: ""
    },
    {
      title: "这是一个时间轴的标题",
      subtitle: [{title:"这是时间轴的子标题1", value: ""},{title:"这是时间轴的子标题2", value: ""} ],
      dot: ``,
      dotColor: "#4CAF50",
      value: ""
    }
  ];

  constructor() {
    super();
    this.initModel();
  }


  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    this.createVueComponent();
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
        <a-timeline :mode="timelineMode" :reverse="reverse" :pending="pending">
        <a-timeline-item v-for="(timeline,i) in timelineData" :key="'timeline' + i" :color="timeline.dotColor"
                         @click="titleClick(timeline, i)">
          {{ timeline.title }}
          <template #dot v-if="timeline.dot">
            <div v-html="timeline.dot"></div>
<!--            <div v-html="filterXSS(timeline.dot)"></div>-->
          </template>
          <p v-if="timeline.subtitle && timeline.subtitle.length > 0" :key="'subtitle' + s"
             v-for="(sub, s) in timeline.subtitle" @click="subtitleClick(sub, s, i)">{{ sub.title }}</p>
        </a-timeline-item>
        </a-timeline>
      `,
      name: "q-timeline",
      props: {},
      components: {},
      setup(props: any, context: any) {
        const timelineMode = ref(self.timelineMode);
        const timelineData = ref(self.timelineData);
        const reverse = ref(self.reverse);
        const pending = ref(self.pending);
        const DOMPurifyCopy = xss

        /**
         * 监听timeline属性变更
         */
        function watchAttributeChange(type: string, value: any) {
          console.log("触发更新");
          // @ts-ignore
          this[type] = value;
        }

        /**
         *
         */
        function titleClick(timeline: TimelineData, index: number) {
          const {title, value} = timeline
          self.onSendMessage("click", {title, value, index})
        }


        function subtitleClick(sub: TimelineSubtitle, index: number, pIndex: number) {
          self.onSendMessage("subClick", {...sub, pIndex, index })
        }

        return {
          props,
          reverse,
          pending,
          timelineMode,
          timelineData,
          DOMPurifyCopy,
          subtitleClick,
          titleClick,
          watchAttributeChange
        };
      }
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(Timeline);
    this.componentInstance.use(TimelineItem);
    this.componentInstance.mount(this.timelineWrapper);
  };


  /**
   * 设置时间轴数据
   * @param data
   */
  setTimelineData(data: TimelineData){
    try {
      if(Array.isArray(data)){
        this.timelineData = data
        this.setVueComponentData("timelineData", data)
      }else {
        console.warn("传入数据与时间轴数据不匹配");
      }
    }catch(e)
    {
      console.log(e);
    }
  }

  /**
   * 更新时间轴数据
   * @param data
   */
  updateTimelineData(value: any){
    try {
      const {data, index} = value
      if(data && Array.isArray(data)) return

      if(index){
        this.timelineData[index] = data
      }
      this.setVueComponentData("timelineData", cloneDeep(this.timelineData))
    }catch (e) {
      console.log(e);
    }
  }


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

  render() {
    return html`
      <div class="q-timeline"></div>
    `;
  }


  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-timeline";
          },
          get type() {
            return EComponentType.TEXT;
          },
          get text() {
            return "时间轴";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "垂直展示的时间流信息。";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "设置组件数据",
                eventType: "setTimelineData",
                messageSchema: "",
                messageDemo: ""
              },
              {
                text: "更新组件数据",
                eventType: "updateTimelineData",
                messageSchema: "",
                messageDemo: ""
              }
            ],
            outputMessage: [
              {
                text: "标题点击",
                eventType: "click",
                messageSchema: "",
                messageDemo: ""
              },
              {
                text: "子标题点击",
                eventType: "subClick",
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
                timelineData: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: {
                        type: "string",
                        description: "标题"
                      },
                      dot: {
                        type: "string",
                        format: "code",
                        description: "自定义节点图标"
                      },
                      dotColor: {
                        type: "string",
                        description: "图标颜色",
                        format: "color"
                      },
                      subtitle: {
                        type: "array",
                        description: "子标题数据",
                        items: {
                          type: "object",
                          properties: {
                            title: {
                              type: "string",
                              description: "子标题"
                            },
                            value: {
                              type: "string",
                              description: "子标题值"
                            }
                          }
                        }
                      },
                      value: {
                        type: "string",
                        description: "标题值"
                      }
                    }
                  },
                  description: "时间轴数据"
                },
                pending: {
                  type: "string",
                  description: "幽灵节点"
                },
                reverse: {
                  type: "boolean",
                  description: "正序/倒叙"
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
          setTimelineData: [
            function (e: IMessage) {
              // @ts-ignore
              this.setTimelineData(e.body)
            },
          ],
          updateTimelineData: [
            function (e: IMessage) {
              // @ts-ignore
              this.updateTimelineData(e.body)
            },
          ],
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
        _initStyle: "height:220px;width:420px;overflow:auto",
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
        get timelineData() {
          return self.timelineData;
        },
        set timelineData(value) {
          if (!isArray(value) || isEqual(value, self.timelineData)) {
            self.setVueComponentData("timelineData", self.timelineData);
            return;
          }
          self.timelineData = value;
          self.setVueComponentData("timelineData", self.timelineData);
        },
        get pending() {
          return self.pending;
        },
        set pending(value) {
          if (value !== self.pending) {
            self.setVueComponentData("pending", value);
            self.pending = value;
          }
        }
      } as unknown as ISchema
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-timeline": QTimeLine;
  }
}

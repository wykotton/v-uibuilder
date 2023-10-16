import { html, LitElement, css, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./index.scss?inline";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { isEqual } from "lodash-es";
import { IMessage } from "../../types/runtime/IMessage";
import { changeProperty } from "../../types/runtime/decorators/decorators";

//类定义
@customElement("q-lyric")
export class QLyric extends LitElement {
  constructor() {
    super();
    this.initModel();
  }
  static styles = [
    css`
      ${unsafeCSS(styles)}
    `,
  ];
  //获得文本的路径
  @changeProperty()
  @property({ type: String, attribute: "src" })
  src = "";

  @changeProperty()
  @property({ type: Number, attribute: "time" })
  time = 0;

  @state()
  playing = false;

  @changeProperty()
  @property({ type: Number, attribute: "activeIndex" })
  activeIndex = 0;

  @state()
  paraList: any[] = [];

  @state()
  timeList: any[] = [];

  @state()
  ticker = null;

  @state()
  info: { title?: String; album?: string; artist?: string } = {};

  componentModel!: ComponentModel;
  //转换时间格式
  private parseTimeStr2Seconds(str: any) {
    if (/^[0-9][0-9]:[0-9][0-9].[0-9][0-9]$/i.test(str)) {
      const [minute, second] = str.split(":").map((i: any) => i * 1);
      return minute * 60 + second;
    }
    return 0;
  }

  //找到歌名-专辑-艺人
  private getTuneInfo(list: string[]): void {
    const info: { title?: String; album?: string; artist?: string } = {};
    for (let i = 0; i < list.length; i++) {
      const line = list[i];
      const stopIndex = line.indexOf("]");
      const content = line.slice(1, stopIndex);
      const arr = content.split(":");
      if (arr[0] === "ti") {
        info.title = arr[1];
      }
      if (arr[0] === "al") {
        info.album = arr[1];
      }
      if (arr[0] === "ar") {
        info.artist = arr[1];
      }
      if (info.title && info.album && info.artist) {
        break;
      }
    }
    this.info = info;
  }
  //点击播放
  private playOrPause(): void {
    if (this.playing) {
      clearInterval(this.ticker as any);
    } else {
      this.ticker = setInterval(() => {
        this.time += 0.2;
      }, 200) as any;
    }
    this.playing = !this.playing;
  }
  //获得当前应显示的行
  // @ts-ignore
  private getActiveIndex(): number {
    if (this.time === 0) {
      return 0;
    }
    for (let i = 0; i <= this.timeList.length; i++) {
      if (this.timeList[i] > this.time) {
        return i > 0 ? i - 1 : 0;
      }
    }
  }
  //渲染多行文本
  public renderParagraphs() {
    if (!this.paraList || this.paraList.length === 0) {
      return html`
        <p class="q-lyric-para active">没有内容</p>
      `;
    } else {
      if (this.playing || this.time > 0) {
        return html`
          ${this.paraList.map((line, index) => {
            return html`
              <p class="q-lyric-para ${index === this.activeIndex ? "active" : ""}">${(line as any).slice(10)}</p>
            `;
          })}
        `;
      } else {
        return html`
          <p class="q-lyric-para info">${this.info.title}</p>
          <p class="q-lyric-para info">${this.info.artist}</p>
          <p class="q-lyric-para info">${this.info.album}</p>
        `;
      }
    }
  }
  //渲染按钮文字
  private renderButton() {
    if (this.playing) {
      return "暂停";
    } else {
      return "播放";
    }
  }
  //渲染函数
  public render() {
    return html`
      <div class="q-lyric-wrap">
        <div class="q-lyric-body">${this.renderParagraphs()}</div>
        <div class="q-lyric-play" @click="${this.playOrPause.bind(this)}">${this.renderButton()}</div>
      </div>
    `;
  }
  public initModel() {
    const self = this;
    self.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-lyric";
          },
          get type() {
            return EComponentType.TEXT;
          },
          get text() {
            return "滚动文本组件";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "滚动文本组件,可以滚动显示文本";
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
                  description: "远程文本数据地址",
                },
                testStyle: {
                  type: "string",
                  description: "style控件",
                  format: "style",
                },
                testDate: {
                  type: "string",
                  description: "日期控件",
                  format: "date",
                },
                testDateTime: {
                  type: "string",
                  description: "日期时间控件",
                  format: "date-time",
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
          click: [
            function (e: Event) {
              console.log(e);
            },
          ],
          dblclick: [
            function (e: Event) {
              console.log(e, "dblclick");
            },
          ],
        },
        _initStyle: "height:600px;width:400px;",
        _onWatchSetting: {
          src: [
            function (newVal: any, oldVal: any, context: any) {
              if (newVal !== "") {
                fetch(newVal)
                  .then((res) => res.text())
                  .then((lrc) => {
                    const list = lrc.split(/[\n\r]/i);
                    self.paraList = list.filter((line) => /^\[[0-9]/i.test(line));
                    self.timeList = self.paraList.map((i) => self.parseTimeStr2Seconds((i as any).slice(1, 9)));
                    self.getTuneInfo(list);
                  });
              }
            },
          ],
          time: [
            function (newVal: any, oldVal: any, context: any) {
              if (newVal !== 0) {
                self.activeIndex = self.getActiveIndex();
              }
            },
          ],
          activeIndex: [
            function (newVal: any, oldVal: any, context: any) {
              console.log(context);
              if (newVal < 3) {
                const body = self.renderRoot.querySelector(".q-lyric-body");
                if (body) {
                  body.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth",
                  });
                }
              } else {
                const body = self.renderRoot.querySelector(".q-lyric-body");
                if (body) {
                  body.scrollTo({
                    top: 40 * (newVal - 3),
                    left: 0,
                    behavior: "smooth",
                  });
                }
              }
            },
          ],
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
        _version: "alpha 1.0.0",
        get src(): string {
          return self.src;
        },
        set src(val: string) {
          if (val === self.src) {
            return;
          }
          self.src = val;
        },
      } as unknown as ISchema,
    });
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "q-lyric": QLyric;
  }
}

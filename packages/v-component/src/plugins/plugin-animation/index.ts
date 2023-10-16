import { css, html, unsafeCSS } from "lit";
import { customElement, query } from "lit/decorators.js";
import { createApp, defineComponent, ref, watch } from "vue";
import { Component } from "../../types/runtime/Component";
import { Button, Empty, Row, Col, Select, InputNumber } from "ant-design-vue";
import { unmountInstance } from "../../util/utils";
import styleParse from "style-to-object";
import antdCss from "ant-design-vue/dist/antd.min.css?inline";
import cssIndex from "./index.scss?inline";
import "animate.css";

let pluginsMaterial: any = null;

interface IAnimationConfig {
  name: string;
  duration: number;
  delay: number;
  repeat: string;
  function: string;
}

@customElement("plugin-animation")
class PluginAnimation extends Component {
  constructor() {
    super();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
    css`
      ${unsafeCSS(antdCss)}
    `,
  ];

  /**
   * 挂载节点.
   */
  @query("#container")
  container!: HTMLElement;

  /**
   * 组件实例
   */
  componentInstance: any = null;

  disconnectedCallback(): void {
    if (!this.isConnected) {
      // 断开文档连接，说明元件已被删除
      unmountInstance(this);
    }
    super.disconnectedCallback();
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    if (!this.componentInstance && this.container) {
      this.createVueComponent();
    }
  }

  protected updated(): void {
    if (this.container) {
      unmountInstance(this);
      this.createVueComponent();
    }
  }

  public render() {
    return html`
      <div id="container"></div>
    `;
  }

  createVueComponent = () => {
    const component = defineComponent({
      template: `
        <div v-show="selectedKeys.length !== 1" style="width: 100%">
          <div style="padding: 20px">
            <a-empty description="暂无数据" />
          </div>
        </div>
        <div v-show="selectedKeys.length === 1">
          <div v-for="(item, index) in animationArray" :key="index" style="border-bottom: 1px dotted rgb(158, 158, 158)">
            <a-row style="padding-top: 10px">
              <a-col :span="12">
                <div style="display: flex;align-items: center;padding-right: 6px">
                  <span style="width: 65px;min-width: 65px">动画名称: </span>
                  <a-select v-model:value="item.name" style="flex: 1;width: 0">
                    <a-select-option v-for="name in animationName" :value="name">{{ name }}</a-select-option>
                  </a-select>
                </div>
              </a-col>
              <a-col :span="12">
                <div style="display: flex;align-items: center;padding-left: 6px">
                  <span style="width: 65px;min-width: 65px">持续时间: </span>
                  <a-input-number
                    style="flex: 1;width: 0"
                    v-model:value="item.duration"
                    :min="0"
                    :step="0.1"
                    :formatter="value => value+'s'"
                    :parser="value => value.replace('s', '')"
                  />
                </div>
              </a-col>
            </a-row>
            <a-row style="padding-top: 10px">
              <a-col :span="12">
                <div style="display: flex;align-items: center;padding-right: 6px">
                  <span style="width: 65px;min-width: 65px">重复次数: </span>
                  <a-select v-model:value="item.repeat" style="flex: 1;width: 0">
                    <a-select-option v-for="repeat in animationRepeat" :value="repeat">{{ repeat }}</a-select-option>
                  </a-select>
                </div>
              </a-col>
              <a-col :span="12">
                <div style="display: flex;align-items: center;padding-left: 6px">
                  <span style="width: 65px;min-width: 65px">延迟时间: </span>
                  <a-input-number
                    style="flex: 1;width: 0"
                    v-model:value="item.delay"
                    :min="0"
                    :step="0.1"
                    :formatter="value => value+'s'"
                    :parser="value => value.replace('s', '')"
                  />
                </div>
              </a-col>
            </a-row>
            <a-row style="padding: 10px 0">
              <a-col :span="12">
                <div style="display: flex;align-items: center;padding-right: 6px">
                  <span style="width: 65px;min-width: 65px">运动函数: </span>
                  <a-select v-model:value="item.function" style="flex: 1;width: 0">
                    <a-select-option v-for="timing in animationTimingFunction" :value="timing">{{ timing }}</a-select-option>
                  </a-select>
                </div>
              </a-col>
              <a-col :span="12">
                <div style="display: flex;align-items: center">
                  <a-button style="margin-left: auto" danger @click="deleteAnimation(index)">删除</a-button>
                </div>
              </a-col>
            </a-row>
          </div>
          <div style="display: flex;align-items: center;padding-top: 10px">
            <a-button @click="addAnimation" style="margin: 0 auto">添加动画</a-button>
            <a-button v-if="animationArray.length" style="margin: 0 auto" @click="running">运行动画</a-button>
          </div>
        </div>
			`,
      setup() {
        const animationName = [
          "bounce",
          "flash",
          "pulse",
          "rubberBand",
          "shakeX",
          "shakeY",
          "headShake",
          "swing",
          "tada",
          "wobble",
          "jello",
          "heartBeat",
          "backInDown",
          "backInLeft",
          "backInRight",
          "backInUp",
          "backOutDown",
          "backOutLeft",
          "backOutRight",
          "backOutUp",
          "bounceIn",
          "bounceInDown",
          "bounceInLeft",
          "bounceInRight",
          "bounceInUp",
          "bounceOut",
          "bounceOutDown",
          "bounceOutLeft",
          "bounceOutRight",
          "bounceOutUp",
          "fadeIn",
          "fadeInDown",
          "fadeInDownBig",
          "fadeInLeft",
          "fadeInLeftBig",
          "fadeInRight",
          "fadeInRightBig",
          "fadeInUp",
          "fadeInUpBig",
          "fadeInTopLeft",
          "fadeInTopRight",
          "fadeInBottomLeft",
          "fadeInBottomRight",
          "fadeOut",
          "fadeOutDown",
          "fadeOutDownBig",
          "fadeOutLeft",
          "fadeOutLeftBig",
          "fadeOutRight",
          "fadeOutRightBig",
          "fadeOutUp",
          "fadeOutUpBig",
          "fadeOutTopLeft",
          "fadeOutTopRight",
          "fadeOutBottomRight",
          "fadeOutBottomLeft",
          "flip",
          "flipInX",
          "flipInY",
          "flipOutX",
          "flipOutY",
          "lightSpeedInRight",
          "lightSpeedInLeft",
          "lightSpeedOutRight",
          "lightSpeedOutLeft",
          "rotateIn",
          "rotateInDownLeft",
          "rotateInDownRight",
          "rotateInUpLeft",
          "rotateInUpRight",
          "rotateOut",
          "rotateOutDownLeft",
          "rotateOutDownRight",
          "rotateOutUpLeft",
          "rotateOutUpRight",
          "hinge",
          "jackInTheBox",
          "rollIn",
          "rollOut",
          "zoomIn",
          "zoomInDown",
          "zoomInLeft",
          "zoomInRight",
          "zoomInUp",
          "zoomOut",
          "zoomOutDown",
          "zoomOutLeft",
          "zoomOutRight",
          "zoomOutUp",
          "slideInDown",
          "slideInLeft",
          "slideInRight",
          "slideInUp",
          "slideOutDown",
          "slideOutLeft",
          "slideOutRight",
        ];
        const animationTimingFunction = [
          "linear",
          "ease",
          "ease-in",
          "ease-out",
          "ease-in-out",
          "step-start",
          "step-end",
        ];
        const animationRepeat = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "infinite"];
        const animationArray = ref<IAnimationConfig[]>([]);
        const selectedKeys = ref<string[]>([]);
        const currentKey = ref("");
        const selectComponent = ref(false);

        watch(
          [animationArray],
          (newValue) => {
            if (selectComponent.value) {
              selectComponent.value = false;
            } else {
              changeCustomAnimation(newValue[0]);
            }
          },
          { deep: true }
        );

        pluginsMaterial?.edit?.useSettingStore?.$subscribe((mutation: any, state: any) => {
          if (mutation?.events?.key !== "selectedKeys") return;
          selectedKeys.value = mutation.events.newValue;
          // 切换选中组件, 更新动画数据
          if (mutation.events.newValue.length === 1) {
            currentKey.value = mutation.events.newValue[0];
            formatAnimation();
          }
        });

        function trim(str: string) {
          return str.replace(/(^\s*)|(\s*$)/g, "");
        }

        function formatAnimation() {
          const component: any = document.querySelector(`#${currentKey.value}`);
          const tempArray: IAnimationConfig[] = [];
          if (component?.componentModel?.model?.initStyle) {
            const styleObj = styleParse(component.componentModel.model.initStyle) ?? {};
            if (styleObj.animation) {
              const arr = styleObj.animation.split(",");
              arr.forEach((animation: string) => {
                const arr2 = trim(animation).split(" ");
                const animationData: IAnimationConfig = {
                  name: arr2[7] || animationName[0],
                  duration: Number(arr2[0].replace("s", "") || "1"),
                  delay: Number(arr2[2].replace("s", "") || "0"),
                  repeat: arr2[3] || animationRepeat[0],
                  function: arr2[1] || animationTimingFunction[0],
                };
                tempArray.push(animationData);
              });
            }
          }
          selectComponent.value = true;
          animationArray.value = tempArray;
        }

        function addAnimation() {
          const temp = {
            name: animationName[0],
            duration: 1,
            delay: 0,
            repeat: animationRepeat[0],
            function: animationTimingFunction[0],
          };
          animationArray.value.push(temp);
        }

        function deleteAnimation(index: number) {
          if (animationArray.value[index]) {
            animationArray.value.splice(index, 1);
          }
        }

        function changeCustomAnimation(animationArray: IAnimationConfig[]) {
          const component: any = document.querySelector(`#${currentKey.value}`);
          if (component?.componentModel?.model?.initStyle) {
            const styleObj = styleParse(component.componentModel.model.initStyle) ?? {};
            let animationStr = "";
            animationArray.forEach((item: IAnimationConfig) => {
              const str = `${item.duration}s ${item.function} ${item.delay}s ${item.repeat} normal forwards running ${item.name}`;
              animationStr ? (animationStr += `,${str}`) : (animationStr += str);
            });
            let tempStyle = {};
            if (animationStr) {
              tempStyle = { ...styleObj, animation: animationStr };
            } else {
              Reflect.deleteProperty(styleObj, "animation");
              tempStyle = styleObj;
            }
            let styleStr = "";
            for (const key in tempStyle) {
              styleStr += `${key}: ${tempStyle[key]};`;
            }
            component.componentModel.updateModelEntity(JSON.stringify({ initStyle: styleStr }));
          }
        }

        function running() {
          changeCustomAnimation([]);
          setTimeout(() => {
            changeCustomAnimation(animationArray.value);
          });
        }

        return {
          selectedKeys,
          animationName,
          animationRepeat,
          animationTimingFunction,
          animationArray,
          addAnimation,
          deleteAnimation,
          running,
        };
      },
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(Button);
    this.componentInstance.use(Empty);
    this.componentInstance.use(Row);
    this.componentInstance.use(Col);
    this.componentInstance.use(Select);
    this.componentInstance.use(InputNumber);
    this.componentInstance.mount(this.container);
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "plugin-animation": PluginAnimation;
  }
}

const customPlugin = (ctx: any) => {
  return {
    async init() {
      const { skeleton, material } = ctx;
      pluginsMaterial = material;
      skeleton.add({
        name: "animation",
        area: "rightArea",
        type: "Panel",
        page: "edit",
        content: "plugin-animation",
        props: {
          title: "动画",
          description: "动画面板给相应组件添加动画",
          icon: '<svg class="icon" width="16px" height="16.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#333333" d="M808.53 442.25l-221.17-78.5-78.5-221.17a52 52 0 0 0-98 0l-78.5 221.17-221.17 78.5a52 52 0 0 0 0 98l221.17 78.49 78.49 221.17a52 52 0 0 0 98 0l78.5-221.17 221.17-78.49a52 52 0 0 0 0-98zM554.3 554.08a51.78 51.78 0 0 0-31.61 31.61l-62.83 177-62.86-177a51.78 51.78 0 0 0-31.61-31.61l-177-62.83 177-62.83A51.77 51.77 0 0 0 397 396.81l62.83-177 62.83 177a51.78 51.78 0 0 0 31.61 31.61l177 62.83z"  /><path fill="#333333" d="M769.13 638.13l-126.79 44.61a36 36 0 1 0 23.9 67.92L793 706.05a36 36 0 0 0-23.89-67.92zM689 798.67l-85.44 30.06a36 36 0 1 0 23.9 67.92l85.44-30.06a36 36 0 1 0-23.9-67.92z"  /></svg>',
        },
      });
    },
  };
};
customPlugin.pluginName = "pluginAnimation";
export default customPlugin;

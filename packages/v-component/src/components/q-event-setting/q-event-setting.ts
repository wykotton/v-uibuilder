import { css, html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { cloneDeep, debounce, isString } from "lodash-es";
import { Component } from "../../types/runtime/Component";
import { DOMEmit } from "../../util/reactivity/Emit";
import { IEventSpecificationEvent } from "../../types/runtime/IModelSchema";
import { createApp, defineComponent, ref, watch } from "vue";
import { Button, Tooltip, Modal, Menu, Dropdown, Collapse, Input, Tabs, Empty, Tree } from "ant-design-vue";
import {
  CaretRightOutlined,
  CaretDownOutlined,
  SettingOutlined,
  PlusOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  CodeOutlined,
  BgColorsOutlined,
  EllipsisOutlined,
  RightCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import antdCss from "ant-design-vue/dist/antd.css?inline";
import cssIndex from "./index.scss?inline";
import "../q-code-editor/q-code-editor";
import { OnDOMEvent } from "./components/onDOMEvent";
import { OnMessageMeta } from "./components/onMessageMeta";
import { LifeCycle } from "./components/lifeCycle";
import { OnWatchSetting } from "./components/onWatchSetting";
import { unmountInstance } from "../../util/utils";

const eventList = ["onDOMEvent", "onMessageMeta", "onWatchSetting", "lifeCycle"];

/**
 * DOM鼠标事件设置器
 */
@customElement("q-event-setting")
export class QEventSetting extends Component {
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

  @property({ type: Object })
  public value = {};

  // designer变更,有实例则不再重新渲染
  set _value(value: any) {
    try {
      let tempValue = cloneDeep(value);
      isString(tempValue) && (tempValue = JSON.parse(tempValue));
      if (this.componentInstance?._instance?.proxy?.changeEventInfo) {
        this.ignoreValue = true;
        this.componentInstance._instance.proxy.changeEventInfo(tempValue);
      } else {
        this.value = tempValue;
      }
    } catch (error) {}
  }

  // 语言
  @property({ type: String })
  public lang = "zh_CN";

  /**
   * 挂载节点.
   */
  @query("#container")
  container!: HTMLElement;

  /**
   * 组件实例
   */
  componentInstance: any = null;

  /**
   * 切换组件时忽略更新
   */
  ignoreValue = false;

  render() {
    return html`
      <div id="container"></div>
    `;
  }

  createVueComponent = () => {
    const self = this;
    typeof self.value === "string" && (self.value = JSON.parse(self.value));
    const component = defineComponent({
      template: `
        <a-tabs v-model:activeKey="activeKey" :tabBarGutter="20">
          <a-tab-pane key="onDOMEvent" tab="DOM事件">
            <OnDOMEvent :eventInfo="eventInfo.onDOMEvent" />
          </a-tab-pane>
          <a-tab-pane key="onMessageMeta" tab="消息响应">
            <OnMessageMeta :eventInfo="eventInfo.onMessageMeta" :inputMessage="inputMessage" />
          </a-tab-pane>
          <a-tab-pane key="onWatchSetting" tab="属性监听">
            <OnWatchSetting :eventInfo="eventInfo.onWatchSetting" :model="model" />
          </a-tab-pane>
          <a-tab-pane key="lifeCycle" tab="生命周期">
            <LifeCycle :eventInfo="eventInfo.lifeCycle" />
          </a-tab-pane>
        </a-tabs>
  		`,
      setup() {
        const activeKey = ref<string>("onDOMEvent");
        const inputMessage = ref<IEventSpecificationEvent[]>([]);
        const model: any = ref(cloneDeep(self.value));
        const eventInfo: any = ref(handleData(cloneDeep(self.value)));

        /**
         * 处理原始数据
         */
        function handleData(value: any) {
          const eventInfo = {};
          eventList.forEach((key: string) => {
            eventInfo[key] = value[key] || {};
          });
          if (value?._iovSchema?.eventSpecification?.inputMessage) {
            inputMessage.value = value._iovSchema.eventSpecification.inputMessage;
          }
          model.value = value;
          return eventInfo;
        }

        watch(
          [eventInfo],
          (newValue) => {
            // 忽略切换组件时造成的更新
            if (self.ignoreValue) {
              self.ignoreValue = false;
            } else {
              emitChange(newValue[0]);
            }
          },
          { deep: true }
        );

        /**
         * 更改eventInfo
         * @param value
         */
        function changeEventInfo(value: any) {
          eventInfo.value = handleData(cloneDeep(value));
        }

        const emitChange = debounce((value: any) => {
          DOMEmit(self, "change", { detail: { value } });
        }, 300);

        return {
          eventInfo,
          activeKey,
          inputMessage,
          model,
          changeEventInfo,
        };
      },
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(Button);
    this.componentInstance.use(Tooltip);
    this.componentInstance.use(Modal);
    this.componentInstance.use(Menu);
    this.componentInstance.use(Dropdown);
    this.componentInstance.use(Collapse);
    this.componentInstance.use(Tabs);
    this.componentInstance.use(Input);
    this.componentInstance.use(Tree);
    this.componentInstance.use(Empty);
    this.componentInstance.component("OnDOMEvent", OnDOMEvent);
    this.componentInstance.component("OnMessageMeta", OnMessageMeta);
    this.componentInstance.component("OnWatchSetting", OnWatchSetting);
    this.componentInstance.component("LifeCycle", LifeCycle);
    this.componentInstance.component("CaretRightOutlined", CaretRightOutlined);
    this.componentInstance.component("CaretDownOutlined", CaretDownOutlined);
    this.componentInstance.component("SettingOutlined", SettingOutlined);
    this.componentInstance.component("PlusOutlined", PlusOutlined);
    this.componentInstance.component("CloseOutlined", CloseOutlined);
    this.componentInstance.component("CodeOutlined", CodeOutlined);
    this.componentInstance.component("ExclamationCircleOutlined", ExclamationCircleOutlined);
    this.componentInstance.component("BgColorsOutlined", BgColorsOutlined);
    this.componentInstance.component("EllipsisOutlined", EllipsisOutlined);
    this.componentInstance.component("RightCircleOutlined", RightCircleOutlined);
    this.componentInstance.component("DeleteOutlined", DeleteOutlined);
    this.componentInstance.mount(this.container);
  };

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
}

declare global {
  interface HTMLElementTagNameMap {
    "q-event-setting": QEventSetting;
  }
}

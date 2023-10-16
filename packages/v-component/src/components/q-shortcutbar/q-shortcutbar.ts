import { css, html, unsafeCSS } from "lit";
import { property, query } from "lit/decorators.js";
import { Component } from "../../types/runtime/Component";
import { customHasElement } from "../../types/runtime/decorators/decorators";
import { DOMEmit } from "../../util/reactivity/Emit";
import funList from "./list"
import "../q-select/q-select";
import "../q-popover/q-popover";
import "../q-button/q-button";
import "../q-icon/q-icon";
import cssIndex from "./index.scss?inline";

@customHasElement("q-shortcutbar")
export class QShortcutbar extends Component {
  constructor() {
    super();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];

  @property({ type: String })
  public modalEvent = "";

  @query(".container")
  public editorContainer!: HTMLElement;

  /*
  * 选中事件
  */
  public onClickEvent(e:any, key: string, item: any, index: number) {
    const selected = funList.filter(v => v.value === key)[0].list?.filter(v => v.value === item.value)[0]
    DOMEmit(this, "onExec", { detail: {value: selected?.text, range: selected?.range } });
    this?.shadowRoot?.querySelectorAll("q-popover")[index]?.leave()
  }

  public render() {
    return html`
      <div id="q-shortcut-bar">
        <div class="q-s-bar q-s-bar-show q-s-toolbar">
          <div class="q-s-bar-item">快捷插入代码：</div>
          ${funList.map((item, index) => {
            return html`
            <div class="q-s-bar-item tox">
              <q-popover trigger="click" slot="left">
                <div style="user-select: none;" class="tox-split-button">
                  <span class="tox-tbtn">
                    ${item.icon ? html`${item.icon}` : null} ${item.label}
                  </span>
                  <span class="tox-tbtn tox-split-button__chevron tox-tbtn--enabled">
                    <svg width="10" height="10"><path d="M8.7 2.2c.3-.3.8-.3 1 0 .4.4.4.9 0 1.2L5.7 7.8c-.3.3-.9.3-1.2 0L.2 3.4a.8.8 0 010-1.2c.3-.3.8-.3 1.1 0L5 6l3.7-3.8z" fill-rule="nonzero"></path></svg>
                  </span>
                </div>

                <div slot="popover" tip="popover">
                  
                    <div class="popover-content">
                    ${item.list.map((subItem) => {
                    return html`
                      <div class="popover-content-item">
                        ${subItem.icon ? html`<q-icon name="${subItem.icon}"></q-icon>` : null}
                        <span @click="${(e: Event) => { return this.onClickEvent(e, item.value, subItem, index) }}">${subItem.label}</span>
                        ${subItem.help ? html`
                        <div class="popover-content-item-help">
                          <div>
                            <div class="ant-popover ant-popconfirm ant-popover-placement-rightTop">
                              <div class="ant-popover-content">
                                <div class="ant-popover-arrow"><span class="ant-popover-arrow-content"></span></div>
                                <div class="ant-popover-inner">
                                  <div class="ant-popover-inner-content">
                                    <div class="ant-popover-message">
                                      <span aria-label="exclamation-circle" class="anticon anticon-exclamation-circle">
                                        ${subItem.icon ? html`<q-icon name="${subItem.icon}" color="#faad14"></q-icon>` : null}
                                      </span>
                                      <div class="ant-popover-message-title">${subItem.help}</div>
                                    </div>
                                    <!-- <div class="ant-popover-buttons">
                                      <button class="ant-btn ant-btn-sm" type="button"><span>No</span></button><button class="ant-btn ant-btn-primary ant-btn-sm" type="button"><span>Yes</span></button>
                                    </div> -->
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        ` : null}
                      </div>
                      `})}
                    </div>
                </div>
              </q-popover>
            </div>
            `
          })}
          
        </div>
      </div>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "q-shortcutbar": QShortcutbar;
  }
}

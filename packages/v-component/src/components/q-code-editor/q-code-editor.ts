import { css, html, unsafeCSS } from "lit";
import { property, query } from "lit/decorators.js";
import { Component } from "../../types/runtime/Component";
import { DOMEmit } from "../../util/reactivity/Emit";
import { booleanTransform } from "../../util/utils";
import { customHasElement } from "../../types/runtime/decorators/decorators";
import { languageList } from "./src/language";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import monacoCss from "monaco-editor/min/vs/editor/editor.main.css?inline";
import "../q-select/q-select";
import "../q-shortcutbar/q-shortcutbar";
import "./src/userWorker";
import cssIndex from "./index.scss?inline";

type themeType = "vs" | "hc-black" | "vs-dark";

@customHasElement("q-code-editor")
export class QCodeEditor extends Component {
  constructor() {
    super();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
    css`
      ${unsafeCSS(monacoCss)}
    `,
  ];

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public readOnly = false;

  @property({ type: String })
  public value = "function hello() {\n\tconsole.log('Hello world!');\n}";

  @property({ type: String })
  public language = "";

  @property({ type: Number })
  public fontSize = 16;

  @property({ type: String })
  public theme: themeType = "vs-dark";

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public showHeader = false;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public showShortcut = false;
  

  @query(".container")
  public editorContainer!: HTMLElement;

  // public editor!: monaco.editor.IStandaloneCodeEditor;
  public editor!: any;

  public themeList = [
    { label: "vs", value: "vs" },
    { label: "hc-black", value: "hc-black" },
    { label: "vs-dark", value: "vs-dark" },
  ];

  /*
   * 变更编辑器主题
   */
  public changeTheme(ev: CustomEvent) {
    if (this.editor) {
      monaco.editor.setTheme(ev.detail.value);
    }
  }

  /*
   * 变更编辑器语言
   */
  public changeLanguage(ev: CustomEvent) {
    if (this.editor) {
      monaco.editor.setModelLanguage((this.editor as any).getModel(), ev.detail.value);
    }
  }

  /*
   * 获取编辑器值
   */
  public getValue() {
    if (this.editor) {
      return this.editor.getValue();
    }
    return "";
  }

  /*
   * 设置编辑器值
   */
  public setValue(value: string) {
    if (this.editor) {
      this.editor.setValue(value);
      this.editor.getAction("editor.action.formatDocument").run();
    }
  }

  /**
   * 格式化代码
   */
  retryNum = 0;
  public async formatDocument() {
    if (this.retryNum > 5) {
      this.retryNum = 0;
      return;
    }
    const isSupported = await this.editor.getAction("editor.action.formatDocument").isSupported();
    if (isSupported) {
      this.editor.getAction("editor.action.formatDocument").run();
    } else {
      setTimeout(() => {
        this.retryNum++;
        this.formatDocument();
      }, 100);
    }
  }

  shortcutBarExec(e: CustomEvent) {
    const selection = this.editor.getSelection()
    this.editor.executeEdits('insert-code', [
      {
        range: new monaco.Range(
          selection.startLineNumber,
          selection.startColumn,
          selection.endLineNumber,
          selection.endColumn
        ),
        text: e.detail.value
      }
    ])
    this.editor.setSelection({startLineNumber: selection.startLineNumber+e.detail.range[0],
      startColumn: selection.startColumn+e.detail.range[1],
      endLineNumber: selection.startLineNumber+e.detail.range[2],
      endColumn: selection.startColumn+e.detail.range[3]
    })
    this.editor.focus()

  }

  /*
   * 初始化monaco
   */
  public initEditor() {
    const self = this;
    if (this.editorContainer) {
      this.editor = null;
      this.editorContainer.outerHTML = `<div class="container" style="flex: 1;width: 100%;"></div>`;
      this.editor = monaco.editor.create(this.editorContainer, {
        value: this.value,
        language: this.language,
        theme: this.theme || "vs",
        fontSize: this.fontSize || 16,
        readOnly: this.readOnly,
        automaticLayout: true, // 自适应布局
        scrollBeyondLastLine: false, // 取消代码后面一大段空白
        overviewRulerBorder: false, // 不要滚动条的边框
      });
      this.editor.onDidChangeModelContent((e: any) => {
        const code = self.editor.getValue();
        DOMEmit(self, "change", { detail: { value: code } });
      });
      this.formatDocument();
    }
  }

  public render() {
    setTimeout(() => {
      this.initEditor();
    }, 0);
    return html`
      <div
        class="q-code-editor"
        style="width: 100%;height: 100%;position: relative;overflow: hidden;display: flex;flex-direction: column;"
      >
        ${this.showHeader
          ? html`
              <div
                class="header"
                style="width: 100%;height: 36px;padding: 0 10px;box-sizing: border-box;display: flex;flex-direction: row;align-items: center;"
              >
                <span>语言</span>
                <q-select
                  style="width: 150px; height: 28px; margin-left: 10px"
                  options=${JSON.stringify(languageList)}
                  placeholder="请选择语言"
                  value=${this.language}
                  @change=${this.changeLanguage.bind(this)}
                ></q-select>
                <span style="margin-left: 30px">主题</span>
                <q-select
                  style="width: 150px; height: 28px; margin-left: 10px"
                  options=${JSON.stringify(this.themeList)}
                  placeholder="请选择主题"
                  value=${this.theme}
                  @change=${this.changeTheme.bind(this)}
                ></q-select>
              </div>
            `
          : null}
          ${this.showShortcut ? html`<q-shortcutbar @onExec="${this.shortcutBarExec}" />` : null}
          
        <div class="container" style="flex: 1;width: 100%;"></div>
      </div>
    `;
  }

  // 将内容渲染至主文档
  createRenderRoot() {
    return this;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-code-editor": QCodeEditor;
  }
}

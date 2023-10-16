import { css, html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { Component } from "../../types/runtime/Component";
import { DOMEmit } from "../../util/reactivity/Emit";
import { booleanTransform } from "../../util/utils";
import cssIndex from "./index.scss?inline";
import "../q-popover/q-popover";

@customElement("q-slider")
export class QSlider extends Component {
  constructor() {
    super();
  }

  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
  ];

  @property({ type: Number, reflect: true })
  public value = 0;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public disabled = false;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
  })
  public stepEnable = false;

  @property({ type: Number })
  public max = 100;

  @property({ type: Number })
  public min = 0;

  @property({ type: Number })
  public step = 1;

  @query("#sliderBox")
  public sliderBox!: HTMLElement;

  @query("#sliderBar")
  public sliderBar!: HTMLElement;

  @query("#slider")
  public slider!: HTMLElement;

  public flag = false;

  public leftOff = 0;

  public valueChange(current: number) {
    DOMEmit(this, "change", { detail: { value: current } });
  }

  // set slider default position with default value when init render
  setLeftByValue() {
    this.value < this.min ? (this.value = this.min) : void 0;
    this.value > this.max ? (this.value = this.max) : void 0;
    // const left = Number(((this.value / this.max) * this.sliderBox.offsetWidth).toFixed(2));
    // this.slider.style.left = ((left - this.leftOff) / this.sliderBox.offsetWidth) * 100 + "%";
    // this.sliderBar.style.width = ((left - this.leftOff) / this.sliderBox.offsetWidth) * 100 + "%";
    const left = ((this.value / this.max) * 100).toFixed(2) + "%";
    this.slider.style.left = left;
    this.sliderBar.style.width = left;
  }

  // get current value and slider left position
  getCurrentValue(left: number) {
    let current = (left / this.sliderBox.offsetWidth) * this.max;
    current = Math.round(current / this.step);
    current = current * this.step;
    return {
      current,
      left: this.stepEnable ? (current / this.max) * Number(this.sliderBox.offsetWidth.toFixed(2)) : left,
    };
  }

  // add listener when page or component loaded
  addListener() {
    this.slider.addEventListener("mousedown", this.onMouseDown);
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
  }

  // remove listener when page or component destroy
  removeListener() {
    this.slider.removeEventListener("mousedown", this.onMouseDown);
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
  }

  // mousedown event of slider
  onMouseDown = () => {
    this.flag = true;
  };

  // mousemove event of document
  onMouseMove = (event: MouseEvent) => {
    if (this.flag) {
      // get mouse offsetX for box
      const offsetX = event.clientX - this.sliderBox.getBoundingClientRect().left;

      // get left offset
      let left = 0;
      if (offsetX > this.sliderBox.offsetWidth) {
        left = this.sliderBox.offsetWidth;
      } else if (offsetX >= 0) {
        left = offsetX;
      } else {
        left = 0;
      }

      const result = this.getCurrentValue(left);
      if (this.valueChange) {
        // send to onValueChange function when it exist
        if (result.current !== this.value) {
          // emit change event when value is different
          this.value = result.current;
          this.valueChange(result.current);
        }
      }

      // set left position of slider
      const tempValue = (((result.left - this.leftOff) / this.sliderBox.offsetWidth) * 100).toFixed(3) + "%";
      this.slider.style.left = tempValue;
      this.sliderBar.style.width = tempValue;
    }
  };

  // mouseup event of document
  public onMouseUp = () => {
    this.flag = false;
  };

  init() {
    // DOM存在再进行初始化，不存在则延迟初始化
    if (this.slider && this.sliderBar && this.sliderBox) {
      this.setLeftByValue();
      this.removeListener();
      this.addListener();
    } else {
      // 异步等待DOM渲染再进行初始化
      setTimeout(() => {
        this.init();
      });
    }
  }

  public render() {
    this.init();
    return html`
      <div id="sliderBox" class="q-slider-box">
        <div class="q-slider_runway"></div>
        <div id="sliderBar" class="q-slider_bar"></div>
        <div class="q-slider_wrapper" id="slider">
          <q-popover position="top" disabled=${this.disabled} trigger="hover">
            <div class="q-slider_button" id="slider"></div>
            <div slot="popover" class="q-slider-dropdown_wrap">
              ${this.value}
            </div>
        </div>
        </q-popover>
      </div>
      </div>
		`;
  }

  // 组件卸载
  disconnectedCallback() {
    // 移除监听事件
    this.removeListener();
    super.disconnectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-slider": QSlider;
  }
}

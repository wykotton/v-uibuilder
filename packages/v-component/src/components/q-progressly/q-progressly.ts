import { css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { extractClass } from "../../common";
import { Component } from "../../types/runtime/Component";
import { styleMap } from "lit/directives/style-map.js";

import cssIndex from "./index.scss?inline";
type TypeEnums = "line" | "circle" | "dashboard"; // line
type StatusEnums = "success" | "exception" | "warning"; //
// type StrokeLinecapEnums = "butt" | "round" | "square"; // round
@customElement("q-progressly")
export class QProgressly extends Component {
  constructor() {
    super();
  }
  static styles = [
    css`
			${unsafeCSS(cssIndex)}
		`,
  ];

  // 进度条类型枚举
  @property({ type: String, attribute: "type" })
  public type: TypeEnums = "line";

  // 进度范围
  @property({ type: Number })
  public percentage = 0;

  // 状态
  @property({ type: Boolean })
  public status: StatusEnums = "success";

  // 描边宽度
  @property({ type: Number })
  public strokeWidth = 6;

  // 描边帽子
  @property({ type: String })
  public strokeLinecap = "round";

  // 文本范围
  @property({ type: Boolean })
  public textInside = false;

  // 宽度
  @property({ type: Number })
  public width = 126;

  // 是否显示文本
  @property({ type: Boolean })
  public showText = true;

  // 颜色
  @property({ type: String })
  public color = "";

  /**
   * 获取颜色
   * @param percentage
   */
  private getCurrentColor(percentage: number) {
    if (typeof this.color === "string") {
      return this.color;
    }
    return this.color;
  }
  /**
   * 内容
   */
  get content() {
    return `${this.percentage}%`;
  }
  /**
   * 进度条大小
   */
  get progressTextSize() {
    return this.type === "line" ? 12 + this.strokeWidth * 0.4 : this.width * 0.111111 + 2;
  }
  /**
   * 图标类名
   */
  get iconClass() {
    if (this.status === "warning") {
      return "el-icon-warning";
    }
    if (this.type === "line") {
      return this.status === "success" ? "el-icon-circle-check" : "el-icon-circle-close";
    } else {
      return this.status === "success" ? "el-icon-check" : "el-icon-close";
    }
  }

  /**
   * 颜色
   */
  get stroke() {
    let ret;
    if (this.color) {
      ret = this.getCurrentColor(this.percentage);
    } else {
      switch (this.status) {
        case "success":
          ret = "#13ce66";
          break;
        case "exception":
          ret = "#ff4949";
          break;
        case "warning":
          ret = "#e6a23c";
          break;
        default:
          ret = "#20a0ff";
      }
    }
    return ret;
  }

  get barStyle() {
    const style: Record<any, any> = {};
    style.width = this.percentage + "%";
    style.backgroundColor = this.getCurrentColor(this.percentage);
    return style;
  }

  get relativeStrokeWidth() {
    return ((this.strokeWidth / this.width) * 100).toFixed(1);
  }

  get radius() {
    if (this.type === "circle" || this.type === "dashboard") {
      return parseInt(String(50 - parseFloat(this.relativeStrokeWidth) / 2), 10);
    } else {
      return 0;
    }
  }

  get trackPath() {
    const radius = this.radius;
    const isDashboard = this.type === "dashboard";
    return `
      M 50 50
      m 0 ${isDashboard ? "" : "-"}${radius}
      a ${radius} ${radius} 0 1 1 0 ${isDashboard ? "-" : ""}${radius * 2}
      a ${radius} ${radius} 0 1 1 0 ${isDashboard ? "" : "-"}${radius * 2}
      `;
  }

  get perimeter() {
    return 2 * Math.PI * this.radius;
  }

  get rate() {
    return this.type === "dashboard" ? 0.75 : 1;
  }

  get strokeDashoffset() {
    const offset = (-1 * this.perimeter * (1 - this.rate)) / 2;
    return `${offset}px`;
  }

  get trailPathStyle() {
    return {
      strokeDasharray: `${this.perimeter * this.rate}px, ${this.perimeter}px`,
      strokeDashoffset: this.strokeDashoffset,
    };
  }

  get circlePathStyle() {
    return {
      strokeDasharray: `${this.perimeter * this.rate * (this.percentage / 100)}px, ${this.perimeter}px`,
      strokeDashoffset: this.strokeDashoffset,
      transition: "stroke-dasharray 0.6s ease 0s, stroke 0.6s ease",
    };
  }

  public render() {
    return html`
			<div
				class="q-progress"
				role="progressbar"
				aria-valuenow="{this.percentage}"
				aria-valuemin="0"
				aria-valuemax="100"
				class=${extractClass({}, "q-progress", {
      ["q-progress-" + this.type]: this.type,
      ["q-progress-" + this.status]: this.status,
      "q-progress-without-text": !this.showText,
      "q-progress-text-inside": this.textInside,
    })}
			>
				${this.type === "line"
      ? html`
							<div class="q-progress-bar">
								<div class="q-progress-bar_outer" style="height:${this.strokeWidth}">
									<div style=${styleMap(this.barStyle)} class="q-progress-bar_inner">
										${this.showText && this.textInside
        ? html`<div class="q-progress-bar_innerText">${this.content}</div>`
        : html`(
													<div
														class="q-progress-circle"
														style=${{
          height: this.width + "px",
          width: this.width + "px",
        }}
													>
														<svg viewBox="0 0 100 100">
															<path
																class="q-progress-circle_track"
																stroke="#e5e9f2"
																fill="none"
																d=${this.trackPath}
																stroke-width="{this.relativeStrokeWidth}"
																style=${this.trailPathStyle}
															/>
															<path
																class="q-progress-circle_path"
																fill="none"
																d=${this.trackPath}
																stroke="{this.stroke}"
																stroke-linecap="{this.strokeLinecap}"
																stroke-width="{this.percentage"
																?
																this.relativeStrokeWidth
																:
																0}
																style=${styleMap(this.circlePathStyle)}
															/>
														</svg>
													</div>
													)}`}
									</div>
								</div>
							</div>
					  `
      : null}
			</div>
		`;
  }
}

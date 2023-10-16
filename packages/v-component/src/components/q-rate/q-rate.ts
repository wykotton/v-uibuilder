import { css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Component } from "../../types/runtime/Component";
import { DOMEmit } from "../../util/reactivity/Emit";
import { booleanTransform } from "../../util/utils";
import cssIndex from "./index.scss?inline";

@customElement("q-rate")
export class QRate extends Component {
	constructor() {
		super();
	}

	static styles = [
		css`
			${unsafeCSS(cssIndex)}
		`,
	];

	@property({ type: Number })
	public value = -1;

	@property({ type: String })
	public name = "QRate";

	@property({ type: Number })
	public lowThreshold = 2;

	@property({ type: Number })
	public highThreshold = 4;

	@property({ type: Number })
	public max = 5;

	@property({
		type: Array,
	})
	public colors = ["#F7BA2A", "#F7BA2A", "#F7BA2A", "#F7BA2A", "#F7BA2A"];

	@property({ type: String })
	public voidColor = "#C6D1DE";

	@property({ type: String })
	public disabledVoidColor = "#EFF2F7";

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
	public allowHalf = false;

	@property({
		type: Boolean,
		converter(value, type?) {
			return booleanTransform(value);
		},
	})
	public showText = false;

	@property({
		type: Boolean,
		converter(value, type?) {
			return booleanTransform(value);
		},
	})
	public showScore = false;

	@property({ type: String })
	public textColor = "#1f2d3d";

	@property({
		type: Array,
	})
	public texts = ["极差", "失望", "一般", "满意", "惊喜"];

	@property({ type: Array })
	public rateList = ["★", "★", "★", "★", "★"];

	public pointerAtLeftHalf = true;

	public currentValue = -1;

	public hoverIndex = -1;

	public valueList = [1, 2, 3, 4, 5];

	public allowUpdate = false;

	public timeout: any = null;

	get text() {
		return this.texts[this.value] || null;
	}

	get rateDisabled() {
		return this.disabled;
	}

	public getIconStyle(index: number) {
		const voidColor = this.rateDisabled ? this.disabledVoidColor : this.voidColor;
		return `color: ${index <= this.value - 1 ? this.colors[index] : voidColor}`;
	}

	/**
	 * 获取图标渲染
	 * @param index
	 */
	public getRateRender(index: number) {
		return this.rateList[index] || null;
	}

	/**
	 * 设置值
	 * @param index
	 * @param event
	 */
	public setCurrentValue(index: number, event: MouseEvent) {
		if (this.rateDisabled) {
			return;
		}
		const target: HTMLElement = event.target as HTMLElement;
		const value = Number(target.dataset["rate"]) + 1;
		if (this.allowHalf) {
			this.pointerAtLeftHalf = event.offsetX * 2 <= target.clientWidth;
			this.value = this.pointerAtLeftHalf ? value - 0.5 : value;
		}

		this.setRateValue(value);
		this.currentValue = value;
		this.hoverIndex = value;
	}

	/**
	 * 重置
	 */
	public resetCurrentValue() {
		if (this.rateDisabled) {
			return;
		}
		if (this.allowHalf) {
			this.pointerAtLeftHalf = this.value !== Math.floor(this.value);
		}
		this.currentValue = this.value;
		this.hoverIndex = -1;
	}

	/**
	 * 选择
	 * @param item
	 * @param event
	 */
	public selectValue(item: number, event: Event) {
		if (this.rateDisabled) {
			return;
		}
		if (this.allowHalf && this.pointerAtLeftHalf) {
			DOMEmit(this, "change", { detail: { value: this.currentValue } });
		} else {
			DOMEmit(this, "change", { detail: { value: this.value } });
		}
	}

	/**
	 * 设置值
	 * @param value
	 */
	public setRateValue(value: number) {
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
		this.timeout = setTimeout(() => {
			this.value = value;
		}, 100);
	}

	/**
	 * 键盘操作
	 * @param e
	 */
	public handleKey(e: MouseEvent) {
		if (this.rateDisabled) {
			return;
		}
		let currentValue = this.currentValue;
		const keyCode = (e as any).keyCode;
		if (keyCode === 38 || keyCode === 39) {
			// left / down
			if (this.allowHalf) {
				currentValue += 0.5;
			} else {
				currentValue += 1;
			}
			e.stopPropagation();
			e.preventDefault();
		} else if (keyCode === 37 || keyCode === 40) {
			if (this.allowHalf) {
				currentValue -= 0.5;
			} else {
				currentValue -= 1;
			}
			e.stopPropagation();
			e.preventDefault();
		}
		currentValue = currentValue < 0 ? 0 : currentValue;
		currentValue = currentValue > this.max ? this.max : currentValue;
	}

	public render() {
		return html`
			<div
				class="q-rate"
				onKeydown=${(event: MouseEvent) => this.handleKey(event)}
				role="slider"
				aria-valuenow=${this.currentValue}
				aria-valuetext=${this.text}
				aria-valuemin="0"
				aria-valuemax=${this.max}
				tabindex="0"
				id="rate"
			>
				${this.valueList.map((item, index) => {
					return html`
						<span
							data-rate=${index}
							class="q-rate_item"
							@mousemove=${(event: MouseEvent) => this.setCurrentValue(index, event)}
							@mouseleave=${(event: MouseEvent) => this.resetCurrentValue()}
							@click=${(event: MouseEvent) => this.selectValue(index, event)}
							style="cursor:  ${this.rateDisabled ? "auto" : "pointer"}"
							key=${index}
						>
							<i
								data-rate=${index}
								class="q-rate_icon ${this.hoverIndex === index + 1 ? "hover" : ""}"
								style=${`${this.getIconStyle(index)}`}
							>
								${this.getRateRender(index)}
							</i>
						</span>
					`;
				})}
				${this.showText || this.showScore ? html`<span class="q-rate_text" style=${`color :${this.textColor}`}> ${this.text} </span>` : null}
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"q-rate": QRate;
	}
}

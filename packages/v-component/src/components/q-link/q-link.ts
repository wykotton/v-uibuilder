import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { extractClass } from "../../common";
import { changeProperty, DOMEmit } from "../../types/runtime/decorators/decorators";
import cssIndex from "./index.scss?inline";

type ButtonType = "primary" | "success" | "warning" | "danger" | "info";

@customElement("q-link")
export class QLink extends LitElement {
	constructor() {
		super();
	}

	static styles = [
		css`
			${unsafeCSS(cssIndex)}
		`,
	];

	// 链接类型
	@property({ type: String, attribute: "type" })
	public type: ButtonType = "primary";

	// 链接名称
	@changeProperty()
	@property({ type: String })
	public name!: string;

	// 是否具有下划线
	@changeProperty()
	@property({ type: Boolean })
	public underline: Boolean = false;

	// 是否可选择
	@property({ type: Boolean })
	public disabled: Boolean = false;

	// 链接路径
	@changeProperty()
	@property({ type: String })
	public href: String = "javascript:void 0";

	@DOMEmit('click')
	public handleClick(e: Event) {
		return e;
	}

	public render() {
		return html`
			<a
				class=${extractClass({}, "q-link", {
					["q-link-" + this.type]: this.type,
					"is-disabled": this.disabled,
					"is-underline": !this.disabled && this.underline,
				})}
				href=${this.href}
			>
				<slot name="prefix"></slot>
				<slot></slot>
				<slot name="suffix"></slot>
			</a>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"q-link": QLink;
	}
}

import { css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { extractClass } from "../../common";
import { Component } from "../../types/runtime/Component";
import { DOMEmit } from "../../util/reactivity/Emit";
import { booleanTransform } from "../../util/utils";
import cssIndex from "./index.scss?inline";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { IMessage } from "../../types/runtime/IMessage";
import { isEqual } from "lodash-es";
@customElement("q-switch")
export class QSwitch extends Component {

	componentModel!: ComponentModel;
	constructor() {
		super();
		this.initModel();
	}

	static styles = [
		css`
			${unsafeCSS(cssIndex)}
		`,
	];

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
	public value = false;

	@property({
		type: Boolean,
		converter(value, type?) {
			return booleanTransform(value);
		},
	})
	public activeValue = true;

	@property({ type: String })
	public activeColor = "#409EFF";

	@property({ type: String })
	public inactiveColor = "#C0CCDA";

	@property({ type: String })
	public name = "QSwitch";

	@property({ type: String })
	public label = "";

	@property({
		type: Boolean,
		converter(value, type?) {
			return booleanTransform(value);
		},
	})
	public inactiveValue = false;

	@property({ type: Number })
	public width = 40;

	@property({
		type: Boolean,
		converter(value, type?) {
			return booleanTransform(value);
		},
	})
	public validateEvent = true;

	public handleChange() {
		const inputRef = this.shadowRoot?.querySelector(".q-switch_input") as HTMLInputElement;
		setTimeout(() => {
			inputRef.checked = !inputRef.checked;
			this.value = inputRef.checked;
			DOMEmit(this, "change", { detail: { value: this.value } });
			this.onSendMessage("change");
		}, 0);
	}

	public switchValue() {
		!this.disabled && this.handleChange();
	}


	public render() {
		return html`<div
			class=${extractClass({}, "q-switch", {
				"is-disabled": this.disabled,
				"is-checked": this.value,
			})}
			role="switch"
			aria-checked=${this.value}
			aria-disabled=${this.disabled}
			@click=${this.switchValue.bind(this)}
		
		>
			<input
				class="q-switch_input"
				type="checkbox"
				id=${this.id}
				name=${this.name}
				true-value=${this.activeValue}
				false-value=${this.inactiveValue}
				disabled=${this.disabled}
				@keydown=${this.switchValue.bind(this)}
			/>
			<span
				class="q-switch_core"
				style=${`width: ${this.width + "px"};
					border-color: ${this.value ? this.activeColor : this.inactiveColor};
					background-color: ${this.value ? this.activeColor : this.inactiveColor}`}
			></span>
			${this.label ? html`<span>${this.label}</span>` : html`<slot></slot>`}
		</div>`;
	}

	initModel(): void {
		const self = this;
		this.componentModel = new ComponentModel({
			el: this as unknown as HTMLElement,
			model: {
				_iovSchema: {
					get componentName() {
						return "q-switch";
					},
					get type() {
						return EComponentType.TEXT;
					},
					get text() {
						return "开关";
					},
					get group() {
						return [EComponentGroup.BASIC];
					},
					get image() {
						return "";
					},
					get description() {
						return "需要表示开关状态/两种状态之间的切换时；";
					},
					get version() {
						return "1.0.0";
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
								text: "点击",
								eventType: "change",
								messageSchema: "",
								messageDemo: "",
							},
							{
								text: "数据变更",
								eventType: "change",
								messageSchema: "",
								messageDemo: "",
							},
						],
					},
					optionsView: {
						model: {
							description: "组件model",
							type: "object",
							properties: {
								name: {
									type: "string",
									description: "组件名称",
								},
								label: {
									type: "string",
									description: "label",
								},
								activeValue: {
									type: "string",
									description: "激活值",
								},
								inactiveValue: {
									type: "string",
									description: "未激活值",
								},
								width: {
									type: "number",
									description: "组件宽度",
								},
								disabled: {
									type: "boolean",
									description: "是否禁用",
								},
								value: {
									type: "boolean",
									description: "开/关",
								},
								activeColor: {
									type: "string",
									description: "激活颜色",
									format: "color",
								},
								inactiveColor: {
									type: "string",
									description: "未激活颜色",
									format: "color",
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
						function (e:IMessage) {
							// @ts-ignore
							if(typeof e.body === "boolean") this.value = e.body;
						},
					],
				},
				_onDOMEvent: {
					click: [
						function (e: Event) {
						},
					],
					dblclick: [
						function (e: Event) {
						},
					],
				},
				_initStyle: "height:30px;width:50px;",
				_onWatchSetting: {},
				_lifeCycle: {
					created: function () {
					},
					updated: function () {
					},
					destroy: function () {
					},
				},
				get name() {
					return self.name;
				},
				set name(value) {
					if (value === self.name) return
					self.name = value;
				},
				get disabled() {
					return self.disabled;
				},
				set disabled(value) {
					if (value === self.disabled) return
					self.disabled = value;
				},
				get value() {
					return self.value;
				},
				set value(value) {
					if (value === self.value) return
					self.value = value;
				},
				get activeValue() {
					return self.activeValue;
				},
				set activeValue(value) {
					if (value === self.activeValue) return
					self.activeValue = value;
				},
				get activeColor() {
					return self.activeColor;
				},
				set activeColor(value) {
					if (value === self.activeColor) return
					self.activeColor = value;
				},
				get inactiveColor() {
					return self.inactiveColor;
				},
				set inactiveColor(value) {
					if (value === self.inactiveColor) return
					self.inactiveColor = value;
				},
				get label() {
					return self.label;
				},
				set label(value) {
					if (value === self.label) return
					self.label = value;
				},
				get inactiveValue() {
					return self.inactiveValue;
				},
				set inactiveValue(value) {
					if (value === self.inactiveValue) return
					self.inactiveValue = value;
				},
				get width() {
					return self.width;
				},
				set width(value) {
					if (value === self.width) return
					self.width = value;
				},
				get validateEvent() {
					return self.validateEvent;
				},
				set validateEvent(value) {
					if (value === self.validateEvent) return
					self.validateEvent = value;
				},
				_eventInterception: {},
			} as unknown as ISchema,
		});
	}

	onSendMessage(type: string) {
		const message: IMessage = {
			header: {
				src: this.id,
				dst: "",
				srcType: type,
				dstType: "",
			},
			body: {checked: this.value, value: this.value ? this.activeValue : this.inactiveValue}
		};
		this.componentModel.sendMessage(message);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"q-switch": QSwitch;
	}
}

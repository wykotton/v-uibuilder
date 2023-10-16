import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Component } from "../../types/runtime/Component";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { ISchema } from "../../types/runtime/IModelSchema";
import { IQDepotOptions } from "./IQDepot";
// import { QText } from "../../../dist/assets"

/**
 * 仓库协议组件
 *
 */
@customElement("q-depot")
export class QDepot extends Component {
	static styles = css`
		:host {
			display: block;
		}
		p {
			margin: 0;
		}
	`;

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	/**
	 * 绑定data数据
	 */
	@property({ type: Object, attribute: "data-data" })
	data: IQDepotOptions[] = [{
		componentName: "q-text",
		componentPath: {},
		text: "",
		image: "",
		type: "",
		group: [],
		description: "",
		options: {} as ISchema,
	}];

	/**
	 * 数据模型
	 */
	componentModel!: ComponentModel;

	constructor() {
		super();
		this.initModel();
	}

	render() {
		console.log(21)
		return html`<p>组件仓库</p>`;
	}

	initModel(): void {
		const self = this;

		this.componentModel = new ComponentModel({
			el: this as unknown as HTMLElement,
			model: {
				get componentName() {
					return "q-depot";
				},
				get type() {
					return "组件仓库";
				},
				get text() {
					return "组件仓库";
				},
				get group() {
					return ["组件仓库"];
				},
				get image() {
					return "";
				},
				get description() {
					return "组件仓库组件,可以读取子应用中所有的组件";
				},
				get schema() {
					return {
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
									messageDemo: "组件仓库1",
								},
							],
						},
						optionsView: {
							list: [
								{
									type: "input",
									label: "输入框",
									options: {
										type: "text",
										width: "100%",
										defaultValue: "",
										placeholder: "请输入",
										clearable: false,
										maxLength: 0,
										prepend: "",
										append: "",
										tooptip: "",
										hidden: false,
										disabled: false,
										dynamicHide: false,
										dynamicHideValue: "",
									},
									model: "text",
									key: "text",
									rules: [
										{
											required: false,
											message: "必填项",
											trigger: ["blur"],
										},
									],
								},
							],
						},
					};
				},
				_onMessageMeta: {
					changeInfo: [
						function (e: IMessage) {
							console.log(e, self);
						},
					],
				},
				_onDOMEvent: {
					onclick: [function (e: Event) {
						console.log(e);
					}],
				},
				_onWatchSetting: {
					data: [
						function (newVal: any, oldVal: any, context: any) {
							console.log(newVal, oldVal, context);
						},
					],
				},
				get data() {
					return self.data;
				},
				set data(value) {
					self.data = value;
				},
			} as unknown as ISchema,
		})
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"q-depot": QDepot;
	}
	const resloveComponent: any;
}
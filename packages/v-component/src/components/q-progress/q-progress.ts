import { css, LitElement, unsafeCSS, html } from "lit";
import { customElement, query, property } from "lit/decorators.js";
import { cloneDeep, isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createApp, defineComponent, ref, watch} from "vue";
import antdCss from "ant-design-vue/dist/antd.css?inline";
import cssIndex from "./index.scss?inline";
import { Progress } from "ant-design-vue";
import { booleanTransform } from "../../util/utils";
/**
 * 步骤条
 */
@customElement("q-progress")
export class QProgress extends LitElement {
	static styles = [css`
    ${unsafeCSS(cssIndex)}
  `,
		css`
      ${unsafeCSS(antdCss)}
    `];

	@query(".vue-com-container")
	vueComWrapper!: HTMLDivElement;

	@property()
	percent = 50;
	@property()
	size = "small";
	@property()
	status = "normal";
	@property({
		type: Boolean,
		converter(value, type?) {
			return booleanTransform(value);
		},
	})
	showInfo = true;
	@property()

	type = "line"

	// 进度条颜色
	@property()
	strokeColor = "#1890ff"

	// 未完成分段颜色
	@property()
	trailColor = "#f5f5f5"

	// 总步数
	@property()
	steps = 0

	@property()
	strokeWidth =10


	// 进度条样式
	@property()
	strokeLinecap = "round"

	@property()
	// @ts-ignore
	infoFormat = (percent, successPercent) => percent + "%"

	@property()
	progressTitle = ""
	/**
	 * 组件实例
	 */
	componentInstance: any = null;

	/**
	 * 数据模型
	 */
	componentModel!: ComponentModel;

	constructor() {
		super();
		this.initModel();
	}


	async connectedCallback() {
		super.connectedCallback();
		await this.updateComplete;
		this.createVueComponent();
	}

	/**
	 * 同步设置属性编辑器里属性
	 * @param type
	 * @param value
	 */
	setWebcomponentData(type: string, value: any) {
		this[type] = value;
	}


	updatePercent(type: string,v: number){
		let tempValue = this.percent
		switch (type) {
			case "increase":
				if(!v){
					tempValue += 1
				}else {
					tempValue = v
				}
				break
			case "decrease":
				if(!v){
					tempValue -= 1
				}else {
					tempValue = v
				}
				break
		}
		this.percent = tempValue
		this.setVueComponentData("percent", tempValue)
	}

	setValue(v: number) {
		try {
			this.percent = v
			this.setVueComponentData("percent", cloneDeep(v))
		}catch (e) {
			console.log(e);
		}
	}

	/**
	 * 创建树VUE组件
	 */
	createVueComponent = () => {
		const self = this;
		const component = defineComponent({
			// :loading="loading"  :paragraph="{ rows: rows }"
			template: `
				<a-progress :percent="percent" :format="infoFormat" :title="progressTitle" :size="size" :strokeWidth="strokeWidth" :status="status" :showInfo="showInfo" :type="type" :strokeColor="strokeColor" :trailColor="trailColor" :steps="steps" :strokeLinecap="strokeLinecap"/>
      `,
			name: "q-skeleton",
			props: {},
			components: {},
			setup(props: any, context: any) {

				const percent = ref(self.percent);
				const size = ref(self.size);
				const status = ref(self.status);
				const showInfo = ref(self.showInfo);
				const type = ref(self.type);
				const strokeColor = ref(self.strokeColor);
				const trailColor = ref(self.trailColor);
				const steps = ref(self.steps);
				const strokeLinecap = ref(self.strokeLinecap);
				const strokeWidth = ref(self.strokeWidth);
				const progressTitle = ref(self.progressTitle);
				const infoFormat = ref(self.infoFormat);


				watch(percent, (v) => {
					self.onSendMessage("change", v)
				})
				/**
				 * 监听timeline属性变更
				 */
				function watchAttributeChange(type: string, value: any) {
					console.log("触发更新");
					// @ts-ignore
					this[type] = value;
				}

				function backTopClick() {
					self.onSendMessage("click", "");
				}


				return {
					props,
					percent,
					size,
					status,
					showInfo,
					type,
					strokeColor,
					trailColor,
					steps,
					progressTitle,
					strokeLinecap,
					infoFormat,
					strokeWidth,
					backTopClick,
					watchAttributeChange
				};
			}
		});

		this.componentInstance = createApp(component);
		this.componentInstance.use(Progress);
		this.componentInstance.mount(this.vueComWrapper);
	};


	/**
	 * 数据路由
	 * @param type
	 * @param value
	 */
	onSendMessage(type: string, value: any): void {
		const message: IMessage = {
			header: {
				src: this.id,
				dst: "",
				srcType: type,
				dstType: ""
			},
			body: value
		};

		this.componentModel.sendMessage(message);
	}

	/**
	 * 更新vue组件实例数据
	 * @param type
	 * @param value
	 */
	setVueComponentData(type: string, value: any) {
		if (this.componentInstance && this.componentInstance?._instance?.proxy?.watchAttributeChange) {
			this.componentInstance._instance.proxy.watchAttributeChange(type, value);
		}
	}

	attributeChangedCallback(name: string, _old: string | null, value: string | null) {
		super.attributeChangedCallback(name, _old, value);
		// 同步更新到 vue组件内
		this.setVueComponentData(name, this[name])
	}

	render() {
		return html`
				<style>
					.ant-progress-text {
						margin-left: 3px !important;
					}
				</style>
    		<div class="vue-com-container" style="width: 100%;height:100%"></div>
    `;
	}


	initModel(): void {
		const self = this;
		this.componentModel = new ComponentModel({
			el: this as unknown as HTMLElement,
			model: {
				_iovSchema: {
					get componentName() {
						return "q-progress";
					},
					get type() {
						return EComponentType.TEXT;
					},
					get text() {
						return "进度条";
					},
					get group() {
						return [EComponentGroup.BASIC];
					},
					get image() {
						return "";
					},
					get description() {
						return "展示操作的当前进度。";
					},
					get version() {
						return "1.0.0";
					},
					eventSpecification: {
						inputMessage: [
							{
								text: "增加",
								eventType: "increase",
								messageSchema: "",
								messageDemo: ""
							},
							{
								text: "减少",
								eventType: "decrease",
								messageSchema: "",
								messageDemo: ""
							},
							{
								text: "赋值",
								eventType: "setValue",
								messageSchema: "",
								messageDemo: ""
							}
						],
						outputMessage: [
							{
								text: "值变更",
								eventType: "change",
								messageSchema: "",
								messageDemo: ""
							},
							{
								text: "点击事件",
								eventType: "click",
								messageSchema: "",
								messageDemo: ""
							}
						]
					},
					optionsView: {
						model: {
							description: "组件model",
							type: "object",
							properties: {
								type: {
									type: "string",
									description: "类型",
									enum: [{value:"line",label: "线"},{value:"circle",label: "圆"} , {value:"dashboard",label: "仪表盘"}]
								},
								percent: {
									type: "number",
									description: "进度百分比",
									minimum: 0,
									maximum: 100
								},
								size: {
									type: "string",
									description: "尺寸",
									enum: [{value: "small", label: "小"},{value: "default", label: "默认"}]
								},
								strokeLinecap: {
									type: "string",
									description: "进度条样式",
									enum: [{value: "round", label: "圆形"},{value: "square", label: "正方形"}]
								},
								status: {
									type: "string",
									description: "状态",
									enum: [{value: "success", label: "完成"},{value: "exception", label: "异常"},{value: "normal", label: "正常"},{value: "active", label: "激活（仅线类型生效）"}]
								},
								showInfo: {
									type: "boolean",
									description: "是否显示进度数值或状态图标"
								},
								strokeColor: {
									type: "string",
									description: "进度条的色彩",
									format: "color"
								},
								trailColor: {
									type: "string",
									description: "未完成的分段的颜色",
									format: "color"
								},
								progressTitle: {
									type: "string",
									description: "鼠标移入显示",
								},
								steps: {
									type: "number",
									description: "进度条总共步数（仅线类型生效）",
									minimum:0
								},
								strokeWidth: {
									type: "number",
									description: "进度条线宽（仅线类型生效）",
									minimum:0
								},
								// infoFormat: {
								// 	type: "string",
								// 	description: "进度条值格式化",
								// 	format: "code"
								// }
							}
						}
					}
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
					increase: [
						function(e: IMessage) {
							// @ts-ignore
							this.updatePercent("increase",e.body)
						}
					],
					decrease: [
						function(e: IMessage) {
							// @ts-ignore
							this.updatePercent("decrease",e.body)
						}
					],
					setValue: [
						function(e: IMessage) {
							// @ts-ignore
							this.setValue(e.body)
						}
					],
				},
				_onDOMEvent: {
					click: [
						function(e: Event) {
							console.log(e);
						}
					],
					dblclick: [
						function(e: Event) {
							console.log(e, "dblclick");
						}
					]
				},
				_initStyle: "height:100px;width:200px;overflow:auto",
				_onWatchSetting: {},
				_lifeCycle: {
					created: function() {
					},
					updated: function() {
					},
					destroy: function() {
					}
				},
				_eventInterception: {},
				get type() {
					return self.type;
				},
				set type(value) {
					if (value !== self.type) {
						self.type = value;
						self.setVueComponentData("type", cloneDeep(value));
					}
				},
				get percent() {
					return self.percent;
				},
				set percent(value) {
					if (value !== self.percent) {
						self.percent = value;
						self.setVueComponentData("percent", cloneDeep(value));
					}
				},
				get size() {
					return self.size;
				},
				set size(value) {
					if (value !== self.size) {
						self.size = value;
						self.setVueComponentData("size", cloneDeep(value));
					}
				},
				get strokeLinecap() {
					return self.strokeLinecap;
				},
				set strokeLinecap(value) {
					if (value !== self.strokeLinecap) {
						self.strokeLinecap = value;
						self.setVueComponentData("strokeLinecap", cloneDeep(value));
					}
				},
				get status() {
					return self.status;
				},
				set status(value) {
					if (value !== self.status) {
						self.status = value;
						self.setVueComponentData("status", cloneDeep(value));
					}
				},
				get showInfo() {
					return self.showInfo;
				},
				set showInfo(value) {
					if (value !== self.showInfo) {
						self.showInfo = value;
						self.setVueComponentData("showInfo", cloneDeep(value));
					}
				},
				get strokeColor() {
					return self.strokeColor;
				},
				set strokeColor(value) {
					if (value !== self.strokeColor) {
						self.strokeColor = value;
						self.setVueComponentData("strokeColor", cloneDeep(value));
					}
				},
				get trailColor() {
					return self.trailColor;
				},
				set trailColor(value) {
					if (value !== self.trailColor) {
						self.trailColor = value;
						self.setVueComponentData("trailColor", cloneDeep(value));
					}
				},
				get steps() {
					return self.steps;
				},
				set steps(value) {
					if (value !== self.steps) {
						self.steps = value;
						self.setVueComponentData("steps", cloneDeep(value));
					}
				},
				get strokeWidth() {
					return self.strokeWidth;
				},
				set strokeWidth(value) {
					if (value !== self.strokeWidth) {
						self.strokeWidth = value;
						self.setVueComponentData("strokeWidth", cloneDeep(value));
					}
				},
				get progressTitle() {
					return self.progressTitle;
				},
				set progressTitle(value) {
					if (value !== self.progressTitle) {
						self.progressTitle = value;
						self.setVueComponentData("progressTitle", cloneDeep(value));
					}
				},
				get infoFormat() {
					return self.infoFormat;
				},
				set infoFormat(value) {
					if (value !== self.infoFormat) {
						self.infoFormat = value;
						self.setVueComponentData("infoFormat", cloneDeep(value));
					}
				},

			} as unknown as ISchema
		});
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"q-progress": QProgress;
	}
}

const value = {
	description: null,
	maximum: null,
	minimum: null,
	enum: [],
};
const attr = {
	description: {
		description: "描述",
		type: "string",
	},
	maximum: {
		description: "最大值",
		type: "number",
	},
	minimum: {
		description: "最小值",
		type: "number",
	},
	enum: {
		description: "枚举",
		type: "textarea",
	},
};
const wrapper = { value, attr };
export default wrapper;

const value = {
	description: null,
	maxLength: null,
	minLength: null,
	format: "text",
	enum: [],
};
const attr = {
	description: {
		description: "描述",
		type: "string",
	},
	maxLength: {
		description: "最大字符数(仅文本有效)",
		type: "number",
	},
	minLength: {
		description: "最小字符数(仅文本有效)",
		type: "number",
	},
	format: {
		description: "格式",
		type: "string",
		enum: ["text", "textarea", "date", "date-time", "color", "code"],
	},
	enum: {
		description: "枚举",
		type: "string",
		format: "textarea",
	},
};
const wrapper = { value, attr };
export default wrapper;

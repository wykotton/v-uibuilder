const value = {
	description: null,
	items: {},
};
const attr = {
	description: {
		description: "描述",
		type: "string",
	},
	items: {
		description: "数组子项",
		type: "string",
		custom: true,
	},
};
const wrapper = { value, attr };
export default wrapper;

import { version } from "../../package.json";

// Mapping the first sub link to the nav link to avoid 404 error.
function getNav() {
	return [
		{
			text: "UIB指南",
			link: "/guide/what-is-uibuilder",
			activeMatch: "/guide/",
		},
		{
			text: "组件",
			link: "/component/q-text",
			activeMatch: "/component/",
		},
		{
			text: `v${version}`,
			items: [
				{
					text: "Changelog",
					link: "https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md",
				},
				{
					text: "Contributing",
					link: "https://github.com/vuejs/vitepress/blob/main/.github/contributing.md",
				},
			],
		},
	];
}

export const nav = getNav();

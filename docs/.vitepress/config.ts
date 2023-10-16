import { nav } from "./config/nav";
import { sidebar } from "./config/sidebars";
// import { mdPlugin } from "./config/plugins";
import type { UserConfig } from "vitepress"; 

export const config: UserConfig = {
	title: "UIBuilder",
	description: "一个可视化低代码平台",
	lang: "zh-CN",
	lastUpdated: true,
	themeConfig: {
		// 展示搜索框
		algolia: {
			appKey: "",
			indexName: "",
			searchParameters: {
				faeFilters: ["tags:guide,api"],
			},
		},
		logo: "/images/ui-builder-logo.svg",
		lastUpdatedText: "最后更新时间",
		outlineTitle: "本页面",
		siteTitle: false,
		nav,
		sidebar,
		docFooter: {
			prev: "上一部分",
			next: "下一部分",
		},
		footer: {
			message: "Released under the MIT License.",
			copyright: "上海直真君智科技有限公司 2022 ALL RIGHTS RESERVED",
		},
	},
	markdown: {
		config: (md) => {
			const { demoBlockPlugin } = require("vitepress-theme-demoblock");
			md.use(demoBlockPlugin);
		},
		// config: (md) => mdPlugin(md),
		lineNumbers: false,
	},
};

export default config;

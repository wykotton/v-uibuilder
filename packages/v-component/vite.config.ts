import vue from "@vitejs/plugin-vue";
import { join, resolve } from "path";
import type { ConfigEnv, UserConfig } from "vite";
import { defineConfig, loadEnv } from "vite";
import { useBuildComponent } from "./build/build"; 
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import  {  viteStaticCopy  }  from  "vite-plugin-static-copy";
// import { replaceCodePlugin } from "vite-plugin-replace";


const componentsEntry = useBuildComponent(join(__dirname, "src/components/"));
const pluginsEntry = useBuildComponent(join(__dirname, "src/plugins/"));
const buildFN = (mode): any => {
	switch (mode) {
		case "model":
			return {
				lib: {
					name: "Quick",
					entry: "./src/types/runtime/ComponentModel.ts",
					formats: ["es"],
				},
				manifest: false,
				outDir: "dist/",
				assetsDir: "assets",
				rollupOptions: {
					// external: /^lit/,
					output: {
						entryFileNames: `assets/[name].js`,
						chunkFileNames: `assets/[name].js`,
						assetFileNames: `assets/[name].[ext]`,
					},
				},
				commonjsOptions: {
					esmExternals: true
				},
			};
		case "plugins":
			return {
				rollupOptions: {
					// external: /^lit/,
					input: {
						...pluginsEntry
					},
					output: {
						format: "esm",
						exports: "auto",
						dir: "dist3",
						esModule: true,
						namespaceToStringTag: false,
						entryFileNames: `assets/[name].js`,
						chunkFileNames: `assets/[name].js`,
						assetFileNames: `assets/[name].[ext]`,
					},
				},
			};
		default:
			return {
				rollupOptions: {
					// external: /^lit/,
					input: {
						...componentsEntry,
						...pluginsEntry
					},
					output: {
						format: "esm",
						exports: "auto",
						dir: "dist2",
						esModule: true,
						namespaceToStringTag: false,
						entryFileNames: `assets/[name].js`,
						chunkFileNames: `assets/[name].js`,
						assetFileNames: `assets/[name].[ext]`,
					},
				},
				commonjsOptions: {
					esmExternals: true
				},
			};
	}
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {

	const env = loadEnv(mode, process.cwd());

	return {
		// micro App 子应用配置
		base: `/v-component/`,
		server: {
			port: 3000,
			proxy: {
				"/v-component/assets": {
					target: "http://localhost:3000/",
					changeOrigin: true,
					rewrite: (path) => path.replace("/v-component", "/v-component/dist2"),
				},
			},
		},
		plugins: [
			vue({
				template: {
					compilerOptions: {
						isCustomElement: (tag) => tag.startsWith("q-"),
					},
				},
			}),
			// @ts-ignore 
			// (function () {
			// 	return {
			// 		...replaceCodePlugin({
			// 			replacements: [
			// 				{
			// 					from: "customElement(",
			// 					to: "//customElement(",
			// 				}
			// 			]
			// 		}),
			// 		apply: "build",
			// 	}
			// })(),
			// 自定义插件
			(function () {
				let basePath = "";
				return {
					name: "vite:micro-app",
					apply: "build",
					configResolved(config) {
						basePath = `${config.base}${config.build.assetsDir}/`;
					},
					// writeBundle(options, bundle) {
					// 	for (const chunkName in bundle) {
					// 		if (Object.prototype.hasOwnProperty.call(bundle, chunkName)) {
					// 			const chunk = <any>bundle[chunkName];
					// 			if (chunk.fileName && chunk.fileName.endsWith(".js")) {
					// 				chunk.code = chunk.code.replace(/(from|import\()(\s*['"])(\.\.?\/)/g, (all, $1, $2, $3) => {
					// 					return all.replace($3, new URL($3, basePath));
					// 				});
					// 				const fullPath = join(options.dir, chunk.fileName);
					// 				writeFileSync(fullPath, chunk.code);
					// 			}
					// 		}
					// 	}
					// },
				};
			})(),
			Components({
				resolvers: [AntDesignVueResolver()],
				dts: "./src/types/components.d.ts",
			}),
			viteStaticCopy ( { 
				targets : [ 
				  { 
					src : "./demo2.html" , 
					dest : "../dist2/",
					rename : "index.html"
				  } 
				] 
			  } ) 
		],
		build: buildFN(mode),
		resolve: {
			alias: {
				vue: resolve(__dirname, "node_modules/vue/dist/vue.esm-browser.js"),
			},
		},
	}
});

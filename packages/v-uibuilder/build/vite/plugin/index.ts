import { ViteEnv } from "@/types/global";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { PluginOption } from "vite";
import WindiCSS from "vite-plugin-windicss";
import { configHtmlPlugin } from "./html";
// import sentryVitePlugin from "@sentry/vite-plugin";

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => /^q-/.test(tag),
        },
      },
    }),
    vueJsx(),
    WindiCSS(),
    Components({
      resolvers: [AntDesignVueResolver()],
      dts: "./src/types/components.d.ts",
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      imports: [
        // presets
        "vue",
        "vue-router",
      ],
      eslintrc: {
        enabled: false,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: true,
      },
      resolvers: [
        /* ... */
      ],
      // 声明文件生成位置和文件名称
      dts: "./src/types/auto-imports.d.ts",
    }),

    // Put the Sentry vite plugin after all other plugins
    // sentryVitePlugin({
    //   url: "http://192.168.21.46:9000/",
    //   org: "uibuilder",
    //   project: "v-uibuilder",

    //   // Specify the directory containing build artifacts
    //   include: "./dist",

    //   // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
    //   // and needs the `project:releases` and `org:read` scopes
    //   authToken: "ecc3c19e1dc34f4b8631a2c2abe0a09138619831bdb64791b5c895aa1231982f",

    //   // Optionally uncomment the line below to override automatic release name detection
    //   // release: "",
    // }),
  ];

  // vite-plugin-html
  isBuild && vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));

  return vitePlugins;
}

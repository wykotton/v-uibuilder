import { resolve } from "path";
import type { ConfigEnv, UserConfig } from "vite";
import { defineConfig, loadEnv } from "vite";
import { wrapperEnv } from "./build/utils";
import { createVitePlugins } from "./build/vite/plugin";
import { createDIProxy, proxyConfig } from "./proxy/proxy";

const viteresolve = {
  development: resolve(__dirname, "./src/utils/components.ts"),
  production: resolve(__dirname, "./src/utils/components_build.ts"),
};

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();

  const env = loadEnv(mode, root);

  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env);

  const isBuild = command === "build";

  return {
    base: "/",
    server: {
      port: 6086,
      open: true,
      proxy: {
        "/ui-builder": {
          target: "http://localhost:6086/",
        },
        "/v-component": {
          target: "http://localhost:3000/",
        },
        "/v-uibuilder-server": {
          // target: "http://192.168.21.251:3200",
          target: "http://localhost:3200",
          changeOrigin: true,
          rewrite: (path) => path.replace("/v-uibuilder-server", ""),
        },
        "/assets/flow-editor": {
          target: "http://192.168.21.17:5500/App/webComponets/",
        },
        "/v-file-server": {
          target: "http://localhost:3300",
          changeOrigin: true,
          rewrite: (path) => path.replace("/v-file-server", ""),
        },
        ...createDIProxy(proxyConfig),
      },
    },
    plugins: createVitePlugins(viteEnv, isBuild),
    build: {
      sourcemap: true, // Source map generation must be turned on
      rollupOptions: {
        external: [/^\/v-component\/.*/, /^\/dist2\/.*/],
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src/"),
        vue: resolve(__dirname, "node_modules/vue/dist/vue.esm-browser.js"),
        "@importcomponents": isBuild ? viteresolve.production : viteresolve.development,
        "@importallcomponents": isBuild ? "../src/types/global.d" : "@zzjz/v-component/src/main",
      },
    },
  };
});

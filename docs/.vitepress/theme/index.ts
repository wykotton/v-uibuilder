import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";
import { getAppEnvConfig } from "../../utils/env";

// const { VITE_SENTRY_DSN } = getAppEnvConfig();

// 使用vitepress-theme-demoblock主题，并注册组件(包含主题中默认的组件)。
import DefaultTheme from "vitepress/theme";
// import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';
// 主题样式
import "vitepress-theme-demoblock/dist/theme/styles/index.css";
/**
 * register-components.js使用脚本自动创建
 * // package.json
 * "scripts": {
    "register:components": "vitepress-rc"
    }
 */
import "./style.css";
// 插件的主题
import { useComponents } from "./register-components.js";

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    useComponents(ctx.app);

    // 监控初始化
    // Sentry.init({
    //   app: ctx.app,
    //   dsn: VITE_SENTRY_DSN,
    //   integrations: [
    //     new BrowserTracing({
    //       // routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    //       tracePropagationTargets: ["localhost", /^\//],
    //     }),
    //   ],
    //   tracesSampleRate: 1.0,
    //   logErrors: true,
    // });
  },
  // enhanceApp({ app }) {
  // 	// app.use(Antd)
  // 	registerComponents(app);
  // },
};

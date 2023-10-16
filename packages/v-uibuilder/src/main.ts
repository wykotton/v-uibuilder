import microApp from "@micro-zoe/micro-app";
import "virtual:windi.css";
import { createApp } from "vue";
import App from "./App.vue";
import { setupRouter, router } from "./router";
import { setupRouterGuard } from "./router/guard";
import { setupStore } from "./store";
// import * as Sentry from "@sentry/vue";
// import { BrowserTracing } from "@sentry/tracing";
// import { getAppEnvConfig } from "./utils/env";
// import "@zzjz/v-component/src/main";
import "@importallcomponents";
import "@importcomponents";
import "./style.css";
import "@/css/var.scss";
import "@/utils/font/iconfont";

// const { VITE_SENTRY_DSN } = getAppEnvConfig();

async function bootstrap() {
  const app = createApp(App);

  // Configure store
  // 配置 store
  setupStore(app);

  // Configure routing
  // 配置路由
  setupRouter(app);

  // router-guard
  // 路由守卫
  setupRouterGuard(router);

  // 监控初始化
  // Sentry.init({
  //   app,
  //   dsn: VITE_SENTRY_DSN,
  //   integrations: [
  //     new BrowserTracing({
  //       routingInstrumentation: Sentry.vueRouterInstrumentation(router),
  //       tracePropagationTargets: ["localhost", /^\//],
  //     }),
  //   ],
  //   tracesSampleRate: 1.0,
  //   logErrors: true,
  // });

  // 节点挂载
  app.mount("#app");

  // 微前端启动
  microApp.start();
  window[`microApp`] = microApp;
}

bootstrap().then((r) => {});

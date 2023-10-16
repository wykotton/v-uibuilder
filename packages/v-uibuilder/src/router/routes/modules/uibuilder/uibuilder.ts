import { LAYOUT } from "@/router/constant";

const edit = {
  path: "/uibuilder",
  name: "uibuilder",
  component: LAYOUT,
  redirect: "/uibuilder/workspace",
  children: [
    {
      path: "edit",
      name: "edit",
      component: () => import("@/pages/uibuilder/edit/index.vue"),
      meta: {
        keepAlive: false,
      },
    },
    {
      path: "setting",
      name: "setting",
      component: () => import("@/pages/uibuilder/setting/index.vue"),
      meta: {
        keepAlive: false,
      },
    },
    {
      path: "management",
      name: "management",
      component: () => import("@/pages/uibuilder/management/index.vue"),
      meta: {
        keepAlive: false,
      },
    },
    {
      path: "publish/:id(\\d+)",
      name: "publish",
      component: () => import("@/pages/uibuilder/publish/index.vue"),
      meta: {
        keepAlive: true,
      },
    },
    {
      path: "workspace",
      name: "workspace",
      component: () => import("@/pages/uibuilder/workspace/index.vue"),
      meta: {
        keepAlive: true,
      },
    },
    {
      path: "website",
      name: "website",
      component: () => import("@/pages/uibuilder/website/index.vue"),
      meta: {
        keepAlive: true,
      },
    },
    {
      path: "website-visit",
      name: "website-visit",
      component: () => import("@/pages/uibuilder/website/visit.vue"),
      meta: {
        keepAlive: true,
      },
    },
    {
      path: "preview-component",
      name: "preview-component",
      component: () => import("@/pages/uibuilder/workspace/preview/customComponent.vue"),
      meta: {
        keepAlive: false,
      },
    },
    {
      path: "preview-page",
      name: "preview-page",
      component: () => import("@/pages/uibuilder/workspace/preview/customPage.vue"),
      meta: {
        keepAlive: false,
      },
    },
  ],
};

export default edit;

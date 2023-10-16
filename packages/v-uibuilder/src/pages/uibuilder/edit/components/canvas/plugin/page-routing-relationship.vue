<template>
  <a-dropdown :trigger="['contextmenu']">
    <div ref="container" class="h-100vh w-100vw absolute"></div>
    <template #overlay>
      <a-menu>
        <a-menu-item key="1" @click="renderMethod">刷新</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script setup lang="ts">
import {
  blurSelectCom,
  focusSelectCom,
  changeRouterConfig,
  selectRouterConfig,
  getProjectList,
  getPageComponent,
  edgeMouseEnter,
  edgeMouseLeave,
} from "@/composition/index";
import { useAppStoreWithOut } from "@/store/modules/app";
import { IRouterTarget, IRouterTargetReceive } from "@/types/IConfigData";
import { EdgeInfo } from "@/types/IRouterConfig";
import { awaitTime } from "@/utils/utils";
import { DagreLayout } from "@antv/layout";
import { Graph, Shape } from "@antv/x6";
import { useEventListener } from "@vueuse/core";

interface MindMapData {
  id: string;
  type: "topic" | "topic-branch" | "topic-child";
  label: string;
  width: number;
  height: number;
  children?: MindMapData[];
}

// pinia
const useAppStore = useAppStoreWithOut();

const container = ref();
const renderMethod = ref();
const targetIsVisible = ref();
const graph = ref<Graph>();

const useCanvasCreation = () => {
  Graph.registerNode(
    "event",
    {
      inherit: "circle",
      attrs: {
        body: {
          strokeWidth: 2,
          stroke: "#5F95FF",
          fill: "#FFF",
        },
      },
    },
    true
  );

  Graph.registerNode(
    "activity",
    {
      inherit: "rect",
      markup: [
        {
          tagName: "rect",
          selector: "body",
        },
        {
          tagName: "image",
          selector: "img",
        },
        {
          tagName: "text",
          selector: "label",
        },
      ],
      attrs: {
        body: {
          rx: 6,
          ry: 6,
          stroke: "#5F95FF",
          fill: "#EFF4FF",
          strokeWidth: 1,
        },
        img: {
          x: 6,
          y: 6,
          width: 16,
          height: 16,
          "xlink:href": "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*pwLpRr7QPGwAAAAAAAAAAAAAARQnAQ",
        },
        label: {
          fontSize: 12,
          fill: "#262626",
          overFlow: "hidden",
        },
      },
    },
    true
  );

  Graph.registerEdge(
    "page-edge",
    {
      inherit: "edge",
      attrs: {
        line: {
          stroke: "#B0B0B0",
          strokeWidth: 2,
        },
      },
    },
    true
  );

  Graph.registerEdge(
    "router-edge",
    {
      inherit: "edge",
      attrs: {
        line: {
          stroke: "blue",
          strokeWidth: 2,
        },
      },
    },
    true
  );

  const getRouterInfo = async () => {
    const element: any = document.querySelector("q-router-config");
    const router = element?.value ?? {};
    while (!pageModel) {
      await awaitTime(500);
    }
    const project = await getProjectList();
    const { pageInfo, data } = getPageComponent(project);
    const currentPage = useAppStore?.pageInstance;

    if (currentPage?.id) {
      Object.entries(router as IRouterTarget[]).forEach(([key, current]) => {
        const { receive = [] } = current;
        receive.forEach((bindCurrent: IRouterTargetReceive) => {
          const { page, target } = bindCurrent;
          if (page && target) {
            const sourceId = pageInfo?.[String(currentPage.id)]?.[key]?.id || "";
            const sourceSrcId = pageInfo?.[String(currentPage.id)]?.[key]?.srcId || "";
            const targetId = pageInfo?.[page]?.[target]?.id || "";
            const targetSrcId = pageInfo?.[page]?.[target]?.srcId || "";
            if (sourceId && targetId && sourceSrcId && targetSrcId) {
              data.edges.push({
                id: `${sourceSrcId}|${page}|${targetSrcId}`,
                shape: "router-edge",
                source: {
                  cell: sourceId,
                  port: "port2",
                },
                target: {
                  cell: targetId,
                  port: "port1",
                },
              });
            }
          }
        });
      });
    }
    return data;
  };

  const createGraph = () => {
    if (graph.value) {
      graph.value.dispose();
    }
    graph.value = new Graph({
      container: container.value!,
      connecting: {
        snap: true,
        allowBlank: false,
        allowMulti: false,
        allowLoop: true,
        highlight: true,
        connector: "rounded",
        connectionPoint: "boundary",
        router: {
          name: "er",
          args: {
            direction: "V",
          },
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: "red",
                strokeWidth: 2,
                targetMarker: {
                  name: "classic",
                  size: 7,
                },
              },
            },
          });
        },
        validateConnection({ targetMagnet }) {
          if (!targetMagnet) {
            return false;
          }
          if (targetMagnet.getAttribute("port-group") !== "in") {
            return false;
          }
          // if (targetView) {
          //   const node: any = targetView.cell;
          //   if (node) {
          //     const portId = targetMagnet.getAttribute("port");
          //     console.log(portId);
          //     const usedInPorts = node.getUsedInPorts(graph);
          //     if (usedInPorts.find((port: any) => port && port.id === portId)) {
          //       return false;
          //     }
          //   }
          // }
          return true;
        },
      },
      selecting: {
        enabled: true,
      },
      keyboard: {
        enabled: true,
      },
      resizing: true,
      background: {
        color: "#f5f5f5",
      },
      grid: {
        visible: true,
      },
      scroller: {
        enabled: true,
        pageVisible: true,
        pageBreak: true,
        pannable: true,
      },
      mousewheel: {
        enabled: true,
        modifiers: ["ctrl", "meta"],
        minScale: 0.5,
        maxScale: 2,
      },
      highlighting: {
        magnetAvailable: {
          name: "stroke",
          args: {
            attrs: {
              fill: "#fff",
              stroke: "#47C769",
            },
          },
        },
        magnetAdsorbed: {
          name: "stroke",
          args: {
            attrs: {
              fill: "#fff",
              stroke: "#FF6940",
            },
          },
        },
      },
    });
  };

  const render = async () => {
    createGraph();
    const dagreLayout = new DagreLayout({
      type: "dagre",
      rankdir: "LR",
      align: "UR",
      ranksep: 35,
      nodesep: 15,
    });

    const model = dagreLayout.layout(await getRouterInfo());
    graph.value?.fromJSON(model);
    eventSetup();
  };

  const findItem = (
    obj: MindMapData,
    id: string
  ): {
    parent: MindMapData | null;
    node: MindMapData | null;
  } | null => {
    if (obj.id === id) {
      return {
        parent: null,
        node: obj,
      };
    }
    const { children } = obj;
    if (children) {
      for (let i = 0, len = children.length; i < len; i++) {
        const res = findItem(children[i], id);
        if (res) {
          return {
            parent: res.parent || obj,
            node: res.node,
          };
        }
      }
    }
    return null;
  };

  const eventSetup = () => {
    graph.value?.on("node:mouseenter", (e: any) => {
      focusSelectCom(e.node.store.data.srcId);
    });
    graph.value?.on("node:mouseleave", (e: any) => {
      blurSelectCom();
    });
    graph.value?.on("edge:connected", ({ edge }) => {
      changeRouterConfig(graph.value as Graph, edge);
    });
    graph.value?.on("edge:dblclick", ({ edge }) => {
      selectRouterConfig(graph.value as Graph, edge);
    });
    graph.value?.on("edge:mouseenter", ({ edge }) => {
      edgeMouseEnter(graph.value as Graph, edge);
    });
    graph.value?.on("edge:mouseleave", ({ edge }) => {
      edgeMouseLeave(edge);
    });
  };
  const destroy = () => {
    graph.value?.dispose();
  };
  return { render, destroy };
};

/**
 * 路由配置元件变更监听
 * 更新关系edge
 */
const cleanRouterChange = reactive({
  cleanUp: () => {},
});
function routerChange() {
  cleanRouterChange.cleanUp = useEventListener(window, "router:change", (e: any) => {
    try {
      e.detail.addEdge.forEach((item: EdgeInfo) => {
        graph.value?.addEdge({
          id: item.id,
          shape: "router-edge",
          source: {
            cell: item.source,
            port: "port2",
          },
          target: {
            cell: item.target,
            port: "port1",
          },
        });
      });
      e.detail.deleteEdge.forEach((item: EdgeInfo) => {
        graph.value?.removeCell(item.id);
      });
    } catch (error) {}
  });
}

watch(targetIsVisible, () => {
  console.log(targetIsVisible.value);
});

onMounted(async () => {
  const { render } = useCanvasCreation();
  render();
  renderMethod.value = render;
  routerChange();
});

onUnmounted(() => {
  const { destroy } = useCanvasCreation();
  destroy();
  cleanRouterChange.cleanUp();
});
</script>

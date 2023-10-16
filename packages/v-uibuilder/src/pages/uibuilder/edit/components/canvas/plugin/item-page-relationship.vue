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
import { workspaceGetProjectApi } from "@/api/uibuilder/workspace";
import { useAppStoreWithOut } from "@/store/modules/app";
import Hierarchy from "@antv/hierarchy";
import { Cell, Graph, Path } from "@antv/x6";
import { useRoute } from "vue-router";

interface MindMapData {
  id: string;
  type: "topic" | "topic-branch" | "topic-child";
  label: string;
  width: number;
  height: number;
  children?: MindMapData[];
}

interface HierarchyResult {
  id: string;
  x: number;
  y: number;
  data: MindMapData;
  children?: HierarchyResult[];
}

// pinia
const useAppStore = useAppStoreWithOut();
// 路由对象
const route = useRoute();

const container = ref();
const renderMethod = ref();

useAppStore.$subscribe((mutation: any) => {
  try {
    const { key = "", oldValue = "", newValue = "" } = mutation.events;
    if (!key || key !== "pageName" || oldValue === newValue) return;
    renderMethod.value?.();
  } catch (error) {}
});

/**
 * 获取项目列表
 */
async function getProjectList() {
  const { data: { results: [projectList = {}] } = { results: [] } } = await workspaceGetProjectApi(
    useAppStore?.pageInstance?.project_id
  );
  return projectList;
}

const useCanvasCreation = () => {
  let graph: Graph;

  // 中心主题或分支主题
  Graph.registerNode(
    "topic",
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
        label: {
          fontSize: 14,
          fill: "#262626",
        },
      },
    },
    true
  );

  // 子主题
  Graph.registerNode(
    "topic-child",
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
        label: {
          fontSize: 14,
          fill: "#262626",
        },
      },
    },
    true
  );

  // 当前页面
  Graph.registerNode(
    "topic-current",
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
          fill: "yellow",
          strokeWidth: 1,
        },
        label: {
          fontSize: 14,
          fill: "#262626",
        },
      },
    },
    true
  );

  // 连接器
  Graph.registerConnector(
    "mindmap",
    (sourcePoint, targetPoint, _routerPoints, options) => {
      const midX = sourcePoint.x + 10;
      const midY = sourcePoint.y;
      const ctrX = (targetPoint.x - midX) / 5 + midX;
      const ctrY = targetPoint.y;
      const pathData = `
     M ${sourcePoint.x} ${sourcePoint.y}
     L ${midX} ${midY}
     Q ${ctrX} ${ctrY} ${targetPoint.x} ${targetPoint.y}
    `;
      return options.raw ? Path.parse(pathData) : pathData;
    },
    true
  );

  // 边
  Graph.registerEdge(
    "mindmap-edge",
    {
      inherit: "edge",
      connector: {
        name: "mindmap",
      },
      attrs: {
        line: {
          targetMarker: "",
          stroke: "#A2B1C3",
          strokeWidth: 2,
        },
      },
      zIndex: 0,
    },
    true
  );

  const createGraph = () => {
    if (graph) {
      graph.dispose();
    }
    graph = new Graph({
      container: container.value!,
      connecting: {
        connectionPoint: "anchor",
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
    });
  };

  const render = async () => {
    const project = await getProjectList();
    const data: MindMapData = project?.pageList?.reduce(
      (pre: { [key: string]: any }, next: { [key: string]: any }, index: number) => {
        pre.children.push({
          id: `1-${index}`,
          type: route.query.id == next?.id ? "topic-current" : "topic-child",
          label: `页面:${next?.page_name}`,
          width: 100,
          height: 40,
        });
        return pre;
      },
      {
        id: "1",
        type: "topic",
        label: `项目:${project?.project_name}`,
        width: 160,
        height: 50,
        children: [],
        attrs: {
          body: {
            fill: "#efdbff",
            stroke: "#9254de",
          },
        },
      }
    );
    createGraph();
    const result: HierarchyResult = Hierarchy.mindmap(data, {
      direction: "H",
      getHeight(d: MindMapData) {
        return d.height;
      },
      getWidth(d: MindMapData) {
        return d.width;
      },
      getHGap() {
        return 40;
      },
      getVGap() {
        return 20;
      },
      getSide: () => {
        return "right";
      },
    });
    const cells: Cell[] = [];
    const traverse = (hierarchyItem: HierarchyResult) => {
      if (hierarchyItem) {
        const { data, children } = hierarchyItem;
        cells.push(
          graph.createNode({
            id: data.id,
            shape: data.type,
            x: hierarchyItem.x,
            y: hierarchyItem.y,
            width: data.width,
            height: data.height,
            label: data.label,
            type: data.type,
          })
        );
        if (children) {
          children.forEach((item: HierarchyResult) => {
            const { id, data } = item;
            cells.push(
              graph.createEdge({
                shape: "mindmap-edge",
                source: {
                  cell: hierarchyItem.id,
                  anchor:
                    data.type === "topic-child"
                      ? {
                          name: "right",
                          args: {
                            dx: -16,
                          },
                        }
                      : {
                          name: "center",
                          args: {
                            dx: "25%",
                          },
                        },
                },
                target: {
                  cell: id,
                  anchor: {
                    name: "left",
                  },
                },
              })
            );
            traverse(item);
          });
        }
      }
    };
    traverse(result);
    graph.resetCells(cells);
    graph.centerContent();
    // eventSetup(data);
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

  const destory = () => {
    graph?.dispose();
  };
  return { render, destory };
};

onMounted(async () => {
  const { render } = useCanvasCreation();

  render();
  renderMethod.value = render;
});

onUnmounted(() => {
  const { destory } = useCanvasCreation();
  destory();
});
</script>

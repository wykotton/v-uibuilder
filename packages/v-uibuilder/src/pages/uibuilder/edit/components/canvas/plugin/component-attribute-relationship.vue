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
import { blurSelectCom, focusSelectCom } from "@/composition";
import { useAppStore } from "@/store/modules/app";
import { awaitTime } from "@/utils/utils";
import { DagreLayout } from "@antv/layout";
import { Graph } from "@antv/x6";

interface MindMapData {
  id: string;
  type: "topic" | "topic-branch" | "topic-child";
  label: string;
  width: number;
  height: number;
  children?: MindMapData[];
}

// pinia
const appStroe = useAppStore();
const container = ref();
const renderMethod = ref();

const useCanvasCreation = () => {
  let graph: Graph;

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
    "bpmn-edge",
    {
      inherit: "edge",
      attrs: {
        line: {
          stroke: "#A2B1C3",
          strokeWidth: 2,
        },
      },
    },
    true
  );

  const getRouterInfo = async () => {
    const { pageModel } = appStroe.pageModel ?? {};
    const data: any = { nodes: [], edges: [] };
    while (!pageModel) {
      await awaitTime(500);
    }
    const allAttrBindRelationship = pageModel.componentsArray
      .map((current: any) => {
        const { attrBindRelationship = [] } = current;
        return attrBindRelationship;
      })
      .flat();
    const nodes = pageModel.componentsArray
      .map((current: any, index: number) => {
        const text = current?.iovSchema?.text ?? "";
        const { attrBindRelationship = [], id = "" } = current;
        const attr = Object.keys(current).map((attribute: string, attributeIndex: number) => {
          attrBindRelationship.forEach((attrBind: any) => {
            const { bindKey, selectedKey, target } = attrBind;

            if (selectedKey === attribute) {
              const targetModel = pageModel.componentsArray.find((currentCom: any) => currentCom.id === target);
              const targetComIndex = pageModel.componentsArray.findIndex(
                (currentCom: any) => currentCom === targetModel
              );
              if (!targetModel) return;
              const targetIndex = Object.keys(targetModel).findIndex((item) => item == bindKey);

              data.edges.push({
                source: `${index}-${attributeIndex}`,
                target: `${targetComIndex}-${targetIndex}`,
              });
            }
          });
          const targetBind = allAttrBindRelationship.find((item: any) => {
            const { src, target, bindKey, selectedKey } = item;
            return (src === id || target === id) && (bindKey === attribute || selectedKey === attribute);
          });
          if (!targetBind) {
            return;
          }
          data.edges.push({
            source: String(index + 1),
            target: `${index}-${attributeIndex}`,
          });
          return {
            id: `${index}-${attributeIndex}`,
            srcId: current.id,
            parentId: current.id,
            shape: "activity",
            width: 100,
            height: 60,
            attrs: {
              line: {
                stroke: "#A2B1C3",
                strokeWidth: 2,
              },
            },
            label: `属性:${attribute}`,
          };
        });
        return [
          {
            ...current,
            id: String(index + 1),
            srcId: current.id,
            shape: "activity",
            width: 100,
            height: 60,
            attrs: {
              line: {
                stroke: "#A2B1C3",
                strokeWidth: 2,
              },
            },
            label: `元件${text}`,
          },
        ].concat(attr.filter((item) => item));
      })
      .flat();

    data.nodes.push(...nodes);

    return data;
  };

  const createGraph = () => {
    if (graph) {
      graph.dispose();
    }
    graph = new Graph({
      container: container.value!,
      connecting: {
        // router: "orth",
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
    createGraph();
    const dagreLayout = new DagreLayout({
      type: "dagre",
      rankdir: "TB",
      align: "DR",
      ranksep: 60,
      nodesep: 30,
    });

    const model = dagreLayout.layout(await getRouterInfo());
    graph.fromJSON(model);
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
    graph.on("node:mouseenter", (e: any) => {
      focusSelectCom(e.node.store.data.srcId);
    });
    graph.on("node:mouseleave", (e: any) => {
      blurSelectCom();
    });
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

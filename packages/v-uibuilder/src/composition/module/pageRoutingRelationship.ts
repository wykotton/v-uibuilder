import { ISchema } from "@/types/IModelSchema";
import { Graph } from "@antv/x6";
import { message, Modal } from "ant-design-vue";
import { cloneDeep, isString } from "lodash-es";
import { useAppStoreWithOut } from "@/store/modules/app";
import { changeRouterRelationship, selectRouterInfo } from "./routerComponent";
import { workspaceGetProjectApi } from "@/api/uibuilder/workspace";

// pinia
const useAppStore = useAppStoreWithOut();

export const inOutPorts = {
  groups: {
    // 输入链接桩群组定义
    in: {
      position: "top",
      attrs: {
        circle: {
          r: 6,
          magnet: "passive",
          stroke: "#5F95FF",
          strokeWidth: 2,
          fill: "#fff",
        },
      },
    },
    // 输出链接桩群组定义
    out: {
      position: "bottom",
      attrs: {
        circle: {
          r: 6,
          magnet: true,
          stroke: "#5F95FF",
          strokeWidth: 2,
          fill: "#fff",
        },
      },
    },
  },
  items: [
    {
      id: "port1",
      group: "in",
    },
    {
      id: "port2",
      group: "out",
    },
  ],
};

export const inPorts = {
  groups: {
    // 输入链接桩群组定义
    in: {
      position: "top",
      attrs: {
        circle: {
          r: 6,
          magnet: "passive",
          stroke: "#5F95FF",
          strokeWidth: 2,
          fill: "#fff",
        },
      },
    },
  },
  items: [
    {
      id: "port1",
      group: "in",
    },
  ],
};

/**
 * 获取项目页面数据
 */
export async function getProjectList() {
  const { data: { results: [projectList = {}] } = { results: [] } } = await workspaceGetProjectApi(
    useAppStore?.pageInstance?.project_id
  );
  return projectList;
}

/**
 * 获取项目所有页面的组件节点列表
 */
export function getPageComponent(project: any) {
  const pageInfo: any = {}; // 页面和组件父子关系的hash数据
  const data: any = { nodes: [], edges: [] }; // canvas数据
  if (!project?.pageList?.length) return { pageInfo, data };
  const pageList = project.pageList; // 项目所有页面数据
  const currentPage = useAppStore?.pageInstance; // 当前页面数据
  const { pageModel } = useAppStore.pageModel ?? {};
  pageList.forEach((item: any) => {
    if (currentPage?.id && pageModel?.componentsArray && currentPage.id === item.id) {
      // 当前页面用pageModel的最新数据，防止数据库数据不同步
      const { nodes, edges, info, page } = getPageComponentData(currentPage, pageModel.componentsArray, true);
      pageInfo[page.srcId] = info;
      data.nodes.push(...nodes);
      data.edges.push(...edges);
    } else {
      isString(item.custom_model) ? (item.custom_model = JSON.parse(item.custom_model)) : void 0;
      const { nodes, edges, info, page } = getPageComponentData(item, item.custom_model.componentsArray, false);
      pageInfo[page.srcId] = info;
      data.nodes.push(...nodes);
      data.edges.push(...edges);
    }
  });
  return { pageInfo, data };
}

/**
 * 获取页面和组件数据
 * 页面和组件关系
 * @param pageInfo
 * @param componentsArray
 */
export function getPageComponentData(pageInfo: any, componentsArray: ISchema, currentPage: boolean) {
  const nodes: any = [];
  const edges: any = [];
  const info: any = {};
  const page = {
    ...cloneDeep(pageInfo),
    id: String(pageInfo.id),
    srcId: String(pageInfo.id),
    shape: "activity",
    width: 100,
    height: 60,
    type: "page",
    attrs: {
      line: {
        stroke: "#FF6940",
        strokeWidth: 2,
      },
      body: {
        stroke: useAppStore?.pageInstance.id === pageInfo.id ? "#FF6940" : "#5F95FF",
        strokeWidth: 3,
      },
    },
    label: `页面: ${pageInfo.page_name}\nID: ${pageInfo.id}`,
  };
  nodes.push(page);
  componentsArray.forEach((current: any) => {
    const text = current?.iovSchema?.text ?? "";
    const node = {
      ...current,
      id: `${pageInfo.id}|${current.id}`,
      pageId: pageInfo.id,
      srcId: current.id,
      shape: "activity",
      width: 100,
      height: 60,
      type: "component",
      attrs: {
        line: {
          stroke: "#A2B1C3",
          strokeWidth: 2,
        },
      },
      label: `元件: ${text}`,
      ports: currentPage ? inOutPorts : inPorts,
    };
    const edge = {
      shape: "page-edge",
      source: page.id,
      target: {
        cell: node.id,
        port: "port1",
      },
    };
    info[current.id] = node;
    nodes.push(node);
    edges.push(edge);
  });
  return { nodes, edges, info, page };
}

/**
 * 创建边线，增加配置项
 * @param graph
 * @param edge
 */
export function changeRouterConfig(graph: Graph, edge: any) {
  const edgeId = edge.store.data.id;
  const sourceId = edge.store.data.source.cell;
  const targetId = edge.store.data.target.cell;
  if (!edgeId || !sourceId || !targetId) {
    graph.removeEdge(edgeId);
    message.destroy();
    message.error("操作数据有误!");
    return;
  }
  const element: any = document.querySelector("q-router-config");
  if (!element) {
    graph.removeEdge(edgeId);
    message.destroy();
    message.error("未找到路由配置元件!");
    return;
  }
  const IncomingEdge = graph.getIncomingEdges(targetId) || [];
  // 已存在边线，则把新增的边删掉
  for (const item of IncomingEdge) {
    const tempEdge = item as any;
    const itemEdgeId = tempEdge.store.data.id;
    const itemSourceId = tempEdge.store.data.source.cell;
    const itemTargetId = tempEdge.store.data.target.cell;
    if (itemSourceId === sourceId && itemTargetId === targetId && itemEdgeId !== edgeId) {
      // 删掉重复边
      graph.removeEdge(edgeId);
      return;
    }
  }
  const config = {
    source: "",
    target: "",
    page: "",
  };
  const sourceCell: any = graph.getCellById(sourceId);
  if (!sourceCell?.store?.data?.srcId) {
    graph.removeEdge(edgeId);
    return;
  }
  config.source = sourceCell.store.data.srcId;
  const targetCell: any = graph.getCellById(targetId);
  if (!targetCell?.store?.data?.srcId || !targetCell?.store?.data?.pageId) {
    graph.removeEdge(edgeId);
    return;
  }
  config.target = targetCell.store.data.srcId;
  config.page = String(targetCell.store.data.pageId);
  changeRouterRelationship(config);
  // 将边线颜色设置成和其他一样的蓝色
  edge.attr({
    line: {
      stroke: "blue",
    },
  });
  // 按照自定义规范更新edge的id
  graph.updateCellId(edge, `${config.source}|${config.page}|${config.target}`);
}

/**
 * 双击边线，编辑路由配置项
 * @param graph
 * @param edge
 */
export function selectRouterConfig(graph: Graph, edge: any) {
  const sourceId = edge.store.data.source.cell;
  if (!sourceId) {
    message.destroy();
    message.error("操作数据有误!");
    return;
  }
  const element: any = document.querySelector("q-router-config");
  if (!element) {
    message.destroy();
    message.error("未找到路由配置元件!");
    return;
  }
  const sourceCell: any = graph.getCellById(sourceId);
  if (!sourceCell?.store?.data?.srcId) return;
  const source = sourceCell.store.data.srcId;
  selectRouterInfo(source);
}

/**
 * 路由关系线mouseenter时变更颜色，添加删除按钮
 * @param edge
 */
export function edgeMouseEnter(graph: Graph, edge: any) {
  const sourcePort = edge.store.data.source?.port === "port2";
  const targetPort = edge.store.data.target?.port === "port1";
  if (sourcePort && targetPort) {
    edge.attr({
      line: {
        stroke: "#FF6940",
      },
    });
    edge.addTools([
      {
        name: "button",
        args: {
          markup: [
            {
              tagName: "circle",
              selector: "button",
              attrs: {
                r: 8,
                stroke: "red",
                "stroke-width": 2,
                fill: "white",
                cursor: "pointer",
              },
            },
            {
              tagName: "text",
              textContent: "×",
              selector: "icon",
              attrs: {
                fill: "red",
                "font-size": 16,
                "font-weight": "600",
                "text-anchor": "middle",
                "pointer-events": "none",
                y: "0.3em",
              },
            },
          ],
          distance: -40,
          onClick({ view }: any) {
            const routerConfig: any = document.querySelector("q-router-config");
            if (!routerConfig) {
              message.destroy();
              message.error("未找到路由配置元件!");
              return;
            }
            Modal.confirm({
              title: "确定要删除该路由吗?",
              okText: "确定",
              cancelText: "取消",
              onOk() {
                const edge = view.cell;
                const source = edge.getSource();
                const target = edge.getTarget();
                try {
                  const config = {
                    source: source.cell.split("|")[1],
                    page: target.cell.split("|")[0],
                    target: target.cell.split("|")[1],
                  };
                  graph.removeCell(edge.id);
                  routerConfig.delete = config;
                } catch (error) {}
              },
            });
          },
        },
      },
    ]);
  }
}

/**
 * 路由关系线mouseleave时变更颜色，移除删除按钮
 * @param edge
 */
export function edgeMouseLeave(edge: any) {
  const sourcePort = edge.store.data.source?.port === "port2";
  const targetPort = edge.store.data.target?.port === "port1";
  if (sourcePort && targetPort) {
    edge.attr({
      line: {
        stroke: "blue",
      },
    });
    edge.removeTools();
  }
}

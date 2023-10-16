import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { cloneDeep, isArray, isEqual } from "lodash-es";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { IMessage } from "../../types/runtime/IMessage";
import { EComponentGroup, EComponentType, ISchema } from "../../types/runtime/IModelSchema";
import { createApp, defineComponent, ref, watch } from "vue";
import { Tree, InputSearch, Input, InputGroup, Button, Row, Col } from "ant-design-vue";
import { TYPE_NAME } from "../q-attribute-setting/type/type";
import locale from "ant-design-vue/lib/date-picker/locale/zh_CN";
import antdCss from "ant-design-vue/dist/antd.css?inline";
import cssIndex from "./index.scss?inline";
import { changeProperty } from "../../types/runtime/decorators/decorators";
import type { AntTreeNodeDragEnterEvent, AntTreeNodeDropEvent, TreeProps } from "ant-design-vue/lib/tree";
import "./q-tree-custom-setting";
import { SearchOutlined } from "@ant-design/icons-vue";
import { booleanTransform, unmountInstance } from "../../util/utils";

/**
 * 树形组件
 */
@customElement("q-tree")
export class QTree extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(cssIndex)}
    `,
    css`
      ${unsafeCSS(antdCss)}
    `,
  ];

  @query(".q-tree")
  treeContainer!: HTMLDivElement;

  /**
   * 组件实例
   */
  componentInstance: any = null;

  /**
   * 数据模型
   */
  componentModel!: ComponentModel;

  @changeProperty()
  @property({ type: Array, attribute: "tree-data" })
  treeData = [
    {
      title: "parent 1",
      key: "0-0",
      customIcon:
        '<svg t="1669882576357" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1957" width="16" height="16"><path d="M779.3152 892.0064H251.8016c-64.9216 0-117.76-52.8384-117.76-117.76V225.2288c0-64.9216 52.8384-117.76 117.76-117.76H779.264c64.9216 0 117.76 52.8384 117.76 117.76v549.0176c0.0512 64.9216-52.7872 117.76-117.7088 117.76zM251.8016 158.6688c-36.7104 0-66.56 29.8496-66.56 66.56v549.0176c0 36.7104 29.8496 66.56 66.56 66.56H779.264c36.7104 0 66.56-29.8496 66.56-66.56V225.2288c0-36.7104-29.8496-66.56-66.56-66.56H251.8016z" fill="#231815" p-id="1958"></path><path d="M512 543.5904c-103.1168 0-187.0336-83.8656-187.0336-186.9824 0-14.1312 11.4688-25.6 25.6-25.6s25.6 11.4688 25.6 25.6c0 74.9056 60.928 135.7824 135.8336 135.7824s135.7824-60.928 135.7824-135.7824c0-14.1312 11.4688-25.6 25.6-25.6s25.6 11.4688 25.6 25.6c0 103.1168-83.8656 186.9824-186.9824 186.9824z" fill="#FF3355" p-id="1959"></path></svg>',
      children: [
        {
          title: "parent 1-0",
          key: "0-0-0",
          disabled: true,
          children: [
            { title: "leaf", key: "0-0-0-0", disableCheckbox: true },
            { title: "leaf", key: "0-0-0-1" },
          ],
        },
        {
          title: "parent 1-1",
          key: "0-0-1",
          children: [{ key: "0-0-1-0", title: "sss" }],
        },
      ],
    },
  ];

  @changeProperty()
  @property({ type: String })
  searchValue = "";

  // 按钮自定义样式
  @changeProperty()
  @property({ type: String })
  searchBtnStyle = "width:82px;margin-left:10px;background-color:rgb(24, 144, 255);color:#ffffff";

  @changeProperty()
  @property({ type: String })
  searchInputStyle = "margin-bottom: 8px;";

  // 按钮文字
  @changeProperty()
  @property({ type: String })
  searchText = "搜索";

  @changeProperty()
  @property({ type: String })
  SearchPlaceholder = "请搜索";

  @property({ type: Object })
  treeStyle = {
    background: "#FFFFFF",
    color: "rgba(0, 0, 0, 0.85)",
    fontSize: "14px",
  };

  /**
   * 多选框选中值
   */
  @changeProperty()
  @property({ type: Array, attribute: "checked-value" })
  checkedValue: any[] = [];

  /**
   * 选中值
   */
  @changeProperty()
  @property({ type: Array, attribute: "selectd-value" })
  selectedValue: any[] = [];

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
    reflect: true,
  })
  // 是否显示checkbox
  showCheckBox = false;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
    reflect: true,
  })
  // 是否可以拖拽
  isDraggable = false;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
    reflect: true,
  })
  // 是否显示连接线
  showLine = false;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
    reflect: true,
  })
  // 开启
  useloadData = false;

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
    reflect: true,
  })
  // 是否显示图标
  showIcon = false;

  messageData: null | any;

  @property({ type: String })
  // 高亮颜色
  selectedColor = "rgb(186, 231, 255)";

  @property({
    type: Boolean,
    converter(value, type?) {
      return booleanTransform(value);
    },
    reflect: true,
  })
  // 开启搜索
  showSearch = true;

  constructor() {
    super();
    this.initModel();
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    super.attributeChangedCallback(name, _old, value);
    this.setVueComponentData(name, this[name]);
  }

  disconnectedCallback(): void {
    if (!this.isConnected) {
      // 断开文档连接，说明元件已被删除
      unmountInstance(this);
    }
    super.disconnectedCallback();
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.updateComplete;
    if (!this.componentInstance && this.treeContainer) {
      this.createVueComponent();
    }
  }

  /**
   * 同步设置属性编辑器里属性
   * @param type
   * @param value
   */
  setWebcomponentData(type: string, value: any) {
    this[type] = value;
    this.messageData = { type, value };
    // this.onSendMessage("eventInput");
  }

  /**
   * 创建树VUE组件
   */
  createVueComponent = () => {
    const self = this;

    const component = defineComponent({
      template: `
        <a-input-group compact v-show="showSearch" style="display: flex">
        <a-input v-model:value="searchValue"  :placeholder="SearchPlaceholder" style="flex: 1" :style="searchInputStyle" />
        <a-button type="primary" :style="searchBtnStyle">
          <template #icon><SearchOutlined /></template>
          {{searchText}}
        </a-button>
        </a-input-group>
<!--        <a-input-search v-show="showSearch" v-model:value="searchValue" style="margin-bottom: 8px"-->
<!--                        :placeholder="SearchPlaceholder"></a-input-search>-->
        <a-tree
          :draggable="isDraggable"
          :checkable="showCheckBox"
          :show-line="showLine"
          :show-icon="showIcon"
          :tree-data="treeData"
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          v-model:selectedKeys="selectedValue"
          v-model:checkedKeys="checkedValue"
          @select="onSelect"
          @check="onChecked"
          @rightClick="onRightClick"
          @expand="onExpand"
          @dragstart="onDragstart"
          @dragover="onDragover"
          @dragleave="onDragleave"
          @dragenter="onDragEnter"
          @dragend="onDragend"
          @drop="onDrop"
          @load="onLoad"
        >
        <template #icon="{ customIcon }" v-if="showIcon">
          <span style="vertical-align: -15%;padding-right: 5px" v-html="customIcon"></span>
        </template>
        <template #title="{ title }">
        <span v-if="title.indexOf(searchValue) > -1">
          {{ title.substr(0, title.indexOf(searchValue)) }}
          <span style="color: #f50">{{ searchValue }}</span>
          {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
        </span>
          <span v-else>{{ title }}</span>
        </template>
        </a-tree>
      `,
      name: "q-tree",
      props: {},
      components: {},
      setup(props: any, context: any) {
        const expandedKeys = ref<(string | number)[]>([]);
        const autoExpandParent = ref<boolean>(true);
        const showSearch = ref<boolean>(true);
        const searchValue = ref<string>(self.searchValue);
        const searchBtnStyle = ref<string>(self.searchBtnStyle);
        const searchInputStyle = ref<string>(self.searchInputStyle);
        const treeData = ref(self.treeData);
        const searchText = ref(self.searchText);
        const showCheckBox = ref(self.showCheckBox);
        const isDraggable = ref(self.isDraggable);
        const showLine = ref(self.showLine);
        const showIcon = ref(self.showIcon);
        const SearchPlaceholder = ref(self.SearchPlaceholder);
        const selectedValue = ref([]);
        const checkedValue = ref([]);
        const useloadData = ref([]);
        const dataList: TreeProps["treeData"] = [];
        const generateList = (data: TreeProps["treeData"]) => {
          if (!data) return;
          for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const key = node.key;
            dataList.push({ key, title: key });
            if (node.children) {
              generateList(node.children);
            }
          }
        };
        generateList(treeData.value);
        const getParentKey = (key: string | number, tree: TreeProps["treeData"]): string | number | undefined => {
          let parentKey;
          if (!tree) return;
          for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
              if (node.children.some((item) => item.key === key)) {
                parentKey = node.key;
              } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
              }
            }
          }
          return parentKey;
        };

        watch(searchValue, (value) => {
          const expanded = dataList
            // @ts-ignore
            .map((item: TreeProps["treeData"][number]) => {
              if (item.title.indexOf(value) > -1) {
                return getParentKey(item.key, treeData.value);
              }
              return null;
            })
            .filter((item: any, i: number, self: any) => item && self.indexOf(item) === i);
          expandedKeys.value = expanded as [];
          searchValue.value = value;
          autoExpandParent.value = true;
        });

        /**
         * 监听tree属性变更
         */
        function watchAttributeChange(type: string, value: any) {
          console.log("触发更新");
          // @ts-ignore
          this[type] = value;
        }

        /**
         * 删除发送数据中的customIcon
         */
        const delSendDataprops = (data: any[], delprop: string[]) => {
          data.map((it) => {
            delprop.map((prop) => {
              if (it[prop]) {
                it[prop] = null;
              }
            });
            if (it.dataRef) delete it.dataRef;
            if (it.parent) {
              const temp = cloneDeep(it.parent);
              it.parent = {
                key: temp.key,
              };
            }
            if (it.children && it.children.length) delSendDataprops(it.children, delprop);
          });
          return data;
        };

        /**
         * 点击树节点
         * @param selectedKeys
         * @param e
         */
        const onSelect = (
          selectedKeys: any,
          e: { selected: boolean; selectedNodes: any; node: any; event: String }
        ) => {
          selectedValue.value = selectedKeys;
          self.setWebcomponentData("selectedValue", selectedKeys);
          const { selected, event } = e;
          self.messageData = {
            selected,
            selectedNodes: delSendDataprops(cloneDeep(e.selectedNodes), ["customIcon"]),
            event,
          };
          self.onSendMessage("select");
        };

        /**
         * 点击复选框触发
         * @param checkedKeys
         * @param e
         */
        const onChecked = (checkedKeys: any, e: { checked: boolean; checkedNodes: any; node: any; event: String }) => {
          checkedValue.value = checkedKeys;
          self.setWebcomponentData("checkedValue", checkedKeys);
          const { checked, event } = e;
          self.messageData = {
            checked,
            checkedNodes: delSendDataprops(cloneDeep(e.checkedNodes), ["customIcon"]),
            event,
          };
          self.onSendMessage("check");
        };

        /**
         * 右键点击
         * @param event
         * @param node
         */
        const onRightClick = ({ event, node }: any) => {
          self.messageData = { event: "rightClick", node: delSendDataprops([cloneDeep(node)], ["customIcon"]) };
          self.onSendMessage("rightClick");
        };

        /**
         * 展开
         * @param expandedKeys
         * @param expanded
         * @param node
         */
        const onExpand = (keys: any, { expanded, node }: any) => {
          expandedKeys.value = keys;
          autoExpandParent.value = false;
          self.messageData = { event: "expand", expanded, node: delSendDataprops([cloneDeep(node)], ["customIcon"]) };
          self.onSendMessage("expand");
        };

        /**
         * 开始拖动
         * @param event
         * @param node
         */
        const onDragstart = ({ event, node }: any) => {
          self.messageData = { event: "dragstart", node: delSendDataprops([cloneDeep(node)], ["customIcon"]) };
          self.onSendMessage("dragstart");
        };

        /**
         * 拖动结束
         * @param event
         * @param node
         */
        const onDragover = ({ event, node }: any) => {
          self.messageData = { event: "dragover", node: delSendDataprops([cloneDeep(node)], ["customIcon"]) };
          self.onSendMessage("dragover");
        };

        /**
         *
         * @param event
         * @param node
         */
        const onDragleave = ({ event, node }: any) => {
          self.messageData = { event: "dragleave", node: delSendDataprops([cloneDeep(node)], ["customIcon"]) };
          self.onSendMessage("dragleave");
        };

        /**
         * 拖动结束
         * @param event
         * @param node
         */
        const onDragend = ({ event, node }: any) => {
          self.messageData = { event: "dragend", node: delSendDataprops([cloneDeep(node)], ["customIcon"]) };
          self.onSendMessage("dragend");
        };
        /**
         * 节点加载完毕
         * @param loadedKeys
         * @param event
         * @param node
         */
        const onLoad = (loadedKeys: any, { event, node }: any) => {
          self.messageData = { event: "load", loadedKeys, node: delSendDataprops([cloneDeep(node)], ["customIcon"]) };
          self.onSendMessage("load");
        };

        /**
         *
         * @param treeNode
         */
        // @ts-ignore
        const onLoadData: TreeProps["loadData"] = (treeNode) => {
          if (!useloadData) return treeData;
          return new Promise((resolve) => {
            if (treeNode?.dataRef?.children) {
              resolve();
              return;
            }
            setTimeout(() => {
              (treeNode?.dataRef as any).children = [
                { title: "Child Node", key: `${treeNode.eventKey}-0` },
                { title: "Child Node", key: `${treeNode.eventKey}-1` },
              ];
              treeData.value = [...treeData.value];
              resolve();
            }, 1000);
          });
        };

        /**
         * 开始拖拽
         * @param info
         */
        const onDragEnter = (info: AntTreeNodeDragEnterEvent) => {
          self.messageData = { type: "dragEnter", info };
          self.onSendMessage("dragEnter");
        };
        const onDrop = (info: AntTreeNodeDropEvent) => {
          const dropKey = info.node.key;
          const dragKey = info.dragNode.key;
          const dropPos = (info as any).node.pos.split("-");
          const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
          const loop = (data: TreeProps["treeData"], key: string | number, callback: any) => {
            data &&
              data.forEach((item, index) => {
                if (item.key === key) {
                  return callback(item, index, data);
                }
                if (item.children) {
                  return loop(item.children, key, callback);
                }
              });
          };
          const data = [...treeData.value];

          // Find dragObject
          let dragObj: any;
          loop(data, dragKey, (item: any, index: number, arr: TreeProps["treeData"]) => {
            arr && arr.splice(index, 1);
            dragObj = item;
          });
          if (!info.dropToGap) {
            // Drop on the content
            loop(data, dropKey, (item: any) => {
              item.children = item.children || [];
              /// where to insert 示例添加到头部，可以是随意位置
              item.children.unshift(dragObj);
            });
          } else if (
            (info.node.children || []).length > 0 && // Has children
            info.node.expanded && // Is expanded
            dropPosition === 1 // On the bottom gap
          ) {
            loop(data, dropKey, (item: any) => {
              item.children = item.children || [];
              // where to insert 示例添加到头部，可以是随意位置
              item.children.unshift(dragObj);
            });
          } else {
            let ar: TreeProps["treeData"] = [];
            let i = 0;
            loop(data, dropKey, (_item: any, index: number, arr: TreeProps["treeData"]) => {
              ar = arr;
              i = index;
            });
            if (dropPosition === -1) {
              ar.splice(i, 0, dragObj);
            } else {
              ar.splice(i + 1, 0, dragObj);
            }
          }
          treeData.value = data;
          self.messageData = { type: "drop", info };
          self.onSendMessage("drop");
          self.setWebcomponentData("treeData", data);
        };

        return {
          props,
          TYPE_NAME,
          locale,
          treeData,
          showCheckBox,
          showLine,
          showSearch,
          showIcon,
          isDraggable,
          searchValue,
          searchBtnStyle,
          searchInputStyle,
          searchText,
          SearchPlaceholder,
          expandedKeys,
          autoExpandParent,
          watchAttributeChange,
          onDragEnter,
          onDrop,
          selectedValue,
          checkedValue,
          onSelect,
          onChecked,
          onRightClick,
          onExpand,
          onDragstart,
          onDragover,
          onDragleave,
          onDragend,
          onLoad,
          onLoadData,
        };
      },
    });

    this.componentInstance = createApp(component);
    this.componentInstance.use(InputSearch);
    this.componentInstance.use(Row);
    this.componentInstance.use(Col);
    this.componentInstance.use(Button);
    this.componentInstance.use(Input);
    this.componentInstance.use(InputGroup);
    this.componentInstance.use(Tree);
    this.componentInstance.component("SearchOutlined", SearchOutlined);
    this.componentInstance.mount(this.treeContainer);
    this.setVueComponentData("selectedValue", this.selectedValue);
    this.setVueComponentData("checkedValue", this.checkedValue);
  };

  /**
   * 数据路由
   * @param e
   * @param value
   */
  onSendMessage(type: string) {
    const message: IMessage = {
      header: {
        src: this.id,
        dst: "",
        srcType: type,
        dstType: "",
      },
      body: this.messageData,
    };

    this.componentModel.sendMessage(message);
  }

  /**
   * 更新vue组件实例数据
   * @param type
   * @param value
   */
  setVueComponentData(type: string, value: any) {
    if (this.componentInstance && this.componentInstance?._instance?.proxy?.watchAttributeChange) {
      this.componentInstance._instance.proxy.watchAttributeChange(type, value);
    }
  }

  /**
   * 菜单编辑
   * @param e
   */
  optionsChange(e: any) {
    this.treeData = e.detail.data;
    this.setVueComponentData("treeData", this.treeData);
  }

  /**
   * 设置树组件的值
   */
  setTreeData(data: any) {
    try {
      if (data.body) data = data.body;
      if (!isArray(data)) throw "传入的数据与树组件不匹配";
      this.treeData = data;
      this.setVueComponentData("treeData", data);
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return html`
      <style>
        :host .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
          background-color: ${this.selectedColor};
        }

        :host .ant-tree .ant-tree-node-content-wrapper:hover {
          background-color: ${this.selectedColor};
        }

        .q-tree {
          background: ${this.treeStyle.background} !important;
        }

        .ant-tree {
          background: ${this.treeStyle.background} !important;
          color: ${this.treeStyle.color} !important;
          font-size: ${this.treeStyle.fontSize} !important;
        }

        .ant-tree-show-line .ant-tree-switcher {
          background: ${this.treeStyle.background} !important;
        }

        input::-webkit-input-placeholder {
          /* placeholder颜色 */
          color: inherit;
          /* placeholder字体大小 */
          font-size: inherit;
        }
      </style>
      <div class="q-tree"></div>
    `;
  }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-tree";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "树";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "树组件";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "设置组件数据",
                eventType: "setTreeData",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "设置搜索值",
                eventType: "setTreeSearchData",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "设置复选框",
                eventType: "setTreeCheckedData",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "设置选中值",
                eventType: "setTreeSelectedData",
                messageSchema: "",
                messageDemo: "",
              },
            ],
            outputMessage: [
              {
                text: "节点点击",
                eventType: "select",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "复选框点击",
                eventType: "check",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "右键点击",
                eventType: "rightClick",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "节点展开",
                eventType: "expand",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "拖动开始",
                eventType: "dragstart",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "拖动经过",
                eventType: "dragover",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "拖动离开",
                eventType: "dragleave",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "拖动结束",
                eventType: "dragend",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "拖动进入",
                eventType: "dragEnter",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "拖动放下",
                eventType: "drop",
                messageSchema: "",
                messageDemo: "",
              },
              {
                text: "树加载完成",
                eventType: "load",
                messageSchema: "",
                messageDemo: "",
              },
            ],
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                treeData: {
                  type: "object",
                  description: "树数据",
                  format: "custom",
                  setter: "q-tree-custom-setting",
                },
                selectedValue: {
                  type: "string",
                  description: "选中值",
                },
                checkedValue: {
                  type: "string",
                  description: "复选框选中值",
                },
                showSearch: {
                  type: "boolean",
                  description: "开启搜索",
                },
                SearchPlaceholder: {
                  type: "string",
                  description: "搜索placeholder",
                },
                searchBtnStyle: {
                  type: "string",
                  description: "按钮样式",
                  format: "style",
                },
                searchInputStyle: {
                  type: "string",
                  description: "输入框样式",
                  format: "style",
                },
                searchText: {
                  type: "string",
                  description: "按钮文字",
                },
                showLine: {
                  type: "boolean",
                  description: "连接线",
                },
                showIcon: {
                  type: "boolean",
                  description: "图标",
                },
                showCheckBox: {
                  type: "boolean",
                  description: "多选框",
                },
                isDraggable: {
                  type: "boolean",
                  description: "拖拽",
                },
                // useloadData: {
                //   type: "boolean",
                //   description: "懒加载"
                // },
                selectedColor: {
                  type: "string",
                  description: "高亮颜色",
                  format: "color",
                },
              },
            },
          },
        },
        get iovSchema() {
          return this["_iovSchema"];
        },
        set iovSchema(value) {
          if (value === this["_iovSchema"] || isEqual(value, this["_iovSchema"])) {
            return;
          }
          this["_iovSchema"] = value;
        },
        _onMessageMeta: {
          setTreeData: [
            function (e: IMessage) {
              // @ts-ignore
              this.setTreeData(e.body);
            }
          ],
          setTreeSearchData: [
            function(e: IMessage) {

              // eslint-disable-next-line @typescript-eslint/no-this-alias
              // const _this = this;
              try {
                // @ts-ignore
                this.searchValue = e.body.toString();
                // @ts-ignore
                this.setVueComponentData("searchValue", this.searchValue);
              } catch (e) {
                console.log(e);
              }
            },
          ],
          setTreeCheckedData: [
            function (e: IMessage) {
              // @ts-ignore
              // eslint-disable-next-line @typescript-eslint/no-this-alias
              const _this = this;
              try {
                if (!Array.isArray(e.body)) throw new Error("设置复选框数据有误");
                _this.checkedValue = e.body;
                _this.setVueComponentData("checkedValue", e.body);
              } catch (e) {
                console.log(e);
              }
            },
          ],
          setTreeSelectedData: [
            function (e: IMessage) {
              // @ts-ignore
              // eslint-disable-next-line @typescript-eslint/no-this-alias
              const _this = this;
              try {
                if (!Array.isArray(e.body)) throw new Error("设置选中数据有误");
                _this.selectedValue = e.body;
                _this.setVueComponentData("selectedValue", e.body);
              } catch (e) {
                console.log(e);
              }
            },
          ],
        },
        _onDOMEvent: {
          click: [
            function (e: Event) {
              console.log(e);
            },
          ],
          dblclick: [
            function (e: Event) {
              console.log(e, "dblclick");
            },
          ],
        },
        _initStyle: "height:150px;width:150px;overflow:auto",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function () {},
          updated: function () {
            console.log("update");
            self.setVueComponentData("treeData", self.treeData);
          },
          destroy: function () {},
        },
        _eventInterception: {},
        get treeData() {
          // const data = _.cloneDeep(self.menuData);
          return self.treeData;
        },
        set treeData(value) {
          if (!isArray(value) || isEqual(value, self.treeData)) {
            self.setVueComponentData("treeData", self.treeData);
            return;
          }
          // const mapTree = (org: any) => {
          //   if (!org) org = { title: "", key: `menu-${createHash()}`, children: [] };
          //   const haveChildren = Array.isArray(org.children) && org.children.length > 0;
          //   return Object.assign(org, {
          //       // scopedSlots: { title: "icon" },
          //       // icon: org.icon ? html`unsafeSVG(org.icon)` : "",
          //       key: org.key || `menu-${createHash()}`,
          //       children: haveChildren ? org.children.map((i: any) => mapTree(i)) : []
          //     }
          //   );
          // };
          // self.treeData = value.map((org) => mapTree(org));
          self.treeData = value;
          self.setVueComponentData("treeData", self.treeData);
        },
        get showCheckBox() {
          return self.showCheckBox;
        },
        set showCheckBox(value) {
          if (value !== self.showCheckBox) {
            self.setVueComponentData("showCheckBox", value);
            self.showCheckBox = value;
          }
        },
        get showLine() {
          return self.showLine;
        },
        set showLine(value) {
          if (value !== self.showLine) {
            self.setVueComponentData("showLine", value);
            self.showLine = value;
          }
        },
        get useloadData() {
          return self.useloadData;
        },
        set useloadData(value) {
          if (value !== self.useloadData) {
            self.setVueComponentData("useloadData", value);
            self.useloadData = value;
          }
        },
        get selectedColor() {
          return self.selectedColor;
        },
        set selectedColor(value) {
          if (value !== self.selectedColor) {
            self.selectedColor = value;
          }
        },
        get showIcon() {
          return self.showIcon;
        },
        set showIcon(value) {
          if (value !== self.showIcon) {
            self.setVueComponentData("showIcon", value);
            self.showIcon = value;
          }
        },
        get showSearch() {
          return self.showSearch;
        },
        set showSearch(value) {
          if (value !== self.showSearch) {
            self.setVueComponentData("showSearch", value);
            self.setVueComponentData("searchValue", "");
            self.setVueComponentData("expandedKeys", []);
            self.setVueComponentData("autoExpandParent", false);
            self.showSearch = value;
          }
        },
        get isDraggable() {
          return self.isDraggable;
        },
        set isDraggable(value) {
          if (value !== self.isDraggable) {
            self.setVueComponentData("isDraggable", value);
            self.isDraggable = value;
          }
        },
        get SearchPlaceholder() {
          return self.SearchPlaceholder;
        },
        set SearchPlaceholder(value) {
          if (value !== self.SearchPlaceholder) {
            self.setVueComponentData("SearchPlaceholder", value);
            self.SearchPlaceholder = value;
          }
        },
        get searchBtnStyle() {
          return self.searchBtnStyle;
        },
        set searchBtnStyle(value) {
          if (value !== self.searchBtnStyle) {
            self.setVueComponentData("searchBtnStyle", value);
            self.searchBtnStyle = value;
          }
        },
        get searchInputStyle() {
          return self.searchInputStyle;
        },
        set searchInputStyle(value) {
          if (value !== self.searchInputStyle) {
            self.setVueComponentData("searchInputStyle", value);
            self.searchInputStyle = value;
          }
        },
        get searchText() {
          return self.searchText;
        },
        set searchText(value) {
          if (value !== self.searchText) {
            self.setVueComponentData("searchText", value);
            self.searchText = value;
          }
        },
        get selectedValue() {
          return JSON.stringify(self.selectedValue);
        },
        set selectedValue(value: any) {
          try {
            const tempValue = typeof value === "string" ? JSON.parse(value) : value;
            if (!isArray(tempValue) || isEqual(tempValue, self.selectedValue)) return;
            self.selectedValue = tempValue;
            self.setVueComponentData("selectedValue", self.selectedValue);
          } catch (e) {
            console.log(e);
          }
        },
        get checkedValue() {
          return JSON.stringify(self.checkedValue);
        },
        set checkedValue(value: any) {
          try {
            const tempValue = typeof value === "string" ? JSON.parse(value) : value;
            if (!isArray(tempValue) || isEqual(tempValue, self.checkedValue)) return;
            self.checkedValue = tempValue;
            self.setVueComponentData("checkedValue", self.checkedValue);
          } catch (e) {
            console.log(e);
          }
        },
        get initStyle() {
          // @ts-ignore
          return this._initStyle;
        },
        set initStyle(value) {
          const div = document.createElement("div");
          div.style.cssText = value;
          console.log("style更新");
          // @ts-ignore
          this._initStyle = value;
          self.treeStyle = {
            background: div.style.backgroundColor || "#FFFFFF",
            color: div.style.color || "rgba(0, 0, 0, 0.85)",
            fontSize: div.style.fontSize || "14px",
          };
          self.style.cssText = div.style.cssText;
          self.requestUpdate();
        },
      } as unknown as ISchema,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "q-tree": QTree;
  }
}

import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
import { createVNode, defineComponent, ref, watch } from "vue";
import { EventDataNode } from "ant-design-vue/es/tree";
import { JSONPath } from "jsonpath-plus";
import { isObject, isArray } from "lodash-es";

enum PluginEnum {
  EDIT = "edit",
  DELETE = "delete",
}

export const OnWatchSetting = defineComponent({
  template: `
      <div class="event-content">
        <div class="title">点击添加监听</div>
        <div style="width: 100%; height: 32px">
          <a-button :block="true" @click="showTreeModel">添加监听</a-button>
        </div>
        <div style="width: 100%; height: 32px;display: flex;align-items: center;margin-top: 10px">
          <a-input v-model:value="newAttribute" placeholder="请输入自定义监听属性" style="flex: 1;" />
          <a-button style="width: 100px" :block="true" @click="inputSubmit">添加监听</a-button>
        </div>
        <div v-if="Object.keys(eventInfo).length" class="title" style="margin: 10px 0 4px;">已有属性监听</div>
        <a-collapse v-model:activeKey="activeKey" :expand-icon-position="'right'" :bordered="false">
          <a-collapse-panel v-for="(event,key) in eventInfo" :key="key" >
            <template #header>
              <div class="event-header">
                <span class="event-header-title">组</span>
                <span class="event-header-text" :title="key">{{ key }}</span>
              </div>
            </template>
            <template #extra><delete-outlined @click.stop="handleDeleteEvent(key)" /></template>
            <div v-for="(item, index) in event" :key="index" class="row">
              <div class="row-content">
                <a-tooltip placement="top">
                  <template v-slot:title>编辑函数片段</template>
                  <a-button type="link" class="setting-icon" @click="handlePluginClick(PluginEnum.EDIT,key,index)">
                    <template #icon><code-outlined :style="{ fontSize: '20px', color: '#409eff' }" /></template>
                  </a-button>
                </a-tooltip>
                <div class="plugin-content">
                  <a-input v-model:value="event[index]" class="ant-col-title" placeholder="字段值"/>
                </div>
              </div>
              <div class="plugin-btn">
                <a-tooltip placement="top">
                  <template v-slot:title>删除函数片段</template>
                  <a-button type="link" class="close-icon ant-btn-icon-only" @click="handlePluginClick(PluginEnum.DELETE,key,index)">
                    <template #icon><delete-outlined :style="{ fontSize: '18px' }" /></template>
                  </a-button>
                </a-tooltip>
              </div>
            </div>
            <div class="add-btn">
              <span @click="addChild(key)">添加一项+</span>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
      <a-modal v-model:visible="treeModal" v-if="treeModal" title="选择监听属性" :maskClosable="false" okText="确定" cancelText="取消" width="600px" @ok="addAttrWatch">
        <div v-if="attrTree.length">
          <a-input-search
            v-model:value="attrSearchValue"
            placeholder="请输入查询内容"
            style="width: 100%; margin-bottom: 10px"
          />
          <div style="width: 100%;height: 600px;overflow: auto">
            <a-tree
              v-model:selectedKeys="attrSelectedKey"
              :tree-data="attrTree"
              :load-data="onLoadData"
              :check-strictly="true"
              :show-icon="false"
            >
              <template #title="{ title }">
                <div v-if="title.indexOf(attrSearchValue) > -1" class="whitespace-nowrap">
                  {{ title.substr(0, title.indexOf(attrSearchValue)) }}
                  <span style="color: #f50">{{ attrSearchValue }}</span>
                  {{ title.substr(title.indexOf(attrSearchValue) + attrSearchValue.length) }}
                </div>
                <div v-else>{{ title }}</div>
              </template>
            </a-tree>
          </div>
        </div>
        <div 
          v-else
          style="
            background-color: #ffffff;
            padding: 10px 0;
            box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
          "
        ><a-empty description="暂无可监听属性" /></div>
      </a-modal>
      <a-modal v-model:visible="codeModal" v-if="codeModal" title="代码编辑" :maskClosable="false" okText="确定" cancelText="取消" width="80%" @ok="codeChange">
        <q-code-editor ref="codeEditor" :value="codeStr" language="javascript" style="width:100%;height:600px;display: block"></q-code-editor>
      </a-modal>
    `,
  props: {
    eventInfo: {
      type: Object,
      default: {},
    },
    model: {
      type: Object,
      default: {},
    },
  },
  setup(props: any) {
    const eventInfo: any = ref(props.eventInfo);
    const activeKey = ref<string[]>([]);
    const newAttribute = ref("");
    const _function_ = "function(e) {console.log(e);}";

    /**
     * 更新数据
     */
    watch(
      () => props.eventInfo,
      (newValue) => {
        changeEventInfo(newValue);
      }
    );

    /**
     * 处理属性Tree
     */
    function handleAttrTree() {
      attrTree.value = [];
      attrSearchValue.value = "";
      attrSelectedKey.value = [];
      newAttribute.value = "";
      try {
        attrTree.value = Object.keys(props.model).map((key: string) => {
          return {
            title: key,
            key,
            children: [],
          };
        });
      } catch (error) {}
    }

    /**
     * 异步加载元件属性
     * @param treeNode
     * @returns
     */
    function onLoadData(treeNode: EventDataNode) {
      return new Promise<void>((resolve) => {
        const { key = "", children = [] } = treeNode.dataRef || <Record<string, any>>{};
        if (!treeNode.dataRef || children.length || !key) {
          resolve();
          return;
        }
        const componentModel = props.model;
        const attribute = JSONPath({ path: key, json: componentModel })[0];
        if (isObject(attribute) || isArray(attribute)) {
          treeNode.dataRef.children = Object.keys(attribute).map((attr: string) => {
            return {
              title: attr,
              key: Number.isNaN(Number(attr)) ? `${key}.${attr}` : `${key}[${attr}]`,
              children: [],
            };
          });
          attrTree.value = [...attrTree.value];
        }
        resolve();
      });
    }

    /**
     * 自定义监听属性
     */
    function inputSubmit() {
      if (!newAttribute.value) return;
      addEvent(newAttribute.value);
    }

    /**
     * 添加事件
     * @param key
     * @returns
     */
    function addEvent(key: string) {
      if (eventInfo.value[key]) {
        message.destroy();
        message.warning("已存在该事件!");
        return false;
      }
      eventInfo.value[key] = [_function_];
      return true;
    }

    /**
     * 删除事件
     * @param key
     */
    function handleDeleteEvent(key: string) {
      Modal.confirm({
        title: `确定删除${key}事件吗?`,
        icon: createVNode(ExclamationCircleOutlined),
        okText: "确定",
        cancelText: "取消",
        onOk() {
          Reflect.deleteProperty(eventInfo.value, key);
        },
      });
    }

    /**
     * 数据项操作按钮
     * @param param0
     */
    const eventKey = ref("");
    const eventIndex = ref<number>(-1);
    function handlePluginClick(menuKey: string, key: string, index: number) {
      codeStr.value = eventInfo.value[key][index];
      eventKey.value = key;
      eventIndex.value = index;
      switch (menuKey) {
        case PluginEnum.EDIT:
          codeModal.value = true;
          break;
        case PluginEnum.DELETE:
          removeChild();
          break;
      }
    }

    /**
     * 代码编辑器
     */
    const codeModal = ref(false);
    const codeEditor = ref(null);
    const codeStr = ref("");
    function codeChange() {
      const code = (codeEditor.value as any).getValue();
      eventInfo.value[eventKey.value][eventIndex.value] = code;
      codeModal.value = false;
    }

    /**
     * 删除子项
     */
    function removeChild() {
      Modal.confirm({
        title: "确定删除此函数片段吗?",
        icon: createVNode(ExclamationCircleOutlined),
        okText: "确定",
        cancelText: "取消",
        onOk() {
          eventInfo.value[eventKey.value].splice(eventIndex.value, 1);
        },
      });
    }

    /**
     * 添加事件响应函数子项
     * @param key
     */
    function addChild(key: string) {
      eventInfo.value[key].push(_function_);
    }

    /**
     * 更改eventInfo
     * @param value
     */
    function changeEventInfo(value: any) {
      activeKey.value = [];
      eventInfo.value = value;
      handleAttrTree();
    }

    /**
     * 元件属性Tree
     */
    const treeModal = ref(false);
    const attrTree = ref<Array<{ title: string; key: string }>>([]);
    const attrSelectedKey = ref<string[]>([]);
    const attrSearchValue = ref("");
    function showTreeModel() {
      handleAttrTree();
      treeModal.value = true;
    }
    function addAttrWatch() {
      const attr = attrSelectedKey.value[0];
      if (!attr) {
        message.destroy();
        message.warning("请选择监听属性!");
        return;
      }
      const state = addEvent(attr);
      if (state) {
        treeModal.value = false;
      }
    }

    return {
      eventInfo,
      attrTree,
      activeKey,
      codeEditor,
      codeModal,
      treeModal,
      codeStr,
      PluginEnum,
      newAttribute,
      attrSelectedKey,
      attrSearchValue,
      handlePluginClick,
      codeChange,
      addChild,
      handleDeleteEvent,
      changeEventInfo,
      inputSubmit,
      onLoadData,
      showTreeModel,
      addAttrWatch,
    };
  },
});

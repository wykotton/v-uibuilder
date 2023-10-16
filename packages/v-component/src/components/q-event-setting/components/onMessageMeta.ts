import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
import { createVNode, defineComponent, onMounted, ref, watch } from "vue";
import { IEventSpecificationEvent } from "../../../types/runtime/IModelSchema";

enum PluginEnum {
  EDIT = "edit",
  DELETE = "delete",
}

export const OnMessageMeta = defineComponent({
  template: `
      <div class="event-content">
        <div v-if="Object.keys(eventInfo).length" class="title" style="margin-bottom: 10px;">已有事件</div>
        <div v-else ><a-empty description="暂无可用事件" /></div>
        <a-collapse v-model:activeKey="activeKey" :expand-icon-position="'right'" :bordered="false">
          <a-collapse-panel v-for="(event,key) in eventInfo" :key="key" >
            <template #header>
              <div class="event-header">
                <span class="event-header-title">组</span>
                <span class="event-header-text">{{ key }}({{ eventName[key] }})</span>
              </div>
            </template>
            <div v-for="(item, index) in event" :key="index" class="row">
              <div class="row-content">
              <a-tooltip placement="left">
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
              <a-tooltip placement="left">
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
      <a-modal v-model:visible="codeModal" v-if="codeModal" title="代码编辑" :maskClosable="false" okText="确定" cancelText="取消" width="80%" @ok="codeChange">
        <q-code-editor ref="codeEditor" :value="codeStr" language="javascript" style="width:100%;height:600px;display: block"></q-code-editor>
      </a-modal>
    `,
  props: {
    eventInfo: {
      type: Object,
      default: {},
    },
    inputMessage: {
      type: Array<IEventSpecificationEvent>,
      default: [],
    },
  },
  setup(props: any) {
    const eventInfo: any = ref(props.eventInfo);
    const eventMenu = ref(props.inputMessage);
    const eventName = ref<{ [key: string]: string }>({});
    const activeKey = ref<string[]>([]);
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
    watch(
      () => props.inputMessage,
      (newValue) => {
        setTimeout(() => {
          handleMenu(newValue);
        }, 0);
      }
    );

    /**
     * 处理菜单可选项
     */
    function handleMenu(menu: IEventSpecificationEvent[]) {
      eventMenu.value = [];
      try {
        menu.forEach((item: IEventSpecificationEvent) => {
          if (!eventInfo.value[item.eventType]) {
            eventMenu.value.push(item);
          }
          eventName.value[item.eventType] = item.text;
        });
      } catch (error) {
        eventMenu.value = menu;
      }
    }
    onMounted(() => {
      handleMenu(props.inputMessage);
    });

    /**
     * 添加事件
     * @param param0
     */
    function handleEventClick({ key }: { key: string }) {
      if (eventInfo.value[key]) {
        message.destroy();
        message.warning("已存在该事件!");
        return;
      }
      eventInfo.value[key] = [_function_];
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
      // const code = removeLineBreaks((codeEditor.value as any).getValue());
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
    }

    return {
      eventInfo,
      eventMenu,
      eventName,
      activeKey,
      codeEditor,
      codeModal,
      codeStr,
      PluginEnum,
      handleEventClick,
      handlePluginClick,
      codeChange,
      addChild,
      handleDeleteEvent,
      changeEventInfo,
    };
  },
});

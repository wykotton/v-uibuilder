import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
import { createVNode, defineComponent, onMounted, ref, watch } from "vue";

enum MouseEventEnum {
  CLICK = "click",
  DBLCLICK = "dblclick",
  CONTEXTMENU = "contextmenu",
  MOUSEDOWN = "mousedown",
  MOUSEENTER = "mouseenter",
  MOUSELEAVE = "mouseleave",
  MOUSEMOVE = "mousemove",
  MOUSEOUT = "mouseout",
  MOUSEOVER = "mouseover",
  MOUSEUP = "mouseup",
}
enum MouseEventNameEnum {
  click = "单击",
  dblclick = "双击",
  contextmenu = "右键",
  mousedown = "鼠标按下",
  mouseenter = "鼠标移入",
  mouseleave = "鼠标移出",
  mousemove = "鼠标移动",
  mouseout = "鼠标移入元素或其中的子元素",
  mouseover = "鼠标移出元素或其中的子元素",
  mouseup = "鼠标抬起",
}
enum PluginEnum {
  EDIT = "edit",
  DELETE = "delete",
}
interface MenuInfo {
  key: string;
  title: string;
}
const mouseEventMenu: MenuInfo[] = [
  {
    key: MouseEventEnum.CLICK,
    title: MouseEventNameEnum.click,
  },
  {
    key: MouseEventEnum.DBLCLICK,
    title: MouseEventNameEnum.dblclick,
  },
  {
    key: MouseEventEnum.CONTEXTMENU,
    title: MouseEventNameEnum.contextmenu,
  },
  {
    key: MouseEventEnum.MOUSEDOWN,
    title: MouseEventNameEnum.mousedown,
  },
  {
    key: MouseEventEnum.MOUSEUP,
    title: MouseEventNameEnum.mouseup,
  },
  {
    key: MouseEventEnum.MOUSEENTER,
    title: MouseEventNameEnum.mouseenter,
  },
  {
    key: MouseEventEnum.MOUSELEAVE,
    title: MouseEventNameEnum.mouseleave,
  },
  {
    key: MouseEventEnum.MOUSEMOVE,
    title: MouseEventNameEnum.mousemove,
  },
  {
    key: MouseEventEnum.MOUSEOVER,
    title: MouseEventNameEnum.mouseover,
  },
  {
    key: MouseEventEnum.MOUSEOUT,
    title: MouseEventNameEnum.mouseout,
  },
];

export const OnDOMEvent = defineComponent({
  template: `
      <div class="event-content">
        <div class="title">点击绑定事件</div>
        <a-dropdown :trigger="['click']">
          <div style="width: 100%; height: 32px">
            <a-button :block="true">添加事件</a-button>
          </div>
          <template #overlay>
            <a-menu v-if="eventMenu.length" @click="handleEventClick">
              <a-menu-item v-for="(item, index) in eventMenu" :key="item.key">
                <div>{{ item.key }}({{ item.title }})</div>
              </a-menu-item>
            </a-menu>
            <div v-else 
              style="
                background-color: #ffffff;
                padding: 10px 0;
                box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
                "
            ><a-empty description="暂无可添加事件" /></div>
          </template>
        </a-dropdown>
        <div v-if="Object.keys(eventInfo).length" class="title" style="margin: 10px 0 4px;">已有事件</div>
        <a-collapse v-model:activeKey="activeKey" :expand-icon-position="'right'" :bordered="false">
          <a-collapse-panel v-for="(event,key) in eventInfo" :key="key" >
            <template #header>
              <div class="event-header">
                <span class="event-header-title">组</span>
                <span class="event-header-text">{{ key }}({{ mouseEventName[key] }})</span>
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
      <a-modal v-model:visible="codeModal" v-if="codeModal" title="代码编辑" :maskClosable="false" okText="确定" cancelText="取消" width="80%" @ok="codeChange">
        <q-code-editor ref="codeEditor" showShortcut :value="codeStr" language="javascript" style="width:100%;height:600px;display: block"></q-code-editor>
      </a-modal>
        `,
  props: {
    eventInfo: {
      type: Object,
      default: {},
    },
  },
  setup(props: any, context: any) {
    const eventInfo: any = ref(props.eventInfo);
    const eventMenu = ref<MenuInfo[]>([]);
    const activeKey = ref<string[]>([]);
    const mouseEventName = ref(MouseEventNameEnum);
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
     * 处理菜单可选项
     */
    function handleMenu() {
      eventMenu.value = [];
      try {
        mouseEventMenu.forEach((item: MenuInfo) => {
          if (!eventInfo.value[item.key]) {
            eventMenu.value.push(item);
          }
        });
      } catch (error) {
        eventMenu.value = mouseEventMenu;
      }
    }
    onMounted(() => {
      handleMenu();
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
      handleMenu();
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
          handleMenu();
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
      handleMenu();
    }

    return {
      eventInfo,
      eventMenu,
      activeKey,
      codeEditor,
      codeModal,
      mouseEventName,
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

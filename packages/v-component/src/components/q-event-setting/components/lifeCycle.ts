import { defineComponent, ref, watch } from "vue";

const eventName = {
  created: "创建",
  updated: "更新",
  destroy: "销毁",
};

export const LifeCycle = defineComponent({
  template: `
    <div class="event-content">
        <div v-if="Object.keys(eventInfo).length" class="title">已有生命周期</div>
        <div v-else ><a-empty description="暂无可用生命周期" /></div>
        <a-collapse v-model:activeKey="activeKey" :expand-icon-position="'right'" :bordered="false">
          <a-collapse-panel v-for="(event,key) in eventInfo" :key="key" >
            <template #header>
              <div class="event-header">
                <span class="event-header-text">{{ key }}({{ eventName[key] }})</span>
              </div>
            </template>
            <div class="row">
              <div class="row-content">
                <a-tooltip placement="top">
                  <template v-slot:title>编辑函数片段</template>
                    <a-button type="link" class="setting-icon" @click="handlePluginClick(key)">
                      <template #icon><code-outlined :style="{ fontSize: '20px', color: '#409eff' }" /></template>
                  </a-button>
                </a-tooltip>
                <div class="plugin-content">
                  <a-input v-model:value="eventInfo[key]" class="ant-col-title" placeholder="字段值"/>
                </div>
              </div>
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
  },
  setup(props: any) {
    const eventInfo: any = ref(props.eventInfo);
    const activeKey = ref<string[]>([]);

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
     * 数据项操作按钮
     * @param param0
     */
    const eventKey = ref("");
    function handlePluginClick(key: string) {
      codeStr.value = eventInfo.value[key];
      eventKey.value = key;
      codeModal.value = true;
    }

    /**
     * 代码编辑器
     */
    const codeModal = ref(false);
    const codeEditor = ref(null);
    const codeStr = ref("");
    function codeChange() {
      const code = (codeEditor.value as any).getValue();
      eventInfo.value[eventKey.value] = code;
      codeModal.value = false;
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
      activeKey,
      codeEditor,
      codeModal,
      codeStr,
      eventName,
      handlePluginClick,
      codeChange,
      changeEventInfo,
    };
  },
});

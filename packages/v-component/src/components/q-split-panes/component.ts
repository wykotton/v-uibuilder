import { createApp, defineComponent, onMounted, ref, toRefs, reactive, watch, provide } from "vue";
import {
  message,
  ConfigProvider
} from "ant-design-vue";
import { Splitpanes, Pane } from 'splitpanes'
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { enumFilter } from "../../util/dict";
// import { onSendMessage } from "../../util/utils";
// import { cloneDeep } from "lodash-es";
import panesItem from "./panesItem.vue"
import { titleBar, panesDataItem } from "./IQSplitPanes"

export const createVueComponent = (root: any) => {
  const component = defineComponent({
    template: `
      <a-config-provider :locale="zhCN">
        <div class="q-splitpanes-wrap">
          <panesItem :panesData="paneslist" :indexKey="'p'" :mutex="mutex" :titleBar="titleBar" :contextType="contextType" :root="root"></panesItem>
        </div>
      </a-config-provider>
    `,
    components: {
      Splitpanes,
      Pane,
      panesItem,
      LeftOutlined,
      RightOutlined
    },
    setup(props: any) {
      const fullPanseId = ref("");
      const updateFullPanseId = (id:string) => {
        fullPanseId.value = id
      }
      provide('fullPanseId', { fullPanseId, updateFullPanseId });
      const state = reactive<{
        root: any;
        contextType: boolean;
        resize: boolean;
        paneslist: panesDataItem[];
        titleBar: titleBar;
        mutex: boolean;
      }>({
        root,
        contextType: root.contextType,
        resize: root.resize,
        paneslist: root.spData[0],
        titleBar: root.titleBar,
        mutex: root.mutex,
      });
      onMounted(() => {
        state.root = root
      });
      watch(
        () => state.paneslist,
        (newVal) => {
          console.log(newVal)
          root.componentModel.model.paneslist = [newVal]
        },
        { deep: true }
      )
      return {
        fullPanseId,
        ...toRefs(state),
        zhCN,
        enumFilter,
        updateFullPanseId
      };
    },
  });

  root.componentInstance = createApp(component);
  root.componentInstance.use(ConfigProvider);
  root.componentInstance.use(message);
  root.componentInstance.mount(root.container);
};

import { createApp, defineComponent, /* onMounted, ref, */ toRefs, reactive } from "vue";
import {
  Collapse,
  message,
  ConfigProvider
} from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { Appearance } from "./IQCollapse"
import { enumFilter } from "../../util/dict";
// import { onSendMessage } from "../../util/utils";

export const createVueComponent = (root: any) => {
  const component = defineComponent({
    template: `
      <a-config-provider :locale="zhCN">
        <div class="q-collapse-wrap">
          <a-collapse v-model:activeKey="activeKey" :bordered="appearance.bordered" :expand-icon-position="enumFilter('expandIconPosition', appearance.position)" :ghost="appearance.ghost">
            <a-collapse-panel :header="item.label" v-for="item in datalist" :key="item.key" :collapsible="enumFilter('collapsible', String(item.disabled))" :show-arrow="item.showArrow" :style="{ backgroundColor: item.bgcolor }">
              <div class="collapse-item" v-html="html(item.key)">
                
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-config-provider>
    `,    
    setup(props: any) {
      const state = reactive<{
        datalist: Array<any>;
        appearance: Appearance;
        html: (key: string) => void;
        activeKey: string[]|string
      }>({
        datalist: root.datalist,
        appearance: root.appearance,
        html: (key) => `<slot name="${key}" class="dropzone"><q-container-mask text="组件降落区"></q-container-mask></slot>`,
        activeKey: root.activeKey
      });
      // const activeKey = computed(() => [...state.columns, { key: "action", ...state.operationcol, fixed: state.operationcol.fixed ? "right" : false }].map((v: any) => {v.customCell = customCell; v.customHeaderCell = customHeaderCell; return v;}))
      // const activeKey = computed(() => {
      //   return state.datalist.filter((v:any) => v.actived).map((v:any) => v.key)
        
      // });
      // onMounted(() => {
      //   const activeKey = state.datalist.filter((v:any) => v.actived).map((v:any) => v.key)
      //   if (state.activeKey === activeKey) return
      //   state.activeKey = activeKey
      // });
      console.log("data:", state.datalist, state.appearance)
      return {
        ...toRefs(state),
        zhCN,
        enumFilter
      };
    },
  });

  root.componentInstance = createApp(component);
  root.componentInstance.use(ConfigProvider);
  root.componentInstance.use(Collapse);
  root.componentInstance.use(message);
  root.componentInstance.mount(root.container);
};

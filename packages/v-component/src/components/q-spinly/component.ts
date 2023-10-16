import { createApp, defineComponent, /* onMounted, ref, */ toRefs, reactive } from "vue";
import {
  Spin,
  message,
  ConfigProvider
} from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { enumFilter } from "../../util/dict";
// import { onSendMessage } from "../../util/utils";
export const createVueComponent = (root: any) => {
  const component = defineComponent({
    template: `
      <a-config-provider :locale="zhCN">
        <div class="q-spin-wrap">
          <spin wrapperClassName="spin-overlay" :spinning="spinning" :delay="delay" :size="enumFilter('spinSize', size)" :tip="tip">
            <div class="content-div" :class="{'editing': !contextType}" v-html="contentHtml"></div>
          </spin>
        </div>
      </a-config-provider>
    `,
    components: {
      Spin,
    },
    setup(props: any) {
      const state = reactive<{
        contextType: boolean;
        spinning: boolean;
        delay: number;
        size: string;
        tip: string;
        contentHtml: string;
      }>({
        contextType: root.contextType,
        spinning: root.spinning,
        delay: root.delay,
        size: root.size,
        tip: root.tip,
        contentHtml: `<slot name="contentHtml" class="dropzone"><q-container-mask text=""></q-container-mask></slot>`
      });
      const PopupContainer = () => root.container
      return {
        ...toRefs(state),
        zhCN,
        enumFilter,
        PopupContainer
      };
    },
  });

  root.componentInstance = createApp(component);
  root.componentInstance.use(ConfigProvider);
  // root.componentInstance.use(Spin);
  root.componentInstance.use(message);
  root.componentInstance.mount(root.container);
};

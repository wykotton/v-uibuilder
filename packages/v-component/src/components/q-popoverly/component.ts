import { createApp, defineComponent, /* onMounted, ref, */ toRefs, reactive } from "vue";
import {
  Popover,
  message,
  ConfigProvider
} from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { enumFilter } from "../../util/dict";
import { Header } from "./IQPopoverly"
import { onSendMessage } from "../../util/utils";
// v-model:visible="visible" :defaultVisible="defaultVisible"  @visibleChange="handleClickChange" mask maskClosable
export const createVueComponent = (root: any) => {
  const component = defineComponent({
    template: `
    <a-config-provider :locale="zhCN">
    <div class="q-popover-wrap">
      <a-popover overlayClassName="popover-overlay" ${root.contextType ? '' : 'action="custom" hideAction="custom" showAction="' + enumFilter('popoverTrigger', root.trigger) + '"'} :getPopupContainer="PopupContainer" v-model:visible="visible" :title="header.enable ? header.title : header.enable" :trigger="enumFilter('popoverTrigger', trigger)" @visibleChange="handleClickChange">
        <template #content>
          <div class="content-div" :class="{'editing': !contextType }" v-html="contentHtml"></div>
        </template>
        <div class="trigger-div" :class="{'editing': !contextType }" v-html="triggerHtml"></div>
      </a-popover>
    </div>
  </a-config-provider>
    `,    
    setup(props: any) {
      const state = reactive<{
        contextType: boolean;
        defaultVisible: boolean;
        visible: boolean;
        trigger: string;
        header: Header;
        contentHtml: string;
        triggerHtml: string;
      }>({
        contextType: root.contextType,
        defaultVisible: false,
        visible: root.visible,
        trigger: root.trigger,
        header: root.header,
        contentHtml: `<slot name="contentHtml" class="dropzone"><q-container-mask text=""></q-container-mask></slot>`,
        triggerHtml: `<slot name="triggerHtml" class="dropzone"><q-container-mask text=""></q-container-mask></slot>`
      });
      const PopupContainer = () => root.container
      const handleClickChange = (visible: boolean) => {
        if (visible) onSendMessage(root, visible, { srcType: "Open" })
        else onSendMessage(root, visible, { srcType: "Close" })
      };
      return {
        ...toRefs(state),
        zhCN,
        enumFilter,
        PopupContainer,
        handleClickChange
      };
    },
  });

  root.componentInstance = createApp(component);
  root.componentInstance.use(ConfigProvider);
  root.componentInstance.use(Popover);
  root.componentInstance.use(message);
  root.componentInstance.mount(root.container);
};

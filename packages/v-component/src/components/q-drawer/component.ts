import { createApp, defineComponent, ref, toRefs, reactive, computed } from "vue";
import {
  Button,
  Drawer,
  message,
  ConfigProvider,
} from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { enumFilter } from "../../util/dict";
import styleParse from "style-to-object";
import { btnType, drawerStyleType } from "./IQDrawer";
import { onSendMessage } from "../../util/utils";
// v-model:visible="visible" :defaultVisible="defaultVisible"  @visibleChange="handleClickChange" mask maskClosable
// getContainer
export const createVueComponent: Function = (root: any) => {
  const component = defineComponent({
    template: `
    <a-config-provider :locale="zhCN">
      <div class="q-drawer-wrap">
        <a-drawer 
          ref="drawerRef"
          v-model:visible="visible"
          :placement="enumFilter('placement', placement)"
          :drawerStyle="drawerWrapperStyle"
          :contentWrapperStyle="contentWrapperStyle"
          :headerStyle="headerStyle"
          :bodyStyle="bodyStyle"
          :footerStyle="footerStyle"
          :width="mWidth.indexOf('%') !== -1 ? mWidth : (parseInt(mWidth)+'px')"
          :mask="mask"
          :maskClosable="maskClosable"
          :getContainer="drawerContainer"
          :closable="closeData.enable"
          @after-visible-change="afterVisibleChange"
          destroyOnClose>
          <template #closeIcon v-if="closeData.icon">
            <img :src="closeData.icon" class="q-dialog_close_icon" />
          </template>
          <template #title v-if="headEnable">
            <img :src="icon" class="q-dialog_title_icon" />
            <span>{{title}}</span>
          </template>
          <template #footer v-if="footEnable">
            <a-button style="margin-right: 8px" :disabled="item.disabled" :loading="item.loading" :type="enumFilter('mbtnType', item.type)" v-for="(item, index) in operation" key="index" @click="drawerEventBus($event, item.func)">{{item.label}}</a-button>
          </template>
          <div 
            class="drawer-body-div" 
            :class="{'editing': !contextType }" 
            :style="{ 'height': mHeight+'px' }"
            v-html="bodyHtml"></div>
        </a-drawer>
      </div>
    </a-config-provider>
    `,    
    setup(props: any) {
      const state = reactive<{
        contextType: boolean;
        visible: boolean;
        size: string;
        mWidth: string;
        mHeight: string;
        mask: boolean;
        maskClosable: boolean;
        closeData: any;
        placement: string;
        headEnable: boolean;
        title: string;
        icon: string;
        footEnable: boolean;
        operation: btnType;
        drawerStyle: drawerStyleType;
        bodyHtml: string;
      }>({
        contextType: root.contextType,
        visible: root.visible,
        size: root.size,
        mWidth: root.size === "自定义" ? root.mWidth : root.size === "大" ? "90%" : root.size === "小" ? "378px" : "50%",
        mHeight: root.mHeight,
        mask: root.mask,
        maskClosable: root.maskClosable,
        closeData: root.closeData, 
        placement: root.placement, 
        headEnable: root.headEnable, 
        title: root.title, 
        icon: root.icon, 
        footEnable: root.footEnable, 
        operation: root.operation, 
        drawerStyle: root.drawerStyle, 
        bodyHtml: `<slot name="bodyHtml" class="dropzone"><q-container-mask text=""></q-container-mask></slot>`
      });

      const drawerRef = ref();
      // 事件处理
      const handleFun = {
        customEventHandleFun: (e: Event) => {
          console.log({e, type: "CustomEvent"})
          onSendMessage(root, {e, type: "CustomEvent"}, { srcType: "CustomEvent" })
          root.visibleHandleFun(false)
        },
        confirmHandleFun: (e: Event) => {
          console.log({e, type: "Confirm"})
          onSendMessage(root, {e, type: "Confirm"}, { srcType: "Confirm" })
          root.visibleHandleFun(false)
        },
        cancelHandleFun: (e: Event) => {
          console.log({e, type: "Cancel"})
          onSendMessage(root, {e, type: "Cancel"}, { srcType: "Cancel" })
          root.visibleHandleFun(false)
        }
      }
      // onMounted(() => {
      //   console.log(drawerRef)
      //   const drawerDom = drawerRef.value.$el.parentNode?.nextElementSibling
      //   const drawerRoot = drawerDom ? drawerDom.querySelector('.ant-drawer-root') : null
      //   let headDom,footDom;
      //   if (drawerRoot) {
      //     headDom = drawerRoot.querySelector('.ant-drawer-header')
      //     footDom = drawerRoot.querySelector('.ant-drawer-footer')
      //     if (headDom) headDom.setAttribute("style", state.drawerData.head.headStyle)
      //     if (footDom) footDom.setAttribute("style", state.drawerData.foot.footStyle)
      //   }
      // })
      // 抽屉外层样式
      const drawerWrapperStyle = computed(() => {
        return styleParse(state.drawerStyle.drawerWrapperStyle)
      })
      // 内容样式
      const contentWrapperStyle = computed(() => {
        return styleParse(state.drawerStyle.contentWrapperStyle)
      })
      // 头部样式
      const headerStyle = computed(() => {
        return styleParse(state.drawerStyle.headerStyle)
      })
      // 主体样式
      const bodyStyle = computed(() => {
        return styleParse(state.drawerStyle.bodyStyle)
      })
      // 底部样式
      const footerStyle = computed(() => {
        return styleParse(state.drawerStyle.footerStyle)
      })

      const drawerContainer = () => root.container
      // 事件处理
      const drawerEventBus = (e: Event, f: string) => {
        const func = enumFilter('btnDrawerEvent', f)
        if (handleFun[func]) handleFun[func](e)
        else handleFun.customEventHandleFun(e)
      }
      // 显示后回调
      const afterVisibleChange = () => {
        onSendMessage(root, {type: "AfterClose"}, { srcType: "AfterClose" })
      }

      return {
        Drawer,
        drawerRef,
        drawerWrapperStyle,
        contentWrapperStyle,
        headerStyle,
        bodyStyle,
        footerStyle,
        ...toRefs(state),
        zhCN,
        enumFilter,
        drawerContainer,
        drawerEventBus,
        afterVisibleChange
      };
    },
  });

  root.componentInstance = createApp(component);
  root.componentInstance.use(ConfigProvider);
  root.componentInstance.use(Button);
  root.componentInstance.use(Drawer);
  root.componentInstance.use(message);
  root.componentInstance.mount(root.container);
};

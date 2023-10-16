import { createApp, defineComponent, ref, toRefs, reactive, computed, watch, nextTick } from "vue";
import {
  Button,
  Modal,
  message,
  ConfigProvider,
} from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { enumFilter } from "../../util/dict";
import { headType } from "./IQModal"
import styleParse from "style-to-object";
import { modalType } from "./IQModal";
import { onSendMessage } from "../../util/utils";
// v-model:visible="visible" :defaultVisible="defaultVisible"  @visibleChange="handleClickChange" mask maskClosable
// getContainer
export const createVueComponent: Function = (root: any) => {
  const component = defineComponent({
    template: `
    <a-config-provider :locale="zhCN">
    <div class="q-modal-wrap">
      <a-modal 
        ref="modalRef"
        v-model:visible="visible" 
        :style="dialogStyle"
        :bodyStyle="bodyStyle"
        :width="mWidth.indexOf('%') !== -1 ? mWidth : (parseInt(mWidth)+'px')"
        :mask="mask"
        :maskClosable="maskClosable"
        :getContainer="modalContainer"
        :closable="closeData.enable"
        :afterClose="afterClose"
        >
        <template #closeIcon v-if="closeData.icon">
          <img :src="closeData.icon" class="q-dialog_close_icon" />
        </template>
        <template #title v-if="modalData.head.enable">
          <img :src="modalData.head.icon" class="q-dialog_title_icon" />
          <span>{{modalData.head.title}}</span>
        </template>
        <template #footer v-if="modalData.foot.enable">
          <a-button :disabled="item.disabled" :loading="item.loading" :type="enumFilter('mbtnType', item.type)" v-for="(item, index) in modalData.foot.operation" key="index" @click="modalEventBus($event, item.func)">{{item.label}}</a-button>
        </template>
        <div 
          class="modal-body-div" 
          :class="{'editing': !contextType }" 
          :style="{ 'height': mHeight+'px' }"
          v-html="bodyHtml"></div>
      </a-modal>
    </div>
  </a-config-provider>
    `,
    setup(props: any) {
      console.log(root)
      const state = reactive<{
        contextType: boolean;
        visible: boolean;
        size: string;
        mWidth: string;
        mHeight: string;
        mask: boolean;
        maskClosable: boolean;
        dialogStyle: any;
        closeData: any;
        modalData: modalType;
        header: headType;
        bodyHtml: string;
      }>({
        contextType: root.contextType,
        visible: root.visible,
        size: root.size,
        mWidth: root.size === "自定义" ? root.mWidth : root.size === "大" ? "90%" : root.size === "小" ? "400px" : "50%",
        mHeight: root.mHeight,
        mask: root.mask,
        maskClosable: root.maskClosable,
        dialogStyle: root.dialogStyle,
        closeData: root.closeData,
        modalData: root.modalData,
        header: root.header,
        bodyHtml: `<slot name="bodyHtml" class="dropzone"><q-container-mask text=""></q-container-mask></slot>`,
      });

      const modalRef = ref();

      const handleFun = {
        customEventHandleFun: (e: Event) => {
          console.log({ e, type: "CustomEvent" })
          onSendMessage(root, { e, type: "CustomEvent" }, { srcType: "CustomEvent" })
          root.visibleHandleFun(false)
        },
        confirmHandleFun: (e: Event) => {
          console.log({ e, type: "Confirm" })
          onSendMessage(root, { e, type: "Confirm" }, { srcType: "Confirm" })
          root.visibleHandleFun(false)
        },
        cancelHandleFun: (e: Event) => {
          console.log({ e, type: "Cancel" })
          onSendMessage(root, { e, type: "Cancel" }, { srcType: "Cancel" })
          root.visibleHandleFun(false)
        }
      }
      // onMounted(() => {
      //   const modalDom = modalRef.value.$el.parentNode?.nextElementSibling
      //   const modalRoot = modalDom ? modalDom.querySelector('.ant-modal-root') : null
      //   let closeDom, headDom, footDom;
      //   if (modalRoot) {
      //     closeDom = modalRoot.querySelector('.ant-modal-close')
      //     headDom = modalRoot.querySelector('.ant-modal-header')
      //     footDom = modalRoot.querySelector('.ant-modal-footer')
      //     if (closeDom) closeDom.setAttribute("style", `color: ${state.closeData.color}`)
      //     if (headDom) headDom.setAttribute("style", state.modalData.head.headStyle)
      //     if (footDom) footDom.setAttribute("style", state.modalData.foot.footStyle)
      //   }
      // })
      // 监听模态数据
      watch(() => state.modalData,
      (newVal) => {
        console.log(newVal)
        setModalDataStyle(newVal)
      })
      // 关闭数据
      watch(() => state.closeData,
      (newVal) => {
        console.log(newVal)
        setCloseDataStyle(newVal)
      })
      // 显隐状态监听
      watch(() => state.visible,
      (newVal) => {
        if(newVal) {
          nextTick(() => {
            setModalDataStyle(state.modalData)
            setCloseDataStyle(state.closeData)
          })
        }
      })
      // 设置模态数据
      const setModalDataStyle = (newVal:any) => {
        const modalDom = modalRef.value.$el.parentNode?.nextElementSibling
        const modalRoot = modalDom ? modalDom.querySelector('.ant-modal-root') : null
        let headDom, footDom;
        if (modalRoot) {
          headDom = modalRoot.querySelector('.ant-modal-header')
          footDom = modalRoot.querySelector('.ant-modal-footer')
          if (headDom) headDom.setAttribute("style", newVal.head.headStyle)
          if (footDom) footDom.setAttribute("style", newVal.foot.footStyle)
        }
      }
      // 设置关闭按钮样式
      const setCloseDataStyle = (newVal:any) => {
        const modalDom = modalRef.value.$el.parentNode?.nextElementSibling
        const modalRoot = modalDom ? modalDom.querySelector('.ant-modal-root') : null
        let closeDom;
        if (modalRoot) {
          closeDom = modalRoot.querySelector('.ant-modal-close')
          if (closeDom) closeDom.setAttribute("style", `color: ${newVal.color}`)
        }
      }
      // 主体样式
      const bodyStyle = computed(() => {
        return styleParse(state.modalData.body.bodyStyle)
      })
      // 模态主体
      const modalContainer = () => root.container
      // 模态事件
      const modalEventBus = (e: Event, f: string) => {
        const func = enumFilter('btnModalEvent', f)
        if (handleFun[func]) handleFun[func](e)
        else handleFun.customEventHandleFun(e)
      }
      // 关闭之后
      const afterClose = () => {
        root.visibleHandleFun(false)
        onSendMessage(root, { type: "AfterClose" }, { srcType: "AfterClose" })
      }

      return {
        Modal,
        modalRef,
        bodyStyle,
        ...toRefs(state),
        zhCN,
        enumFilter,
        modalContainer,
        modalEventBus,
        afterClose
      };
    },
  });
  root.componentInstance = createApp(component);
  root.componentInstance.use(ConfigProvider);
  root.componentInstance.use(Button);
  root.componentInstance.use(Modal);
  root.componentInstance.use(message);
  root.componentInstance.mount(root.container);
};

import { createApp, defineComponent, onMounted, ref, toRefs, reactive, computed, onUnmounted } from "vue";
import {
  Button,
  Modal,
  message,
  ConfigProvider,
} from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import styleParse from "style-to-object";
import { isElement, merge } from "lodash-es";
import { createHashId } from "./uuid";
// v-model:visible="visible" :defaultVisible="defaultVisible"  @visibleChange="handleClickChange" mask maskClosable
// getContainer
export type headType = {
  enable: boolean; // 是否启用
  headStyle: string;  // 自定义样式
}
export type bodyType = {
  bodyStyle: string;
}
export type footType = {
  enable: boolean; // 是否启用
  footStyle: string;  // 自定义样式
}

export type btnType = {
  label: string; // 按钮文字
  type?: string; // 按钮风格  "默认": "primary", "简约": "", "虚边": "dashed", "文字": "text", "链接": "link"
  disabled?: boolean; // 按钮可用
  loading?: boolean; // 按钮加载
  func: string; // 点击按钮后触发的父组件事件
}

export interface styleType {
  head: headType;
  body: bodyType;
  foot: footType;
}

interface modalType {
  container: Element|string;
  size: string;
  mWidth: string;
  mHeight: number;
  mask: boolean;
  maskClosable: boolean;
  dialogStyle: string;
  closeData: {
      enable: boolean;
      icon: string;
  };
  title: string;
  icon: string;
  onload: Function;
  handleOk: Function;
  handleClose: Function;
  afterClose: Function;
  mode: string;
  operation: Array<btnType>;
  styleData: styleType;
  bodyHtml: Element|string;
}
const dialogStorageSpace:Array<any> = []

const createDialogComponent = (dialog: any, root: modalType) => {
  let dom:Element;
  if (isElement(root.container)) dom = root.container as Element
  else {
    dom = document.createElement("div")
    dom.id = root.container ? "dialog_" + root.container : createHashId(12, "dialog_");
    document.body.appendChild(dom)
  }
  const component = defineComponent({
    template: `
    <a-config-provider :locale="zhCN">
    <div class="cmd-dialog-wrap">
      <a-modal 
        ref="modalRef"
        wrapClassName="cmd-dialog-root"
        v-model:visible="visible" 
        :style="dialogStyle"
        :bodyStyle="bodyStyle"
        :width="mWidth.indexOf('%') !== -1 ? mWidth : (parseInt(mWidth)+'px')"
        :mask="mask"
        :maskClosable="maskClosable"
        :getContainer="modalContainer"
        :closable="closeData.enable"
        :afterClose="afterClose"
        destroyOnClose>
        <template #closeIcon v-if="closeData.icon">
          <span v-html="closeData.icon" style="display: inline-block;"></span>
        </template>
        <template #title v-if="styleData.head.enable">
          <span v-html="icon" style="display: inline-block;margin-right: 5px;vertical-align: middle;" class="q-dialog_title_icon"></span>
          <span style="vertical-align: middle;">{{title}}</span>
        </template>
        <template #footer v-if="styleData.foot.enable">
          <a-button :disabled="item.disabled" :loading="item.loading" :type="item.type" v-for="(item, index) in operation" key="index" @click="modalEventBus($event, item.func)">{{item.label}}</a-button>
        </template>
        <div 
          class="modal-body-div" 
          :style="{ 'height': mHeight+'px' }"
          v-html="polishBodyHtml"></div>
      </a-modal>
    </div>
  </a-config-provider>
    `,
    setup(props: any) {
      console.log(root)
      const state = reactive<{
        visible: boolean;
        size: string;
        mWidth: string;
        mHeight: number;
        mask: boolean;
        maskClosable: boolean;
        dialogStyle: any;
        closeData: any;
        title: string;
        icon: string;
        mode: string;
        operation: Array<btnType>;
        styleData: styleType;
        bodyHtml: Element|string;
      }>({
        visible: false,
        size: root.size,
        mWidth: root.size === "自定义" ? root.mWidth : root.size === "大" ? "90%" : root.size === "小" ? "400px" : "50%",
        mHeight: root.mHeight,
        mask: root.mask,
        maskClosable: root.maskClosable,
        dialogStyle: root.dialogStyle,
        closeData: root.closeData,
        title: root.title,
        icon: root.icon,
        mode: root.mode,
        operation: root.operation,
        styleData: root.styleData,
        bodyHtml: root.bodyHtml
      });

      const modalRef = ref();
      onMounted(() => {
        console.log(modalRef)
        const modalDom = modalRef.value.$el.parentNode?.nextElementSibling
        const modalRoot = modalDom ? modalDom.querySelector('.ant-modal-root') : null
        let headDom,footDom;
        if (modalRoot) {
          headDom = modalRoot.querySelector('.ant-modal-header')
          footDom = modalRoot.querySelector('.ant-modal-footer')
          if (headDom) headDom.setAttribute("style", state.styleData.head.headStyle)
          if (footDom) footDom.setAttribute("style", state.styleData.foot.footStyle)
        }
        root.onload()
      })

      const polishBodyHtml = computed(() => {
        // const childPageId = "7377gw63l0t2"
        let result = state.bodyHtml as any;
        if (isElement(result)) result = result.outerHTML
        switch (state.mode) {
          case "child-page":
            result = `<q-child-page child_page_id="${result}">子页面</q-child-page>`
            break;
        
          default:
            break;
        }
        return result
      })

      const bodyStyle = computed(() => {
        return styleParse(state.styleData.body.bodyStyle)
      })
      const modalContainer = () => dom

      const modalEventBus = (e: Event, f: Function) => {
        if (typeof f === "function") f()
      }
      const handleOk = () => {
        if (typeof root.handleOk === "function") root.handleOk()
      }
      const handleClose = () => {
        console.log("handleClose")
        if (typeof root.handleClose === "function") root.handleClose()
      }
      const afterClose = () => {
        console.log("afterClose")
        if (typeof root.afterClose === "function") root.afterClose()
      }
      onUnmounted(() => {
        dom.remove()
      })

      return {
        Modal,
        modalRef,
        bodyStyle,
        polishBodyHtml,
        ...toRefs(state),
        zhCN,
        modalContainer,
        modalEventBus,
        handleOk,
        handleClose,
        afterClose
      };
    },
  });

  dialog.$vm = createApp(component);
  dialog.$vm.use(ConfigProvider);
  dialog.$vm.use(Button);
  dialog.$vm.use(Modal);
  dialog.$vm.use(message);
  dialog.$vm.mount(dom);
};


export class Dialog {
  $vm: any;
  $dss: Array<any>
  constructor(opt: any) {
      this.$vm = null
      const defaultOpt = {
        size: '中',
        mWidth: '50%',
        mHeight: 320,
        mask: true,
        maskClosable: true,
        dialogStyle: 'background-colo: #ffffff;',
        closeData: {
            enable: true,
            icon: ''
        },
        title: '模态标题',
        icon: '',
        onload: () => {},
        handleOk: () => {},
        handleClose: () => {},
        afterClose: () => {},
        mode: "html",
        operation: [{
            label: '确定',
            type: 'primary',
            disabled: false,
            loading: false,
            func: () => {
                // message.info("确定")
                this.$vm._instance.setupState.handleOk()
                this.close()
            }
        }, {
            label: '取消',
            func: () => {
                message.warning("取消")
                this.close()
            }
        }],
        styleData: {
            head: {
                enable: true,
                headStyle: ''
            },
            body: {
                bodyStyle: 'background-colo: #ffffff;'
            },
            foot: {
                enable: true,
                footStyle: ''
            }
        },
        bodyHtml: '<div>body内容</div>'
      }
      if (opt.operation) defaultOpt.operation = opt.operation
      createDialogComponent(this, merge(defaultOpt, opt))
      dialogStorageSpace.push(this.$vm)
      this.$dss = dialogStorageSpace
  }
  open() {
      console.log(this.$vm)
      this.$vm._instance.setupState.visible = true
  }
  close() {
      this.$vm._instance.setupState.visible = false
      this.$vm._instance.setupState.handleClose()
  }
  closeAll() {
      this.$dss.map((v:any) => {
          v._instance.setupState.visible = false
          v._instance.setupState.handleClose()
      })
  }
  destory() {
      try {
          this.$vm?.unmount();
          this.$vm = null;
      } catch (error) {
          console.log(error);
      }
  }
  destoryAll() {
      this.$dss.map((v:any) => {
          try {
              v?.unmount();
              v = null
          } catch (error) {
              console.log(error);
          }
      })
      console.log(this.$vm)
  }
}

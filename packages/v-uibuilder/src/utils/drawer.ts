import { createApp, defineComponent, onMounted, ref, toRefs, reactive, computed, onUnmounted } from "vue";
import {
  Button,
  Drawer as sDrawer,
  message,
  ConfigProvider,
} from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import styleParse from "style-to-object";
import { isElement, merge } from "lodash-es";
import { createHashId } from "./uuid";
// v-model:visible="visible" :defaultVisible="defaultVisible"  @visibleChange="handleClickChange" mask maskClosable
// getContainer
export type btnType = {
  label: string; // 按钮文字
  type: string; // 按钮风格
  disabled?: boolean; // 按钮可用
  loading?: boolean; // 按钮加载
  func: string; // 点击按钮后触发的父组件事件
}

export type drawerStyleType = {
  drawerWrapperStyle: string;
  contentWrapperStyle: string;
  headerStyle: string;
  bodyStyle: string;
  footerStyle: string;
}

interface drawerType {
  container: Element|string;
  size: string;
  mWidth: string;
  mHeight: number;
  mask: boolean;
  maskClosable: boolean;
  closeData: {
      enable: boolean;
      icon: string;
  };
  placement: string;
  headEnable: boolean;
  title: string;
  icon: string;
  footEnable: boolean;
  operation: btnType;
  drawerStyle: drawerStyleType;
  onload: Function;
  handleOk: Function;
  handleClose: Function;
  afterVisibleChange: Function;
  mode: string;
  bodyHtml: Element|string;
}
const drawerStorageSpace:Array<any> = []

const createDrawerComponent = (drawer: any, root: drawerType) => {
  let dom:Element;
  if (isElement(root.container)) dom = root.container as Element
  else {
    dom = document.createElement("div")
    dom.id = root.container ? "drawer_" + root.container : createHashId(12, "drawer_");
    document.body.appendChild(dom)
  }
  const component = defineComponent({
    template: `
    <a-config-provider :locale="zhCN">
    <div class="cmd-drawer-wrap">
      <a-drawer 
        ref="drawerRef"
        v-model:visible="visible"
        :placement="placement"
        :drawerStyle="drawerWrapperStyle"
        :contentWrapperStyle="contentWrapperStyle"
        :headerStyle="headerStyle"
        :bodyStyle="bodyStyle"
        :footerStyle="footerStyle"
        class="cmd-drawer-root"
        :width="mWidth.indexOf('%') !== -1 ? mWidth : (parseInt(mWidth)+'px')"
        :mask="mask"
        :maskClosable="maskClosable"
        :getContainer="drawerContainer"
        :closable="closeData.enable"
        @after-visible-change="afterVisibleChange"
        destroyOnClose>
        <template #closeIcon v-if="closeData.icon">
          <span v-html="closeData.icon" style="display: inline-block;"></span>
        </template>
        <template #title v-if="headEnable">
          <span v-html="icon" style="display: inline-block;margin-right: 5px;vertical-align: middle;" class="q-drawer_title_icon"></span>
          <span style="vertical-align: middle;">{{title}}</span>
        </template>
        <template #footer v-if="footEnable">
          <a-button :disabled="item.disabled" :loading="item.loading" :type="item.type" v-for="(item, index) in operation" key="index" @click="drawerEventBus($event, item.func)">{{item.label}}</a-button>
        </template>
        <div 
          class="drawer-body-div" 
          :style="{ 'height': mHeight+'px' }"
          v-html="polishBodyHtml"></div>
      </a-drawer>
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
        closeData: any;
        placement: string;
        headEnable: boolean;
        title: string;
        icon: string;
        mode: string;
        footEnable: boolean;
        operation: btnType;
        drawerStyle: drawerStyleType;
        bodyHtml: Element|string;
      }>({
        visible: false,
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
        mode: root.mode,
        bodyHtml: root.bodyHtml
      });

      const drawerRef = ref();
      onMounted(() => {
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

      const drawerWrapperStyle = computed(() => {
        return styleParse(state.drawerStyle.drawerWrapperStyle)
      })
      const contentWrapperStyle = computed(() => {
        return styleParse(state.drawerStyle.contentWrapperStyle)
      })
      const headerStyle = computed(() => {
        return styleParse(state.drawerStyle.headerStyle)
      })
      const bodyStyle = computed(() => {
        return styleParse(state.drawerStyle.bodyStyle)
      })
      const footerStyle = computed(() => {
        return styleParse(state.drawerStyle.footerStyle)
      })

      const drawerContainer = () => dom

      const drawerEventBus = (e: Event, f: Function) => {
        if (typeof f === "function") f()
      }
      const handleOk = () => {
        if (typeof root.handleOk === "function") root.handleOk()
      }
      const handleClose = () => {
        if (typeof root.handleClose === "function") root.handleClose()
      }
      const afterVisibleChange = () => {
        if (typeof root.afterVisibleChange === "function") root.afterVisibleChange()
      }

      onUnmounted(() => {
        dom.remove()
      })

      return {
        Drawer,
        drawerRef,
        drawerWrapperStyle,
        contentWrapperStyle,
        headerStyle,
        bodyStyle,
        footerStyle,
        polishBodyHtml,
        ...toRefs(state),
        zhCN,
        drawerContainer,
        drawerEventBus,
        handleOk,
        handleClose,
        afterVisibleChange
      };
    },
  });

  drawer.$vm = createApp(component);
  drawer.$vm.use(ConfigProvider);
  drawer.$vm.use(Button);
  drawer.$vm.use(sDrawer);
  drawer.$vm.use(message);
  drawer.$vm.mount(dom);
};


export class Drawer {
  $vm: any;
  $dss: Array<any>
  constructor(opt: any) {
      this.$vm = null
      const defaultOpt = {
        placement: 'right',
        size: '小',
        mWidth: '378',
        mHeight: 920,
        mask: true,
        maskClosable: true,
        drawerStyle: {
          drawerWrapperStyle: "",
          contentWrapperStyle: "",
          headerStyle: "",
          bodyStyle: "",
          footerStyle: ""
        },
        closeData: {
            enable: true,
            icon: ''
        },
        headEnable: true,
        footEnable: true,
        title: '抽屉标题',
        icon: '',
        onload: () => {},
        handleOk: () => {},
        handleClose: () => {},
        afterVisibleChange: () => {},
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
        bodyHtml: '<div>body内容</div>'
      }
      if (opt.operation) defaultOpt.operation = opt.operation
      createDrawerComponent(this, merge(defaultOpt, opt))
      drawerStorageSpace.push(this.$vm)
      this.$dss = drawerStorageSpace
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

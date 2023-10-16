import { createApp, defineComponent, ref } from "vue";
import {
  Select,
  Tooltip,
  Switch,
  ConfigProvider,
  Drawer,
  Spin,
  Tabs,
  Tree,
  Radio,
  Divider,
  Collapse,
  Popconfirm,
} from "ant-design-vue";
import Modal from "ant-design-vue/es/modal";
import Input from "ant-design-vue/es/input";
import Button from "ant-design-vue/es/button";
import {
  EyeOutlined,
  CopyOutlined,
  FormOutlined,
  DeleteOutlined,
  PlusOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  BulbOutlined,
  CodeOutlined,
  PartitionOutlined,
  LogoutOutlined,
  LoginOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons-vue";
import RouterConfig from "./component/index.vue";

export const createVueComponent = (root: any, insideChange: { value: boolean }) => {
  const component = defineComponent({
    template: `<router-config ref="routerConfig" :root="root" :insideChange="insideChange" />`,
    setup() {
      const routerConfig = ref();

      /**
       * 组件外部更新元件源
       * @param value
       */
      function changeSelectedComponent(value: string) {
        try {
          routerConfig.value?.changeSelectedComponent(value);
        } catch (error) {}
      }

      /**
       * 变更运行/设计状态
       * @param value
       */
      function changeContextType(value: boolean) {
        try {
          routerConfig.value?.changeContextType(value);
        } catch (error) {}
      }

      return {
        root,
        insideChange,
        routerConfig,
        changeSelectedComponent,
        changeContextType,
      };
    },
  });

  root.componentInstance = createApp(component);
  root.componentInstance.use(ConfigProvider);
  root.componentInstance.use(Select);
  root.componentInstance.use(Input);
  root.componentInstance.use(Button);
  root.componentInstance.use(Tooltip);
  root.componentInstance.use(Switch);
  root.componentInstance.use(Modal);
  root.componentInstance.use(Drawer);
  root.componentInstance.use(Spin);
  root.componentInstance.use(Tabs);
  root.componentInstance.use(Tree);
  root.componentInstance.use(Radio);
  root.componentInstance.use(Divider);
  root.componentInstance.use(Collapse);
  root.componentInstance.use(Popconfirm);
  root.componentInstance.component("RouterConfig", RouterConfig);
  root.componentInstance.component("EyeOutlined", EyeOutlined);
  root.componentInstance.component("CopyOutlined", CopyOutlined);
  root.componentInstance.component("FormOutlined", FormOutlined);
  root.componentInstance.component("DeleteOutlined", DeleteOutlined);
  root.componentInstance.component("PlusOutlined", PlusOutlined);
  root.componentInstance.component("CloseCircleOutlined", CloseCircleOutlined);
  root.componentInstance.component("SyncOutlined", SyncOutlined);
  root.componentInstance.component("BulbOutlined", BulbOutlined);
  root.componentInstance.component("CodeOutlined", CodeOutlined);
  root.componentInstance.component("PartitionOutlined", PartitionOutlined);
  root.componentInstance.component("LogoutOutlined", LogoutOutlined);
  root.componentInstance.component("LoginOutlined", LoginOutlined);
  root.componentInstance.component("QuestionCircleOutlined", QuestionCircleOutlined);
  root.componentInstance.mount(root.container);
};

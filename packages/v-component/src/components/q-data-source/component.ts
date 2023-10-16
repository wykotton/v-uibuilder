import { createApp, defineComponent, ref } from "vue";
import { cloneDeep } from "lodash-es";
import {
  Select,
  Dropdown,
  Menu,
  Button,
  Tooltip,
  Switch,
  Textarea,
  message,
  Drawer,
  MenuItem,
  MenuDivider,
  MenuItemGroup,
  SubMenu,
  DropdownButton,
} from "ant-design-vue";
import Input from "ant-design-vue/lib/input";
import InputNumber from "ant-design-vue/lib/input-number";
import Radio from "ant-design-vue/lib/radio";
import Modal from "ant-design-vue/lib/modal";
import Spin from "ant-design-vue/lib/spin";
import Divider from "ant-design-vue/lib/divider";
import {
  DownOutlined,
  EyeOutlined,
  CopyOutlined,
  FormOutlined,
  DeleteOutlined,
  PlusOutlined,
  CloseCircleOutlined,
  ArrowsAltOutlined,
  CodeOutlined,
} from "@ant-design/icons-vue";
import TypographyLink from "ant-design-vue/lib/typography";
import Popconfirm from "ant-design-vue/lib/popconfirm";
// import ConfigProvider from "ant-design-vue/lib/config-provider";
import axios from "axios";
import fetchJsonp from "fetch-jsonp";
import DataSource from "./component/index.vue";

export const createVueComponent = (root: any, insideChange: { value: boolean }) => {
  const data = cloneDeep(root.source);
  const component = defineComponent({
    template: `
      <data-source ref="dataSource" :data="data" :root="root" :insideChange="insideChange"></data-source>
    `,
    setup() {
      const dataSource = ref();

      function initiateRequest(params: any) {
        dataSource.value?.initiateRequest(params);
      }
      function updateRequestParams(params: any) {
        dataSource.value?.updateRequestParams(params);
      }
      function switchPolling(params: any) {
        dataSource.value?.switchPolling(params);
      }

      return {
        root,
        data,
        insideChange,
        dataSource,
        initiateRequest,
        updateRequestParams,
        switchPolling,
      };
    },
  });

  root.componentInstance = createApp(component);
  // root.componentInstance.use(ConfigProvider);
  root.componentInstance.use(Select);
  root.componentInstance.use(TypographyLink);
  root.componentInstance.use(Popconfirm);
  root.componentInstance.use(Input);
  root.componentInstance.use(Dropdown);
  root.componentInstance.use(DropdownButton);
  root.componentInstance.use(Menu);
  root.componentInstance.use(MenuItem);
  root.componentInstance.use(MenuDivider);
  root.componentInstance.use(MenuItemGroup);
  root.componentInstance.use(SubMenu);
  root.componentInstance.use(Button);
  root.componentInstance.use(Tooltip);
  root.componentInstance.use(Switch);
  root.componentInstance.use(InputNumber);
  root.componentInstance.use(Textarea);
  root.componentInstance.use(Modal);
  root.componentInstance.use(Drawer);
  root.componentInstance.use(Spin);
  root.componentInstance.use(message);
  root.componentInstance.use(Radio);
  // root.componentInstance.use(RadioGroup);
  // root.componentInstance.use(RadioButton);
  root.componentInstance.use(Divider);
  root.componentInstance.use("axios", axios);
  // root.componentInstance.use("fetchJsonp", fetchJsonp);
  root.componentInstance.config.globalProperties.fetchJsonp = fetchJsonp;
  root.componentInstance.component("DataSource", DataSource);
  root.componentInstance.component("DownOutlined", DownOutlined);
  root.componentInstance.component("EyeOutlined", EyeOutlined);
  root.componentInstance.component("CopyOutlined", CopyOutlined);
  root.componentInstance.component("FormOutlined", FormOutlined);
  root.componentInstance.component("DeleteOutlined", DeleteOutlined);
  root.componentInstance.component("PlusOutlined", PlusOutlined);
  root.componentInstance.component("CloseCircleOutlined", CloseCircleOutlined);
  root.componentInstance.component("ArrowsAltOutlined", ArrowsAltOutlined);
  root.componentInstance.component("CodeOutlined", CodeOutlined);
  root.componentInstance.mount(root.container);
};

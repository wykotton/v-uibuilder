import { createApp, defineComponent, reactive, ref } from "vue";
import { cloneDeep } from "lodash-es";
import { Button, Tooltip, message, Modal, ConfigProvider } from "ant-design-vue";
import Input from "ant-design-vue/lib/input";
import {
  EyeOutlined,
  CopyOutlined,
  FormOutlined,
  DeleteOutlined,
  PlusOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons-vue";
import zhCN from "ant-design-vue/lib/locale/zh_CN";

export const createVueComponent = (root: any, insideChange: { value: boolean }) => {
  const data = cloneDeep(root.value);
  const component = defineComponent({
    template: `
            <a-config-provider :locale="zhCN">
              <div class="router-container">
                <div class="title">脚本配置</div>
                <div class="search-input">
                  <a-input-search
                    v-model:value="searchText"
                    placeholder="请输入查询关键字"
                    @search="onSearch"
                  ></a-input-search>
                </div>
                <div style="display: flex; align-items: center; margin-top: 10px">
                  <a-button style="width : 90px" @click="openScriptModal('add')">
                    新建
                    <plus-outlined />
                  </a-button>
                </div>
                <div v-for="(item, index) in tempScriptConfig" class="router-card">
                  <div>
                    <div class="card-title">{{ item.title }}</div>
                    <div class="card-key">{{ item.key }}</div>
                  </div>
                  <a-tooltip placement="bottom">
                    <template #title>
                    <span>查看</span>
                    </template>
                    <eye-outlined :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: 'auto' }" @click="openScriptModal('see',item.key)" />
                  </a-tooltip>
                  <a-tooltip placement="bottom">
                    <template #title>
                    <span>编辑</span>
                    </template>
                    <form-outlined :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }" @click="openScriptModal('edit',item.key)" />
                  </a-tooltip>
                  <a-tooltip placement="bottom">
                    <template #title>
                    <span>删除</span>
                    </template>
                    <delete-outlined :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }" @click="openScriptModal('delete',item.key)" />
                  </a-tooltip>
                  <a-tooltip placement="bottom">
                    <template #title>
                    <span>复制</span>
                    </template>
                    <copy-outlined :style="{ fontSize: '18px', color: '#8F9BB3', marginLeft: '6px' }" @click="openScriptModal('copy',item.key)" />
                  </a-tooltip>
                </div>
                <a-modal v-model:visible="modalVisible" v-if="modalVisible" :title="modalTitle" :maskClosable="false" width="80%" @ok="handleDataInfo">
                  <div style="overflow: auto;background: white;position: relative;">
                    <div style="display: flex; align-items: center; margin-top: 20px">
                      <div style="width: 100px; text-align: right"><span style="color: red">*</span>配置项名称: </div>
                      <div style="width: 350px; margin-left: 10px">
                        <a-input v-model:value="tempDataInfo.title" :disabled="modalType==='see'" placeholder="请输入名称" />
                      </div>
                    </div>
                    <div style="display: flex; align-items: center; margin-top: 20px">
                      <div style="width: 100px; text-align: right"><span style="color: red">*</span>配置项key: </div>
                      <div style="width: 350px; margin-left: 10px">
                        <a-input v-model:value="tempDataInfo.key" :disabled="modalType==='see'" placeholder="请输入key" />
                      </div>
                    </div>
                    <div style="display: flex; margin-top: 20px; max-height: 500px;overflow: hidden">
                      <div style="width: 100px; text-align: right"><span style="color: red">*</span>脚本内容: </div>
                      <div style="width: 90%; margin-left: 10px;">
                        <q-code-editor ref="codeEditor" :value="tempDataInfo.script" language="javascript" :readOnly="modalType==='see'" style="width:100%;height:600px;display: block"></q-code-editor>
                      </div>
                    </div>
                  </div>
                </a-modal>
              </div>
            </a-config-provider>
            `,
    setup() {
      const defaultInfo = {
        title: "",
        key: "",
        script: "",
      };
      const tempDataInfo = ref(cloneDeep(defaultInfo));
      const codeEditor = ref(null);

      /**
       * 搜索脚本配置项
       */
      const searchText = ref("");
      const tempScriptConfig = ref(cloneDeep(data));
      const onSearch = (value: string) => {
        tempScriptConfig.value = [];
        data.forEach((item: any) => {
          if (item.title.includes(value) || item.key.includes(value)) {
            tempScriptConfig.value.push(item);
          }
        });
      };

      /**
       * 配置项操作
       */
      const modalVisible = ref(false);
      const modalType = ref("");
      const modalTitle = ref("");
      const handleScriptKey = ref("");
      const componentsArr = reactive({ value: <any>[] });
      const receiveComponentsArr = reactive({ value: <any>[] });
      const triggerArr = reactive({ value: <any>[] });
      const receiveEventArr = reactive({ value: <any>[] });
      const openScriptModal = (e: any, key: string) => {
        const type = e.key || e;
        handleScriptKey.value = key;
        modalType.value = type;
        const scriptIndex = data.findIndex((item: any) => item.key === key);
        switch (type) {
          case "add":
            tempDataInfo.value = cloneDeep(defaultInfo);
            modalTitle.value = "创建脚本配置项";
            modalVisible.value = true;
            break;
          case "see":
            if (scriptIndex === -1) return;
            tempDataInfo.value = cloneDeep(data[scriptIndex]);
            modalTitle.value = "查看脚本配置项 " + tempDataInfo.value.title;
            modalVisible.value = true;
            break;
          case "edit":
            if (scriptIndex === -1) return;
            tempDataInfo.value = cloneDeep(data[scriptIndex]);
            modalTitle.value = "编辑脚本配置项 " + tempDataInfo.value.title;
            modalVisible.value = true;
            break;
          case "delete":
            if (scriptIndex === -1) return;
            Modal.confirm({
              title: "确定要删除吗?",
              okText: "确定",
              cancelText: "取消",
              onOk() {
                data.splice(scriptIndex, 1);
                onSearch(searchText.value);
                changeElementData();
              },
            });
            break;
          case "copy":
            if (scriptIndex === -1) return;
            tempDataInfo.value = cloneDeep(data[scriptIndex]);
            modalTitle.value = "复制脚本配置项 " + tempDataInfo.value.title;
            modalVisible.value = true;
            break;
        }
      };

      /**
       * 弹窗确定操作
       * @returns
       */
      const handleDataInfo = () => {
        if (!modalType.value) {
          message.destroy();
          message.error("程序操作类型出错!");
          return;
        }
        // 获取脚本内容
        const code = (codeEditor.value as any)?.getValue();
        if (code) {
          tempDataInfo.value.script = code;
        }
        if (!tempDataInfo.value.title || !tempDataInfo.value.key || !tempDataInfo.value.script) {
          message.destroy();
          message.error("缺少必填参数");
          return;
        }
        let repeatKey = false;
        const tempDataList = cloneDeep(data);
        switch (modalType.value) {
          case "add":
          case "copy":
            tempDataList.forEach((item: any) => {
              if (item.key === tempDataInfo.value.key) repeatKey = true;
            });
            if (repeatKey) {
              message.destroy();
              message.error("脚本key重复, 已存在该脚本!");
              return;
            }
            data.push(cloneDeep(tempDataInfo.value));
            onSearch(searchText.value);
            modalVisible.value = false;
            break;
          case "edit":
            const scriptIndex = tempDataList.findIndex((item: any) => item.key === handleScriptKey.value);
            if (scriptIndex === -1) return;
            tempDataList.splice(scriptIndex, 1);
            tempDataList.forEach((item: any) => {
              if (item.key === tempDataInfo.value.key) repeatKey = true;
            });
            if (repeatKey) {
              message.destroy();
              message.error("脚本key重复, 已存在该脚本!");
              return;
            }
            data[scriptIndex] = tempDataInfo.value;
            onSearch(searchText.value);
            modalVisible.value = false;
            break;
          default:
            modalVisible.value = false;
        }
        changeElementData();
      };

      /**
       * 更新组件value
       */
      const changeElementData = () => {
        insideChange.value = true;
        root.value = cloneDeep(data);
      };

      return {
        searchText,
        tempScriptConfig,
        modalVisible,
        modalType,
        modalTitle,
        tempDataInfo,
        zhCN,
        componentsArr,
        receiveComponentsArr,
        triggerArr,
        receiveEventArr,
        codeEditor,
        onSearch,
        openScriptModal,
        handleDataInfo,
      };
    },
  });

  root.componentInstance = createApp(component);
  root.componentInstance.use(ConfigProvider);
  root.componentInstance.use(Input);
  root.componentInstance.use(Button);
  root.componentInstance.use(Tooltip);
  root.componentInstance.use(Modal);
  root.componentInstance.component("EyeOutlined", EyeOutlined);
  root.componentInstance.component("CopyOutlined", CopyOutlined);
  root.componentInstance.component("FormOutlined", FormOutlined);
  root.componentInstance.component("DeleteOutlined", DeleteOutlined);
  root.componentInstance.component("PlusOutlined", PlusOutlined);
  root.componentInstance.component("CloseCircleOutlined", CloseCircleOutlined);
  root.componentInstance.mount(root.container);
};

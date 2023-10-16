import { createApp, defineComponent, /* onMounted, */ref, toRefs, reactive } from "vue";
import {
  Button,
  Upload,
  Modal,
  message,
  ConfigProvider,
  UploadChangeParam,
  UploadProps
} from "ant-design-vue";
import { UploadOutlined, LoadingOutlined, PlusOutlined, InboxOutlined } from "@ant-design/icons-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { cloneDeep } from "lodash-es";
import { enumFilter } from "../../util/dict";
import { onSendMessage } from "../../util/utils";
import { AxiosRequestHeaders } from "axios";

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// function getBase64(img: Blob, callback: (base64Url: string) => void) {
//   const reader = new FileReader();
//   reader.addEventListener('load', () => callback(reader.result as string));
//   reader.readAsDataURL(img);
// }

export const createVueComponent = (root: any) => {
  const component = defineComponent({
    template: `
      <a-config-provider :locale="zhCN">
        <div class="q-upload-wrap">
          <a-upload
            :accept="accept"
            v-model:file-list="fileLists"
            :class="enumFilter('uploadListType', listType)+'-uploader'"
            :show-upload-list="listType !== '头像展示'"
            :list-type="'区域拖拽' === listType ? 'text' : '头像展示' === listType ? 'picture-card' : enumFilter('uploadListType', listType)"
            :name="name"
            :action="action"
            :headers="headers"
            :data="requestData"
            :max-count="maxCount"
            :multiple="listType === '区域拖拽'"
            @change="handleChange"
            :before-upload="beforeUpload"
            @preview="handlePreview"
            @drop="handleDrop"
          >
          <template v-if="listType === '照片墙'">
            <div v-if="fileList.length < maxCount">
              <plus-outlined />
              <div style="margin-top: 8px">{{btnTxt}}</div>
            </div>
          </template>
          <template v-else-if="listType === '头像展示'">
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <div v-else>
              <loading-outlined v-if="loading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">{{btnTxt}}</div>
            </div>
          </template>
          <template v-else-if="listType === '区域拖拽'">
            <p class="ant-upload-drag-icon">
              <inbox-outlined></inbox-outlined>
            </p>
            <div v-html="btnDescribe"></div>
          </template>
          <template v-else>
            <a-button>
              <upload-outlined></upload-outlined>
              {{btnTxt}}
            </a-button>
          </template>
        </a-upload>
        </div>
      </a-config-provider>
      <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
        <img :alt="previewTitle" style="width: 100%" :src="previewImage" />
      </a-modal>
    `,
    components: {
      UploadOutlined,
      LoadingOutlined,
      PlusOutlined,
      InboxOutlined
    },
    setup(props: any) {
      const fileLists = ref<UploadProps['fileList']>(root.fileList);
      const loading = ref<boolean>(false);
      const imageUrl = ref<string>('');

      const previewVisible = ref(false);
      const previewImage = ref('');
      const previewTitle = ref('');

      let headers = {}, requestData={};
      try {
        headers = JSON.parse(root.headers)
      } catch (error) {}
      try {
        requestData = JSON.parse(root.requestData)
      } catch (error) {}

      const state = reactive<{
        fileList: Array<any>;
        headers: AxiosRequestHeaders;
        requestData: {[key: string]: any;};
        action: string;
        name: string;
        btnTxt: string;
        btnDescribe: string;
        listType: string;
        maxCount: number;
        accept: number;
        filePath: string;
      }>({
        fileList: root.fileList,
        headers,
        requestData,
        action: root.action,
        name: root.name,
        btnTxt: root.btnTxt,
        btnDescribe: root.btnDescribe,
        listType: root.listType,
        maxCount: root.maxCount,
        accept: root.accept,
        filePath: root.filePath,
      });
      // 处理变更
      const handleChange = ({ file, fileList }: UploadChangeParam) => {
        if (file.status === 'uploading') {
          loading.value = true;
          return;
        }
        if (file.status === "done") {
          // file.url = file.response.data.file
          // const { uid, name, response: { data: { file: url } } } = file
          const { uid, name, response, status} = file
          const getValArr = (state.filePath || 'data.file').split(".")
          let url = cloneDeep(response);
          getValArr.map(v => {
            url = url[v]
          })

          if (state.listType === '头像展示') {
            getBase64(file.originFileObj as File).then((base64Url: any) => {
              console.log(base64Url)
              imageUrl.value = base64Url;
              loading.value = false;
            });
            state.fileList=[{ uid, name, url, status }]
          } else {
            state.fileList.push({ uid, name, url, status })
          }
          console.log(file, fileList)
          message.success('上传成功');
        }
        if (file.status === 'error') {
          loading.value = false;
          message.error('上传失败');
        }
        onSendMessage(root, { file, fileList }, { srcType: "onChange" })
      };
      // 上传前
      const beforeUpload:UploadProps['beforeUpload'] = (file, fileList) => {
        return root.componentModel.model.lifeCycle.beforeUpload(file, fileList)
      };
      // 取消
      const handleCancel = () => {
        previewVisible.value = false;
        previewTitle.value = '';
      };
      // 预览
      const handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
          if (!file.originFileObjif) return message.error("数据格式不正确")
          file.preview = (await getBase64(file.originFileObj)) as string;
        }
        previewImage.value = file.url || file.preview;
        previewVisible.value = true;
        previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
      };
      // 拖放上传后
      const handleDrop = (e: DragEvent) => {
        console.log(e);
      }

      return {
        fileLists,
        loading,
        imageUrl,
        previewVisible,
        previewImage,
        previewTitle,
        ...toRefs(state),
        zhCN,
        enumFilter,
        handleChange,
        beforeUpload,
        handleCancel,
        handlePreview,
        handleDrop
      };
    },
  });

  root.componentInstance = createApp(component);
  root.componentInstance.use(ConfigProvider);
  root.componentInstance.use(Button);
  root.componentInstance.use(Upload);
  root.componentInstance.use(Modal);
  root.componentInstance.use(message);
  root.componentInstance.mount(root.container);
};

<template>
  <a-spin :spinning="componentsLoading">
    <a-input-search
      @search="searchComponents"
      v-model:value="searchText"
      placeholder="输入组件名查询"
      class="w-full py-12px"
    ></a-input-search>
    <div ref="compRef">
      <div class="flex justify-between">
        <a-cascader
          v-model:value="cascaderValue"
          :dropdownStyle="{ width: '15%' }"
          placeholder="请选择操作"
          :options="protocalOptions"
        ></a-cascader>
        <a-button class="!flex items-center" @click="handleAction">
          <sync-outlined />
          执行设置
        </a-button>
      </div>
      <a-tabs v-model:activeKey="tabsActiveKey">
        <a-tab-pane v-for="(item, index) in group" :key="index" :tab="item">
          <a-collapse v-model:activeKey="activeKey[index]">
            <template v-for="(panel, pIndex) in componentSchema">
              <a-collapse-panel
                :header="panel[0]"
                :key="pIndex"
                v-if="panel[1].some((current: any) => current?.group?.includes(item))"
              >
                <ul class="com-menu-ul">
                  <template v-for="com in panel[1]">
                    <li
                      class="com-menu-li cursor-pointer"
                      draggable="true"
                      :key="com?.componentName"
                      :data-tag="com?.componentName"
                      :data-options="JSON.stringify(com || '{}')"
                      @mouseover="saveTagetComponent($event, com)"
                      v-if="com?.group?.includes(item)"
                    >
                      <div class="com-menu-item" :title="com.text">
                        <img class="h-32px w-32px" draggable="false" :src="com.image || emptyImage" alt="暂无略缩图" />
                        <span class="com-menu-name" v-html="com.highlights || com.text"></span>
                      </div>
                      <div class="com-item-tips" v-if="com?.group.length && com?.group.indexOf('UIB原子组件') !== -1">
                        <a-tooltip title="查看帮助">
                          <a :href="`${VITE_GLOB_DOCS_ADDRESS}/component/${com?.componentName}.html`" target="_blank">
                            <question-circle-outlined />
                          </a>
                        </a-tooltip>
                        <a-tooltip title="查看源码">
                          <a @click="viewSourceCode(com)"><gitlab-outlined /></a>
                        </a-tooltip>
                        <a-tooltip title="查看产物">
                          <a :href="com?.componentPath" target="_blank"><file-zip-outlined /></a>
                        </a-tooltip>
                      </div>
                    </li>
                  </template>
                </ul>
              </a-collapse-panel>
            </template>
          </a-collapse>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-spin>
  <a-modal v-model:visible="vscVisible" :title="vscTitle">
    <template #footer>
      <a-button key="back" @click="vscVisible = false">关闭</a-button>
    </template>
    <a-timeline>
      <a-timeline-item v-for="item in VersionHistory" :key="item.commit.id">
        <template #dot><tag-outlined style="font-size: 16px" /></template>
        <div class="ver-his-item">
          <span>版本{{ item.name }}</span>
          <a-tag>{{ formatDate(item.commit.created_at) }}</a-tag>
          <a-tag color="green">最新</a-tag>
          <a-tooltip>
            <template #title>查看访问</template>
            <a
              class="visit-sc"
              :href="`${VITE_GIT_URL}/gitlab-instance-f34eb8d7/v-uibuilder/-/raw/${item.name}/packages/v-component/src/components/${comComponentName}/${comComponentName}.ts`"
              target="_blank"
            >
              <node-index-outlined />
              <span>{{ item.commit.short_id }}</span>
            </a>
          </a-tooltip>
        </div>
      </a-timeline-item>
    </a-timeline>
  </a-modal>
</template>
<script setup lang="ts">
import {
  QuestionCircleOutlined,
  GitlabOutlined,
  FileZipOutlined,
  TagOutlined,
  SyncOutlined,
  NodeIndexOutlined,
} from "@ant-design/icons-vue";
import { dragDrop } from "@/utils/dragdrop/index";
import { cloneDeep } from "lodash-es";
import { getComponents, componentsAction, dataSearch } from "@/composition/index";
import emptySvg from "@/assets/svg/empty-component.svg";
import { useAppStoreWithOut } from "@/store/modules/app";
import { IComponentWarehouse } from "@/types/IPageModel";
import { ComponentProtocolEnum } from "@/enums/appEnum";
import axios from "axios";
import { message } from "ant-design-vue";

// pinia
const useAppStore = useAppStoreWithOut();

const componentsLoading = ref(true);
const group = ref([]);
const activeKey = ref([[], [], []]);
const compRef = ref(null);
const componentSchema = ref();
const componentsList = ref<any>([]);
const tabsActiveKey = ref(0);
const emptyImage = ref(emptySvg);
// const selectWarehouse = ref();
const pageModel = useAppStore.pageModel;
const cascaderValue = ref<string[]>([]);
const optionsChildren = useAppStore.getComponentWarehouse?.map(({ name }: IComponentWarehouse) => ({
  value: name,
  label: name,
}));
const protocalOptions = ref([
  {
    value: ComponentProtocolEnum.REFRESH,
    label: "刷新仓库",
    children: optionsChildren,
  },
  {
    value: ComponentProtocolEnum.IMPORT,
    label: "元件导入",
    children: optionsChildren,
  },
  {
    value: ComponentProtocolEnum.EXPORT,
    label: "元件导出",
    children: optionsChildren,
  },
  {
    value: ComponentProtocolEnum.DELETE,
    label: "元件删除",
    children: optionsChildren,
  },
]);
const comComponentName = ref("");
const vscVisible = ref(false);
const vscTitle = ref("");
const { VITE_GLOB_DOCS_ADDRESS, VITE_GIT_URL, VITE_GIT_ACCESS_TOKEN } = import.meta.env;
/**
 * 刷新元件仓库
 */
async function useGetComponent() {
  // componentsAction(selectWarehouse.value, { type: ComponentProtocolEnum.REFRESH, body: pageModel });
  // setTimeout(async () => {
  //   componentsList.value = getComponents();
  //   componentSchema.value = await transformSchema(componentsList.value);
  // }, 100);
  componentsList.value = getComponents();
  componentSchema.value = await transformSchema(componentsList.value);
}
onMounted(() => {
  useGetComponent();
});
defineExpose({
  useGetComponent,
});

/**
 * 注册组件拖拽事件
 */
watchEffect(() => {
  if (!compRef.value) return;
  dragDrop.dragStart(compRef.value);
});

/**
 * 返回注册元件数据
 * @param components
 */
async function transformSchema(components: any[]) {
  const componentMap = new Map();
  componentsLoading.value = true;

  for await (const current of components) {
    const { type = "", group: tGroup = [] } = current;
    const modelGroup = tGroup;
    const modelType = type;

    Object.assign(group.value, [...new Set([...group.value, ...modelGroup])]);

    if (!modelType) {
      console.error(`组件类型不存在`);
      continue;
    }
    if (!componentMap.has(modelType)) {
      componentMap.set(modelType, []);
    }
    componentMap.get(modelType).push(cloneDeep(current));
  }
  componentsLoading.value = false;
  return componentMap;
}

/**
 * 查询元件
 */
const searchText = ref("");
async function searchComponents() {
  if (!searchText.value) {
    componentSchema.value = await transformSchema(componentsList.value);
    return;
  }
  const results = dataSearch(componentsList.value, searchText.value, "component");
  componentSchema.value = await transformSchema(results);
}

function saveTagetComponent(ev: MouseEvent, component: any) {
  if (!ev.target) return;
  Reflect.set(ev.target, "component", component);
}

/**
 * 处理仓库操作
 */
function handleAction() {
  if (!cascaderValue.value || !cascaderValue.value[0] || !cascaderValue.value[1]) {
    message.destroy();
    message.warning("请选择操作项!");
    return;
  }
  componentsAction(cascaderValue.value[1], {
    type: cascaderValue.value[0] as ComponentProtocolEnum,
    body: pageModel,
  });
  switch (cascaderValue.value[0]) {
    case ComponentProtocolEnum.REFRESH:
      setTimeout(async () => {
        await useGetComponent();
        message.destroy();
        message.success("元件仓库已刷新");
      }, 200);
      break;
    default:
      break;
  }
}

/**
 * 查看源代码
 */
const VersionHistory = ref<any>([]);

function viewSourceCode(val: any) {
  vscTitle.value = `${val.group} - ${val.text} - 历史版本`
  comComponentName.value = val.componentName
  axios.get(`${VITE_GIT_URL}/api/v4/projects/4/repository/tags?id=1`, {
    headers: { "PRIVATE-TOKEN": VITE_GIT_ACCESS_TOKEN }
  }).then((res) => {
    // console.log(res)
    if (res?.data.length) {
      VersionHistory.value = res.data
    }
  })
  vscVisible.value = true
}

function formatDate(date: string) {
  // console.log(date)
  return new Date(date).toLocaleString()
}

/**
 * 监听自动刷新
 */
const autoRefresh = inject("autoRefresh");
watch([autoRefresh], () => {
  useGetComponent();
});
</script>
<style lang="scss" scoped>
.com-menu-ul {
  width: 100%;
  margin: 0;
}

.com-menu-li {
  width: 33.33%;
  max-width: 150px;
  height: 100px;
  position: relative;
  float: left;
  padding: 16px 8px;
  overflow: hidden;
  border-right: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
  transition: box-shadow 0.2s ease, -webkit-box-shadow 0.2s ease;
  .com-item-tips {
    transition: 0.3s;
    opacity: 0;
    transform: translateY(100%);
    display: block;
    width: 100%;
    height: 24px;
    color: #565656;
    background-color: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 18px;
    display: flex;
    box-shadow: 0px -5px 4px 0px #0000000d;
    > a {
      flex: 1;
      text-align: center;
      line-height: 16px;
      &:hover {
        color: #40a9ff;
      }
    }
  }
  &:hover {
    .com-item-tips {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
.com-menu-li:hover {
  -webkit-box-shadow: 0 6px 16px 0 rgb(0 0 0 / 15%);
  box-shadow: 0 6px 16px 0 rgb(0 0 0 / 15%);
  border-color: transparent;
}

.com-menu-item {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.com-menu-name {
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.7);
  text-align: center;
  margin-top: auto;
}

::v-deep(.highlights-text) {
  color: #ff5134;
}

::v-deep(.ant-collapse-content-box) {
  padding: 0 !important;
}
::v-deep(.ant-collapse-content) {
  overflow: hidden;
}
// 版本历史
.ver-his-item {
  padding: 3px;
  .ant-tag {
    margin-left: 10px;
  }
  .visit-sc {
    span {
      vertical-align: middle;
    }
    &:hover {
      border-bottom: 1px #1890ff solid;
    }
  }
}
</style>

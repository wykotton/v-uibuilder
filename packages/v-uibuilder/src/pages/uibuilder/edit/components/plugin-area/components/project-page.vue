<template>
  <div class="page-container">
    <a-spin :spinning="loading">
      <a-input-search
        @search="searchPage"
        v-model:value="searchText"
        placeholder="输入页面名查询"
        class="w-full mb-10px"
      ></a-input-search>
      <div v-for="item in tempPageList">
        <div
          class="page-card"
          :style="{ backgroundColor: String(currentId) === String(item.id) ? 'rgb(145, 213, 255)' : '' }"
        >
          <div :class="{ 'item-card-wrap': true, editing: editId === item.id }">
            <div class="item-preview" :style="`background-image:url()`"></div>
            <div class="item-info">
              <div v-if="editId === item.id" class="item-name-input">
                <a-input
                  ref="renameInput"
                  v-model:value="editPageName"
                  show-count
                  :maxlength="30"
                  @pressEnter="renamePage"
                />
                <a-button @click="editId = ''">取消</a-button>
              </div>
              <span
                v-else
                @dblclick.stop="beginEdit(item.id)"
                title="双击修改名称"
                v-html="item.highlights || item.page_name"
              ></span>
              <div class="extra">
                <div class="option">
                  <div>
                    <div>ID: {{ item.id }}</div>
                    <div>修改时间 {{ item.update_time }}</div>
                  </div>
                  <q-button @click.stop="handleDelete(item.id)" title="删除" type="text" style="margin-left: auto">
                    <DeleteOutlined :style="{ fontSize: '18px', color: 'red' }"></DeleteOutlined>
                  </q-button>
                </div>
              </div>
            </div>
            <div class="item-forward">
              <q-button @click.stop="handlePreview(item.id)" title="预览" type="text">
                <svg
                  t="1665372662278"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                >
                  <path
                    d="M928.842245 512.091074c0-5.006014-0.846274-9.193383-1.086751-9.691733-0.182149-2.480494-1.028423-7.001461-1.815345-9.374508-0.210801-0.590448-0.484024-1.209548-0.724501-1.799996-0.424672-1.360997-0.876973-2.691295-1.390673-3.749394-76.871785-168.137395-242.376213-281.144168-411.782507-281.144168-169.375595 0-334.865697 112.902396-411.388535 280.130072-0.921999 1.815345-1.572822 3.553942-1.981121 5.066389-0.181125 0.49835-0.39295 0.967024-0.558725 1.406023-1.512447 4.430916-1.542122 7.514137-1.421372 6.712889-0.710175 3.251044-1.360997 9.722432-1.360997 9.722432-0.181125 1.949398-0.181125 3.50687 0.030699 5.442966 0 0 0.649799 5.65479 0.968048 6.80294 0.090051 1.602498 0.483001 3.931542 0.951675 6.048763l-0.030699 0c0.408299 1.814322 0.968048 3.568269 1.738597 5.291516 0.393973 1.330298 0.862647 2.570545 1.270946 3.507894 76.976162 168.166047 242.436588 281.20352 411.781484 281.20352 169.436994 0 334.941422-112.945375 410.936233-279.328823 1.177825-2.177596 1.935072-4.233418 2.448772-6.018064 0.2415-0.543376 0.454348-1.027399 0.604774-1.511423 1.331321-3.872191 1.602498-7.227612 1.481747-7.227612l-0.028653 0.029676C928.027693 520.921183 928.842245 516.89959 928.842245 512.091074zM872.717993 514.146896c-0.029676 0.121773-0.091074 0.272199-0.151449 0.393973-0.090051 0.36225-0.240477 0.785899-0.332575 1.209548-68.403926 147.420561-212.830293 246.337431-360.191502 246.337431-146.997935 0-291.168476-98.642624-360.252901-246.578931-0.166799-0.5137-0.287549-0.998747-0.468674-1.481747-0.030699-0.484024-0.12075-0.876973-0.150426-1.150196-0.060375-0.300852-0.12075-0.724501-0.166799-1.088798l0-0.3776c0.166799-0.620124 0.286526-1.239224 0.347924-1.919722 0.12075-0.36225 0.211824-0.710175 0.347924-1.103124C220.132094 360.89042 364.680235 261.928524 512.041444 261.928524c147.420561 0 291.940049 99.051947 360.161826 246.322082 0.060375 0.287549 0.121773 0.530073 0.212848 0.726547 0.060375 0.2415 0.119727 0.484024 0.240477 0.740874 0.151449 1.104147 0.272199 2.192945 0.423649 2.736321C872.899118 513.028423 872.809067 513.572822 872.717993 514.146896z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M512.041444 373.060601c-76.598562 0-138.954749 62.325487-138.954749 138.939399 0 76.598562 62.356187 138.954749 138.954749 138.954749 76.598562 0 138.954749-62.356187 138.954749-138.954749C650.996193 435.386088 588.640006 373.060601 512.041444 373.060601zM512.041444 595.372849c-45.935192 0-83.371826-37.406958-83.371826-83.371826 0-45.950542 37.436634-83.356476 83.371826-83.356476 45.964868 0 83.373873 37.406958 83.373873 83.356476C595.414293 557.965891 558.006312 595.372849 512.041444 595.372849z"
                    fill="currentColor"
                  ></path>
                </svg>
              </q-button>
              <q-button @click.stop="handleEdit(item.id)" title="编辑" type="text">
                <svg
                  t="1665480148794"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                >
                  <path
                    d="M862.709333 116.042667a32 32 0 1 1 45.248 45.248L455.445333 613.813333a32 32 0 1 1-45.258666-45.258666L862.709333 116.053333zM853.333333 448a32 32 0 0 1 64 0v352c0 64.8-52.533333 117.333333-117.333333 117.333333H224c-64.8 0-117.333333-52.533333-117.333333-117.333333V224c0-64.8 52.533333-117.333333 117.333333-117.333333h341.333333a32 32 0 0 1 0 64H224a53.333333 53.333333 0 0 0-53.333333 53.333333v576a53.333333 53.333333 0 0 0 53.333333 53.333333h576a53.333333 53.333333 0 0 0 53.333333-53.333333V448z"
                    fill="currentColor"
                  ></path>
                </svg>
              </q-button>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
    <div class="page-add-btn">
      <a-button @click="createNewPage" block>新建页面</a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { DeleteOutlined } from "@ant-design/icons-vue";
import { cloneDeep } from "lodash-es";
import { useAppStoreWithOut } from "@/store/modules/app";
import { message, Modal } from "ant-design-vue";
import { workspaceGetProjectApi, workspaceModifyPageApi } from "@/api/uibuilder/workspace";
import { managementDeleteApi } from "@/api/uibuilder/management";
import { useRouter, useRoute } from "vue-router";
import { closeChildPage, createPage, resetChildPage } from "@/composition/index";
import { EditTypeEnum } from "@/enums/appEnum";

// pinia
const useAppStore = useAppStoreWithOut();

// 路由对象
const router = useRouter();
const route = useRoute();

interface IPageInfo {
  id: string;
  page_name: string;
  highlights?: string;
  update_time: string;
}
const loading = ref(false);
const editPageName = ref("");
const editId = ref("");
const pageList = ref<IPageInfo[]>([]);
const tempPageList = ref<IPageInfo[]>([]);
const renameInput = ref();
const currentId = computed(() => route.query.id);

/**
 * 查询页面
 */
const searchText = ref("");
async function searchPage() {
  if (!searchText.value) {
    tempPageList.value = pageList.value;
    return;
  }
  tempPageList.value = [];
  cloneDeep(pageList.value).forEach((item: IPageInfo) => {
    let temp = { ...item };
    const nameReg = item.page_name?.indexOf(searchText.value) > -1;
    if (nameReg) {
      let replaceReg = new RegExp(searchText.value, "g"); // 匹配关键字正则
      let replaceString = '<span style="color: red">' + searchText.value + "</span>"; // 高亮替换v-html值
      temp["highlights"] = temp.page_name.replace(replaceReg, replaceString);
      tempPageList.value.push(temp);
    }
  });
}

/**
 * 检查name合法性
 */
function checkName() {
  let status = true;
  const reg = new RegExp("[`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？\\s]");
  if (!editPageName.value || editPageName.value === "" || reg.test(editPageName.value)) {
    message.destroy();
    reg.test(editPageName.value) ? message.warning("不允许包含特殊字符") : message.warning("请输入正确的页面名称");
    status = false;
  } else {
    status = true;
  }
  return status;
}

/**
 * 预览页面
 * @param id
 */
function handlePreview(id: string) {
  window.open(`/#/uibuilder/publish/${id}?id=${id}`);
}

/**
 * 编辑页面
 * @param id
 */
async function handleEdit(id: string) {
  if (String(route.query.id) === String(id)) {
    if (useAppStore.editType === EditTypeEnum.CHILD_PAGE) {
      closeChildPage();
    } else {
      message.destroy();
      message.warning("正在编辑当前页面!");
    }
    return;
  }
  await resetChildPage();
  router.replace({ path: route.path, query: { id } });
  useAppStore.setHomeLoading(true);
}

/**
 * 切换到重命名状态
 * @param id
 */
function beginEdit(id: string) {
  editPageName.value = "";
  const index = pageList.value.findIndex((item) => item.id === id);
  if (index > -1) {
    editPageName.value = pageList.value[index].page_name;
    editId.value = id;
    nextTick(() => {
      renameInput.value[0].focus();
    });
  }
}

/**
 * 重命名子页面
 */
async function renamePage() {
  if (!editId.value || !checkName()) return;
  const request = await workspaceModifyPageApi(Number(editId.value), editPageName.value);
  const {
    info: { msg = "" },
  } = request.data;
  message.destroy();
  if (msg !== "success") {
    message.error(msg);
    return;
  }
  message.success("重命名页面成功");
  const index = pageList.value.findIndex((item) => item.id === editId.value);
  if (index !== -1) {
    pageList.value[index].page_name = editPageName.value;
    searchPage();
  }
  if (String(editId.value) === String(currentId.value)) {
    useAppStore.setPageName(editPageName.value);
  }
  editId.value = "";
}
useAppStore.$subscribe((mutation: any) => {
  try {
    const { key = "", oldValue = "", newValue = "" } = mutation.events;
    if (!key || key !== "pageName" || oldValue === newValue) return;
    const index = pageList.value.findIndex((item) => String(item.id) === String(currentId.value));
    if (index !== -1) {
      pageList.value[index].page_name = newValue;
      searchPage();
    }
  } catch (error) {}
});

/**
 * 处理删除操作
 * @param id
 */
function handleDelete(id: string) {
  // 若当前被删除页面正在编辑，则禁止删除
  if (String(id) === String(currentId.value)) {
    message.destroy();
    message.warning("当前页面正在编辑, 无法删除!");
    return;
  }
  Modal.confirm({
    title: "确定要删除该页面吗?",
    okText: "确定",
    cancelText: "取消",
    onOk() {
      deletePage(id);
    },
  });
}

/**
 * 删除页面
 * @param id
 */
async function deletePage(id: string) {
  const request = await managementDeleteApi({ id });
  const {
    info: { msg = "" },
  } = request.data;
  message.destroy();
  if (msg !== "success") {
    message.error(msg || "删除页面失败");
    return;
  }
  message.success("删除页面成功");
  getPageList();
}

/**
 * 新建页面
 */
function createNewPage() {
  const projectId = useAppStore?.pageInstance?.project_id;
  if (!projectId) return;
  createPage(parseInt(projectId), "新建页面")?.then((res) => {
    router.replace({ path: route.path, query: { id: (res as any).id } });
  });
}

/**
 * 获取项目页面列表
 */
async function getPageList() {
  loading.value = true;
  const projectId = useAppStore.pageInstance.project_id;
  if (!projectId) {
    loading.value = false;
    return;
  }
  const request = await workspaceGetProjectApi(projectId);
  const {
    results = [],
    info: { msg = "" },
  } = request.data;
  if (msg !== "success") {
    message.destroy();
    message.error(msg || "项目页面数据获取失败!");
    loading.value = false;
    return;
  }
  pageList.value = results[0].pageList || [];
  searchPage();
  loading.value = false;
}
onMounted(() => {
  getPageList();
});
</script>
<style scoped lang="scss">
q-button {
  background-color: #fff !important;
  width: unset !important;
  background: inherit !important;
  color: #333 !important;
}

.page-container {
  height: calc(100% - 40px);
  overflow-x: hidden;
  overflow-y: auto;

  .page-card {
    padding: 16px;
    border-radius: 4px;
  }

  .page-add-btn {
    width: calc(100% - 48px);
    bottom: 15px;
    z-index: 1;
    padding: 0;
    position: absolute;
    display: flex;
    justify-content: center;
  }
}

.item-card-wrap {
  height: 200px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  transition: all 200ms linear;
  user-select: none;
  position: relative;
  background-color: #fff;
  &:hover,
  &.editing {
    transform: scale(1.02);
    transform-origin: center center;
    transition: all 200ms linear;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.4);
    .item-info {
      bottom: 0;
      transition: bottom 200ms linear;
    }
    .item-forward {
      opacity: 1;
      pointer-events: all;
      transition: opacity 200ms linear;
    }
    .item-preview {
      transition: filter 200ms linear;
      filter: blur(2px) brightness(150%);
    }
  }
  .item-info {
    box-sizing: content-box;
    width: calc(100% - 20px);
    font-size: 14px;
    position: absolute;
    bottom: -42px;
    background-color: rgba(0, 0, 0, 0.1);
    padding-bottom: 36px;
    padding-left: 10px;
    padding-right: 10px;
    color: #333;
    text-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    transition: bottom 200ms linear;
    & > span {
      width: 100%;
      height: 30px;
      margin: 4px 0;
      line-height: 30px;
      user-select: text;
      box-sizing: content-box;
      cursor: text;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:hover {
        background-color: #fafafa;
      }
    }

    .extra {
      position: absolute;
      bottom: 0;
      left: 10px;
      width: calc(100% - 20px);
      .option {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 0;
        box-sizing: content-box;
        font-size: 12px;
      }
    }
    .item-name-input {
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 4px 0;
      padding-bottom: 6px;
      box-sizing: content-box;
      input {
        outline: none;
        border: none;
        border-radius: 2px;
        height: 28px;
        line-height: 28px;
        padding-left: 4px;
        background-color: #fafafa;
      }
      button {
        height: 30px;
        font-size: 14px;
        line-height: 30 px;
        padding: 0px 15px;
      }
    }
  }

  .item-forward {
    position: absolute;
    top: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    height: 120px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 200ms linear;
  }
  .item-preview {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: filter 200ms linear;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }
}
</style>

<template>
  <div :class="{ 'item-card-wrap': true, editing: editing }">
    <div class="item-preview" :style="`background-image:url()`"></div>
    <div class="item-info">
      <span
        v-if="!editing"
        @dblclick.stop="beginEdit"
        title="双击修改名称"
        v-html="(data as any).highlights || (data as ProjectInfo).project_name || (data as PageWarehouseInfo).name || (data as ComponentInfo).text || (data as WebsiteInfo).website_name"
      ></span>
      <div v-else @click.stop class="item-name-input">
        <a-input
          ref="editInput"
          v-model:value="editingName"
          show-count
          :maxlength="30"
          @pressEnter="changeName"
          @blur="editing = false"
        />
        <!-- <a-button @click="editing = false">取消</a-button> -->
      </div>
      <div class="extra">
        <div class="update">
          修改时间
          <span>{{ data?.update_time }}</span>
        </div>
        <div class="option">
          <q-button v-if="props.export" title="导出" type="text" @click.stop="handleExport">
            <DownloadOutlined :style="{ fontSize: '20px' }"></DownloadOutlined>
          </q-button>
          <q-button v-if="props.delete" class="ml-auto" title="删除" type="text" @click.stop="handleDelete">
            <DeleteOutlined :style="{ fontSize: '18px', color: 'red' }"></DeleteOutlined>
          </q-button>
        </div>
      </div>
    </div>
    <div class="item-forward">
      <q-button v-if="props.preview" @click.stop="handlePreview" title="预览" type="text">
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
      <q-button v-if="props.edit" @click.stop="handleEdit" title="编辑" type="text">
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
</template>

<script setup lang="ts">
import { ComponentInfo, PageWarehouseInfo, ProjectInfo, WebsiteInfo } from "@/types/workspace";
import { PageType, UserEventType } from "@/enums/workspace";
import {
  exportProject,
  workspaceRenameProjectApi,
  workspaceRenameComponentApi,
  workspaceRenamePageApi,
  workspaceRenameWebsiteApi,
} from "@/api/uibuilder/workspace";
import { message } from "ant-design-vue";
import { isStringNormal } from "@/utils/utils";
import { useWorkspaceStore } from "@/store/modules/workspace";
import { DownloadOutlined, DeleteOutlined } from "@ant-design/icons-vue";

export interface Props {
  data: ProjectInfo | ComponentInfo | PageWarehouseInfo | WebsiteInfo;
  type: String;
  preview?: boolean;
  edit?: boolean;
  export?: boolean;
  delete?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  preview: true,
  edit: true,
  export: true,
  delete: true,
});
const store = useWorkspaceStore();
const editInput = ref<HTMLInputElement>();
const emit = defineEmits(["update", "create", "edit", "preview", "delete"]);
const editing = ref<boolean>(false);
const editingName = ref<string>("");
const pageType = computed(() => {
  return store.currentPageType;
});
const beginEdit = () => {
  editingName.value = handleName(false, "");
  editing.value = true;
  setTimeout(() => {
    editInput.value?.click?.();
    editInput.value?.focus();
  }, 500);
};

/**
 * 处理name
 * @param isSet
 * @param name
 */
function handleName(isSet: boolean, name: string) {
  let tempName = "";
  switch (props.type) {
    case PageType.PROJECT:
      tempName = (props.data as ProjectInfo)?.project_name || "";
      isSet ? ((props.data as ProjectInfo).project_name = name) : void 0;
      break;
    case PageType.COMPONENT:
      tempName = (props.data as ComponentInfo)?.text || "";
      isSet ? ((props.data as ComponentInfo).text = name) : void 0;
      break;
    case PageType.PAGE_WAREHOUSE:
      tempName = (props.data as PageWarehouseInfo)?.name || "";
      isSet ? ((props.data as PageWarehouseInfo).name = name) : void 0;
      break;
    case PageType.WEBSITE:
      tempName = (props.data as WebsiteInfo)?.website_name || "";
      isSet ? ((props.data as WebsiteInfo).website_name = name) : void 0;
      break;
  }
  return tempName;
}

/**
 * 删除
 * 项目|元件库|页面库|站点
 */
const handleDelete = () => {
  switch (pageType.value) {
    case PageType.COMPONENT: {
      window.dispatchEvent(
        new CustomEvent("user", {
          detail: {
            type: UserEventType.DELETE,
          },
        })
      );
      break;
    }
    case PageType.PAGE: {
      window.dispatchEvent(
        new CustomEvent("pageWarehouse", {
          detail: {
            type: UserEventType.DELETE,
          },
        })
      );
      break;
    }
    case PageType.PROJECT:
      emit("delete", { id: (props.data as ProjectInfo).id, name: (props.data as ProjectInfo).project_name });
      break;
    case PageType.WEBSITE:
      emit("delete", { id: (props.data as WebsiteInfo).id, name: (props.data as WebsiteInfo).website_name });
      break;
  }
};

/**
 * 导出
 * 项目|元件库|页面库
 */
const handleExport = () => {
  switch (pageType.value) {
    case PageType.COMPONENT: {
      window.dispatchEvent(
        new CustomEvent("user", {
          detail: {
            type: UserEventType.EXPORT,
          },
        })
      );
      break;
    }
    case PageType.PAGE: {
      window.dispatchEvent(
        new CustomEvent("pageWarehouse", {
          detail: {
            type: UserEventType.EXPORT,
          },
        })
      );
      break;
    }
    case PageType.PROJECT: {
      exportProject((props.data as ProjectInfo).id);
    }
  }
};

/**
 * 变更名称
 * 项目|元件库|页面库|站点
 */
const changeName = () => {
  if (!editingName.value) {
    message.destroy();
    message.warning("请输入名称！");
    return;
  }
  if (!isStringNormal(editingName.value)) {
    message.destroy();
    message.warning("请勿输入特殊字符！");
    return;
  }
  const name = (props.data as ComponentInfo)?.text || (props.data as ProjectInfo)?.project_name;
  if (editingName.value === name) {
    editing.value = false;
    return;
  }
  let service;
  switch (pageType.value) {
    case PageType.PROJECT: {
      service = workspaceRenameProjectApi;
      break;
    }
    case PageType.PAGE: {
      service = workspaceRenamePageApi;
      break;
    }
    case PageType.COMPONENT: {
      service = workspaceRenameComponentApi;
      break;
    }
    case PageType.WEBSITE: {
      service = workspaceRenameWebsiteApi;
      break;
    }
  }
  service?.((props.data as ProjectInfo)?.id, editingName.value)
    .then(({ data }: { data: any }) => {
      if (data?.info?.msg === "success") {
        message.success(`已修改`);
        editing.value = false;
        handleName(true, editingName.value);
        emit("update");
      } else {
        if (data?.info?.msg) {
          message.error(data.info.msg);
        } else {
          message.error("修改失败");
        }
      }
    })
    .catch((e) => {
      console.log(e);
      message.error("修改失败");
    });
};

/**
 * 编辑
 */
const handleEdit = () => {
  emit("edit", { id: (props.data as ProjectInfo).id });
};

/**
 * 预览
 */
const handlePreview = () => {
  emit("preview", props.data.id);
};
</script>

<style lang="scss" scoped>
q-button {
  background-color: #fff !important;
  width: unset !important;
  background: inherit !important;
  color: #333 !important;
}
.item-card-wrap {
  width: 200px;
  height: 200px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
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
    // min-height: 50px;
    // line-height: 30px;
    font-size: 14px;
    position: absolute;
    bottom: -48px;
    background-color: rgba(0, 0, 0, 0.1);
    padding-bottom: 40px;
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
    .update {
      font-size: 12px;
      color: #555;
      &.hide {
        opacity: 0;
        pointer-events: none;
      }
    }
    .extra {
      position: absolute;
      bottom: 0;
      left: 10px;
      width: calc(100% - 20px);
      height: 50px;
      .option {
        width: 100%;
        display: flex;
        justify-content: space-between;
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

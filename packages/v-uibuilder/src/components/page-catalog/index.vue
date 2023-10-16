<template>
  <div
    :class="{
      'page-catalog-wrap': true,
      closed: !toggle,
    }"
  >
    <div class="page-catalog-navigator">
      <div class="page-add">
        <a-button @click="$emit('add')">创建页面</a-button>
      </div>
      <span>页面目录</span>
      <div @click="$emit('toggle')" :title="toggle ? '收起' : '展开'" class="page-catalog-toggle">
        <svg
          t="1665572664762"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
        >
          <path
            d="M671.968176 911.99957c-12.287381 0-24.576482-4.67206-33.951566-14.047144L286.048434 545.984249c-18.751888-18.719204-18.751888-49.12028 0-67.872168L638.016611 126.111222c18.751888-18.751888 49.12028-18.751888 67.872168 0 18.751888 18.719204 18.751888 49.12028 0 67.872168l-318.016611 318.047574L705.888778 830.047574c18.751888 18.751888 18.751888 49.12028 0 67.872168C696.544658 907.32751 684.255557 911.99957 671.968176 911.99957z"
          ></path>
        </svg>
      </div>
    </div>
    <div class="page-catalog-body">
      <div
        v-if="category === PageCategory.PAGE"
        v-for="item in list"
        :key="`page-index-${item.id}`"
        :class="{ 'page-component-index': true, active: index === item.id }"
        @click="handleClickPage(item.id)"
      >
        <span class="page-name" v-if="editing !== item.id" @dblclick.stop="beginEdit(item)" title="双击修改名称">
          {{ item.page_name || "未命名" }}
        </span>
        <div class="page-name-input" v-else>
          <input
            @click.stop
            @keydown.native.enter="changeName(item)"
            @input="editName"
            ref="editInput"
            :value="editingName"
          />
          <div class="cancel-edit" @click.stop="editing = -1">取消</div>
        </div>
        <a-dropdown>
          <div class="cursor-pointer" v-show="editing !== item.id">
            <MenuOutlined></MenuOutlined>
          </div>
          <template #overlay>
            <a-menu @click="menuClick($event, item)">
              <a-menu-item key="preview">
                <div class="flex items-center">
                  <EyeOutlined :style="{ fontSize: '16px' }"></EyeOutlined>
                  <span class="ml-10px">预览</span>
                </div>
              </a-menu-item>
              <a-menu-item key="rename">
                <div class="flex items-center">
                  <FormOutlined :style="{ fontSize: '16px' }"></FormOutlined>
                  <span class="ml-10px">重命名</span>
                </div>
              </a-menu-item>
              <a-menu-item key="edit">
                <div class="flex items-center">
                  <EditOutlined :style="{ fontSize: '16px' }"></EditOutlined>
                  <span class="ml-10px">编辑</span>
                </div>
              </a-menu-item>
              <a-menu-item key="delete">
                <div class="flex items-center">
                  <DeleteOutlined :style="{ fontSize: '16px' }"></DeleteOutlined>
                  <span class="ml-10px">删除</span>
                </div>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
    <div class="website-add" @click="$emit('addWebsite')">创建站点</div>
  </div>
</template>

<script setup lang="ts">
import { PageCategory } from "@/enums/workspace";
import { PageInfo } from "@/types/workspace";
import { createVNode, ref } from "vue";
import { workspaceModifyPageApi } from "@/api/uibuilder/workspace";
import { message, Modal } from "ant-design-vue";
import { isStringNormal } from "@/utils/utils";
import {
  MenuOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
} from "@ant-design/icons-vue";
import { managementDeleteApi } from "@/api/uibuilder/management";

// 路由对象
const router = useRouter();

const props = defineProps<{
  toggle: boolean; //true for open ; false for close;
  list: PageInfo[];
  index: number;
}>();
const emit = defineEmits(["content", "update"]);

const editInput = ref<HTMLInputElement[]>();
const category = ref<PageCategory>(PageCategory.PAGE);
const editingName = ref<string>("");
const editing = ref<number>(-1);

/**
 * 选择页面
 * @param id
 */
const handleClickPage = (id: number) => {
  emit("content", id);
};

/**
 * 双击修改页面名称
 * @param p
 */
const beginEdit = (p: PageInfo) => {
  editing.value = p.id;
  editingName.value = p.page_name;
  setTimeout(() => {
    editInput.value?.forEach?.((button) => {
      button?.click?.();
      button?.focus();
    });
  }, 500);
};

/**
 * input输入
 * @param e
 */
const editName = (e: any) => {
  editingName.value = e.target.value;
};

/**
 * 回车确认修改页面名称
 * @param info
 */
const changeName = (info: PageInfo) => {
  if (!isStringNormal(editingName.value)) {
    message.error("请勿输入特殊字符！");
    return;
  }
  const name = info.page_name;
  if (editingName.value === name) {
    editing.value = -1;
    return;
  }
  workspaceModifyPageApi(info.id, editingName.value)
    .then(({ data }: { data: any }) => {
      if (data?.info?.msg === "success") {
        message.success(`已修改`);
        editing.value = -1;
        const currentIndex = props.list.findIndex((item) => item.id === info.id);
        if (currentIndex !== -1) {
          props.list[currentIndex].page_name = editingName.value;
        }
      } else {
        message.error("修改失败");
      }
    })
    .catch((e) => {
      console.log(e);
      message.error("修改失败");
    });
};

/**
 * 操作菜单
 */
function menuClick(e: any, pageInfo: PageInfo) {
  switch (e.key) {
    case "preview":
      window.open(`/#/uibuilder/publish/${pageInfo.id}?id=${pageInfo.id}`);
      break;
    case "rename":
      beginEdit(pageInfo);
      break;
    case "edit":
      router.push(`/uibuilder/edit?id=${pageInfo.id}`);
      break;
    case "delete":
      deletePage(pageInfo);
      break;
  }
}

/**
 * 删除页面
 * @param id
 */
function deletePage(pageInfo: PageInfo) {
  if (!pageInfo?.id) return;
  Modal.confirm({
    title: `确定删除[${pageInfo.page_name}]吗?`,
    icon: createVNode(ExclamationCircleOutlined),
    okText: "确定",
    cancelText: "取消",
    onOk() {
      managementDeleteApi({ id: pageInfo.id }).then((res) => {
        const {
          info: { msg = "" },
        } = res.data;
        if (msg === "success") {
          emit("update");
        } else {
          message.error("删除页面失败!");
        }
      });
    },
  });
}
</script>

<style lang="scss" scoped>
.page-catalog-wrap {
  position: absolute;
  top: 48px;
  bottom: 0;
  left: 0;
  width: 300px;
  // padding-top: 48px;
  background-color: #fff;
  overflow: visible;
  transition: transform 200ms linear;
  .page-catalog-body {
    height: calc(100% - 100px);
    overflow-y: auto;
    .page-component-index {
      width: calc(100% - 30px);
      margin: 5px 15px;
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #ccc;
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .page-name-input {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        input {
          outline: none;
          border: none;
          border-radius: 4px;
          height: 24px;
          padding-left: 4px;
          background-color: #f1f1f1;
          color: #000;
        }
        .cancel-edit {
          background-color: #57b5ff;
          color: #fff;
          user-select: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          text-align: center;
        }
      }
      &:hover {
        border-color: #008dff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      &.active {
        background-color: #008dff;
        color: #fff;
      }
      span {
        padding: 4px;
        border-radius: 2px;
      }
      .page-name {
        cursor: text;
        &:hover {
          background-color: #57b5ff;
          color: #fff;
        }
      }
    }
  }
  .page-catalog-navigator {
    width: 100%;
    position: relative;
    text-align: center;
    height: 50px;
    line-height: 50px;
    .page-add {
      position: absolute;
      left: 15px;
    }
  }
  .page-catalog-toggle {
    width: 30px;
    height: 30px;
    position: absolute;
    border-radius: 8px;
    right: 15px;
    top: 10px;
    border: #666666 1px solid;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    &:hover {
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
    }
  }
  &.closed {
    transform: translateX(-301px);
    transition: transform 200ms linear;
    .page-catalog-toggle {
      right: -10px;
      justify-content: flex-end;
      transition: right 200ms linear;
      &:hover {
        right: -31px;
        justify-content: center;
        transition: right 200ms linear;
      }
      .icon {
        transform: rotate(180deg);
      }
    }
  }
  .website-add {
    position: absolute;
    left: 15px;
    bottom: 10px;
    width: 270px;
    height: 36px;
    font-size: 16px;
    line-height: 36px;
    margin: 0 auto;
    text-align: center;
    color: #fff;
    padding: 0 20px;
    cursor: pointer;
    background-color: #2861ff;
  }
}
</style>

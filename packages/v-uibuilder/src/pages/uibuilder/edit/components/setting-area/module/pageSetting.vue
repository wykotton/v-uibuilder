<template>
  <div id="attribute">
    <div class="layui-row w-full">
      <div class="layui-col-md12">
        <a-form :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
          <!-- <a-form-item label="布局设置">
            <a-radio-group :value="useAppStore.percentOrAbsolute" @change="layoutChange" disabled>
              <a-radio value="absolute">绝对值</a-radio>
              <a-radio value="percent">百分比</a-radio>
            </a-radio-group>
          </a-form-item> -->
          <a-form-item label="缩放比例">
            <div class="flex items-center text-16px">
              <minus-outlined class="mr-15px cursor-pointer" @click="calculateScale('reduce')" />
              <div class="user-select-none">
                {{ `${(useAppStore.scaleNum * 100).toFixed(0)}%` }}
              </div>
              <plus-outlined class="ml-15px cursor-pointer" @click="calculateScale('add')" />
            </div>
          </a-form-item>
          <a-form-item label="页面名称">
            <div v-if="editPageName" class="flex items-center">
              <a-input v-model:value="pageName" show-count :maxlength="30" @pressEnter="pageNameChange"></a-input>
              <a-button @click="cancelChange">取消</a-button>
            </div>
            <span v-else @dblclick="editClick" title="双击修改页面名称">{{ useAppStore.pageName }}</span>
          </a-form-item>
          <a-form-item>
            <template #label>
              <a-tooltip placement="left">
                <template #title>
                  <span>
                    是否允许从元件内|部开始框选, 禁用后使用shift框选时鼠标起点和终点只能是画布, 且只能选中非容器子元件
                  </span>
                </template>
                <question-circle-outlined :style="{ marginRight: '6px' }" />
              </a-tooltip>
              内|部框选
            </template>
            <a-switch v-model:checked="selectFromInside" @change="insideChange" />
          </a-form-item>
          <a-form-item>
            <template #label>
              <a-tooltip placement="left">
                <template #title>
                  <span>开启/关闭画布元件右键菜单</span>
                </template>
                <question-circle-outlined :style="{ marginRight: '6px' }" />
              </a-tooltip>
              右键菜单
            </template>
            <a-switch v-model:checked="contextMenu" @change="contextMenuChange" />
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAppStoreWithOut } from "@/store/modules/app";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import { MinusOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons-vue";
import { calculateScale } from "@/composition/index";
import { message } from "ant-design-vue";
import { useRoute } from "vue-router";
import { workspaceModifyPageApi } from "@/api/uibuilder/workspace";
import { isStringNormal } from "@/utils/utils";

// pinia
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();

// 路由对象
const route = useRoute();

// 页面设置
const labelCol = reactive({ span: 6 });
const wrapperCol = reactive({ span: 18 });
const form = reactive({});

/**
 * 切换页面布局
 * @param e
 */
// const layoutChange = (e: any) => {
//   console.log(e);
// };

/**
 * 修改页面名称
 * @param e
 */
const editPageName = ref(false);
const pageName = ref("");
const editClick = () => {
  editPageName.value = true;
  pageName.value = useAppStore.pageName;
};
const cancelChange = () => {
  editPageName.value = false;
  pageName.value = "";
};
const pageNameChange = () => {
  if (!pageName.value) {
    message.destroy();
    message.error("页面名称不能为空!");
    return;
  }
  if (!isStringNormal(pageName.value)) {
    message.destroy();
    message.warning("请勿输入特殊字符！");
    return;
  }
  const id = route.query.id;
  if (!id) {
    message.destroy();
    message.error("页面id不存在, 无法进行操作!");
    return;
  }
  workspaceModifyPageApi(Number(id), pageName.value)
    .then(({ data }: { data: any }) => {
      if (data?.info?.msg === "success") {
        message.success(`已修改`);
        useAppStore.setPageName(pageName.value);
      } else {
        message.error("修改失败");
      }
    })
    .catch((e) => {
      console.log(e);
      message.error("修改失败");
    })
    .finally(() => {
      editPageName.value = false;
    });
};

/**
 * 内|部框选切换
 */
const selectFromInside = ref(true);
function insideChange(checked: boolean) {
  useSettingStore.selectoExample.selectoTop.selectFromInside = checked;
  useSettingStore.selectoExample.selectoBottom.selectFromInside = checked;
}

/**
 * 内|部框选切换
 */
const contextMenu = ref(true);
function contextMenuChange(checked: boolean) {
  useSettingStore.setContextMenu(checked);
}

onMounted(() => {
  useSettingStore.setContextMenu(contextMenu.value);
});
</script>
<style scoped lang="scss">
#attribute {
  .ant-param-rest {
    margin-bottom: 10px;
    display: flex;
    align-items: center;

    .reset-btn {
      width: 110px;
      display: flex;
      align-items: center;
      // margin-left: auto;
    }

    .window-btn {
      width: 110px;
      display: flex;
      align-items: center;
      margin-left: 20px;
    }
  }

  .change-container-btn {
    cursor: default;
  }
}
</style>

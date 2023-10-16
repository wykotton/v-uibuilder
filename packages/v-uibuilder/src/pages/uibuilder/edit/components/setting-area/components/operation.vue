<template>
  <div>
    <div id="events">
      <div class="layui-row w-full" v-show="useSettingStore.selectedKeys.length === 0">
        <div class="layui-col-md12 p-20px">
          <a-empty description="暂无数据" />
        </div>
      </div>
      <!-- 动态组件 -->
      <div
        v-show="useSettingStore.selectedKeys.length > 0"
        class="rightWidth-event-btn"
        v-for="item in events"
        :key="item.id"
      >
        <a-button :block="item.block" :key="item.id" :data-index="item.id" type="text" @click="handleEvents(item.id)">
          <template #icon><component :is="item.icon"></component></template>
          {{ item.title }}
        </a-button>
      </div>
      <div v-show="useSettingStore.selectedKeys.length > 1" class="rightWidth-event-btn">
        <a-button :block="false" type="text" @click="useCombination">
          <template #icon><appstore-add-outlined /></template>
          合并元件
        </a-button>
      </div>
      <div
        v-show="useSettingStore.selectedKeys.length === 1 && useSettingStore.isCombination"
        class="rightWidth-event-btn"
      >
        <a-button :block="false" type="text" @click="useCombinationSplit">
          <template #icon><block-outlined /></template>
          拆分集合
        </a-button>
      </div>
      <div v-show="useSettingStore.selectedKeys.length === 1" class="rightWidth-event-btn">
        <a-button :block="false" type="text" @click="showCombinationModel">
          <template #icon><save-outlined /></template>
          保存元件
        </a-button>
      </div>
      <div v-show="selectedInfo.length" class="selected-list">
        <a-tag
          class="selected-list-tag"
          v-for="item in selectedInfo"
          :key="item.id"
          closable
          @close="clearSelectedTag(item.id)"
          @click="clickSelectedTag(item.id)"
          @mouseenter="focusSelectCom(item.id)"
          @mouseleave="blurSelectCom"
        >
          {{ item.title }}
        </a-tag>
      </div>
    </div>
    <a-modal
      v-model:visible="combinationVisible"
      v-if="combinationVisible"
      title="保存元件"
      :confirmLoading="confirmLoading"
      :maskClosable="false"
      :closable="false"
      width="600px"
      @ok="addCombination"
      @cancel="closeCombinationModel"
    >
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-item :required="true" label="存储库">
          <a-radio-group v-model:value="radioType" button-style="solid" @change="warehouseChange">
            <a-radio-button value="user">我的元件</a-radio-button>
            <a-radio-button value="public">公共元件</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :required="true"
          :label="isNewType === 'choose' ? '选择类型' : '新增类型'"
          :validate-status="rules.type.validateStatus"
          :help="rules.type.errorMsg"
        >
          <a-select
            v-if="isNewType === 'choose'"
            v-model:value="combinationInfo.type"
            placeholder="请选择元件类型"
            @change="combinationInfoChange('type')"
            style="width: 300px"
          >
            <a-select-option v-for="(item, index) in typeArr" :value="item" :key="index">
              {{ item }}
            </a-select-option>
          </a-select>
          <a-input
            v-else
            v-model:value="combinationInfo.type"
            :maxlength="15"
            show-count
            placeholder="请输入元件类型"
            @change="combinationInfoChange('type')"
            style="width: 300px"
          />
          <a-divider type="vertical" />
          <a-radio-group v-model:value="isNewType" @change="clearRules">
            <a-radio-button value="choose">选择</a-radio-button>
            <a-radio-button value="add">新增</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          :required="true"
          label="名称"
          :validate-status="rules.name.validateStatus"
          :help="rules.name.errorMsg"
        >
          <a-input
            v-model:value="combinationInfo.text"
            :maxlength="30"
            show-count
            placeholder="请输入元件名称"
            @change="combinationInfoChange('name')"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { createVNode } from "vue";
import {
  AppstoreAddOutlined,
  BlockOutlined,
  SaveOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons-vue";
import {
  handleEvents,
  useCombination,
  useCombinationSplit,
  useSaveCombination,
  clearSelectedTag,
  clickSelectedTag,
  focusSelectCom,
  blurSelectCom,
} from "@/composition/index";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import { usePluginStoreWithOut } from "@/store/modules/plugin";
import { useUserStoreWithOut } from "@/store/modules/user";
import { IQDepotOptions } from "@/types/IQDepot";
import { isEqual, isString } from "lodash-es";
import { message, Modal } from "ant-design-vue";
import { searchCombinationApi } from "@/api/uibuilder/edit";
import { ComponentProtocolEnum } from "@/enums/appEnum";

// pinia
const useUserStore = useUserStoreWithOut();
const usePluginStore = usePluginStoreWithOut();
const useSettingStore = useSettingStoreWithOut();

// 操作事件
const events = reactive([
  { id: 1, title: `删除`, icon: createVNode(DeleteOutlined), block: false },
  { id: 2, title: `增加层级`, icon: createVNode(CaretUpOutlined), block: false },
  { id: 3, title: `降低层级`, icon: createVNode(CaretDownOutlined), block: false },
]);

/**
 * 元件集合Modal
 */
const combinationVisible = ref(false);
const showCombinationModel = () => {
  combinationVisible.value = true;
  getTypes(["我的元件"]);
};
const closeCombinationModel = () => {
  if (confirmLoading.value) {
    combinationVisible.value = true;
    message.destroy();
    message.warning("正在保存中, 请稍后再试!");
    return;
  }
  resetForm();
};

/**
 * 元件集合可选类型
 */
const typeArr = ref<string[]>([]);
const getTypes = (group: Array<string>) => {
  usePluginStore.componentsList.forEach((item: IQDepotOptions) => {
    if (!item.group || !item.type) return;
    isString(item.group) ? (item.group = JSON.parse(item.group)) : void 0;
    if (isEqual(item.group, group) && !typeArr.value.includes(item.type)) {
      typeArr.value.push(item.type);
    }
  });
};

/**
 * 数据校验
 */
const rules: { [key: string]: any } = reactive({
  type: { validateStatus: "", errorMsg: "" },
  name: { validateStatus: "", errorMsg: "" },
});
const clearRules = () => {
  combinationInfo.type = "";
  rules.type = { validateStatus: "", errorMsg: "" };
};
const checkFun = (data: string, { msg1, msg2 }: { [key: string]: string }, rulesKey: string) => {
  const reg = new RegExp("[`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？\\s]");
  if (!data || data === "" || reg.test(data)) {
    rules[rulesKey].validateStatus = "error";
    rules[rulesKey].errorMsg = reg.test(data) ? msg1 : msg2;
    return false;
  }
  return true;
};
const checkCombination = (type: string) => {
  switch (type) {
    case "type":
      return checkFun(
        combinationInfo.type,
        {
          msg1: "不允许包含特殊字符",
          msg2: isNewType.value === "add" ? "请输入正确的元件集合类型" : "请选择正确的元件集合类型",
        },
        "type"
      );
    case "name":
      return checkFun(combinationInfo.text, { msg1: "不允许包含特殊字符", msg2: "请输入正确的元件集合名称" }, "name");
  }
  return false;
};
const resetForm = () => {
  typeArr.value = [];
  rules.type = { validateStatus: "", errorMsg: "" };
  rules.name = { validateStatus: "", errorMsg: "" };
  combinationInfo.type = "";
  combinationInfo.text = "";
  isNewType.value = "add";
  radioType.value = "user";
};

/**
 * 元件集合信息
 */
const combinationInfo = reactive({
  type: "",
  text: "",
});
const radioType = ref("user");
const isNewType = ref("add");
const warehouseChange = () => {
  typeArr.value = [];
  clearRules();
  radioType.value === "user" ? getTypes(["我的元件"]) : getTypes(["公共元件"]);
};
const combinationInfoChange = (type: string) => {
  if (type === "type") {
    if (checkCombination("type")) {
      rules.type = { validateStatus: "", errorMsg: "" };
    }
  } else {
    if (checkCombination("name")) {
      rules.name = { validateStatus: "", errorMsg: "" };
    }
  }
};

/**
 * 新增元件集合
 */
const confirmLoading = ref(false);
const addCombination = async () => {
  if (!checkCombination("type") || !checkCombination("name")) return;
  const userInfo = useUserStore.getUibUserInfo;
  if (!userInfo?.id) {
    message.destroy();
    message.error("未查询到用户信息, 请重新登录后再试!");
    return;
  }
  const searchInfo = await searchCombinationApi({
    userId: radioType.value === "user" ? userInfo.id : "",
    text: combinationInfo.text,
  });
  const {
    results,
    info: { msg = "" },
  } = searchInfo.data;
  if (msg !== "success") {
    message.destroy();
    message.error("集合数据查找失败, 请重试!");
    return;
  }
  if (results?.length) {
    Modal.confirm({
      content: "已存在该元件集合, 是否覆盖？",
      icon: createVNode(QuestionCircleOutlined),
      onOk() {
        saveCombination();
      },
    });
  } else {
    saveCombination();
  }
};

/**
 * 保存元件集合
 */
const saveCombination = async () => {
  confirmLoading.value = true;
  const results = await useSaveCombination(combinationInfo, radioType.value);
  confirmLoading.value = false;
  const {
    info: { msg = "" },
  } = results.data;
  if (msg === "success") {
    message.success("保存成功");
    combinationVisible.value = false;
    resetForm();
    // 刷新元件库
    window.dispatchEvent(new CustomEvent("user", { detail: { type: ComponentProtocolEnum.REFRESH } }));
  } else {
    message.error("元件集合保存失败!");
  }
};

/**
 * 选中组件变更监听
 * pinia状态订阅
 */
interface selectedOptions {
  id: string;
  title: string;
}
const selectedInfo = ref<selectedOptions[]>([]);
useSettingStore.$subscribe((mutation: any) => {
  if (mutation?.events?.key !== "selectedKeys") return;
  if (mutation.events.newValue.length > 1) {
    selectedInfo.value = mutation.events.newValue.map((id: string) => {
      const element = document.querySelector(`#${id}`) as any;
      const info = {
        id,
        title: "",
      };
      if (element?.componentModel?.model?.iovSchema?.text) {
        info.title = element.componentModel.model.iovSchema.text;
      } else {
        info.title = "未命名元件";
      }
      return info;
    });
  } else {
    selectedInfo.value = [];
  }
});
</script>
<style lang="scss" scoped>
#events {
  min-height: 125px;

  .rightWidth-event-btn {
    width: 100%;
    height: 40px;
  }

  button {
    padding: 10px 40px;
    font-size: 14px;
    display: flex;
    align-items: center;
  }

  .selected-list {
    width: 100%;

    .selected-list-tag {
      cursor: pointer;
      margin-top: 10px;

      &:hover {
        color: #44aaff;
        border: 1px solid #44aaff;
      }
    }
  }
}
</style>

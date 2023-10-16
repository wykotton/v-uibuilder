<template>
  <div>
    <div class="layui-row w-full" v-show="useSettingStore.selectedKeys.length !== 1">
      <div class="layui-col-md12 p-20px">
        <a-empty description="暂无数据" />
      </div>
    </div>
    <div v-show="useSettingStore.selectedKeys.length === 1">
      <div class="mb-10px w-130px">
        <a-button class="flex items-center" block @click="showCustomModal">
          <template #icon><bg-colors-outlined /></template>
          自定义CSS
        </a-button>
      </div>
      <q-style-setting ref="styleSetter" class="w-full" v-on:change="styleChange"></q-style-setting>
    </div>
  </div>
  <a-modal
    v-model:visible="cssModal"
    v-if="cssModal"
    title="自定义CSS"
    :maskClosable="false"
    okText="确定"
    cancelText="取消"
    :width="800"
    @ok="customChange"
  >
    <q-code-editor
      ref="cssEditor"
      :value="cssText"
      language="css"
      style="width: 100%; height: 600px; display: block"
    ></q-code-editor>
  </a-modal>
</template>
<script setup lang="ts">
import { useAppStoreWithOut } from "@/store/modules/app";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import { removeLineBreaks } from "@/utils";
import { BgColorsOutlined } from "@ant-design/icons-vue";

// pinia
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();

/**
 * 样式设置器
 */
const styleSetter = ref<unknown>(null);
watch([styleSetter], (newValue) => {
  useSettingStore.setStyleSetter(newValue[0]);
});

/**
 * 样式设置器change事件
 */
const styleChange = (e: CustomEvent) => {
  if (useAppStore.pageModel?.selectedComponents.length === 1) {
    const component = document.querySelector(`#${useAppStore.pageModel?.currentComponent.id}`);
    if ((component as any)?.componentModel) {
      useSettingStore.setSetterChange(true);
      (component as any).componentModel.updateModelEntity(JSON.stringify({ initStyle: e.detail.value }));
      // 更新moveable矩阵
      useSettingStore.moveableExample.updateMoveable();
    }
  }
};

/**
 * 自定义CSS编辑
 */
const cssModal = ref(false);
const cssEditor = ref(null);
const cssText = ref("");
function showCustomModal() {
  if (useAppStore.pageModel?.selectedComponents.length === 1) {
    cssText.value = `#${useAppStore.pageModel.currentComponent.id}{${
      useAppStore.pageModel.currentComponent.initStyle || ""
    }}`;
    cssModal.value = true;
  }
}

/**
 * 自定义更改css
 */
function customChange() {
  let cssText = removeLineBreaks((cssEditor.value as any).getValue());
  const firstIndex = cssText.indexOf("{");
  const lastIndex = cssText.indexOf("}");
  cssText = cssText.slice(firstIndex + 1, lastIndex).replace(/\s{2,}/g, "");
  const component = document.querySelector(`#${useAppStore.pageModel?.currentComponent.id}`) as any;
  if (component?.componentModel) {
    component.componentModel.updateModelEntity(JSON.stringify({ initStyle: cssText }));
    // 更新moveable矩阵
    useSettingStore.moveableExample.updateMoveable();
  }
  cssModal.value = false;
}
</script>
<style scoped lang="scss"></style>

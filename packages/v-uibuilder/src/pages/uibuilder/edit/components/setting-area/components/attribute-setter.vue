<template>
  <div id="attribute">
    <div class="layui-row w-full" v-show="useSettingStore.selectedKeys.length !== 1">
      <div class="layui-col-md12 p-20px">
        <a-empty description="暂无数据" />
      </div>
    </div>
    <a-tabs v-show="useSettingStore.selectedKeys.length === 1" default-active-key="1" size="small">
      <a-tab-pane key="1" tab="基础信息">
        <div class="ant-param-rest">
          <a-popconfirm placement="leftTop" ok-text="确定" cancel-text="取消" @confirm="resetModel">
            <template v-slot:title>
              <p>确定重置?</p>
              <p>重置会把元件model重置到初始状态!</p>
            </template>
            <a-button class="reset-btn" block>
              <template #icon><cloud-sync-outlined /></template>
              重置信息
            </a-button>
          </a-popconfirm>
          <a-button class="window-btn" block @click="showAttributeModal">
            <template #icon><arrows-alt-outlined /></template>
            窗口化
          </a-button>
        </div>
        <a-modal
          v-model:visible="attributeModal"
          v-if="attributeModal"
          title="属性编辑"
          :maskClosable="false"
          okText="确定"
          cancelText="取消"
          width="50%"
          :bodyStyle="{ maxHeight: '700px', overflow: 'auto' }"
          @ok="handleAttributeModal"
          @cancel="cancelAttributeModal"
        >
          <q-attribute-setting
            ref="attributeSetterModal"
            class="w-full"
            @change="schemaValueChange"
          ></q-attribute-setting>
        </a-modal>
        <q-attribute-setting ref="attributeSetter" class="w-full" @change="schemaValueChange"></q-attribute-setting>
      </a-tab-pane>
      <!-- <a-tab-pane key="2" tab="属性绑定">
        <AttrBind />
      </a-tab-pane> -->
      <a-tab-pane key="3" tab="切换容器">
        <div
          class="ant-btn change-container-btn"
          draggable="true"
          @dragstart="changeContainerStart"
          @dragend="changeContainerEnd"
        >
          拖动至要切换的容器
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script setup lang="ts">
import { checkUpContextType, resetModel } from "@/composition/index";
import { ArrowsAltOutlined, CloudSyncOutlined } from "@ant-design/icons-vue";
import { useAppStoreWithOut } from "@/store/modules/app";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import { ISchema } from "@/types/IModelSchema";
import { dragDrop } from "@/utils/dragdrop/index";
// import AttrBind from "./attr-bind.vue";

// pinia
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();

/**
 * 属性编辑器实例
 */
const attributeSetter = ref(null);
watch([attributeSetter], (newValue) => {
  useSettingStore.setAttributeSetter(newValue[0]);
});

/**
 * 属性编辑器弹窗
 */
const attributeModal = ref(false);
const attributeSetterModal = ref<any>(null);
const tempComponentValue = ref<ISchema>();
const showAttributeModal = () => {
  attributeModal.value = true;
  nextTick(() => {
    if (attributeSetterModal.value) {
      //更新属性设置器
      const value = {
        model: JSON.parse(useAppStore.pageModel?.pageModel.stringify(useAppStore.pageModel?.currentComponent)),
      };
      const schema = useAppStore.pageModel?.currentComponent.iovSchema.optionsView;
      Object.assign(attributeSetterModal.value, { schema, value });
    }
  });
};
// 属性弹窗确定操作
const handleAttributeModal = () => {
  if (!attributeSetterModal.value) return;
  const component = document.querySelector(`#${useAppStore.pageModel?.currentComponent.id}`);
  if (tempComponentValue.value && (component as any)?.componentModel) {
    if (tempComponentValue.value?.contextType !== (component as any)?.componentModel?.model?.contextType) {
      checkUpContextType(tempComponentValue.value.contextType);
    }
    useSettingStore.setSetterChange(true);
    (component as any)?.componentModel.updateModelEntity(JSON.stringify(tempComponentValue.value));
    // 更新属性设置器
    const _value = {
      model: tempComponentValue.value,
    };
    const _schema = tempComponentValue.value.iovSchema.optionsView;
    Object.assign(useSettingStore.attributeSetter, { _schema, _value });
    tempComponentValue.value = undefined;
  }
  attributeModal.value = false;
};
// 属性弹窗取消操作
const cancelAttributeModal = () => {
  tempComponentValue.value = undefined;
};
/**
 * 属性编辑器change事件
 */
const schemaValueChange = (e: CustomEvent) => {
  if (useAppStore.pageModel?.selectedComponents.length !== 1) return;
  const component = document.querySelector(`#${useAppStore.pageModel?.currentComponent.id}`);
  const model: ISchema = e.detail.value;
  if ((component as any)?.componentModel) {
    if (attributeModal.value) {
      tempComponentValue.value = model;
    } else {
      if (model?.contextType !== (component as any)?.componentModel?.model?.contextType) {
        checkUpContextType(model.contextType);
      }
      useSettingStore.setSetterChange(true);
      (component as any)?.componentModel.updateModelEntity(JSON.stringify(model));
    }
  }
};

/**
 * 拖拽切换容器对象开始/结束
 */
const changeContainerStart = () => {
  dragDrop.changeContainerState = true;
};
const changeContainerEnd = () => {
  setTimeout(() => {
    dragDrop.changeContainerState = false;
  }, 0);
};
</script>
<style scoped lang="scss">
#attribute {
  .ant-param-rest {
    margin-bottom: 10px;
    display: flex;
    align-items: center;

    .reset-btn,
    .window-btn {
      width: 110px;
      display: flex;
      align-items: center;
    }

    .window-btn {
      margin-left: 20px;
    }
  }

  .change-container-btn {
    cursor: default;
  }
}
</style>

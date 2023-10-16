<template>
  <div
    v-if="schemaIsDisplay"
    class="json-schema-editor"
    :style="{ borderLeft: schemaIsObject || schemaIsArray ? '1px solid #F2F3F5' : '' }"
  >
    <div class="row">
      <div v-if="pickSchema.value?.format === 'custom'" class="row-content">
        <a-tooltip placement="top">
          <template #title>
            <span>{{ pickKey }}</span>
            <br />
            <span>数据类型: {{ pickSchema.value?.type }}</span>
            <br />
            <span>数据描述: {{ pickSchema.value?.description }}</span>
          </template>
          <div class="ant-col-name-key" :style="{ width: labelWidth || 'clamp(20%, 22%, 25%)' }">
            <span v-if="isItem">
              {{ pickSchema.value?.description ? `${pickSchema.value?.description}_${pickKey}` : pickKey }}
            </span>
            <span v-else>
              {{ pickSchema.value?.description || pickKey }}
            </span>
          </div>
        </a-tooltip>
        <div class="plugin-content">
          <span
            ref="customSetter"
            v-if="pickSchema.value?.setter"
            v-html="`<${pickSchema.value?.setter}></${pickSchema.value?.setter}>`"
          ></span>
        </div>
      </div>
      <div
        v-else
        class="row-content"
        :style="{
          backgroundColor: schemaIsObject || schemaIsArray ? '#F2F3F5' : '',
          cursor: schemaIsObject || schemaIsArray ? 'pointer' : 'default',
          paddingLeft: schemaIsObject || schemaIsArray ? '10px' : '0',
        }"
        @click="showOrHidden"
      >
        <a-tooltip placement="top">
          <template #title>
            <span>{{ pickKey }}</span>
            <br />
            <span>数据类型: {{ pickSchema.value?.type }}</span>
            <br />
            <span>数据描述: {{ pickSchema.value?.description }}</span>
          </template>
          <div
            class="ant-col-name-key"
            :style="{
              width: schemaIsObject || schemaIsArray ? 'calc(100% - 32px)' : labelWidth || 'clamp(20%, 22%, 25%)',
            }"
          >
            <span v-if="isItem">
              {{ pickSchema.value?.description ? `${pickSchema.value?.description}_${pickKey}` : pickKey }}
            </span>
            <span v-else>
              {{ pickSchema.value?.description || pickKey }}
            </span>
          </div>
        </a-tooltip>
        <div class="plugin-content" v-if="pickSchema.value?.type === 'string'">
          <a-select
            v-if="pickSchema.value?.enum?.length"
            v-model:value="pickValue.value[pickKey]"
            :disabled="pickSchema.value.disabled"
            class="ant-col-title"
            :mode="pickSchema.value?.multiple ? 'multiple' : ''"
          >
            <a-select-option
              v-for="(item, index) in pickSchema.value.enum"
              :key="index"
              :value="item.value ? item.value : item"
            >
              {{ item.label ? item.label : item }}
            </a-select-option>
          </a-select>
          <a-textarea
            v-else-if="pickSchema.value?.format && pickSchema.value?.format === 'textarea'"
            v-model:value="pickValue.value[pickKey]"
            :disabled="pickSchema.value.disabled"
            :maxlength="pickSchema.value.maxLength"
            class="ant-col-title"
            placeholder="字段值"
          />
          <a-date-picker
            v-else-if="pickSchema.value.format && pickSchema.value.format === 'date'"
            v-model:value="tempTimeValue"
            :disabled="pickSchema.value.disabled"
            :locale="locale"
            valueFormat="YYYY-MM-DD"
            @change="timeChange"
            class="ant-col-title"
          />
          <a-date-picker
            v-else-if="pickSchema.value?.format && pickSchema.value.format === 'date-time'"
            v-model:value="tempTimeValue"
            :disabled="pickSchema.value.disabled"
            :locale="locale"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            show-time
            @change="timeChange"
            class="ant-col-title"
          />
          <q-color-picker
            v-else-if="pickSchema.value?.format && pickSchema.value?.format === 'color'"
            class="border-type-color"
            style="width: 100%; height: 28px; margin-top: 10px"
            :value="checkColorUtil(pickValue.value[pickKey])"
            @change="colorPick"
          ></q-color-picker>
          <div class="image-pick" v-else-if="pickSchema.value?.format && pickSchema.value?.format === 'resource'">
            <a-input
              v-model:value="pickValue.value[pickKey]"
              :disabled="pickSchema.value.disabled"
              :maxlength="pickSchema.value.maxLength"
              class="ant-col-title"
              placeholder="字段值"
            />
            <q-button @click="openUploadWin(pickKey)">选择</q-button>
          </div>
          <a-input
            v-else
            v-model:value="pickValue.value[pickKey]"
            :disabled="pickSchema.value.disabled"
            :maxlength="pickSchema.value.maxLength"
            class="ant-col-title"
            placeholder="字段值"
          />
        </div>
        <div class="plugin-content" v-else-if="pickSchema.value?.type === 'number'">
          <a-select
            v-if="pickSchema.value?.enum?.length"
            v-model:value="pickValue.value[pickKey]"
            :disabled="pickSchema.value.disabled"
            class="ant-col-title"
            :mode="pickSchema.value?.multiple ? 'multiple' : ''"
          >
            <a-select-option
              v-for="(item, index) in pickSchema.value.enum"
              :key="index"
              :value="item.value ? item.value : item"
            >
              {{ item.label ? item.label : item }}
            </a-select-option>
          </a-select>
          <a-input-number
            v-else
            v-model:value="pickValue.value[pickKey]"
            :disabled="pickSchema.value.disabled"
            :min="pickSchema.value.minimum"
            :max="pickSchema.value.maximum"
            class="ant-col-title"
          />
        </div>
        <div class="plugin-content" v-else-if="pickSchema.value?.type === 'boolean'">
          <a-switch v-model:checked="pickValue.value[pickKey]" :disabled="pickSchema.value.disabled" />
        </div>
        <a-button
          class="ant-col-name-btn"
          v-if="pickSchema.value?.type === 'object' || pickSchema.value?.type === 'array'"
          type="link"
          style="color: rgba(0, 0, 0, 0.65)"
        >
          <template #icon>
            <caret-right-outlined v-if="hidden" />
            <caret-down-outlined v-else />
          </template>
        </a-button>
      </div>
      <div class="plugin-btn">
        <template v-if="pluginMenu.length > 1">
          <a-dropdown placement="bottomRight">
            <a-button type="link" class="setting-icon">
              <template #icon><ellipsis-outlined /></template>
            </a-button>
            <template #overlay>
              <a-menu @click="handlePluginClick">
                <a-menu-item v-for="item in pluginMenu" :key="item">
                  <a-tooltip v-if="item === PluginEnum.SETTING" placement="left">
                    <template v-slot:title>字段设置</template>
                    <a-button type="link" class="setting-icon">
                      <template #icon><setting-outlined /></template>
                    </a-button>
                  </a-tooltip>
                  <a-tooltip v-else-if="item === PluginEnum.CODE" placement="left">
                    <template v-slot:title>编辑代码</template>
                    <a-button type="link" class="setting-icon">
                      <template #icon><code-outlined /></template>
                    </a-button>
                  </a-tooltip>
                  <a-tooltip v-else-if="item === PluginEnum.STYLE" placement="left">
                    <template v-slot:title>编辑样式</template>
                    <a-button type="link" class="setting-icon">
                      <template #icon><bg-colors-outlined /></template>
                    </a-button>
                  </a-tooltip>
                  <a-tooltip v-else-if="item === PluginEnum.CUSTOM" placement="left">
                    <template v-slot:title>{{ local["remove_node"] }}</template>
                    <a-button type="link" class="close-icon ant-btn-icon-only">
                      <i aria-label="icon: plus" class="anticon anticon-plus">
                        <svg
                          viewBox="64 64 896 896"
                          data-icon="plus"
                          width="1em"
                          height="1em"
                          fill="currentColor"
                          aria-hidden="true"
                          focusable="false"
                          class=""
                        >
                          <path
                            d="M810.666667 273.493333L750.506667 213.333333 512 451.84 273.493333 213.333333 213.333333 273.493333 451.84 512 213.333333 750.506667 273.493333 810.666667 512 572.16 750.506667 810.666667 810.666667 750.506667 572.16 512z"
                            p-id="1142"
                          ></path>
                        </svg>
                      </i>
                    </a-button>
                  </a-tooltip>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
        <template v-else>
          <a-tooltip
            v-if="
              pickSchema.value?.custom &&
              (pickSchema.value.type === 'array' ||
                pickSchema.value.type === 'string' ||
                pickSchema.value.type === 'number')
            "
          >
            <template v-slot:title>字段设置</template>
            <a-button type="link" class="setting-icon" @click="showSchemaModal(ISchemaModel.EDIT)">
              <template #icon><setting-outlined :style="{ color: '#1890FF' }" /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip v-else-if="pickSchema.value?.format && pickSchema.value.format === 'code'">
            <template v-slot:title>编辑代码</template>
            <a-button type="link" class="setting-icon" @click="codeModal = true">
              <template #icon><code-outlined :style="{ color: '#1890FF' }" /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip v-else-if="pickSchema.value?.format && pickSchema.value.format === 'style'">
            <template v-slot:title>编辑样式</template>
            <a-button type="link" class="setting-icon" @click="styleModal = true">
              <template #icon><bg-colors-outlined :style="{ color: '#1890FF' }" /></template>
            </a-button>
          </a-tooltip>
          <a-tooltip v-else-if="isItem || pickSchema.value?.custom">
            <template v-slot:title>{{ local["remove_node"] }}</template>
            <a-button type="link" class="close-icon ant-btn-icon-only" @click="removeChild">
              <i aria-label="icon: plus" class="anticon anticon-plus" :style="{ color: '#1890FF' }">
                <svg
                  viewBox="64 64 896 896"
                  data-icon="plus"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                  class=""
                >
                  <path
                    d="M810.666667 273.493333L750.506667 213.333333 512 451.84 273.493333 213.333333 213.333333 273.493333 451.84 512 213.333333 750.506667 273.493333 810.666667 512 572.16 750.506667 810.666667 810.666667 750.506667 572.16 512z"
                    p-id="1142"
                  ></path>
                </svg>
              </i>
            </a-button>
          </a-tooltip>
        </template>
      </div>
    </div>

    <div v-if="!pickSchema.value?.format || pickSchema.value.format !== 'custom'">
      <div v-show="!hidden" :style="{ width: 'calc(100% - 10px)', marginLeft: 'auto' }">
        <json-schema-editor
          v-if="pickSchema.value?.properties && !schemaIsArray"
          v-for="(item, key) in pickSchema.value?.properties"
          :schema="{ [key]: item }"
          :value="pickValue.value[pickKey]"
          :parent="pickSchema.value"
          :key="key"
          :deep="deep + 1"
          :root="false"
          class="children"
          :lang="lang"
          :custom="custom"
          @removeNode="removeNode"
          @changeSchema="changeSchema"
        />
        <div v-else-if="schemaIsArray">
          <div v-if="itemsArray">
            <json-schema-editor
              v-for="(item, index) in pickSchema.value.items"
              :key="index"
              :schema="{ [index]: item }"
              :value="{ [index]: pickValue.value[pickKey]?.[index] }"
              :parent="pickSchema.value"
              :itemIndex="index"
              :deep="deep + 1"
              isItem
              :root="false"
              class="children test"
              :lang="lang"
              :custom="custom"
              @itemChange="itemChange"
              @removeNode="removeNode"
              @changeSchema="changeSchema"
            />
          </div>
          <div v-else>
            <json-schema-editor
              v-for="(item, index) in pickValue.value[pickKey]"
              :key="index"
              :schema="{ [index]: pickSchema.value.items }"
              :value="{ [index]: item }"
              :parent="pickSchema.value"
              :itemIndex="index"
              :deep="deep + 1"
              isItem
              :root="false"
              class="children"
              :lang="lang"
              :custom="custom"
              @itemChange="itemChange"
              @removeNode="removeNode"
              @changeSchema="changeSchema"
            />
          </div>
        </div>
        <div class="add-btn" v-if="schemaIsObject && !isItem && !pickSchema.value.disabled">
          <span @click="showSchemaModal(ISchemaModel.ADD)">添加子属性+</span>
        </div>
        <div class="add-btn" v-else-if="schemaIsArray && !pickSchema.value.disabled">
          <span @click="addArrayChild">添加一项+</span>
        </div>
      </div>
    </div>

    <a-modal
      v-model:visible="schemaModal"
      v-if="schemaModal"
      :title="schemaModalTitle"
      :maskClosable="false"
      :closable="false"
      :okText="local['ok']"
      :cancelText="local['cancel']"
      width="80%"
      @ok="schemaInfoChange"
    >
      <div style="width: 100%; height: 600px; display: flex; align-items: center">
        <div style="width: 350px; height: 100%">
          <a-tabs v-model:activeKey="codeActivity">
            <a-tab-pane v-for="item in schemaList" :key="item.type" :tab="item.title">
              <a-tooltip>
                <template v-slot:title>使用示例</template>
                <right-circle-outlined
                  :style="{ fontSize: '20px', color: '#409eff', float: 'right', padding: '6px 0' }"
                  @click="useExample"
                />
              </a-tooltip>
              <pre
                style="
                  width: 100%;
                  height: 100%;
                  font-size: 14px;
                  font-family: Arial, Helvetica, sans-serif;
                  background-color: #1e1e1e;
                  color: #9cdcfe;
                "
              >
                <code style="width: 100%;height: 100%;overflow: auto;" >{{ JSON.stringify(item.example,null,2) }}</code>
              </pre>
            </a-tab-pane>
          </a-tabs>
        </div>
        <div style="width: 20px"></div>
        <q-code-editor
          ref="schemaEditor"
          :value="tempSchemaInfo"
          language="json"
          style="flex: 1; height: 100%; display: block"
        ></q-code-editor>
      </div>
    </a-modal>
    <a-modal
      v-model:visible="codeModal"
      v-if="codeModal"
      title="代码编辑"
      :maskClosable="false"
      :okText="local['ok']"
      :cancelText="local['cancel']"
      width="80%"
      @ok="codeChange"
    >
      <q-code-editor
        ref="codeEditor"
        :value="pickValue.value[pickKey]"
        language="javascript"
        style="width: 100%; height: 600px; display: block"
      ></q-code-editor>
    </a-modal>
    <a-modal
      v-model:visible="styleModal"
      v-if="styleModal"
      title="样式编辑"
      :maskClosable="false"
      :okText="local['ok']"
      :cancelText="local['cancel']"
      width="505px"
      @ok="handleStyle"
    >
      <q-style-setting
        :value="pickValue.value[pickKey]"
        style="height: 600px; overflow-y: auto; overflow-x: hidden; width: 100%"
        @change="styleChange"
      ></q-style-setting>
    </a-modal>
    <a-modal
      v-model:visible="itemsModal"
      v-if="itemsModal"
      title="选择或新增schema"
      :maskClosable="false"
      :footer="null"
      width="450px"
    >
      <div style="display: flex; align-items: center">
        <a-button style="margin: 0 auto" @click="showItemsListModel">选择Schema</a-button>
        <a-button style="margin: 0 auto" @click="(itemsModal = false), showSchemaModal(ISchemaModel.ITEMS)">
          新增Schema
        </a-button>
      </div>
    </a-modal>
    <a-modal
      v-model:visible="itemsListModal"
      v-if="itemsListModal"
      title="选择schema"
      :maskClosable="false"
      :okText="local['ok']"
      :cancelText="local['cancel']"
      width="600px"
      @ok="handleItems"
    >
      <div style="width: 100%; height: 600px; padding: 10px; overflow: auto">
        <div v-if="pickSchema.value?.items?.length">
          <div v-for="(item, index) in pickSchema.value.items" :key="index">
            <div
              :style="{
                outline: itemsIndex === index ? '2px solid #1890ff' : '',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                cursor: 'pointer',
              }"
              @click="itemsIndex = index"
            >
              <pre
                style="
                  width: 100%;
                  font-size: 14px;
                  font-family: Arial, Helvetica, sans-serif;
                  background-color: #1e1e1e;
                  color: #9cdcfe;
                  margin: 0;
                "
              >
                <code style="width: 100%;height: 100%;overflow: auto;">{{ JSON.stringify(item,null,2) }}</code>
              </pre>
            </div>
          </div>
        </div>
        <div v-else style="margin: 0 auto">
          <a-empty description="暂无数据" />
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
import locale from "ant-design-vue/lib/date-picker/locale/zh_CN";
import dayjs, { Dayjs } from "dayjs";
import { cloneDeep, isFunction, isString, isObject, isArray, isEqual, isBoolean } from "lodash-es";
import { computed, createVNode, inject, onMounted, reactive, Ref, ref, watch } from "vue";
import { removeLineBreaks, openFileSelector } from "../../util/utils";
import LocalProvider from "./LocalProvider";
import schemaExample from "./type/example.json";
import { TYPE_NAME } from "./type/type";
import JsonSchemaEditor from "./index.vue";
import { checkColor } from "../../util/color/checkColor";

const props = defineProps({
  value: {
    type: Object,
    required: true,
  },
  schema: {
    type: Object,
    required: true,
  },
  disabled: {
    //name不可编辑，根节点name不可编辑,数组元素name不可编辑
    type: Boolean,
    default: false,
  },
  disabledType: {
    //禁用类型选择
    type: Boolean,
    default: false,
  },
  isItem: {
    //是否数组元素
    type: Boolean,
    default: false,
  },
  itemValue: {
    //是否数组元素
    type: Object || String || Number || Boolean,
    default: null,
  },
  itemIndex: {
    // 数组元素index
    type: Number,
    default: null,
  },
  deep: {
    // 节点深度，根节点deep=0
    type: Number,
    default: 0,
  },
  root: {
    //是否root节点
    type: Boolean,
    default: true,
  },
  parent: {
    //父节点
    type: Object,
    default: null,
  },
  custom: {
    // 是否是自定义属性
    type: Boolean,
    default: false,
  },
  lang: {
    // i18n language
    type: String,
    default: "zh_CN",
  },
});
const context = defineEmits(["itemChange", "removeNode", "changeSchema"]);
const componentModel = inject("componentModel") as Ref;
const optionsView = inject("optionsView") as Ref;
const component = inject("component") as Ref;
const labelWidth = inject("labelWidth") as Ref;

const hidden = ref(false);
const local = LocalProvider("zh_CN");
const pickSchema: any = reactive({
  value: Object.values(props.schema)[0],
});
const pickValue: any = reactive({
  value: props.value,
});
const pickKey = ref(Object.keys(props.schema)[0]);
const schemaIsObject = computed(() => {
  if (!pickSchema.value) {
    return false;
  }
  return pickSchema.value.type === "object";
});
const schemaIsArray = computed(() => {
  if (!pickSchema.value) {
    return false;
  }
  return pickSchema.value.type === "array";
});
const itemsArray = computed(() => {
  if (!pickSchema.value) {
    return false;
  }
  return isArray(pickSchema.value.items);
});
const schemaIsDisplay = computed(() => {
  if (!pickSchema.value) {
    return false;
  }
  if (isBoolean(pickSchema.value?.display)) {
    return pickSchema.value.display;
  } else {
    return true;
  }
});

/**
 * 监听schema和value的props传入数据更新
 */
watch(
  () => props.schema,
  (newValue) => {
    if (!isObject(newValue)) return;
    pickSchema.value = Object.values(newValue)[0];
    pickKey.value = Object.keys(newValue)[0];
    getPluginNum();
  }
);
watch(
  () => props.value,
  (newValue) => {
    if (!isObject(newValue)) return;
    changeComponent.value = true;
    pickValue.value = newValue;
    checkUpCustomSetter();
  }
);

/**
 * 处理时间数据
 * 转换为dayjs对象
 */
const tempTimeValue = ref<Dayjs>();
if (pickSchema.value && pickSchema.value.format && pickSchema.value.format === "date") {
  tempTimeValue.value = dayjs(pickValue.value[pickKey.value], "YYYY-MM-DD");
}
if (pickSchema.value && pickSchema.value.format && pickSchema.value.format === "date-time") {
  tempTimeValue.value = dayjs(pickValue.value[pickKey.value], "YYYY-MM-DD hh:mm:ss");
}
const timeChange = (e: any) => {
  pickValue.value[pickKey.value] = e;
};

/**
 * 监听value更改, 进行自定义操作
 */
const changeComponent = ref(false);
watch(
  () => pickValue.value[pickKey.value],
  (newValue, oldValue) => {
    if (changeComponent.value && isEqual(props.value[pickKey.value], oldValue)) {
      changeComponent.value = false;
      return;
    }
    if (props.isItem && props.itemIndex !== null) {
      // 数组子项更改，抛到父组件更改数组数据
      context("itemChange", { index: props.itemIndex, value: pickValue.value[pickKey.value] });
    }
    const config = {
      component: component.value,
      componentModel: componentModel.value,
      optionsView: optionsView.value,
      parentValue: pickValue.value,
      parentSchema: props.parent,
      value: cloneDeep(newValue),
      key: cloneDeep(pickKey.value),
      itemIndex: props.itemIndex,
    };
    handleCustomFn(config);
  }
);
const itemChange = (e: any) => {
  pickValue.value[pickKey.value][e.index] = e.value;
};

/**
 * 执行schema中的自定义fn
 * @param value
 * @param componentModel
 */
function handleCustomFn(config: Record<string, any>) {
  try {
    if (!pickSchema.value.fn) return;
    if (isString(pickSchema.value.fn)) {
      const customFn = new Function(`return ${pickSchema.value.fn}`)();
      customFn(config);
    } else if (isFunction(pickSchema.value.fn)) {
      pickSchema.value.fn(config);
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * 折叠或者展开
 */
function showOrHidden() {
  if (schemaIsObject.value || schemaIsArray.value) {
    hidden.value = !hidden.value;
  }
}

/**
 * 添加array子项
 */
const addArrayChild = () => {
  if (itemsArray.value) {
    itemsModal.value = true;
  } else {
    const value = getDefaultValue(pickSchema.value.items);
    pickValue.value[pickKey.value].push(value);
  }
};

/**
 * 处理数组items为多项不同schema
 */
const itemsModal = ref(false);
const itemsListModal = ref(false);
const itemsIndex = ref<number>(-1);
function showItemsListModel() {
  itemsModal.value = false;
  itemsIndex.value = -1;
  itemsListModal.value = true;
}
function handleItems() {
  if (!pickSchema.value.items[itemsIndex.value]) {
    message.warning("请选择Schema !");
    return;
  }
  const schema = cloneDeep(pickSchema.value.items[itemsIndex.value]);
  pickSchema.value.items.push(schema);
  const index = pickSchema.value.items.length - 1;
  pickValue.value[pickKey.value][index] = getDefaultValue(schema);
  itemsListModal.value = false;
}

/**
 * 获取结构化的初始数据
 * @param schema
 * @returns
 */
const getDefaultValue = (schema: any) => {
  if (schema.preprocess) return document.getElementById(pickValue.value.id)?.[schema.preprocess]?.(schema); // 新增提前处理有需要的数据
  switch (schema.type) {
    case "object":
      const itemsValue = {};
      Object.keys(schema.properties).forEach((key: string) => {
        itemsValue[key] = getDefaultValue(schema.properties[key]);
      });
      return itemsValue;
    case "array":
      return [];
    case "string":
      if (schema.multiple) {
        return [];
      } else {
        return "";
      }
    case "number":
      if (schema.multiple) {
        return [];
      } else {
        return 0;
      }
    case "boolean":
      return false;
  }
  return null;
};

/**
 * 删除子项
 */
const removeChild = () => {
  Modal.confirm({
    title: `确定删除[${pickSchema.value?.description}][${pickKey.value}]吗?`,
    icon: createVNode(ExclamationCircleOutlined),
    okText: "确定",
    cancelText: "取消",
    onOk() {
      context("removeNode", pickKey.value);
    },
  });
};

/**
 * 移除节点数据
 * @param key 数据的key
 */
const removeNode = (key: any) => {
  if (schemaIsObject.value) {
    delete pickSchema.value.properties[key];
    delete pickValue.value[pickKey.value][key];
  }
  if (schemaIsArray.value) {
    if (itemsArray.value) {
      pickSchema.value.items.splice(Number(key), 1);
    }
    pickValue.value[pickKey.value].splice(Number(key), 1);
  }
};

/**
 * 代码编辑器
 */
const codeModal = ref(false);
const codeEditor = ref(null);
const codeChange = () => {
  const code = (codeEditor.value as any).getValue();
  pickValue.value[pickKey.value] = code;
  codeModal.value = false;
};

/**
 * 样式编辑器
 */
const styleModal = ref(false);
const tempStyle = ref("");
const styleChange = (ev: CustomEvent) => {
  tempStyle.value = ev.detail.value;
};
const handleStyle = () => {
  if (tempStyle.value) {
    pickValue.value[pickKey.value] = tempStyle.value;
  }
  styleModal.value = false;
};

/**
 * 新增和编辑属性
 */
const schemaModal = ref(false);
const schemaEditor = ref(null);
const schemaType = ref("");
const schemaModalTitle = ref("");
const tempSchemaInfo = ref("");
const enum ISchemaModel {
  ADD = "add",
  EDIT = "edit",
  ITEMS = "items",
}
const showSchemaModal = (type: string) => {
  schemaType.value = type;
  switch (type) {
    case ISchemaModel.ADD:
      schemaModalTitle.value = "新增Schema属性";
      schemaModal.value = true;
      break;
    case ISchemaModel.EDIT:
      schemaType.value = "edit";
      schemaModalTitle.value = "编辑Schema属性";
      const schema = { [pickKey.value]: { ...pickSchema.value } };
      // 编辑时去除custom
      delete schema[pickKey.value].custom;
      tempSchemaInfo.value = JSON.stringify(schema);
      schemaModal.value = true;
      break;
    case ISchemaModel.ITEMS:
      schemaModalTitle.value = "新增数组Schema子属性";
      schemaModal.value = true;
      break;
  }
};
const schemaInfoChange = () => {
  let schemaInfo = removeLineBreaks((schemaEditor.value as any).getValue());
  if (!schemaInfo) {
    message.destroy();
    message.warning("请输入属性Schema描述信息!");
    return;
  }
  try {
    schemaInfo = JSON.parse(schemaInfo);
    const schema: any = Object.values(schemaInfo)[0];
    const key: string = Object.keys(schemaInfo)[0];
    if (!key) {
      message.error("属性key错误, 请更改key!");
      return;
    }
    if (!schema.type || !TYPE_NAME.includes(schema.type)) {
      message.error("属性type错误, 请更改type!");
      return;
    }
    switch (schemaType.value) {
      case ISchemaModel.ADD:
        if (pickSchema.value.properties[key]) {
          message.error("属性key重复, 请更改key!");
          return;
        }
        // 添加自定义属性标记
        schema.custom = true;
        // 新增时操作当前层数据
        pickSchema.value.properties[key] = schema;
        pickValue.value[pickKey.value][key] = getDefaultValue(schema);
        break;
      case ISchemaModel.EDIT:
        // 添加自定义属性标记
        schema.custom = true;
        // 编辑时操作上一层数据
        context("changeSchema", key, pickKey.value, schema);
        break;
      case ISchemaModel.ITEMS:
        pickSchema.value.items.push(schema);
        const index = pickSchema.value.items.length - 1;
        pickValue.value[pickKey.value][index] = getDefaultValue(schema);
        break;
    }
    schemaModal.value = false;
    tempSchemaInfo.value = "";
    schemaType.value = "";
  } catch (error) {
    console.log(error);
    message.destroy();
    message.error("属性Schema描述信息解析错误, 请关注浏览器控制台错误信息!");
  }
};
// 编辑schema
const changeSchema = (newKey: string, oldKey: string, schema: any) => {
  const nodeSchema = pickSchema.value.properties[oldKey];
  const nodeValue = pickValue.value[pickKey.value][oldKey];
  if (newKey !== oldKey) {
    // 删除oldKey数据
    delete pickSchema.value.properties[oldKey];
    delete pickValue.value[pickKey.value][oldKey];
  }
  pickSchema.value.properties[newKey] = schema;
  if (nodeSchema.type !== schema.type) {
    // 字段类型变更，重新初始化数据
    pickValue.value[pickKey.value][newKey] = getDefaultValue(schema);
  } else {
    pickValue.value[pickKey.value][newKey] = nodeValue;
  }
};

// 属性编辑-颜色选择
const colorPick = (v: any) => {
  pickValue.value[pickKey.value] = v.detail.value;
};
// 属性编辑-图片选择
const openUploadWin = (v: any) => {
  openFileSelector("attrSettingOpenWin", {
    selected: (val: string) => {
      pickValue.value[v] = val;
    },
  });
};

/**
 * 颜色校验
 */
const checkColorUtil = (v: string) => {
  return checkColor(v) ? v : "#FFFFFF";
};

/**
 * 获取控件数量，两个及以上控件使用下拉菜单
 */
enum PluginEnum {
  SETTING = "setting",
  CODE = "code",
  STYLE = "style",
  CUSTOM = "custom",
}
const pluginMenu = ref<string[]>([]);
function getPluginNum() {
  pluginMenu.value = [];
  if (pickSchema.value?.disabled) return;
  if (
    pickSchema.value?.custom &&
    (pickSchema.value.type === "array" || pickSchema.value.type === "string" || pickSchema.value.type === "number")
  ) {
    pluginMenu.value.push(PluginEnum.SETTING);
  }
  if (pickSchema.value?.format === "code") {
    pluginMenu.value.push(PluginEnum.CODE);
  }
  if (pickSchema.value?.format === "style") {
    pluginMenu.value.push(PluginEnum.STYLE);
  }
  if (props.isItem || pickSchema.value?.custom) {
    pluginMenu.value.push(PluginEnum.CUSTOM);
  }
}

/**
 * 数据项操作按钮
 * @param param0
 */
function handlePluginClick({ key }: { key: string }) {
  switch (key) {
    case PluginEnum.SETTING:
      showSchemaModal(ISchemaModel.EDIT);
      break;
    case PluginEnum.CODE:
      codeModal.value = true;
      break;
    case PluginEnum.STYLE:
      styleModal.value = true;
      break;
    case PluginEnum.CUSTOM:
      removeChild();
      break;
  }
}

/**
 * 代码结构示例
 */
const codeActivity = ref("string");
const schemaList = ref(schemaExample);
function useExample() {
  const codeStr = JSON.stringify(schemaExample[codeActivity.value].example);
  try {
    if (codeStr) {
      (schemaEditor.value as any).setValue(codeStr);
    }
  } catch (error) {}
}

/**
 * 自定义设置器
 */
const customSetter = ref();
function checkUpCustomSetter() {
  if (!customSetter.value?.children[0]) return;
  try {
    const setter = customSetter.value.children[0] as HTMLElement;
    setter.removeEventListener("change", customSetterChange);
    setter.setAttribute(
      "value",
      !isString(pickValue.value[pickKey.value])
        ? JSON.stringify(pickValue.value[pickKey.value])
        : pickValue.value[pickKey.value]
    );
    setter.addEventListener("change", customSetterChange);
  } catch (error) {}
}
function customSetterChange(e: any) {
  if (e.detail?.data) {
    pickValue.value[pickKey.value] = cloneDeep(e.detail.data);
  }
}

onMounted(() => {
  getPluginNum();
  checkUpCustomSetter();
});
</script>
<style lang="scss" scoped></style>

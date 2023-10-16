<template>
  <div class="form-container">
    <a-form
      ref="formRef"
      name="form_in_modal"
      :model="data.data"
      :size="data.config.size"
      :layout="data.config.layout"
      v-bind="{ labelCol: { span: data.config.labelCol ? data.config.labelCol : 4 }, wrapperCol: { span: data.config.wrapperCol ? data.config.wrapperCol : 14 } }"
    >
      <!-- className: 'full-col', 整行排列显示 -->
      <div v-for="(element, index) in data.list.filter((v) => { return v && (typeof v.hide === 'function' ? !v.hide(data) : !v.hide) })" :key="index" :class="element.col==='2'?'width50':'width100'">
        <a-form-item
          class="form-item"
          :class="element.className"
          :name="element.prop"
          :rules="[{ required: element.required, message: element.message }]"
        >
          <template v-if="element.name" #label>{{ element.name }}</template>
          <template v-if="element.type == 'input'">
            <a-input
              v-model:value="data.data[element.prop]"
              :maxlength="(element.maxlength || 128)"
              :placeholder="element.placeholder"
              :disabled="element.disabled"
            />
          </template>

          <template v-if="element.type == 'textarea'">
            <a-textarea
              v-model:value="data.data[element.prop]"
              type="textarea"
              :rows="element.rows || 5"
              :maxlength="(element.maxlength || 500)"
              :disabled="element.disabled"
              :placeholder="element.placeholder"
            />
          </template>

          <template v-if="element.type == 'number'">
            <a-input-number
              v-model:value="data.data[element.prop]"
              :disabled="element.disabled"
              :controls-position="element.controlsPosition"
            />
          </template>

          <template v-if="element.type == 'radio'">
            <a-radio-group
              v-model:value="data.data[element.prop]"
              :disabled="element.disabled"
              @change="(val:any) => { if(typeof element.change === 'function') element.change(data, val) }"
            >
              <a-radio
                v-for="(item, indexRadio) in element.options"
                :key="item.value + indexRadio"
                :disabled="item.disabled"
                :style="{display: element.inline ? 'block' : 'inline-block'}"
                :value="item.value"
              >
                {{ (element.showLabel || element.showLabel === undefined) ? item.label : item.value }}
              </a-radio>
            </a-radio-group>
          </template>

          <template v-if="element.type == 'checkbox'">
            <a-checkbox-group
              v-model:value="data.data[element.prop]"
              :disabled="element.disabled"
              :min="element.min"
              :max="element.max"
              @change="(val:any) => { if(typeof element.change === 'function') element.change(data, val) }"
            >
              <a-checkbox
                v-for="(item, indexCheckbox) in element.options"
                :key="item.value + indexCheckbox"
                :style="{display: element.inline ? 'block' : 'inline-block'}"
                :value="item.value"
              >
                {{ (element.showLabel || element.showLabel === undefined) ? item.label : item.value }}
              </a-checkbox>
            </a-checkbox-group>
          </template>

          <template v-if="element.type == 'time'">
            <a-time-picker
              v-model:value="data.data[element.prop]"
              :is-range="element.isRange"
              :placeholder="element.placeholder"
              :start-placeholder="element.startPlaceholder"
              :end-placeholder="element.endPlaceholder"
              :readonly="element.readonly"
              :disabled="element.disabled"
              :editable="element.editable"
              :clearable="element.clearable"
              :arrow-control="element.arrowControl"
            />
          </template>

          <template v-if="element.type == 'date'">
            <a-date-picker
              v-model:value="data.data[element.prop]"
              :type="element.type"
              :is-range="element.isRange"
              :placeholder="element.placeholder"
              :start-placeholder="element.startPlaceholder"
              :end-placeholder="element.endPlaceholder"
              :readonly="element.readonly"
              :disabled="element.disabled"
              :editable="element.editable"
              :clearable="element.clearable"
              :value-format="'yyyy-MM-dd'"
            />
          </template>

          <template v-if="element.type == 'rate'">
            <a-rate
              v-model:value="data.data[element.prop]"
              :max="element.max"
              :disabled="element.disabled"
              :allow-half="element.allowHalf"
            />
          </template>

          <!-- <template v-if="element.type == 'color'">
            <a-color-picker
              v-model:value="data.data[element.prop]"
              :disabled="element.disabled"
              :show-alpha="element.showAlpha"
            />
          </template> -->

          <template v-if="element.type == 'select'">
            <a-select
              v-model:value="data.data[element.prop]"
              :max-tag-count="element.maxTagCount?element.maxTagCount:2"
              :disabled="element.disabled"
              :mode="element.mode"
              :clearable="element.clearable"
              :placeholder="element.placeholder || '请选择'"
              @change="(val:any) => { if(typeof element.change === 'function') element.change(data, val) }"
            >
              <a-select-option v-for="item in element.options" :key="item.value" :value="item.value" :label="(element.showLabel || element.showLabel === undefined)?item.label:item.value" />
            </a-select>
          </template>

          <template v-if="element.type=='switch'">
            <a-switch
              v-model:value="data.data[element.prop]"
              :disabled="element.disabled"
            />
          </template>

          <template v-if="element.type=='slider'">
            <a-slider
              v-model:value="data.data[element.prop]"
              :min="element.min"
              :max="element.max"
              :disabled="element.disabled"
              :step="element.step"
              :show-input="element.showInput"
              :range="element.range"
            />
          </template>

          <!-- <template v-if="element.type=='imgupload'">
            <fm-upload
              v-model:value="data.data[element.prop]"
              :disabled="element.disabled"
              :style="{'width': element.width}"
              :width="element.size.width"
              :height="element.size.height"
              :length="element.length"
              token="xxx"
              domain="xxx"
            />
            <div v-if="element.tip" class="upload-tip">
              <span v-html="element.tip" />
            </div>
          </template> -->

          <template v-if="element.type == 'cascader'">
            <a-cascader
              v-model:value="data.data[element.prop]"
              :disabled="element.disabled"
              :clearable="element.clearable"
              :placeholder="element.placeholder"
              :options="element.remoteOptions"
            />
          </template>

          <template v-if="element.type == 'editor'">
            <!-- <fm-editor
              v-model:value="data.data[element.prop]"
              :height="element.height"
            /> -->
          </template>

          <template v-if="element.type == 'blank'">
            <div style="height: 50px;color: #999;background: #eee;line-height:50px;text-align:center;">自定义区域</div>
          </template>

          <template v-if="element.type == 'divider'">
            <a-divider :content-position="element.position"><i v-if="element.icon" :class="element.icon" />{{ element.content }}</a-divider>
          </template>

          <template v-if="element.type == 'custom'">
            <slot :name="element.prop" />
          </template>
        </a-form-item>
      </div>
    </a-form>
    <!-- <a-button @click="cctv">aaaa</a-button> -->
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, defineComponent } from "vue"

import { FormData } from "./IQTablely"
// 定义接口来定义对象的类型
interface DyncFormData {
  data: FormData
}

export default defineComponent({
  name: "dyncForm",
  props: {
    formData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props: any) {
    console.log(props.formData)
    const state = reactive<DyncFormData>({
      data: props.formData
    })
    const formState = {}
    const cctv = () => {
      console.log(props.formData, state.data)
    }
    return {
      formState,
      ...toRefs(state),
      cctv
    }
  }
})
</script>

<style lang="scss" scoped>
  .form-container{
    .width50{
      width: 50%;
      display: inline-block;
      vertical-align: middle;
    }
    .width100{
      width: 100%;
      display: inline-block;
      vertical-align: middle;
    }
    .form-item{
      &.is_req{}
    }

    .upload-tip{
      line-height: 180%;
      color: #C5CFEB;
    }
  }
</style>

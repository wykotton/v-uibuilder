---
category: Components
type: 数据展示
title: Tag
subtitle: 标签
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Tag.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{
import ("@zzjz/v-component/dist2/assets/q-tag.js");
import ("@zzjz/v-component/dist2/assets/q-color-picker.js");
import ("@zzjz/v-component/dist2/assets/q-input.js"); 
})

</script>

# Tag 标签

进行标记和分类的小标签

## 何时使用

用于标记事物的属性和维度。
进行分类。

## 代码演示

:::demo

```vue
<script setup lang="ts">
import { ref,onMounted } from 'vue'
const tagData = ref([
  {
    closable: false,
    visible: true,
    checked: false,
    type: "Tag",
    color: "",
    icon: "",
    title: "可修改颜色Tag",
    titleSlot: ""
  }
])



onMounted(() => {
  document.getElementById("colorPicker").addEventListener("change", (e: any) => {
    tagData.value[0].color = e.detail.value
    document.getElementById("qTag").setValue(tagData.value)
  });

  
  const type = ["success", "processing", "error", "warning", "default"]
  
  // 可修改颜色Tag
  Array.from(document.querySelectorAll(".tag")).map((it,i) => {
    const temp = [{
      closable: true,
      visible: true,
      checked: false,
      type: "Tag",
      color: type[i],
      icon: "",
      title: type[i],
      titleSlot: ""
    }]
    it.setValue(temp)
  })

  // 不同类型Tag
  Array.from(document.querySelectorAll(".typeTag")).map((it,i) => {
    const temp = type.map((its,t) => {
      return {
        closable: true,
        visible: true,
        checked: false,
        type: "Tag",
        color: its,
        icon: "",
        title: its,
        titleSlot: ""
      }
    })
    it.setValue(temp)
  })

  // 可选中Tag
  Array.from(document.querySelectorAll(".checkTag")).map((it,i) => {
    const temp = [{
      closable: false,
      visible: true,
      checked: true,
      type: "CheckableTag",
      color: "",
      icon: "",
      title: "Tag1",
      titleSlot: ""
    },
      {
        closable: false,
        visible: true,
        checked: false,
        type: "CheckableTag",
        color: "",
        icon: "",
        title: "Tag2",
        titleSlot: ""
      }]
    it.setValue(temp)
  })

  // 带图标Tag
  Array.from(document.querySelectorAll(".iconTag")).map((it,i) => {
    const temp = [{
      closable: false,
      visible: true,
      checked: true,
      type: "Tag",
      color: "",
      icon: '<svg t="1675669368724" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2664" width="16" height="16"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" p-id="2665"></path></svg>',
      title: "Tag1",
      titleSlot: ""
    }]
    it.setValue(temp)
  })

 // 可新增
  document.getElementById("tagInput").addEventListener("onChange", (e: any) => {
    tagData.value[0].color = e.detail.value
    const addTag = document.querySelector(".addTag")
    const temp = addTag.getValue()
    temp.push({
      closable: true,
      visible: true,
      checked: false,
      type: "Tag",
      color: "",
      icon: "",
      title: e.detail.value,
      titleSlot: ""
    })
    addTag.setValue(temp)
  });
})
</script>
<template>
  <div style="height: 500px">
    <div style="display: flex; align-items: center">
      可修改颜色Tag
      <q-tag class="tag" :tag-data="tagData" id="qTag"> </q-tag>
      <q-color-picker id="colorPicker"></q-color-picker>
    </div>
    <br/>
    <br/>
    <div>
      不同状态Tag
      <q-tag class="typeTag" tag-data ></q-tag>
    </div>
    <br/>
    <br/>
    <div>
      可选中Tag
      <q-tag class="checkTag" tag-data></q-tag>
    </div>

    <br/>
    <br/>
    <div>
      带图标Tag
      <q-tag class="iconTag" tag-data></q-tag>
    </div>

    <br/>
    <br/>
    <div>
      可新增Tag
      <q-tag class="addTag" tag-data></q-tag>
      <q-input id="tagInput"></q-input>
    </div>
  </div>

</template>
<style>
.tag {
  width: 100px;
  margin: 5px;
}
</style>
```

:::

## Tag 属性

| 属性       | 说明      | 类型      | 可选值                  | 默认值     |
|----------|---------|---------|----------------------|---------|
| closable     | 开启关闭按钮 | boolean  | —                    | —       |
| visible     | 显示/隐藏 | boolean  | —                    | —       |
| type     | 标签类型 | string  | Tag,CheckableTag                 | Tag     |
| checked    | 可选中标签 （类型为可选中时才生效）    | boolean  | —                    | —       |
| color    | 标签颜色   | string  | —                    | #fafafa |
| icon | 标签图标   | string | —                    | —       |
| title     | 标签名   | string  | — | —       |

## Tag DOM事件

| 事件名      | 说明  | 参数                   |
|----------|-----|----------------------|
| click    | 单击  | (event: CustomEvent) |
| dblclick | 双击  | (event: CustomEvent) |

## Tag 消息响应

| 事件名        | 说明     | 参数                |
|------------|--------|-------------------|
| setValue | 设置组件值  | (event: IMessage) |
| changeValue      | 修改组件值  | (event: IMessage) |
| resetValue      | 重置组件值  | (event: IMessage) |
| setSelectedValue      | 设置组件选中 | (event: IMessage) |
| click      | Tag点击 | (event: IMessage) |
| close      | Tag关闭 | (event: IMessage) |
| change      | Tag选中 | (event: IMessage) |



## Tag 生命周期

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |
---
category: Components
type: 布局
title: Row,Col
subtitle: 步骤条
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{
import("@zzjz/v-component/dist2/assets/q-row.js");
import("@zzjz/v-component/dist2/assets/q-col.js");
import("@zzjz/v-component/dist2/assets/q-container-mask.js");
})

</script>

# Row,Col 布局工具

24 栅格系统。

## 何时使用

布局的栅格化系统，我们是基于行（row）和列（col）来定义信息区块的外部框架，以保证页面的每个区域能够稳健地排布起来.

## 代码演示

### 基本栅格

:::demo

```vue

<template>
  <div style="height: 300px">
    <q-row>
      <q-col style="" span="10" id="Q-COLw7vms9hft4dl">
        <div>
          col-10
        </div>
      </q-col>
      <q-col style="" span="12" offset="2" id="Q-COLw7vms9hft4dl1">
        <div>
          col-12 offset-2
        </div>
      </q-col>
    </q-row>
  </div>
</template>
<style>
.ant-col-12 {
  display: block;
  flex: 0 0 50%;
  max-width: 50%;
}

.ant-col-offset-2 {
  margin-left: 8.33333%;
}

.ant-col-10 {
  display: block;
  flex: 0 0 41.6667%;
  max-width: 41.6667%;
}
</style>
```

:::

### order、push、pull、flex

:::demo

```vue

<template>
  <div style="height: 300px">
    <q-row>
      <q-col style="" flex="1" order="3" push="2" id="Q-COLw7vms9hft4dl2">
        <div>
          1/6
        </div>
      </q-col>
      <q-col style="" flex="3" order="2" id="Q-COLw7vms9hft4dl3">
        <div>
          3/6
        </div>
      </q-col>
      <q-col style="" flex="2" pull="2" id="Q-COLw7vms9hft4dl4">
        <div>
          2/6
        </div>
      </q-col>
    </q-row>
  </div>
</template>
<style>


.ant-col-offset-2 {
  margin-left: 8.33333%;
}


.ant-col-order-3 {
  order: 3;
}

.ant-col-order-2 {
  order: 2;
}
</style>
```

:::

### 对齐方式

:::demo

```vue

<template>
  <p>Align Top</p>
  <div style="height: 100px">
    <q-row>
      <q-col style="" flex="1" order="3" push="2" id="Q-COLw7vms9hft4dl5">
        <div>
          1/6
        </div>
      </q-col>
      <q-col style="" flex="3" order="2" id="Q-COLw7vms9hft4dl6">
        <div style="height: 50px">
          3/6
        </div>
      </q-col>
      <q-col style="" flex="2" pull="2" id="Q-COLw7vms9hft4dl7">
        <div>
          2/6
        </div>
      </q-col>
    </q-row>
  </div>
</template>
<style>
q-col div {
  width: 100%;
  height: 100%;
  background: #40adff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
}

.ant-col-offset-2 {
  margin-left: 8.33333%;
}


.ant-col-order-3 {
  order: 3;
}

.ant-col-order-2 {
  order: 2;
}
</style>
```

:::

## Row 属性

| 属性      | 说明                                              | 类型      | 可选值                                         | 默认值   |
|---------|-------------------------------------------------|---------|---------------------------------------------|-------|
| wrap    | 是否自动换行                                          | boolean | —                                           | false |
| gutter  | 栅格间隔 { xs: 8, sm: 16, md: 24} / [水平间距，垂直间距] / 2 | string  | —                                           | —     |
| justify | 水平对齐方式                                          | string  | start,end,center,space-between,space-around | start |
| align   | 垂直对齐方式                                          | string  | top,middle,bottom                           | —     |

## Col 属性

| 属性     | 说明                            | 类型     | 可选值 | 默认值   |
|--------|-------------------------------|--------|-----|-------|
| flex   | flex 布局填充                     | string | —   | false |
| offset | 栅格左侧的间隔格数                     | number | —   | —     |
| order  | 栅格顺序，flex 布局模式下有效             | number |     | —     |
| pull   | 栅格向左移动格数                      | number | —   | —     |
| push   | 栅格向右移动格数                      | number | —   | —     |
| span   | 栅格占位格数，为 0 时相当于 display: none | number | —   | —     |
| xs     | <576px 响应式栅格                  | number | —   | —     |
| sm     | ≥576px 响应式栅格                  | number | —   | —     |
| md     | ≥768px 响应式栅格                  | number | —   | —     |
| lg     | ≥992px 响应式栅格                  | number | —   | —     |
| xl     | ≥1200px 响应式栅格                 | number | —   | —     |
| xxl    | ≥1600px 响应式栅格                 | number | —   | —     |
| xxxl   | ≥2000px 响应式栅格                 | number | —   | —     |

## DOM事件

| 事件名      | 说明  | 参数                   |
|----------|-----|----------------------|
| click    | 单击  | (event: CustomEvent) |
| dblclick | 双击  | (event: CustomEvent) |


## 生命周期

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |
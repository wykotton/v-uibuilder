---
category: Components
type: 数据展示
title: Skeleton
subtitle: 锚点
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Skeleton.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{
import ("@zzjz/v-component/dist2/assets/q-skeleton.js");
import ("@zzjz/v-component/dist2/assets/q-switch.js");
import ("@zzjz/v-component/dist2/assets/q-button.js");
import ("@zzjz/v-component/dist2/assets/q-input-number.js");
})

</script>

# Skeleton  骨架屏

在需要等待加载内容的位置提供一个占位图形组合。

## 何时使用

网络较慢，需要长时间等待加载处理的情况下。
图文信息内容较多的列表/卡片中。
只在第一次加载数据的时候使用。
可以被 Spin 完全代替，但是在可用的场景下可以比 Spin 提供更好的视觉效果和用户体验。

## 代码演示

### 基础用法
:::demo

```vue
<template>
  <div style="">
    <div style="height: 300px;position: relative;">
      <q-skeleton :loading="loading"></q-skeleton>
    </div>
    <q-button class="q-button" @click="handleClick('loading')" style="">{{loading ? '关闭' : '开启'}}</q-button>
    <q-button class="q-button" @click="handleClick('active')" style="">{{active ? '关闭动画' : '开启动画'}}</q-button>
    <q-button class="q-button" @click="handleClick('avatar')" style="width: 180px">{{avatar ? '关闭头像占位符' : '开启头像占位符'}}</q-button>
    展示行数<q-input-number class="q-button" :value="row" @change="handleChange" :min="0" ></q-input-number>
  </div>
</template>
<script>  
export default {
  data() {
    return {
      loading: true,
      active: true,
      avatar: true,
      row: 3
    }
  },
 methods: {
   handleClick(v) {
     this[v] = !this[v]
     const qSkeleton = document.querySelector("q-skeleton")
     qSkeleton.setAttribute(v, this[v])
   },
   handleChange(v) {
     this.row = v.detail.value
     const qSkeleton = document.querySelector("q-skeleton")
     qSkeleton.setAttribute("rows",this.row)
   }
 }
}
</script>
<style>
.q-button + .q-button{
  margin-left: 5px;
}
</style>
```

:::

### 不带动画
:::demo

```vue
<template>
  <div style="">
    <div style="height: 300px;position: relative;">
      <q-skeleton loading="true" active="false"></q-skeleton>
    </div>
  </div>
</template>
```

:::

### 不带头像占位符
:::demo

```vue
<template>
  <div style="">
    <div style="height: 300px;position: relative;">
      <q-skeleton loading="true" avatar="false"></q-skeleton>
    </div>
  </div>
</template>
```

:::


### 自定义行数
:::demo

```vue
<template>
  <div style="">
    <div style="height: 300px;position: relative;">
      <q-skeleton loading="true" rows="5"></q-skeleton>
    </div>
  </div>
</template>
```

:::

## Skeleton 属性

| 属性               | 说明        | 类型       | 可选值                       | 默认值   |
|------------------|-----------|----------|---------------------------|-------|
| active           | 开启动画 | boolean   | —                         | true  |
| avatar      | 头像占位符      | boolean   | —                         | true     |
| loading | 显示/隐藏  | boolean   | —                         | false |
| rows      | 行数      | number | —               | 3     |


## Skeleton DOM事件

| 事件名      | 说明  | 参数                   |
|----------|-----|----------------------|
| click    | 单击  | (event: CustomEvent) |
| dblclick | 双击  | (event: CustomEvent) |

## Skeleton 消息响应

| 事件名                 | 说明     | 参数                |
|---------------------|--------|-------------------|
| changeStatue   | 状态改变回调 | (event: IMessage) |

## Skeleton 生命周期

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |
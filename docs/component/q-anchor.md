---
category: Components
type: 数据展示
title: Anchor
subtitle: 锚点
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Anchor.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{import ("@zzjz/v-component/dist2/assets/q-anchor.js");})

</script>

# Anchor  回到顶部

返回页面顶部的操作按钮。

## 何时使用

当页面内容区域比较长时；
当用户需要频繁返回顶部查看相关内容时。

## 代码演示

### 基础用法

:::demo

```vue
<template>
  <div class="q-anchor" :affix="false" id="components-anchor-demo-basic" >
    <q-anchor :anchorData="anchorData" :get-container="'.VPContent'"></q-anchor>
  </div>
</template>
<script lang="ts" setup>
  const anchorData =  [
    {href: `components-anchor-demo-basic`, title: "锚点1",  target: ""},
    {href: `components-anchor-demo-static`, title: "锚点2",  target: ""},
  ]
const getContainer = () => document.getElementsByClassName('VPContent')[0]
</script>
<style>
.q-anchor {
  height: 150px;
  position: relative ;
}
</style>
```

:::

### 静态位置
:::demo

```vue

<script  lang="ts">
export default defineComponent({
  setup() {
    return {
      anchorData: [
        {href: `components-anchor-demo-basic`, title: "锚点1",  target: ""},
        {href: `components-anchor-demo-static`, title: "锚点2",  target: ""},
      ],
      getContainer: () => document.getElementsByClassName('VPContent')[0]
    };
  },
  mounted() {
    console.log("cctv", this)
  }
});
</script>
<template>
  <div class="q-anchor" id="components-anchor-demo-static" >
    <q-anchor :anchorData="anchorData" get-container=".VPContent"></q-anchor>
  </div>
</template>
<style>
.q-anchor {
  height: 150px;
}
</style>
```

:::

## Anchor 属性

| 属性               | 说明        | 类型       | 可选值                       | 默认值          |
|------------------|-----------|----------|---------------------------|--------------|
| title           | 显示标题 | string   | —                         | — |
| href      | 锚点ID      | string   | —                         | —            |
| target | 跳转地址  | string   | —                         | —            |
| getContainer      | 滚动容器      | Function | —               | —         |


## Anchor DOM事件

| 事件名      | 说明  | 参数                   |
|----------|-----|----------------------|
| click    | 单击  | (event: CustomEvent) |
| dblclick | 双击  | (event: CustomEvent) |

## Anchor 消息响应

| 事件名                 | 说明        | 参数                |
|---------------------|-----------|-------------------|
| click   | 点击事件 | (event: IMessage) |

## Anchor 生命周期

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |
---
title: Swiper 轮播图
lang: zh-CN
---
# Swiper 轮播图
图片轮播组件

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{
  import("@zzjz/v-component/dist2/assets/q-swiper.js");
})

</script>

## 基础用法

:::demo

```vue
<template>
  <div style="width: 500px;height: 500px">
    <q-swiper dot-position="right"></q-swiper>
  </div>
</template>
```

:::



## Swiper 属性

| 属性                | 说明     | 类型     | 可选值               | 默认值    |
|-------------------|--------|--------|-------------------|--------|
| imgArr           | 轮播图片数组 | array  | —                 | —      |
| timeInterval             | 切换时间间隔 | number | —                 | 2000   |
|  dotPosition        | 切换圆点位置 | string | center、left、right | center |


## Video 事件

| 事件名       | 说明      | 参数                            |
| ------------ |---------|-------------------------------|
| onSwiperChange      | 图片切换时回调 | (event: Event, index(当前图片索引)) |

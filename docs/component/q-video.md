---
title: Video 视频
lang: zh-CN
---
# Video 视频
视频组件

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{
  import ("@zzjz/v-component/dist2/assets/q-video.js");
}) 
</script>

## 基础用法

:::demo

```vue
<template>
  <q-video  src="https://blz-videos.nosdn.127.net/1/OverWatch/AnimatedShots/Overwatch_AnimatedShot_Bastion_TheLastBastion.mp4"></q-video>
</template>
<style>
.video {
	width: 100%;
}
</style>
```

:::

## 禁用鼠标事件

通过 `disabledPointerEvents` 属性指定是否禁用事件

:::demo

```vue
<template>
  <q-video  src="https://blz-videos.nosdn.127.net/1/OverWatch/AnimatedShots/Overwatch_AnimatedShot_Bastion_TheLastBastion.mp4"  disablePointerEvents></q-video>

</template>
<style>
.video {
  width: 100%;
}
</style>
```

:::



## Video 属性

| 属性                | 说明       | 类型     | 可选值          | 默认值   |
|-------------------|----------|--------| --------------- |-------|
| autoplay           | 是否自动播放   | boolean | —  | —     |
| controls             | 是否显示控制面板 | boolean | —               | false |
| height         | 视频高度     | string | —               | 100%  |
| width | 视频宽度     | string | —               | 100%     |
| src       | 视频地址     | string | —               | —     |
| loop        | 是否循环播放   | boolean | —               | false |
| muted         | 是否静音     | boolean | —               | false |
| pointerEvents         | 是否禁用鼠标事件 | boolean | —               | false |

## Video 事件

| 事件名       | 说明      | 参数                               |
| ------------ |---------|----------------------------------|
| played      | 视频播放时回调 | (event: Event) |
| paused       | 视频暂停时回调 | (event: Event)      |

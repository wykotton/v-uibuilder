---
title: Card 选项卡
lang: zh-CN
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{import ("@zzjz/v-component/dist2/assets/q-card.js");})

</script>


# Card 输入框

用于选项卡切换组件

## 基础用法

:::demo

```vue
<template>
   <q-card class="q-card"  
          height="400" >
        <div slot="header">UIB组件头部</div>
        <div>deepCharts</div>
        <div>UIB组件</div>
        <div>deepCharts</div>
      </q-card>
</template>
<style>
.q-card{
    width:100%;
}
</style>
```

:::

## 是否显示头部

通过 `headerShow` 属性指定是否显示头部 组件

:::demo

```vue
<template>
    <q-card 
    height="400" 
    class="q-card" 
    :headerShow="false"> 
            <div slot="header">UIB组件头部</div>
            <div>UIB组件头部</div>
        </q-card>
</template>
<style>
.q-card {
	width: 100%;
}
</style>
```

:::



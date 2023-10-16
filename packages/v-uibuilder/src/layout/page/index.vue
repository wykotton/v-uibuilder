<template>
  <RouterView :key="route.meta.keepAlive ? '' : route.fullPath">
    <template #default="{ Component }">
      <transition name="fade" mode="out-in" appear>
        <div>
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </div>
      </transition>
    </template>
  </RouterView>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
</script>

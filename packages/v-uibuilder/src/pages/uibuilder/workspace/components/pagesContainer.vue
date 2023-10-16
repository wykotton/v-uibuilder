<template>
  <div :class="{ 'page-container-wrap': true, expand: toggle }">
    <iframe ref="pageWindow" :class="{ pending: loading }" @load="handleLoadFinish" />
    <div v-if="loading" class="pending">
      <a-spin tip="加载中…"></a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  index: number;
  toggle: boolean; //true for expand; false for shrink
  single?: boolean;
}>();
const loading = ref<boolean>(true);
const handleLoadFinish = () => {
  if (pageWindow.value?.getAttribute("src") !== `about:blank`) {
    loading.value = false;
  }
};
const pageWindow = ref<HTMLIFrameElement>();
watch(
  () => props.index,
  () => {
    loading.value = true;
    pageWindow.value!.setAttribute("src", `about:blank`);
    setTimeout(() => {
      pageWindow.value!.setAttribute("src", `/#/uibuilder/publish/${props.index}?id=${props.index}`);
    }, 200);
  }
);
onMounted(() => {
  if (props.single) {
    setTimeout(() => {
      pageWindow.value!.setAttribute("src", `/#/uibuilder/publish/${props.index}?id=${props.index}`);
    }, 200);
  }
});
</script>

<style scoped lang="scss">
.page-container-wrap {
  position: absolute;
  width: calc(100% - 320px);
  height: calc(100% - 68px);
  top: 58px;
  left: 310px;
  transform-origin: 0 0;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.4);
  transition: all 200ms linear;
  &.expand {
    width: calc(100% - 20px);
    left: 10px;
  }
  iframe {
    width: 100%;
    height: 100%;
    &.loading {
      filter: blur(2px);
    }
  }
  .pending {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
    top: 0;
  }
  .page-edit {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
}
</style>

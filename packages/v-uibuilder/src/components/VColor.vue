<script setup>
import { Sketch, Twitter, Slider, Chrome } from "@ans1998/vue3-color";
import { ref, defineEmits } from "vue";
let colors = ref("");
let sketchBackColor = ref("#222");
let showSketch = ref(false);

const emit = defineEmits(["setShow"]);

const handlerClose = () => {
  showSketch.value = false;
  emit("setShow", {
    show: false,
    colors: colors,
  });
};

const handleClick = () => {
  emit("setShow", {
    show: true,
    colors: colors,
  });
};
</script>
<template>
  <div @click="handleClick">
    <Slider style="width: 210px" v-model="colors" :show="showSketch"></Slider>
    <div
      class="active-icon"
      @click="handlerClose"
      style="position: absolute; right: -16px; top: -6px; cursor: pointer; font-size: 16px"
    >
      <q-icon name="close"></q-icon>
    </div>
  </div>
</template>

<style scoped lang="scss">
.active-icon:hover {
  color: #73d8ff;
}
</style>

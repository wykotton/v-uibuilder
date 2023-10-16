<template>
  <div ref="pageContent" :class="{ 'floating-window': true, zIndexTop: moveFlags }" @mouseup.stop.prevent="moveEnd">
    <div
      class="popover-content__trigger floatBtn"
      ref="floatBtn"
      :style="{
        transition: !moveFlags ? 'all 300ms ease' : 'unset',
        transform: `translate3d(${transform.left}px,${transform.top}px,0)`,
        backgroundColor: website.theme === 'dark' ? '#001529' : '#fff',
        boxShadow:
          website.theme === 'dark'
            ? '0px 16px 34px 0px rgba(255, 255, 255, 0.3)'
            : '0px 16px 34px 0px rgba(0, 49, 128, 0.3)',
      }"
      @mousedown.stop.prevent="moveStart"
      @mouseenter.stop.prevent="showButton"
      @click.stop.prevent="toggleMenu"
    >
      <span
        @mouseleave.stop.prevent="hideButton"
        :style="{
          left: transform.left < 50 ? '-50px' : 0,
          width: moveFlags ? '50px' : '100px',
          borderRadius: '25px',
        }"
        class="hover-area"
      ></span>
      <svg
        class="icon"
        width="26px"
        height="26.00px"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        style="translate: -2px; pointer-events: none"
      >
        <path
          fill="#20A0FF"
          d="M906.000638 1023.99996a99.290887 99.290887 0 0 1-57.16748-18.052889L483.763632 746.186063l-55.161604 221.649355a40.11753 40.11753 0 0 1-39.114592 30.088147 40.11753 40.11753 0 0 1-39.114592-31.091086l-82.240937-352.031328a20.058765 20.058765 0 0 0-11.032321-14.041135L50.494306 504.477943l-5.014692-3.008815a100.293826 100.293826 0 0 1 18.052889-176.517133L886.944811 7.020568a100.293826 100.293826 0 0 1 136.399603 101.296764l-17.04995 821.406432v3.008815a99.290887 99.290887 0 0 1-58.170419 81.237998 100.293826 100.293826 0 0 1-42.123407 10.029383z m-11.03232-84.246814a20.058765 20.058765 0 0 0 31.091085-13.038197l17.049951-821.406432v-3.008815a20.058765 20.058765 0 0 0-27.079333-21.061703L92.617712 399.169426a20.058765 20.058765 0 0 0-6.017629 34.099901l203.596466 94.276196a99.290887 99.290887 0 0 1 55.161604 68.199801l45.132222 190.558269 29.085209-117.343776a40.11753 40.11753 0 0 1 62.182172-23.06758z"
        />
        <path
          fill="#20A0FF"
          d="M389.487436 997.923565a40.11753 40.11753 0 0 1-27.079333-69.202739l191.561207-176.517134a40.11753 40.11753 0 0 1 54.158666 59.173358L416.566769 986.891244a40.11753 40.11753 0 0 1-27.079333 11.032321zM462.701929 714.092039a40.11753 40.11753 0 0 1-31.091086-65.190987L917.032959 42.123407a40.11753 40.11753 0 1 1 62.182172 50.146913L493.793015 699.047965a40.11753 40.11753 0 0 1-31.091086 15.044074z"
        />
      </svg>
      <transition name="floating-popover-fade-in-out">
        <div
          ref="popoverContent"
          class="floating-popover"
          :style="{ ...menuPosition, backgroundColor: website.theme === 'dark' ? '#001529' : '#fff' }"
          v-if="popoverShow"
        >
          <div v-if="website.logo" class="mr-15px logo">
            <img :src="website.logo" class="w-full h-full" />
          </div>
          <div class="title">
            <div
              :class="{ 'main-title': true, 'omit-display': !website.fullDisplayTitle }"
              :style="{ color: website.theme === themeColorEnum.DARK ? '#fff' : '#000' }"
              :title="website.mainTitle"
            >
              {{ website.mainTitle }}
            </div>
            <div
              v-if="website.showSubheading && website.subheading"
              :class="{ 'sub-heading': true, 'omit-display': !website.fullDisplayTitle }"
              :style="{ color: website.theme === themeColorEnum.DARK ? '#b9b9b9' : '#3E4760' }"
              :title="website.subheading"
            >
              {{ website.subheading }}
            </div>
          </div>
          <a-menu
            v-model:selectedKeys="selectedKeys"
            mode="vertical"
            :theme="website.theme"
            :style="{ height: '100%', border: '0' }"
            @click="menuClick"
          >
            <template v-for="item in website.treeData" :key="item.key">
              <Submenu v-if="item.children.length" :treeData="item"></Submenu>
              <a-menu-item v-else :key="item.key">{{ item.title }}</a-menu-item>
            </template>
          </a-menu>
        </div>
      </transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import { websiteOptions } from "@/types/website";
import { themeColorEnum } from "@/enums/websiteEnum";
import { getTreeLevel } from "@/composition/index";
import { cloneDeep } from "lodash-es";
import { useRoute } from "vue-router";
import Submenu from "./submenu.vue";

// 路由对象
const route = useRoute();

const props = defineProps<{
  website: websiteOptions;
}>();
const emit = defineEmits(["click", "move"]);
defineExpose(["initHomePage"]);
const pageContent = ref();

/**
 * 菜单项点击
 */
const selectedKeys = ref<string[]>([]);
function menuClick(e: any) {
  // e?.domEvent.stopPropagation();
  // e?.domEvent.preventDefault();
  emit("click", e);
}

/**
 * 初始化主页和菜单
 */
function initHomePage() {
  const { nav = "" } = route.query;
  let homePage = "";
  if (nav) {
    // 有query导航加载url导航地址
    homePage = String(nav);
  } else {
    // 没有query导航就加载配置的站点主页
    homePage = props?.website?.homePage;
  }
  const treeData = props?.website?.treeData;
  if (!homePage || !treeData?.length || selectedKeys.value.length) return;
  const result = getTreeLevel(cloneDeep(treeData), homePage);
  const { path } = result;
  if (path.length) {
    selectedKeys.value = [cloneDeep(homePage)];
    menuClick({ key: homePage });
  }
}

// 移动状态
const moveFlags = ref(false);
// hover状态
const hoverFlag = ref(false);
// 初始的位置记录
const movePosition = reactive({ x: 0, y: 0 });
const nx = ref(0);
const ny = ref(0);
const dx = ref(0);
const dy = ref(0);
const xPum = ref(0);
const yPum = ref(0);
const popoverShow = ref(false);
//浮窗的位置
const transform = reactive({
  top: 300,
  left: -25,
});
// 菜单位置
const menuPosition = reactive({
  top: "0",
  left: "0",
});
// 拖拽按钮实例
const floatBtn = ref();

/**
 * 监听移动状态
 * 抛出状态用于添加拖拽遮罩层，防止iframe鼠标丢失
 */
watch(moveFlags, (newValue) => {
  emit("move", newValue);
});

onMounted(() => {
  document.addEventListener("click", (event) => {
    if (!floatBtn.value) return;
    var tDom = event.target;
    if (floatBtn.value !== tDom && !floatBtn.value?.contains(tDom)) {
      closeMenuAndFloating();
    }
  });
  initHomePage();
});

/**
 * 关闭菜单,收起悬浮球
 */
function closeMenuAndFloating() {
  popoverShow.value = false;
  hoverFlag.value = false;
  moveFlags.value = false;
  // 移除鼠标移动监听
  document.removeEventListener("mousemove", mousemoveEvent);
  resetFloatBtnLocation();
}

/**
 * 点击悬浮球
 */
const popoverContent = ref();
async function toggleMenu() {
  //  如果上一次down事件到下一次click事件中 相同即为点击事件
  if (!hoverFlag.value) return;
  popoverShow.value = !popoverShow.value;
  await nextTick();
  if (popoverShow.value) {
    // 移除鼠标移动监听
    document.removeEventListener("mousemove", mousemoveEvent);
    const { top, left } = transform;
    if (top >= 60) {
      menuPosition.top = `-${popoverContent.value?.offsetHeight + 10}px`;
    } else {
      menuPosition.top = "60px";
    }
    if (left > 200) {
      menuPosition.left = "-132px";
    } else {
      menuPosition.left = "0";
    }
  } else {
    hideButton();
  }
}

/**
 * 收起悬浮球
 */
function hideButton() {
  if (popoverShow.value) return;
  hoverFlag.value = false;
  //移动过程中不复位 按钮；
  if (moveFlags.value) return;
  resetFloatBtnLocation();
}

/**
 * 弹出悬浮球
 */
function showButton() {
  if (moveFlags.value) {
    hoverFlag.value = false;
    return;
  }
  hoverFlag.value = true;
  const { left, top } = transform;
  if (left > 0 && left < -25) return;
  let bodyWidth = pageContent.value.clientWidth;
  if (left < bodyWidth / 2) {
    generateTransform({ top: top, left: 20 });
  } else {
    generateTransform({ top: top, left: bodyWidth - 70 });
  }
}

/**
 * 鼠标移动监听
 * @param e
 */
async function mousemoveEvent(e: any) {
  e.preventDefault();
  e.stopPropagation();
  // 关闭hover状态
  hoverFlag.value = false;
  // 开启拖拽状态
  moveFlags.value = true;
  let bodyWidth = pageContent.value.clientWidth;
  let bodyHeight = pageContent.value.clientHeight;
  let moveMaxHeight = bodyHeight - 30;
  let moveMaxWidth = bodyWidth - floatBtn.value.offsetWidth / 2 + dx.value;
  nx.value = e.clientX;
  ny.value = e.clientY;
  xPum.value = (nx.value > moveMaxWidth ? moveMaxWidth : nx.value) - dx.value;
  yPum.value = (ny.value > moveMaxHeight ? moveMaxHeight : ny.value) - dy.value;
  await nextTick();
  generateTransform({
    left: xPum.value > -25 ? xPum.value : -25,
    top: yPum.value > 0 ? yPum.value : 0,
  });
}

// 鼠标抬起监听
function mouseupEvent(e: any) {
  e.preventDefault();
  e.stopPropagation();
  // 移除鼠标抬起监听
  floatBtn.value.removeEventListener("mouseup", mouseupEvent);
  document.removeEventListener("mouseup", mouseupEvent);
  moveEnd();
}

/**
 * 拖拽悬浮球
 * @param e
 */
function moveStart(e: any) {
  if (e?.button == 2) return;
  if (popoverShow.value) {
    moveFlags.value = false;
    return;
  }
  movePosition.x = e.clientX;
  movePosition.y = e.clientY;
  //计算鼠标相对元素的位置
  const { left, top } = transform;
  dx.value = e.clientX - left;
  dy.value = e.clientY - top;
  floatBtn.value.addEventListener("mouseup", mouseupEvent);
  document.addEventListener("mouseup", mouseupEvent);
  document.addEventListener("mousemove", mousemoveEvent);
}

/**
 * 设置悬浮球位置
 * @param param0
 */
function generateTransform({ top, left }: { left: number; top: number }) {
  if (!floatBtn.value) return;
  transform.left = Number(left);
  transform.top = Number(top);
}

/**
 * 重置悬浮球位置
 */
function resetFloatBtnLocation() {
  if (!floatBtn.value) return;
  let bodyWidth = pageContent.value.clientWidth;
  const { left, top } = transform;
  if (left < bodyWidth / 2) {
    generateTransform({ top, left: -25 });
  } else {
    generateTransform({ top, left: bodyWidth - 25 });
  }
}

/**
 * 移动结束
 */
function moveEnd() {
  moveFlags.value = false;
  if (hoverFlag.value) return;
  // 移除鼠标移动监听
  document.removeEventListener("mousemove", mousemoveEvent);
  resetFloatBtnLocation();
}
</script>
<style lang="scss" scoped>
.zIndexTop {
  z-index: 1000;
}
.floating-window {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  .floatBtn {
    position: absolute;
    z-index: 1000;
    cursor: pointer;
    .icon {
      color: var(--themeColor);
      font-size: 24px;
      -webkit-user-drag: none;
    }
    ::v-deep(.hover-area) {
      position: absolute;
      width: 100px;
      height: 100%;
    }
    span:last-child {
      z-index: 2;
    }
  }
  .popover-content {
    width: 100% !important;
    &__trigger {
      width: 50px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 40px;
      pointer-events: auto;
    }
  }
}

.floating-popover-fade-in-out {
  &-enter-active,
  &-leave-active {
    transition-timing-function: ease;
    transition-duration: 300ms;
    transition-property: opacity, transform;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
    transform: translate3d(0, -10px, 0);
  }
}
.floating-popover {
  position: absolute;
  padding: 0 !important;
  border: 0 !important;
  width: 182px;
  min-width: 182px;
  max-width: 182px;
  .logo {
    width: 150px;
    height: 30px;
    margin: 6px auto;
  }
  .title {
    padding: 10px;
    color: #fff;
    word-break: break-all;
    .sub-heading {
      font-size: 12px;
      color: #b9b9b9;
    }
    .omit-display {
      max-width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>

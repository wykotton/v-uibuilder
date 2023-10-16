<template>
  <teleport :to="to" :disabled="disabled">
    <div
      v-if="!disabled"
      ref="moveTeleportRef"
      class="fixed z-9999 title-shadow move-teleport bg-white overflow-hidden"
      :data-x="`${oldMoveInfo.dataX}`"
      :data-y="`${oldMoveInfo.dataY}`"
    >
      <div
        class="h-45px bg-light-800 cursor-move move-teleport-handle font-bold leading-48px pl-14px flex justify-between"
      >
        {{ title }}
        <div class="mr-10px flex items-center w-44px justify-between cursor-default">
          <MinusOutlined class="hover:bg-white" @click="minEvent" />
          <CloseOutlined class="hover:bg-white" @click="closeEvent" />
        </div>
      </div>
      <span class="tree-content">
        <slot></slot>
      </span>
    </div>
    <slot v-else></slot>
  </teleport>
</template>
<script lang="ts" setup>
import interact from "interactjs";
import { MinusOutlined, CloseOutlined } from "@ant-design/icons-vue";

const props = defineProps({
  disabled: {
    type: Boolean,
  },
  to: {
    type: String,
    default: "body",
  },
  title: {
    type: String,
  },
});

const emit = defineEmits(["close"]);
const minVisible = ref(true);
const moveTeleportRef = ref<HTMLElement>();
const oldMoveInfo = ref<{ [key: string]: number | string }>({});

watch([moveTeleportRef, () => props.disabled], () => {
  if (moveTeleportRef.value) {
    const x = window.innerWidth - ((oldMoveInfo.value.width as number) || moveTeleportRef.value.offsetWidth) - 80;
    const y = 234;

    Object.assign(oldMoveInfo.value, {
      translate: `(${x}px, ${y}px)`,
      dataX: x,
      dataY: y,
    });
    Object.assign(moveTeleportRef.value.style, {
      width: `${oldMoveInfo.value.width}px`,
      height: `${Math.min(Number(oldMoveInfo.value.height), window.innerHeight)}px`,
      transform: `translate${oldMoveInfo.value.translate}`,
      top: 0,
      left: 0,
    });
  }
});

watchEffect(() => {
  if (!props.disabled) {
    teleportMove();
  }
});

/**
 * 移动内容
 */
function teleportMove() {
  if (!moveTeleportRef.value) return;
  interact(moveTeleportRef.value)
    .draggable({
      allowFrom: ".move-teleport-handle",
      ignoreFrom: ".cursor-default",
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "parent",
          endOnly: true,
        }),
      ],
      autoScroll: true,
      listeners: {
        move: dragMoveListener,
      },
    })
    .resizable({
      ignoreFrom: ".cursor-default .tree-content",
      edges: { left: false, right: true, bottom: true, top: false },
      listeners: {
        move(event) {
          if (!minVisible.value) return;
          const target = event.target;
          let x = parseFloat(target.getAttribute("data-x")) || 0;
          let y = parseFloat(target.getAttribute("data-y")) || 0;

          // update the element's style
          target.style.width = event.rect.width + "px";
          target.style.height = event.rect.height + "px";

          x += event.deltaRect.left;
          y += event.deltaRect.top;

          target.style.transform = "translate(" + x + "px," + y + "px)";

          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
        },
      },
      modifiers: [
        interact.modifiers.restrictEdges({
          outer: "parent",
        }),
        interact.modifiers.restrictSize({
          min: { width: 100, height: 50 },
        }),
      ],
      inertia: true,
    });

  function dragMoveListener(event: any) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    // update the element's style
    const styleObj = {
      width: event.rect.width + "px",
      height: event.rect.height + "px",
      transform: "translate(" + x + "px, " + y + "px)",
    };
    Object.assign(target.style, styleObj);
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
  }
}

function closeEvent(e: PointerEvent) {
  e.stopPropagation();
  e.preventDefault();

  emit("close", true);
}

function useGetMinHeight() {
  let height = 0;
  let width = 0;
  function minEvent(e: PointerEvent) {
    e.stopPropagation();
    e.preventDefault();

    if (!moveTeleportRef.value) return;
    if (minVisible.value) {
      ({ height, width } = moveTeleportRef.value.getBoundingClientRect());
    }
    Object.assign(oldMoveInfo.value, { height: minVisible.value ? 45 : height, width });
    minVisible.value = !minVisible.value;
    Object.assign(moveTeleportRef.value.style, {
      height: `${oldMoveInfo.value.height}px`,
      width: `${width}px`,
    });
  }
  return { minEvent };
}
const { minEvent } = useGetMinHeight();
</script>
<style lang="scss">
.title-shadow {
  box-shadow: 0 0 0 1px rgb(0 0 0 / 5%), 0 4px 10px rgb(0 0 0 / 10%);
  height: 80vh;
}
.ant-select-dropdown .ant-dropdown {
  z-index: 10000;
}
.tree-content {
  max-height: calc(100% - 45px);
  overflow: auto;
  display: block;
  padding: 16px;
}
</style>

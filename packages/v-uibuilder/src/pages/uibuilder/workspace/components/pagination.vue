<template>
  <div class="pagination-wrap">
    <a-pagination
      :current="currentPage"
      :total="pageTotal"
      show-less-items
      show-quick-jumper
      :page-size="pageSize"
      :show-total="(total: number) => `共${total}项`"
      :page-size-options="['9', '19', '29', '39', '49']"
      @change="paginationChange"
    ></a-pagination>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentPage: number;
  pageTotal: number;
  pageSize: number;
}>();

const emit = defineEmits(["change"]);
function paginationChange(index: number, size: number) {
  emit("change", { index, size });
}
</script>

<style lang="scss" scoped>
.pagination-wrap {
  height: 50px;
  width: fit-content;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  :host-context(q-pagination.pagination) {
    background-color: #0d1014;
    .q-pagination {
      background-color: #0d1014;
      justify-content: center;
    }
  }
}
</style>

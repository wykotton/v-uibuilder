<template>
  <div class="website-construction">
    <Website :website="website"></Website>
  </div>
</template>
<script setup lang="ts">
import { message } from "ant-design-vue";
import { previewWebsiteApi } from "@/api/uibuilder/management";
import Website from "./components/website.vue";

// 路由对象
const route = useRoute();
const router = useRouter();

const website: any = ref({});

/**
 * 获取website数据
 */
function getWebsite(id: number) {
  if (!id) return;
  const results = previewWebsiteApi({ websiteId: id });
  results
    .then((res) => {
      const { code, results } = res.data;
      switch (code) {
        case 404:
          message.error("站点实例不存在!");
          return;
        case 500:
          message.error("获取站点实例失败!");
          return;
      }
      website.value = JSON.parse(results[0].config);
      if (results[0].website_name !== website.value.mainTitle) {
        website.value.mainTitle = results[0].website_name;
      }
    })
    .catch((err) => {
      console.log(err);
      message.error("站点信息获取失败!");
    });
}
onMounted(() => {
  getWebsite(Number(route.query.id));
});

/**
 * 监听路由变更，处理页面更新
 */
router.afterEach((to, from) => {
  if (!to.query.id) return;
  if (to.query.id !== from.query.id) {
    website.value = {};
    getWebsite(Number(to.query.id));
  }
});
</script>
<style scoped lang="scss">
.website-construction {
  width: 100vw;
  height: 100vh;
}
</style>

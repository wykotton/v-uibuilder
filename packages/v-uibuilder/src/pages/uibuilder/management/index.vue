<template>
  <div class="management-wrapper">
    <div class="headers">
      <q-page-header class="h-48px">
        <div class="font-微软雅黑 font-bold text-24px leading-48px text-white text-center w-full h-full">
          {{ useAppStore.websiteName || useAppStore.defaultWebsiteName }}
        </div>
        <div slot="btn"><UserDropdown></UserDropdown></div>
      </q-page-header>
    </div>
    <div class="table-wrapper">
      <div style="padding: 10px">
        <q-table
          class="q-table"
          style="height: 100%"
          editable
          toolbar-style="justify-content: space-between;align-items: center;"
          toolbar-html='<q-button type="primary" @click="test">新增</q-button> <q-input style="width: 280px;" placeholder="请输入" type="input" value=""></q-input>'
          editable-data="{}"
          table-pagination='{"current":1,"pageSize":10,"total":20,"numDisplay":5,"numEdge":3,"ellipseText":"...","style": "text-align: center;"}'
          table-columns='[
            {"title":"id","dataIndex":"id","key":"id"},
            {"title":"预览","dataIndex":"pic","key":"pic","customRender":"({column}) => `<img width=\"30px\" height=\"30px\"/>`"},
            {"title":"远程元件","dataIndex":"custom_result_componet","key":"custom_result_componet","maxWidth": "200px","width": "300px"},
            {"title":"本地元件","dataIndex":"custom_componet","key":"custom_componet","maxWidth": "200px"},
            {"title":"元件","dataIndex":"custom_model","key":"custom_model","maxWidth": "200px"},
            {"title":"创建时间","dataIndex":"create_time","key":"create_time"},
            {"title":"更新时间","dataIndex":"update_time","key":"update_time"},
            {"customRender":"() => `<q-button type=\"text\"><svg viewBox=\"64 64 896 896\" data-icon=\"upload\" width=\"1em\" height=\"1em\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\" class=\"\"><path d=\"M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 0 0-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z\"></path></svg>打开App</q-button><q-button style=\"margin-left: 5px;\" type=\"text\"><svg viewBox=\"64 64 896 896\" data-icon=\"edit\" width=\"1em\" height=\"1em\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\" class=\"\"><path d=\"M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z\"></path></svg>编辑</q-button> <q-popover class=\"table-popover\"  trigger=\"click\"><q-button style=\"margin-left: 5px\" type=\"text\"><svg viewBox=\"64 64 896 896\" data-icon=\"delete\" width=\"1em\" height=\"1em\" fill=\"currentColor\" aria-hidden=\"true\" focusable=\"false\" class=\"\"><path d=\"M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z\"></path></svg>删除</q-button><div style=\"width: 120px;padding: 10px;text-align: unset;\" slot=\"popover\" tip=\"popover\">真的要删除吗？<q-button type=\"info\" class=\"popoverCancel\">取消</q-button><q-button class=\"popoverConfirm\" style=\"margin-left: 5px\" type=\"primary\">确定</q-button></div></q-popover>`","title":"操作","dataIndex":"operate","key":"operate","width":"200px"}]'
          data-source=""
          :loading="loading"
        ></q-table>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { managementInfoApi, managementDeleteApi } from "@/api/uibuilder/management";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { initThemeConfig } from "@/composition/index";
import { useAppStoreWithOut } from "@/store/modules/app";
import UserDropdown from "@/components/user-dropdown/index.vue";

// pinia
const useAppStore = useAppStoreWithOut();

// 路由对象
const router = useRouter();

let tableNode: HTMLElement | null;
let loading = ref<boolean>(false);

/**
 * 获取数据
 * @param params 接口参数
 * @param isFirst 是否第一次加载
 */
async function getManagementInfo(params: { page: number; limit: number; id?: number }, isFirst?: boolean) {
  loading.value = true;
  try {
    const { data } = await managementInfoApi(params);
    if (data.info.msg === "success") {
      if (!tableNode) return;
      tableNode.setAttribute("data-source", JSON.stringify(data.data));
      if (isFirst)
        tableNode.setAttribute(
          "table-pagination",
          JSON.stringify({
            current: 1,
            pageSize: 10,
            total: data.count,
            numDisplay: 5,
            numEdge: 3,
            ellipseText: "...",
            style: "text-align: center;",
          })
        );
      loading.value = false;
    }
  } catch (e) {
    loading.value = false;
    console.log(e);
  }
}

/**
 * 分页器切换
 * @param e
 */
function onPageChange(e: any) {
  const { current, pageSize } = e.detail;
  getManagementInfo({ page: current, limit: pageSize });
}

/**
 * 删除数据
 * @param params
 */
async function deleteManagementInfo(params: { id: number }) {
  loading.value = true;
  try {
    const { data } = await managementDeleteApi(params);
    if (data.info.msg === "success") {
      if (!tableNode) return;
      await getManagementInfo({ page: 1, limit: 10 });
      loading.value = false;
    }
  } catch (e) {
    loading.value = false;
    console.log(e);
  }
}

/**
 * 操作区点击事件
 * @param e
 */
function onBtnClick(e: any) {
  const {
    row: { id },
    type,
  } = e.detail;
  let tempType = "";
  const typeArr = ["打开App", "编辑", "删除", "确定", "取消"];
  typeArr.forEach((item) => {
    if (type.indexOf(item) !== -1) tempType = item;
  });
  switch (tempType) {
    case "打开App":
      const routerUrl = router.resolve({
        path: `/uibuilder/publish/${id}`,
        query: { id },
      });
      window.open(routerUrl.href);
      break;
    case "编辑":
      jumpEditRouter("/uibuilder/edit", { id });
      break;
    case "确定":
      // 删除数据
      deleteManagementInfo({ id });
      break;
  }
}

/**
 * 路由跳转
 * @param url 路由地址
 * @param params 传递参数
 */
function jumpEditRouter(url: string, params?: any) {
  console.log("go-", url);
  //query传参
  router.replace({
    path: url,
    query: params,
  });
}

/**
 * 搜索
 * @param id
 */
function search(id?: number) {
  let params = { page: 1, limit: 10 } as { page: number; limit: number; id?: number };
  if (id) params = { ...params, id };
  getManagementInfo(params);
}

/**
 * toolbar 按钮点击事件
 * @param evn
 */
async function onToolbarClick(evn: any) {
  const { e } = evn.detail;
  if (e.target.localName !== "q-button" && e.target.innerHTML !== "新增") {
    return;
  }
  // const userInfo = useUserStore.getUserInfo;
  // if (!userInfo?.userId) {
  //   notification.destroy();
  //   notification.warning({
  //     message: "用户id不存在!",
  //   });
  //   return;
  // }
  // const results = createPage("save", "", true);
  // results.then((data: any) => {
  //   const { id = "" } = data;
  //   if (!id) {
  //     message.error(`创建实例失败，请稍后重试!`);
  //     return;
  //   }
  //   jumpEditRouter("/uibuilder/edit", { id });
  // });
}

/**
 * toolbar 输入框数据
 * @param evn
 */
function onToolbarInput(evn: any) {
  const { value } = evn.detail;
  parseInt(value) ? search(parseInt(value)) : search();
}

nextTick(() => {
  // page切换事件
  tableNode = document.querySelector(".q-table");
  if (tableNode) {
    tableNode.addEventListener("onPageChange", onPageChange);
    tableNode.addEventListener("onBtnClicked", onBtnClick);
    tableNode.addEventListener("onToolbarClick", onToolbarClick);
    tableNode.addEventListener("onToolbarInput", onToolbarInput);
    getManagementInfo({ page: 1, limit: 10 }, true);
  }
});

/**
 * 事件注销
 */
onMounted(() => {
  tableNode = document.querySelector(".q-table");
  if (tableNode) {
    tableNode.removeEventListener("onPageChange", onPageChange);
    tableNode.removeEventListener("onBtnClicked", onBtnClick);
    tableNode.removeEventListener("onToolbarClick", onToolbarClick);
    tableNode.removeEventListener("onToolbarInput", onToolbarInput);
  }
  // 加载用户主题
  initThemeConfig();
});
</script>
<style lang="scss">
.management-wrapper {
  width: 100vw;
  height: 100vh;

  .headers {
    height: var(--header-height);
    background-color: var(--theme-color);
  }

  .table-wrapper {
    height: calc(100vh - 48px - 40px);
    box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    margin: 20px;
    overflow: auto;
  }
}
</style>

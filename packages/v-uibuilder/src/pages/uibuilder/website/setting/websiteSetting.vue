<template>
  <div class="container">
    <a-collapse v-model:activeKey="activeKey">
      <a-collapse-panel key="basics" header="基础配置" class="p-0 !border-b-transparent bg-blue-33">
        <div class="w-full title">
          <div>
            <div class="flex items-center">
              <span>标题设置</span>
              <a-input
                v-model:value="website.mainTitle"
                show-count
                :maxlength="30"
                class="title-input"
                type="text"
                placeholder="标题名称"
              />
            </div>
          </div>
          <div class="mt-20px flex items-center">
            <div>导航模式</div>
            <div class="flex cursor-pointer">
              <span class="ml-20px flex flex-col items-center" @click="setNavigation(navigationEnum.DUAL)">
                <div
                  class="w-50px h-40px flex"
                  :style="{ outline: website.navigation === navigationEnum.DUAL ? '1px solid #b2b2b2 !important' : '' }"
                >
                  <img
                    class="w-40px h-30px ml-5px mt-5px"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAAwBAMAAAC1TKpoAAAAFVBMVEUsSVgsSVk0kXg+7Z4sSVkwcWo5xI03FU12AAAAAnRSTlNXw4EElaEAAABCSURBVDjLYxBxIQQYGIaoGtdQ3ACmxtkYJzAaymrc0nCCpIGIC6h7UlyUMIAqmr9G1YyqGVVDohpoWRcy3MpwQmoAysZh3otqn+oAAAAASUVORK5CYII="
                    alt=""
                  />
                </div>
                <div class="mt-10px">双导航布局</div>
              </span>
              <span class="ml-10px flex flex-col items-center" @click="setNavigation(navigationEnum.LEFT)">
                <div
                  class="w-50px h-40px flex"
                  :style="{ outline: website.navigation === navigationEnum.LEFT ? '1px solid #b2b2b2 !important' : '' }"
                >
                  <img
                    class="w-40px h-30px ml-5px mt-5px"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAAwBAMAAAC1TKpoAAAAG1BMVEUsSVksSVg+7Z4sSVk0kXgtV14wb2k4toczjHaGoU+qAAAAAnRSTlPDV2NLjeIAAAA/SURBVDjLY2A2JgQEGIaoGtPUsFAgSjYOxQQwNUZKYFBs3OKCDtxG1YyqGVUzqmYoqDENBRd2wfjKuuFYzgMA0A106OCR+joAAAAASUVORK5CYII="
                    alt=""
                  />
                </div>
                <div class="mt-10px">左侧导航布局</div>
              </span>
              <span class="ml-10px flex flex-col items-center" @click="setNavigation(navigationEnum.TOP)">
                <div
                  class="w-50px h-40px flex"
                  :style="{ outline: website.navigation === navigationEnum.TOP ? '1px solid #b2b2b2 !important' : '' }"
                >
                  <img
                    class="w-40px h-30px ml-5px mt-5px"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAAwBAMAAAC1TKpoAAAAFVBMVEUsSVksSVgsSVk0kXg+7Z4uXmI5vopJiCenAAAAAnRSTlPDV2NLjeIAAABBSURBVDjLY2BSIgQEGIaoGtVQ3ACmRsUFJ3AeymrU0nCC5IGIC2VjnMB0VM2omlE1lKlRVVUNCgrFTgzlMpyQGgBbAyZB8RSe1QAAAABJRU5ErkJggg=="
                    alt=""
                  />
                </div>
                <div class="mt-10px">顶部导航布局</div>
              </span>
              <span class="ml-10px flex flex-col items-center" @click="setNavigation(navigationEnum.FLOAT)">
                <div
                  class="w-50px h-40px flex"
                  :style="{
                    outline: website.navigation === navigationEnum.FLOAT ? '1px solid #b2b2b2 !important' : '',
                  }"
                >
                  <img
                    class="w-40px h-30px ml-5px mt-5px"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAAwCAYAAABHYrdbAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE7mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuZWRhMmIzZiwgMjAyMS8xMS8xNC0xMjozMDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjEgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0xMS0wMlQxMTo1NDozMiswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMTEtMDJUMTE6NTg6MDIrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMTEtMDJUMTE6NTg6MDIrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjdhNDAzMWEwLWViNzAtOTQ0MC1iOWMwLTM1ZjM2OTY2N2ExNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3YTQwMzFhMC1lYjcwLTk0NDAtYjljMC0zNWYzNjk2NjdhMTQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3YTQwMzFhMC1lYjcwLTk0NDAtYjljMC0zNWYzNjk2NjdhMTQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjdhNDAzMWEwLWViNzAtOTQ0MC1iOWMwLTM1ZjM2OTY2N2ExNCIgc3RFdnQ6d2hlbj0iMjAyMi0xMS0wMlQxMTo1NDozMiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIzLjEgKFdpbmRvd3MpIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhCxKJ0AAAF4SURBVGiB7drBSgJBHMfx3zoKtupFiGBBu0uP0APUG9Sbdu/YXbyqIJSwHpRtyZ3dLhUGP7dG1nWK3+fozuHPl1lnEIOr2/tHANeQD8Vd49Qj+EhRCEUhFIVQFKJZ9rB9c1nXHLVLH6Z7n2mnEIpClL4++wRhE2bYg4lCNPptAEAep7CLBHa2RpFklQ5ZN+cojfM2WqM+zKD77XMTdWCiDuzFGbbjGPkyrWzIujm9PkHYpEF2mUEXrVEfQXjQJvSCUxQz7JUG+Vo36MIMewcPdWpuUaLwKGt94xTl80u16rW+0ZFMOEXJ49+fKC5rfeMUxS6So6z1jVuU2Rp2vvl53XwDO1sfPNSpOUUpkgzbcVwaxs432I7jP32rdb5h5csUb08vMM+vuubvKpIM2WSFbLKqeh4v6EgmFIVQFEJRCEUhFIVQFEJRCEUhFIVQFEJRCEUhFIVQFEJRCEUhFIVQFEJRiNIfrsv+F/afaacQikIoCqEohKIQ77s2YmcHw1MxAAAAAElFTkSuQmCC"
                    alt=""
                  />
                </div>
                <div class="mt-10px">悬浮导航布局</div>
              </span>
            </div>
          </div>
          <div class="mt-20px flex items-center">
            <div>主题设置</div>
            <div class="flex cursor-pointer">
              <span class="ml-26px flex flex-col items-center" @click="setTheme(themeColorEnum.DARK)">
                <div
                  class="w-48px h-32px flex"
                  :style="{ outline: website.theme === themeColorEnum.DARK ? '1px solid #b2b2b2 !important' : '' }"
                >
                  <div class="w-12px h-12px ml-18px mt-10px bg-[#48526F]"></div>
                </div>
                <div class="mt-10px">深色</div>
              </span>
              <span class="ml-26px flex flex-col items-center" @click="setTheme(themeColorEnum.LIGHT)">
                <div
                  class="w-48px h-32px flex"
                  :style="{ outline: website.theme === themeColorEnum.LIGHT ? '1px solid #b2b2b2 !important' : '' }"
                >
                  <div class="w-12px h-12px ml-18px mt-10px bg-[#F0F2F5]"></div>
                </div>
                <div class="mt-10px">浅色</div>
              </span>
            </div>
          </div>
          <div class="mt-15px">
            <div class="flex items-center">
              <span>LOGO</span>
              <a-textarea v-model:value="website.logo" class="logo-input" placeholder="base64或图片URL" :rows="2" />
            </div>
          </div>
        </div>
      </a-collapse-panel>
      <a-collapse-panel key="senior" header="高级配置" class="p-0 !border-b-transparent bg-blue-33">
        <div class="w-full title">
          <div class="flex items-center">
            <a-checkbox v-model:checked="website.showSubheading" />
            <div class="ml-10px">显示副标题</div>
          </div>
          <div class="mt-4px flex items-center">
            <a-input
              v-model:value="website.subheading"
              :disabled="!website.showSubheading"
              show-count
              :maxlength="50"
              class="subheading-input"
              type="text"
              placeholder="副标题名称"
            />
          </div>
          <div class="mt-10px flex items-center">
            <a-checkbox v-model:checked="website.showFooter" />
            <div class="ml-10px">显示页脚</div>
          </div>
          <div class="mt-4px flex items-center">
            <a-input
              v-model:value="website.footerText"
              :disabled="!website.showFooter"
              class="subheading-input"
              type="text"
              placeholder="页脚内容"
            />
          </div>
          <div class="mt-10px flex items-center">
            <a-checkbox v-model:checked="website.menuCache" />
            <div class="ml-10px">菜单缓存</div>
            <a-tooltip placement="top">
              <template #title>
                <span>打开过的菜单将不会重新加载</span>
              </template>
              <QuestionCircleOutlined :style="{ fontSize: '12px', marginLeft: '6px' }"></QuestionCircleOutlined>
            </a-tooltip>
          </div>
          <div class="mt-10px flex items-center">
            <a-checkbox v-model:checked="website.fullDisplayTitle" />
            <div class="ml-10px">完整展示站点标题</div>
            <a-tooltip placement="top">
              <template #title>
                <span>双导航/顶部导航情况下，当标题过长时，默认展示完整</span>
              </template>
              <QuestionCircleOutlined :style="{ fontSize: '12px', marginLeft: '6px' }"></QuestionCircleOutlined>
            </a-tooltip>
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script setup lang="ts">
import { QuestionCircleOutlined } from "@ant-design/icons-vue";
import { navigationEnum, themeColorEnum } from "@/enums/websiteEnum";
import { websiteOptions } from "@/types/website";

const props = defineProps<{
  website: websiteOptions;
}>();
watch(
  () => props.website,
  (newValue) => {
    console.log(newValue);
  }
);

const activeKey = ref(["basics", "senior"]);

/**
 * 设置导航模式
 * @param type
 */
function setNavigation(type: navigationEnum) {
  props.website.navigation = type;
}

/**
 * 设置主题
 */
function setTheme(type: themeColorEnum) {
  props.website.theme = type;
}
</script>
<style scoped lang="scss">
.container {
  padding: 4px;
  ::v-deep(.ant-collapse) {
    background-color: #3e4760;
    border: 0;
    color: #fff;
  }
  ::v-deep(.ant-collapse-header) {
    padding: 10px !important;
    color: #fff !important;
    font-size: 12px !important;
  }
  ::v-deep(.ant-collapse-content) {
    background-color: #3e4760;
    border-color: #2b3551;
  }
}
.title {
  background-color: #2b3551;
  color: hsla(0, 0%, 100%, 0.7);
  font-size: 12px !important;
  padding: 24px 12px;

  ::v-deep(.title-input),
  ::v-deep(.subheading-input) {
    color: #fff;
    margin: 0;
    height: 28px;
    padding: 0 8px;
    font-size: 12px;
    line-height: 28px;
    background-color: #2b3551;
    border: 1px solid hsla(0, 0%, 100%, 0.1);
    input {
      background-color: inherit;
      color: inherit;
    }
    .ant-input-suffix {
      .ant-input-show-count-suffix {
        color: #1890ff;
      }
    }
  }

  ::v-deep(.title-input) {
    width: 310px;
    margin-left: 20px;
  }

  ::v-deep(.subheading-input) {
    width: 354px;
    margin-left: 24px;
  }

  ::v-deep(.logo-input) {
    width: 326px;
    color: #fff;
    margin: 0;
    margin-left: 20px;
    padding: 0 8px;
    background-color: #2b3551;
    border: 1px solid hsla(0, 0%, 100%, 0.1);
  }
}
</style>

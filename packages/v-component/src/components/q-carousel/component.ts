import { createApp, defineComponent, /* onMounted, ref, */ toRefs, reactive } from "vue";
import {
  Carousel,
  message,
  ConfigProvider
} from "ant-design-vue";
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { enumFilter } from "../../util/dict";
import { onSendMessage } from "../../util/utils";
export const createVueComponent = (root: any) => {
  const component = defineComponent({
    template: `
      <a-config-provider :locale="zhCN">
        <div class="q-carousel-wrap">
          <a-carousel ref="qCarouselRef" :class="enumFilter('carouselImageSize', imageSize)+'-size'" :class="{'carousel-image': dots.image}" :dots-class="dots.image ? 'slick-dots slick-thumb': ''" :arrows="arrows" :autoplay="autoplay" :after-change="afterChange" :before-change="beforeChange" :dot-position="enumFilter('placement', dotPosition)" :effect="enumFilter('carouselEffect', effect)" :easing="easing" :dots="dots.enable">
          <template #customPaging="props" v-if="dots.image">
            <a>
              <img :src="imglist[props.i].url" />
            </a>
          </template>
          <template #prevArrow>
            <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
              <left-outlined />
            </div>
          </template>
          <template #nextArrow>
            <div class="custom-slick-arrow" style="right: 10px">
              <right-outlined />
            </div>
          </template>  
          <div v-for="(item, index) in imglist" :key="index">
              <img :src="item.url" :title="item.title" :alt="item.alt" />
            </div>
          </a-carousel>
        </div>
      </a-config-provider>
    `,
    components: {
      LeftOutlined,
      RightOutlined
    },
    setup(props: any) {
      const state = reactive<{
        imglist: Array<any>;
        autoplay: boolean;
        dots: { enable: boolean; image: boolean; };
        arrows: boolean;
        dotPosition: string;
        effect: string;
        easing: string;
        imageSize: string;
      }>({
        imglist: root.imglist,
        autoplay: root.autoplay,
        dots: root.dots,
        arrows: root.arrows,
        dotPosition: root.dotPosition,
        effect: root.effect,
        easing: root.easing,
        imageSize: root.imageSize
      });
      const afterChange = (current: number) => {
        onSendMessage(root, { current }, { srcType: "AfterChange" })
      };
      const beforeChange = (current: number) => {
        onSendMessage(root, { current }, { srcType: "BeforeChange" })
      };

      return {
        ...toRefs(state),
        zhCN,
        enumFilter,
        afterChange,
        beforeChange
      };
    },
  });

  root.componentInstance = createApp(component);
  root.componentInstance.use(ConfigProvider);
  root.componentInstance.use(Carousel);
  root.componentInstance.use(message);
  root.componentInstance.mount(root.container);
};

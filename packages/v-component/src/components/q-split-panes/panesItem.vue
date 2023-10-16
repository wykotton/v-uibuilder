<template>
    <splitpanes
      v-if="panesData?.list.length"
      class="q-split-panes default-theme"
      :push-other-panes="false"
      :horizontal="panesData.horiz" 
      @resize="spResize" 
      @resized="spResized"
      @pane-click="paneClick"
      @splitter-click="splitterClick"
      @pane-maximize="paneMaximize">
        <pane v-for="(item, index) in panesData['list']" :minSize="item.minSize" :maxSize="item.maxSize" :key="index" :size="item.size" :style="{ 'backgroundColor': item.bg.bgcolor, 'backgroundImage': `url(${item.bg.bgimg})` }" :class="item.bg.bgimgSize+'-size'">
          <panesItem :panesData="item" :indexKey="indexKey + '_' + index" :mutex="mutex" :contextType="contextType" :root="root"></panesItem>
        </pane>
    </splitpanes>
    <splitpanes
      v-else-if="panesData.key==='0'"
      class="q-split-panes default-theme"
      :push-other-panes="false"
      :horizontal="panesData.horiz" 
      @resize="spResize" 
      @resized="spResized"
      @pane-click="paneClick"
      @splitter-click="splitterClick"
      @pane-maximize="paneMaximize">
        <pane :key="panesData.key" :size="panesData.size" :style="{ 'backgroundColor': panesData.bg.bgcolor, 'backgroundImage': `url(${panesData.bg.bgimg})` }" :class="panesData?.bg?.bgimgSize+'-size'">
          <div ref="el" :id="panesData.key" :class="`content-div tbd-${panesData.tbdDir} ${contextType?'':'editing'}`" @click="onClickPanes">
            <div class="panes-title-bar" v-if="panesData.titleEnable" :style="{ 'color': panesData.titleColor, 'borderBottom': `${panesData.splitLine?.width}px solid ${panesData.splitLine?.color}` }">
              <span class="ps-title" @dblclick="ondblclickpdte">
                <span class="ps-title-txt" v-if="!panesDataTitleEditing" v-html="panesData.title || '请双击此处输入标题'"></span>
                <a-input ref="pdt" v-else v-model:value="panesDataTitle" size="small" @pressEnter="onChangeTitle" />
              </span>
              <span class="ps-opt">
                <caret-up-outlined :class="{'max-size': panesData.size === panesData.maxSize}" @click.stop="toggleShrink" />
                <fullscreen-outlined v-if="panesData.full" @click.stop="setFullscreen" />
                <!-- <fullscreen-exit-outlined /> -->
              </span>
            </div>
            <div class="title-bar-layout s-h" @click.stop="setHorizontal">
              <swap-right-outlined />
            </div>
            <div class="title-bar-layout s-v" @click.stop="setVertical">
              <swap-left-outlined />
            </div>
            <div class="split-layout s-l-t" @click.stop="splitHorizontal">
              <scissor-outlined />
            </div>
            <div class="split-layout s-l-r" @click.stop="splitVertical">
              <scissor-outlined />
            </div>
            <div class="split-layout s-del" @click.stop="delPanes">
              <delete-outlined />
            </div>
            <div class="split-tag-layout s-tag" @click.stop="delPanes">
              {{panesData.key}}
            </div>
            <div class="dropzone-content" v-html="outSlotHtml(indexKey)"></div>
          </div>
        </pane>
    </splitpanes>
    <div v-else ref="el" :id="panesData.key" :class="`content-div tbd-${panesData.tbdDir} ${contextType?'':'editing'}`" @click="onClickPanes">
      <div class="panes-title-bar" v-if="panesData.titleEnable" :style="{ 'color': panesData.titleColor, 'borderBottom': `${panesData.splitLine?.width}px solid ${panesData.splitLine?.color}` }">
        <span class="ps-title" @dblclick="ondblclickpdte">
          <span class="ps-title-txt" v-if="!panesDataTitleEditing" v-html="panesData.title || '请双击此处输入标题'"></span>
          <a-input ref="pdt" v-else v-model:value="panesDataTitle" size="small" @pressEnter="onChangeTitle" />
        </span>
        <span class="ps-opt">
          <caret-up-outlined :class="{'max-size': panesData.size === panesData.maxSize}" @click.stop="toggleShrink" />
          <fullscreen-outlined v-if="panesData.full" @click.stop="setFullscreen" />
          <!-- <fullscreen-exit-outlined /> -->
        </span>
      </div>
      <div class="title-bar-layout s-h" @click.stop="setHorizontal">
        <swap-right-outlined />
      </div>
      <div class="title-bar-layout s-v" @click.stop="setVertical">
        <swap-left-outlined />
      </div>
      <div class="split-layout s-l-t" @click.stop="splitHorizontal">
        <scissor-outlined />
      </div>
      <div class="split-layout s-l-r" @click.stop="splitVertical">
        <scissor-outlined />
      </div>
      <div class="split-layout s-del" @click.stop="delPanes">
        <delete-outlined />
      </div>
      <div class="split-tag-layout s-tag" @click.stop="delPanes">
        {{panesData.key}}
      </div>
      <div class="dropzone-content" v-html="outSlotHtml(indexKey)"></div>
    </div>
</template>

<script lang="ts">
import {
  ref,
  toRefs, 
  reactive, 
  defineComponent,
  getCurrentInstance,
  nextTick,
  inject,
  watch
} from "vue"
import { 
  ScissorOutlined, 
  CaretUpOutlined, 
  FullscreenOutlined, 
  FullscreenExitOutlined, 
  SwapRightOutlined,
  SwapLeftOutlined,
  DeleteOutlined
} from "@ant-design/icons-vue";
import { Splitpanes, Pane } from 'splitpanes'
import { cloneDeep } from "lodash-es";
import panesItem from "./panesItem.vue"
import { panesDataItem } from "./IQSplitPanes"
import { message } from "ant-design-vue";
import { createHashId, onSendMessage } from "../../util/utils";

export default defineComponent({
  name: "panesItem",
  components: {
    Splitpanes,
    Pane,
    ScissorOutlined, 
    CaretUpOutlined, 
    FullscreenOutlined, 
    FullscreenExitOutlined, 
    SwapRightOutlined,
    SwapLeftOutlined,
    DeleteOutlined
  },
  props: {
    panesData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    indexKey: [String, Number],
    contextType: Boolean,
    mutex: Boolean,
    root: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  setup(props: any, context: any) {
    const { fullPanseId, updateFullPanseId }:any = inject('fullPanseId');
    const { proxy } = getCurrentInstance() as any;
    const state = reactive<{
      root: any;
      selectedPanes: boolean;
      panesData: panesDataItem;
      mutex: boolean;
      isFull: boolean;
      panesDataTitle: string;
      panesDataTitleEditing: boolean;
    }>({
      root: props.root,
      selectedPanes: false,
      panesData: props.panesData,
      mutex: props.mutex,
      isFull: false,
      panesDataTitle: "",
      panesDataTitleEditing: false,
    })
    // 面板内容Dom
    const el = ref()
    // 面板标题输入Dom
    const pdt = ref()

    const spResize = (e: any) => {
      // console.log(e)
    }
    // 面板变化后
    const spResized = (e: any) => {
      console.log(e)
      const panesDataList = cloneDeep(state.panesData.list)
      panesDataList.map((v, i) => { v.size = e[i].size })
      state.panesData.list = panesDataList
      onSendMessage(state.root, e, { srcType: "AfterChangeSize" })
    }
    // 面板点击
    const paneClick = (e: any) => {
      // console.log(e)
    }
    // 面板分割线点击
    const splitterClick = (e: any) => {
      let result = [] as any;
      state.panesData.list.map((v, i) => {
        if (i === e.index) v.size = v.maxSize
        else v.size = v.minSize
        result.push({
          min: v.minSize,
          max: v.maxSize,
          size: v.size
        })
      })
      onSendMessage(state.root, result, { srcType: "AfterChangeSize" })
    }
    // 点击面板
    const onClickPanes = (e: any) => {
      // console.log(el.value)
      if (!el.value) return
      const selectedArr = state.root.shadowRoot.querySelectorAll('.selected')
      for (let i = 0; i < selectedArr.length; i++) {
        const element = selectedArr[i];
        element.className = element.className.replace(/selected/g, "");
      }
      el.value.classList.value = el.value.className + " selected"
      
      // state.selectedPanes = true
    }
    const paneMaximize = (e: any) => {
      // state.panesData.list[0].size = 0
      // state.panesData.list[1].size = 100
      console.log(e)
    }

    // 水平分割面板
    const splitHorizontal = (e: MouseEvent) => {
      state.panesData.horiz = false
      state.panesData.list = [{
        key: createHashId(12, "split-"),
        title: "未命名",
        titleEnable: true,
        titleColor: "#333333",
        splitLine: {
          width: 1,
          color: "#1f38581a"
        },
        tbdDir: "top",
        full: true,
        horiz: false,
        size: 50,
        minSize: 0,
        maxSize: 100,
        bg: {
          bgcolor: "#f2f2f2",
          bgimg: "",
          bgimgSize: "default"
        },
        list: []
      }, {
        key: createHashId(12, "split-"),
        title: "未命名",
        titleEnable: true,
        titleColor: "#333333",
        splitLine: {
          width: 1,
          color: "#1f38581a"
        },
        tbdDir: "top",
        full: true,
        horiz: false,
        size: 50,
        minSize: 0,
        maxSize: 100,
        bg: {
          bgcolor: "#f2f2f2",
          bgimg: "",
          bgimgSize: "default"
        },
        list: []
      }]
    }
    // 垂直分割面板
    const splitVertical = (e: MouseEvent) => {
      state.panesData.horiz = true
      state.panesData.list = [{
        key: createHashId(12, "split-"),
        title: "未命名",
        titleEnable: true,
        titleColor: "#333333",
        splitLine: {
          width: 1,
          color: "#1f38581a"
        },
        tbdDir: "top",
        horiz:true,
        size:50,
        minSize: 0,
        maxSize: 100,
        bg: {
          bgcolor: "#f2f2f2",
          bgimg: "",
          bgimgSize: "default"
        },
        list: []
      }, {
        key: createHashId(12, "split-"),
        title: "未命名",
        titleEnable: true,
        titleColor: "#333333",
        splitLine: {
          width: 1,
          color: "#1f38581a"
        },
        tbdDir: "top",
        horiz:true,
        size:50,
        minSize: 0,
        maxSize: 100,
        bg: {
          bgcolor: "#f2f2f2",
          bgimg: "",
          bgimgSize: "default"
        },
        list: []
      }]
    }
    // 查找面板
    const findNodeIndex = (tier:number) => {
      return props.indexKey.slice(props.indexKey.lastIndexOf('_') + 1)
    }
    // 删除面板
    const delPanes = (e: MouseEvent) => {
      // console.log(e)
      const panesAll = state.root.shadowRoot.querySelectorAll('.splitpanes__pane')
      if (panesAll.length === 1) {
        message.error("至少保留一个面板！")
        return
      }
      


      const curPanesData = proxy.$parent.$parent.$parent.panesData
      // const parentPanesData = proxy.$parent.$parent.$parent.$parent.$parent.$parent.panesData
      const optindex = findNodeIndex(1)

      
      // if (optindex) curPanesData.list[optindex - 1].size += state.panesData.size
      // else curPanesData.list[1].size += state.panesData.size
      curPanesData.list.splice(optindex, 1)
      // if (curPanesData.list.length === 2 && parentPanesData) {
      //   const parentIndex = findNodeIndex(2)
      //   const remainindex = optindex ? 0 : 1
      //   const remainPanes = curPanesData.list[remainindex]
      //   remainPanes.list.map((v: panesDataItem) => {
      //     v.size = curPanesData.size * (v.size/100)
      //   })
      //   parentPanesData.list.splice(parentIndex, 1, ...remainPanes.list)
      //   // parentPanesData.list.push(...remainPanes.list)
      // } else if(curPanesData.list.length > 2) {
      //   if (optindex) curPanesData.list[optindex - 1].size += state.panesData.size
      //   else curPanesData.list[1].size += state.panesData.size
      //   curPanesData.list.splice(optindex, 1)
      // } else {
      //   curPanesData.horiz = state.panesData.horiz
      //   curPanesData.tbdDir = state.panesData.tbdDir
      //   curPanesData.title = state.panesData.title
      //   curPanesData.list = []
      // }

      

      // if (curPanesData.list.length > 2) {
      //   const parentPanes = el.value.parentNode.parentNode.querySelectorAll('.splitpanes__pane')
      //   let optindex:number = 0
      //   for (let i = 0; i < parentPanes.length; i++) {
      //     if (el.value.parentNode === parentPanes[i]) optindex = i
      //   }
      //   if (optindex) curPanesData.list[optindex - 1].size += state.panesData.size
      //   else curPanesData.list[1].size += state.panesData.size
      //   curPanesData.list.splice(optindex, 1)
      // } else {
      //   curPanesData.horiz = state.panesData.horiz
      //   curPanesData.tbdDir = state.panesData.tbdDir
      //   curPanesData.title = state.panesData.title
      //   if (panesAll.length === 2) {
      //     curPanesData.list = [{
      //       title: state.panesData.title,
      //       tbdDir: state.panesData.tbdDir,
      //       horiz: state.panesData.horiz,
      //       size: 100,
      //       list: []
      //     }]
      //   } else {
      //     curPanesData.list = []
      //   }
      // }
      
    }
    // 设置水平面板标题
    const setHorizontal = (e: MouseEvent) => {
      state.panesData.tbdDir = "top"
      // console.log(e)
    }
    // 设置垂直面板标题
    const setVertical = (e: MouseEvent) => {
      state.panesData.tbdDir = "left"
      // console.log(e)
    }
    // 缩放
    const toggleShrink = (e: MouseEvent) => {
      state.root.toggle(state.panesData, state.panesData?.relatedId)
      // console.log(e)
      // const parentPanesList = proxy.$parent.$parent.$parent.panesData.list
      // if (state.panesData.size !== 100) {
      //   parentPanesList.map((v:panesDataItem) => {
      //     v.size = 0
      //   })
      //   state.panesData.size = 100
      // } else {
      //   if (parentPanesList.length > 1) {
      //     const parentPanes = el.value.parentNode.parentNode.getElementsByClassName('splitpanes__pane')
      //     let optindex:number = 0
      //     for (let i = 0; i < parentPanes.length; i++) {
      //       if (el.value.parentNode === parentPanes[i]) optindex = i
      //     }
      //     parentPanesList[optindex ? (optindex - 1) : (parentPanesList.length - 1)].size = 100
      //     state.panesData.size = 0
      //   }
      // }
    }
    /**
     * 获取元素在页面中的坐标(x, y) 
     * @param {Object} e
     */
    // const getElementPosition = (e: any) => {
    //     let x = 0, y = 0;
    //     while(e != null) {
    //         x += e.offsetLeft;
    //         y += e.offsetTop;
    //         e = e.offsetParent;
    //     }
    //     return { x: x, y: y };
    // }
    /**
     * 遍历隐藏全部面板 
     * @param {Object} e
     */
    const visibAllPanse = (e: any, visib?: boolean) => {
        while(e.parentNode.className != "q-splitpanes-wrap" && e.parentNode.id != "container") {
          const childlist = e.parentNode.parentNode.children
          // let panselist = []
          for (let i = 0; i < childlist.length; i++) {
            if (e.parentNode !== childlist[i]) {
              childlist[i].style.display = visib ? "" : "none"
            }
          }
          e = e.parentNode.parentNode;
        }
    }
    // 缩放监听
    const resizeListener = () => {
      window.addEventListener('resize', () => {
        setTimeout(() => {
          if (state.isFull) state.isFull = false
        }, 200);
      })
    }
    // 初始化监听器
    resizeListener()
    // 设置全屏
    const setFullscreen = (e?: MouseEvent) => {
      console.log(context, proxy)
      const curDom = proxy.$el
      const fullDom = state.panesData.fullDom ? document.getElementById(state.panesData.fullDom) : ""
      if (state.panesData.fullDom && fullDom) { // 指定展开目标节点
        const { width, height } = fullDom.getBoundingClientRect()
        if (state.isFull) {
          state.root.style.top = state.root.beforefullpos.top
          state.root.style.left = state.root.beforefullpos.left
          state.root.style.width = state.root.beforefullpos.width
          state.root.style.height = state.root.beforefullpos.height
          curDom.style.width = ""
          curDom.style.height = ""
          curDom.style.position = ""
          el.value.className += " editing"
          visibAllPanse(proxy.$el, true)
        } else {
          visibAllPanse(proxy.$el)
          state.root.beforefullpos.top = state.root.style.top
          state.root.beforefullpos.left = state.root.style.left
          state.root.beforefullpos.width = state.root.style.width
          state.root.beforefullpos.height = state.root.style.height
          state.root.style.top = `0px`
          state.root.style.left = `0px`
          state.root.style.width = `0px`
          state.root.style.height = `0px`
          curDom.style.width = `${width}px`
          curDom.style.height = `${height}px`
          curDom.style.position = "absolute"
          el.value.className = el.value.className.replace(" editing", "")
        }
      } else {
        // console.log(e)
        // if (el.value.requestFullscreen) {
        //   if (state.isFull) {
        //     try {
        //       document.exitFullscreen()
        //     } catch (error) {
        //       state.isFull = false
        //       el.value.requestFullscreen()
        //     }
        //   } else {
        //     el.value.requestFullscreen()
        //   }
        //   // state.isFull ? document.exitFullscreen() : curDom.requestFullscreen()
        // } else message.info("该浏览器不支持全屏")
        if (!state.isFull) {
          if (el.value.requestFullscreen) {
            el.value.requestFullscreen();
          } else if ((el.value as any).webkitRequestFullScreen) {
            (el.value as any).webkitRequestFullScreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if ((document as any).webkitCancelFullScreen) {
            (document as any).webkitCancelFullScreen();
          }
        }
      }
      state.isFull = !state.isFull      
    }
    // 双击标题
    const ondblclickpdte = (e: MouseEvent) => {
      if (props.contextType) return
      state.panesDataTitleEditing = true
      nextTick(() => {
        pdt.value.focus()
      })
    }
    // 修改标题
    const onChangeTitle = () => {
      state.panesDataTitleEditing = false
      state.panesData.title = state.panesDataTitle
    }
    // 面板容器
    const outSlotHtml = (index: any) => {
      return `<slot name="contentHtml_${index}" class="dropzone">
                <q-container-mask text="" noborder>
                </q-container-mask>
              </slot>`
    }
    watch(() => fullPanseId,
    (newVal: any) => {
      console.log(newVal.value, state.panesData.key)
      if (newVal.value === state.panesData.key) {
        setFullscreen()
        updateFullPanseId("")
      }
    }, { deep: true })
    return {
      el,
      pdt,
      fullPanseId,
      updateFullPanseId,
      ...toRefs(state),
      spResize,
      spResized,
      paneClick,
      splitterClick,
      onClickPanes,
      splitHorizontal,
      splitVertical,
      delPanes,
      paneMaximize,
      setHorizontal,
      setVertical,
      toggleShrink,
      setFullscreen,
      onChangeTitle,
      ondblclickpdte,
      outSlotHtml
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
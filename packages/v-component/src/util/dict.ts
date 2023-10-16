export const dictionaries = {
  btnType: {
    "默认": "primary",
    "简约": "default",
    "虚边": "dashed",
    "文字": "text",
    "链接": "link"
  },
  qbtnType: {
    "默认": "primary",
    "简约": "info",
    "虚边": "success",
    "文字": "warning",
    "链接": "text"
  },
  mbtnType: {
    "默认": "primary",
    "简约": "",
    "虚边": "dashed",
    "文字": "text",
    "链接": "link"
  },
  // "primary" | "success" | "warning" | "danger" | "info" | "text";
  btnModalEvent: {
    "确定": "confirmHandleFun",
    "取消": "cancelHandleFun",
    "自定义": "customEventHandleFun" 
  },
  modalImageSize: {
    "默认": "default",
    "重复": "contain",
    "铺满": "full"
  },
  btnDrawerEvent: {
    "确定": "confirmHandleFun",
    "取消": "cancelHandleFun",
    "自定义": "customEventHandleFun" 
  },
  placement: {
    "上": "top", 
    "右": "right", 
    "下": "bottom",
    "左": "left"
  },
  align: {
    "居左": "left", 
    "居中": "center", 
    "居右": "right"
  },
  tableSize: {
    "默认": "default", 
    "中等": "middle", 
    "紧凑": "small"
  },
  expandIconPosition: {
    "左": "left",
    "右": "right"
  },
  collapsible: {
    "true": "disabled",
    "false": "header"
  },
  popoverTrigger: {
    "点击": "click",
    "悬停": "hover"
  },
  spinSize: {
    "小": "small",
    "中": "default",
    "大": "large"
  },
  carouselEffect: {
    "滚动": "scrollx",
    "渐显": "fade"
  },
  carouselImageSize: {
    "默认": "default",
    "铺满": "contain"
  },
  uploadListType: {
    "文字按钮": "text",
    "图片列表": "picture",
    "照片墙": "picture-card",
    "头像展示": "avatar",
    "区域拖拽": "drop"
  }
}

export function enumFilter(word:string, key:string|number, def?: string|number) {
  return dictionaries[word][key]?dictionaries[word][key]:def?def:key
}
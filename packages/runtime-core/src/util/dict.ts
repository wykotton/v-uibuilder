export const dictionaries: RootObject = {
  btnType: {
    默认: "primary",
    简约: "default",
    虚边: "dashed",
    文字: "text",
    链接: "link",
  },
  qbtnType: {
    默认: "primary",
    简约: "info",
    虚边: "success",
    文字: "warning",
    链接: "text",
  },
  btnModalEvent: {
    确定: "confirmHandleFun",
    取消: "cancelHandleFun",
    自定义: "customEventHandleFun",
  },
  btnDrawerEvent: {
    确定: "confirmHandleFun",
    取消: "cancelHandleFun",
    自定义: "customEventHandleFun",
  },
  placement: {
    上: "top",
    右: "right",
    下: "bottom",
    左: "left",
  },
  align: {
    居左: "left",
    居中: "center",
    居右: "right",
  },
  tableSize: {
    默认: "default",
    中等: "middle",
    紧凑: "small",
  },
  expandIconPosition: {
    左: "left",
    右: "right",
  },
  collapsible: {
    true: "disabled",
    false: "header",
  },
  popoverTrigger: {
    点击: "click",
    悬停: "hover",
  },
  spinSize: {
    小: "small",
    中: "default",
    大: "large",
  },
  carouselEffect: {
    滚动: "scrollx",
    渐显: "fade",
  },
  carouselImageSize: {
    默认: "default",
    铺满: "contain",
  },
};
interface RootObject {
  btnType: BtnType;
  qbtnType: BtnType;
  btnModalEvent: BtnModalEvent;
  btnDrawerEvent: BtnModalEvent;
  placement: Placement;
  align: Align;
  tableSize: TableSize;
  expandIconPosition: ExpandIconPosition;
  collapsible: Collapsible;
  popoverTrigger: PopoverTrigger;
  spinSize: SpinSize;
  carouselEffect: CarouselEffect;
  carouselImageSize: CarouselImageSize;
}

interface CarouselImageSize {
  默认: string;
  铺满: string;
}

interface CarouselEffect {
  滚动: string;
  渐显: string;
}

interface SpinSize {
  小: string;
  中: string;
  大: string;
}

interface PopoverTrigger {
  点击: string;
  悬停: string;
}

interface Collapsible {
  true: string;
  false: string;
}

interface ExpandIconPosition {
  左: string;
  右: string;
}

interface TableSize {
  默认: string;
  中等: string;
  紧凑: string;
}

interface Align {
  居左: string;
  居中: string;
  居右: string;
}

interface Placement {
  上: string;
  右: string;
  下: string;
  左: string;
}

interface BtnModalEvent {
  确定: string;
  取消: string;
  自定义: string;
}

interface BtnType {
  默认: string;
  简约: string;
  虚边: string;
  文字: string;
  链接: string;
} 
type RootObjectChildProps =
  | keyof BtnType
  | keyof BtnModalEvent
  | keyof Placement
  | keyof Align
  | keyof TableSize
  | keyof ExpandIconPosition
  | keyof Collapsible
  | keyof PopoverTrigger
  | keyof SpinSize
  | keyof CarouselEffect
  | keyof CarouselImageSize;
export function enumFilter<T extends keyof RootObject>(word: T, key: RootObjectChildProps, def?: unknown): string {
  //@ts-ignore
  return dictionaries[word][key] || def || key;
}

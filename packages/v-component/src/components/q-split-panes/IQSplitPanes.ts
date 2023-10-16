export interface titleBar {
    enable: boolean;
    mutex: boolean;
    full: boolean;
}
// 定义接口来定义对象的类型
export interface panesDataItem {
    key: string;
    icon?: string; 
    title: string;
    titleEnable: boolean;
    titleColor: string;
    splitLine: {
      width: number;
      color: string;
    };
    tbdDir: string;
    full?: boolean;
    fullDom?: string;
    horiz: boolean;
    size: number;
    minSize: number;
    maxSize: number;
    relatedId?: string;
    bg: {
        bgcolor: string;
        bgimg: string;
        bgimgSize: string
    };
    list: panesDataItem[];
    disabled?: boolean;
  }

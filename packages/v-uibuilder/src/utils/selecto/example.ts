import { SelectoParams } from "./params";
import Selecto from "selecto";

/*
 * Selecto
 * 框选
 */
export class SelectoExample extends SelectoParams {
  constructor() {
    super();
    this.initSelecto(this.topParam);
    this.initSelecto(this.bottomParam);
  }

  /*
   * 创建selecto实例
   */
  private initSelecto(param: any) {
    (this as any)[param.rootName] = new Selecto({
      container: param.container || null, // 主容器
      rootContainer: param.rootContainer || null, // selecto实例根容器
      dragContainer: param.dragContainer || null, // 拖动选择元素的容器
      selectableTargets: param.selectableTargets || [], // 要选择的目|标
      selectFromInside: param.selectFromInside || false, // 是否从目|标内|部进行选择
      dragCondition: param.dragCondition || null, // 开始拖动的条件函数
      preventDefault: param.preventDefault || false, // 拖动时阻止默认事件
      preventClickEventOnDrag: param.preventClickEventOnDrag || false, // 防止拖动时发生单击事件
      preventClickEventOnDragStart: param.preventClickEventOnDragStart || false, // 	防止dragStart上的单击事件(鼠标按下)
      hitRate: param.hitRate || 100, // 目|标与要选择的拖动区域重叠率
    });
    const events = ["dragStart", "selectEnd"];
    events.forEach((event) => {
      (this as any)[param.rootName].on(event, (e: any) => {
        // console.log(event);
        param[event] ? param[event](e) : void 0;
      });
    });
  }
}

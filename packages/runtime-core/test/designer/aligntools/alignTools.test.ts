import { IComponent, ISchema, PositionEnum } from "@zzjz/v-uibuilder-types";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isPlane, useAlignmentEvents } from "../../../src/designer";
import { Component, ComponentModel } from "../../../src/runtime/api";
import { createHashId } from "../../../src/util";

class TestComponent extends Component {
  componentModel: ComponentModel;
  constructor() {
    super();
    this.initModel();
  }
  initModel() {
    this.componentModel = new ComponentModel({
      el: this,
      model: {} as unknown as ISchema,
    } as unknown as ComponentModel);
  }
}
customElements.define("q-test", TestComponent);

describe("designer 对齐工具函数", async () => {
  function addTestData() {
    const doms = Array(10)
      .fill(0)
      .map((current) => {
        const hashId = createHashId();
        const div = document.createElement("q-test");
        div.style.cssText = `height:100px;width:100px;background-color:red;position:absloute;left:${Math.floor(
          Math.random() * 100
        )}px;top:${Math.floor(Math.random() * 100)}px;`;
        div.id = hashId;
        return div;
      });
    return doms;
  }
  const testData = addTestData() as never as IComponent[];
  beforeEach(async () => {
    testData.forEach((child) => {
      document.body.appendChild(child);
    });
  });

  it("isPlane 元件是否为一个平面", () => {
    console.log( 
        testData.map((c) => c.style.cssText)
      );
    const selectComponents = testData.map((current) => {
      return {
        id: current.id,
      } as unknown as IComponent;
    });
    expect(isPlane(selectComponents)).toEqual(true);
  });

  it("leftAlign 元件左对齐", () => {
    console.log(testData.map((c) => c.style.left));
    useAlignmentEvents({
      key: "2-1",
      percentOrAbsolute: PositionEnum.ABSOLUTE,
      elementArr: testData,
    });
    // @ts-ignore
    window.testData = testData;
    // @ts-ignore
    console.log(testData.map((c) => c.style.left));

    expect(testData.every((current) => testData[0].style.left === current.style.left)).toEqual(true);
  });
  it("rightAlign 元件右对齐", () => {
    console.log(testData.map((c) => c.style.right));

    useAlignmentEvents({
      key: "2-2",
      percentOrAbsolute: PositionEnum.ABSOLUTE,
      elementArr: testData,
    });
    // @ts-ignore
    window.testData = testData;
    // @ts-ignore
    console.log(testData.map((c) => c.style.right));

    expect(testData.every((current) => testData[0].style.right === current.style.right)).toEqual(true);
  });

  it("topAlign 元件顶端对齐", () => {
    console.log(testData.map((c) => c.style.top));

    useAlignmentEvents({
      key: "2-3",
      percentOrAbsolute: PositionEnum.ABSOLUTE,
      elementArr: testData,
    });
    // @ts-ignore
    window.testData = testData;
    // @ts-ignore
    console.log(testData.map((c) => c.style.top));

    expect(testData.every((current) => testData[0].style.top === current.style.top)).toEqual(true);
  });

  it("bottomAlign 元件底部对齐", () => {
    console.log(testData.map((c) => c.style.bottom));

    useAlignmentEvents({
      key: "2-4",
      percentOrAbsolute: PositionEnum.ABSOLUTE,
      elementArr: testData,
    });
    // @ts-ignore
    window.testData = testData;
    // @ts-ignore
    console.log(testData.map((c) => c.style.bottom));

    expect(testData.every((current) => testData[0].style.bottom === current.style.bottom)).toEqual(true);
  });

  it("horizontalAlign 元件水平对齐", () => {
    console.log(testData.map((c) => c.style.left));

    useAlignmentEvents({
      key: "2-5",
      percentOrAbsolute: PositionEnum.ABSOLUTE,
      elementArr: testData,
    });
    // @ts-ignore
    window.testData = testData;
    // @ts-ignore
    console.log(testData.map((c) => c.style.left));

    expect(testData.every((current) => testData[0].style.left === current.style.left)).toEqual(true);
  });

  it("verticalAlign 元件垂直对齐", () => {
    useAlignmentEvents({
      key: "2-6",
      percentOrAbsolute: PositionEnum.ABSOLUTE,
      elementArr: testData,
    });
    // @ts-ignore
    window.testData = testData;
    // @ts-ignore
    console.log(testData.map((c) => c.style.top));

    expect(testData.every((current) => testData[0].style.top === current.style.top)).toEqual(true);
  });
  it.skip("horizontalDistribution 元件横向分布", () => {
    useAlignmentEvents({
      key: "2-7",
      percentOrAbsolute: PositionEnum.ABSOLUTE,
      elementArr: testData,
    });

    testData.sort(
      // @ts-ignore
      (a, b) => parseInt(a.componentModel.model.initStyle.left) - parseInt(b.componentModel.model.initStyle.left)
    );

    // @ts-ignore
    const maxWidth = testData.reduce((max, current) => {
      // @ts-ignore
      const currentWidth = parseInt(current.componentModel.model.initStyle.width);
      // @ts-ignore
      if (parseInt(current.componentModel.model.initStyle.left) + currentWidth > max) {
        // @ts-ignore
        return parseInt(current.componentModel.model.initStyle.left) + currentWidth;
      }
      return max;
    }, 0);

    const totalWidth = testData.reduce(
      // @ts-ignore
      (total, current) => total + parseInt(current.componentModel.model.initStyle.width),
      0
    );
    // @ts-ignore
    const areaWidth = maxWidth - parseInt(testData[0].componentModel.model.initStyle.left);

    // Calculate average width of remaining space
    const remainingWidth = areaWidth - totalWidth;
    const averageWidth = remainingWidth / (testData.length - 1);

    // @ts-ignore
    let currentLeft = parseInt(testData[0].componentModel.model.initStyle.left);
    for (let i = 0; i < testData.length; i++) {
      // @ts-ignore
      const currentWidth = parseInt(testData[i].componentModel.model.initStyle.width);
      // @ts-ignore
      testData[i].componentModel.model.initStyle.left = `${currentLeft}px`;
      currentLeft += currentWidth + averageWidth;
    }

    expect(
      testData.every((current, index) => {
        if (index === 0) {
          return true;
        }
        // @ts-ignore
        const prevWidth = parseInt(testData[index - 1].componentModel.model.initStyle.width);
        // @ts-ignore
        const prevLeft = parseInt(testData[index - 1].componentModel.model.initStyle.left);
        // @ts-ignore
        const currentLeft = parseInt(current.componentModel.model.initStyle.left);
        return currentLeft === prevLeft + prevWidth + averageWidth;
      })
    ).toEqual(true);
  });
  it.skip("verticalDistribution 元件垂直分布", () => {
    console.log( 
      testData.map((c) => c?.componentModel?.model?.initStyle)
    );
    useAlignmentEvents({
      key: "2-8",
      percentOrAbsolute: PositionEnum.ABSOLUTE,
      elementArr: testData,
    });
    testData.sort(
      (
        a,
        b // @ts-ignore
      ) => parseInt(a.componentModel.model.initStyle.top ?? 0) - parseInt(b.componentModel.model.initStyle.top ?? 0)
    );
    console.log(testData.map((c) => c?.componentModel?.model?.initStyle?.top));

    // @ts-ignore
    const totalHeight = testData.reduce(
      // @ts-ignore
      (total, current) => total + parseInt(current.componentModel.model.initStyle.height ?? 0),
      0
    );

    const areaHeight = // @ts-ignore
      parseInt(testData[testData.length - 1].componentModel.model.initStyle.top ?? 0) -
      // @ts-ignore
      parseInt(testData[0].componentModel.model.initStyle.top ?? 0);

    const remainingHeight = areaHeight - totalHeight;
    const averageHeight = remainingHeight / (testData.length - 1);

    // @ts-ignore
    let currentTop = parseInt(testData[0].componentModel.model.initStyle.top ?? 0);
    for (let i = 0; i < testData.length; i++) {
      // @ts-ignore
      const currentHeight = parseInt(testData[i].componentModel.model.initStyle.height ?? 0);
      // @ts-ignore
      testData[i].componentModel.model.initStyle.top = `${currentTop}px`;
      currentTop += currentHeight + averageHeight;
    }
    console.log(
      testData.every((current, index) => {
        if (index === 0) {
          return true;
        }
        // @ts-ignore
        const prevHeight = parseInt(testData[index - 1].componentModel.model.initStyle.height ?? 0);
        // @ts-ignore
        const prevTop = parseInt(testData[index - 1].componentModel.model.initStyle.top ?? 0);
        // @ts-ignore
        const currentTop = parseInt(current.componentModel.model.initStyle.top ?? 0);

        return currentTop === prevTop + prevHeight + averageHeight;
      })
    );

    expect(
      testData.every((current, index) => {
        if (index === 0) {
          return true;
        }
        // @ts-ignore
        const prevHeight = parseInt(testData[index - 1].componentModel.model.initStyle.height);
        // @ts-ignore
        const prevTop = parseInt(testData[index - 1].componentModel.model.initStyle.top);
        // @ts-ignore
        const currentTop = parseInt(current.componentModel.model.initStyle.top);
        console.log(currentTop, prevTop, prevHeight, averageHeight);

        return currentTop === prevTop + prevHeight + averageHeight;
      })
    ).toEqual(true);
  });
  it("equalHeight 元件等高", () => {
    useAlignmentEvents({
      key: "2-9",
      percentOrAbsolute: PositionEnum.ABSOLUTE,
      elementArr: testData,
    });

    expect(testData.every((current) => testData[0].style.height === current.style.height)).toEqual(true);
  });
  it("equalWidth 元件等宽", () => {
    useAlignmentEvents({
      key: "2-10",
      percentOrAbsolute: PositionEnum.ABSOLUTE,
      elementArr: testData,
    });

    expect(testData.every((current) => testData[0].style.width === current.style.width)).toEqual(true);
  });
  it("equalSize 元件等尺寸", () => {
    useAlignmentEvents({
      key: "2-11",
      percentOrAbsolute: PositionEnum.ABSOLUTE,
      elementArr: testData,
    });

    expect(testData.every((current) => testData[0].style.width === current.style.width)).toEqual(true);
    expect(testData.every((current) => testData[0].style.height === current.style.height)).toEqual(true);
  });

  afterEach(async () => {
    testData.forEach((child) => {
      child.remove();
    });
  });
});

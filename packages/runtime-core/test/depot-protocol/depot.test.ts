import { ComponentProtocolEnum } from "@zzjz/v-uibuilder-types";
import { describe, expect, it } from "vitest";
import { getComponents, componentsAction } from "../../src/depot-protocol";

describe("depot-protocol 仓库协议", async () => {
  it("获取所有仓库元件列表", () => {
    expect(getComponents()).toEqual([]);
  });
  it("元件仓库通讯协议", async () => {
    await expect(componentsAction("uib", { type: ComponentProtocolEnum.IMPORT, body: null })).resolves.toBeNull();
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { getElementTree } from "../../src/util";

describe("utils 帮助文件", async () => {
  beforeEach(async () => {});

  it("获取元素DOM树", () => {
    expect(getElementTree()).toEqual([]);
  });
});

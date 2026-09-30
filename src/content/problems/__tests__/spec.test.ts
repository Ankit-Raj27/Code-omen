import { describe, expect, it } from "vitest";
import { buildGraph, buildList, buildTree, graphAdj, javaLiteral, listValues, treeLevel } from "../spec";
import { problems } from "@/utils/problems";

describe("list and tree test data", () => {
  it("round-trips lists", () => {
    expect(listValues(buildList([3, 1, 2]))).toEqual([3, 1, 2]);
    expect(buildList([])).toBeNull();
    expect(listValues(null)).toEqual([]);
  });
  it("round-trips LeetCode level order, trimming trailing nulls", () => {
    for (const t of [[], [1], [1, null, 2], [3, 9, 20, null, null, 15, 7], [1, 2, null, 3, 4, 5, null, null, 6]]) {
      expect(treeLevel(buildTree(t))).toEqual(t);
    }
    expect(treeLevel(buildTree([1, 2, null]))).toEqual([1, 2]);
  });
  it("stops on a cyclic list instead of hanging", () => {
    const h = buildList([1, 2])!;
    h.next!.next = h;
    expect(listValues(h).length).toBe(10000);
  });
  it("renders Java literals for the new types", () => {
    expect(javaLiteral([1, 2], "ListNode")).toBe("list(1, 2)");
    expect(javaLiteral([1, null, 2], "TreeNode")).toBe("tree(new Integer[]{1, null, 2})");
    expect(javaLiteral([[1], []], "ListNode[]")).toBe("new ListNode[]{list(1), list()}");
    expect(javaLiteral([[1, 2], 0], "CycleList")).toBe("cycle(new int[]{1, 2}, 0)");
    expect(javaLiteral(["A", "B"], "char[]")).toBe("new char[]{'A', 'B'}");
  });
  it("graphs: round-trip adjacency lists and reject a non-copy", () => {
    const adj = [[2, 4], [1, 3], [2, 4], [1, 3]];
    const g = buildGraph(adj);
    expect(graphAdj(g)).toEqual(adj);
    expect(graphAdj(g, g)).toBe("shares nodes with the input");
    expect(graphAdj(buildGraph([]))).toEqual([]);
    const handler = problems["clone-graph"].handlerFunction as (fn: unknown) => boolean;
    expect(() => handler((node: unknown) => node)).toThrow(/AssertionError/);
  });
});

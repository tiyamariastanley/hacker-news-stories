import { getRandomIdArray } from ".";
import { fetcher } from "./fetcher";

describe("random id frunction", () => {
  test("returns random ids", () => {
    const arr = [1, 2, 3, 4, 5];
    const ids = getRandomIdArray(arr, 3);
    expect(ids).toHaveLength(3);

    ids.forEach((item) => {
      expect(arr.includes(item)).toBe(true);
    });
    expect(new Set(ids).size).toBe(3);
  });

  test("empty array", () => {
    const ids = getRandomIdArray([], 3);
    expect(ids).toEqual([]);
  });

  test("empty count ", () => {
    const ids = getRandomIdArray([1, 2, 3, 4, 5], 0);
    expect(ids).toEqual([]);
  });
});

describe("fetcher function", () => {
  test("successful fetch", async () => {
    const mockRes = { message: "success" };
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRes),
    });

    const res = await fetcher(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    expect(res).toEqual(mockRes);
  });

  test("failed fetch", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve("Not Found"),
    });

    await expect(
      fetcher("https://hacker-news.firebaseio.com/v0/topstories.json")
    ).rejects.toMatchObject({
      message: "An error occurred while fetching the data.",
      info: "Not Found",
      status: 404,
    });
  });
});

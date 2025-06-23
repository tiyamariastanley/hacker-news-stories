import { render, screen } from "@testing-library/react";
import { beforeEach, expect, it, vi, describe } from "vitest";
import "@testing-library/jest-dom";
import { formatDistanceToNow } from "date-fns";
import Stories from ".";
import useSWR from "swr";

const mockStories = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Story Title ${i + 1}`,
  by: `Author ${i + 1}`,
  score: 100 - i,
  url: `https://example.com/story-${i + 1}`,
  time: 1750171646,
  descendants: 0,
  kids: [],
  type: "story",
}));

vi.mock("swr", () => {
  return {
    default: vi.fn(),
  };
});

vi.mock("../../util/fetcher", () => ({
  fetcher: vi.fn((url: string) => {
    const match = url.match(/item\/(\d+)\.json/);
    const id = match ? Number(match[1]) : null;
    const story = mockStories.find((s) => s.id === id);
    return Promise.resolve(story);
  }),
}));

vi.mock("../../util", () => ({
  getRandomIdArray: () => mockStories.map((s) => s.id),
}));

const mockedUseSWR = useSWR as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.restoreAllMocks();

  mockedUseSWR.mockImplementation((key: string) => {
    if (key === "https://hacker-news.firebaseio.com/v0/topstories.json") {
      return {
        data: mockStories.map((s) => s.id), // return array of story ids
        error: undefined,
        isLoading: false,
      };
    }

    if (key?.startsWith("https://hacker-news.firebaseio.com/v0/user/")) {
      return {
        data: { id: "Author 1", karma: 42 }, // mock user data for StoryCard
        error: undefined,
        isLoading: false,
      };
    }
  });
});

describe("Stories", () => {
  it("renders loading component", async () => {
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });

    render(<Stories />);
    const loaderElements = await screen.findAllByTestId("loader-skeleton");
    expect(loaderElements.length).toBe(10);
  });

  it("renders error component", async () => {
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: { message: "Failed to fetch stories" },
      isLoading: false,
    });

    render(<Stories />);
    expect(
      screen.getByRole("button", { name: /refresh/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Failed to fetch stories/i)).toBeInTheDocument();
  });

  it("renders story card details", async () => {
    render(<Stories />);

    for (const story of mockStories) {
      const expectedText = formatDistanceToNow(new Date(story.time * 1000), {
        addSuffix: true,
      });
      expect(await screen.findByText(story.title)).toBeInTheDocument();
      expect(await screen.findByText(story.by)).toBeInTheDocument();
      expect(await screen.findByText(String(story.score))).toBeInTheDocument();
      expect((await screen.findAllByText(expectedText)).length).toBeGreaterThan(
        1
      );
    }
    expect((await screen.findAllByText(/42 score/i)).length).toBeGreaterThan(1);
  });
});

import { render, screen } from "@testing-library/react";
import { beforeEach, expect, vi, describe, test } from "vitest";
import "@testing-library/jest-dom";
import { formatDistanceToNow } from "date-fns";
import Stories from ".";
import useSWR from "swr";
import StoryCard from "./StoryCard";
import { buildStoriesUrl } from "../../util/search";

const mockStories = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Story Title ${i + 1}`,
  by: `Author ${i + 1}`,
  score: 100 - i,
  url: `https://example.com/story-${i + 1}`,
  time: 1750171646,
  descendants: 12,
  kids: [],
  type: "story",
}));

const mockAlgoliaResponse = {
  hits: mockStories.map((story) => ({
    objectID: String(story.id),
    story_id: story.id,
    title: story.title,
    author: story.by,
    points: story.score,
    num_comments: story.descendants,
    created_at_i: story.time,
    url: story.url,
  })),
};

vi.mock("swr", () => {
  return {
    default: vi.fn(),
  };
});

const mockedUseSWR = useSWR as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.restoreAllMocks();

  mockedUseSWR.mockImplementation((key: string | null) => {
    if (!key) {
      return {
        data: undefined,
        error: undefined,
        isLoading: false,
      };
    }

    if (key.startsWith("https://hn.algolia.com/api/v1/search")) {
      return {
        data: mockAlgoliaResponse,
        error: undefined,
        isLoading: false,
      };
    }
  });
});

describe("Stories", () => {
  test("fetches front page stories from Algolia", async () => {
    render(<Stories />);
    await screen.findAllByTestId("story-card");

    expect(mockedUseSWR).toHaveBeenCalledWith(
      buildStoriesUrl(),
      expect.any(Function),
      { revalidateOnFocus: false }
    );
  });

  test("renders loading component", async () => {
    mockedUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });

    render(<Stories />);
    const loaderElements = await screen.findAllByTestId("loader-skeleton");
    expect(loaderElements.length).toBe(10);
  });

  test("renders error component", async () => {
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

  test("renders stories", async () => {
    render(<Stories />);
    const storyCards = await screen.findAllByTestId("story-card");
    expect(storyCards.length).toBe(10);
  });

  test("renders empty state for search with no results", async () => {
    mockedUseSWR.mockReturnValue({
      data: { hits: [] },
      error: undefined,
      isLoading: false,
    });

    render(<Stories searchQuery="nonexistent" />);
    expect(screen.getByText(/No stories found for/i)).toBeInTheDocument();
    expect(screen.getByText(/nonexistent/)).toBeInTheDocument();
  });
});

describe("Story Card", () => {
  test("renders story card details", async () => {
    render(<StoryCard data={mockStories[0]} />);

    const expectedText = formatDistanceToNow(new Date(1750171646 * 1000), {
      addSuffix: true,
    });
    expect(await screen.findByText("Story Title 1")).toBeInTheDocument();
    expect(await screen.findByText("Author 1")).toBeInTheDocument();
    expect(await screen.findByText("100")).toBeInTheDocument();
    expect(await screen.findByText(expectedText)).toBeInTheDocument();
    expect(await screen.findByText(/12 comments/i)).toBeInTheDocument();
  });
});

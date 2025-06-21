import { render, screen } from "@testing-library/react";
import { beforeEach, expect, it, vi, describe } from "vitest";
import "@testing-library/jest-dom";
import Stories from ".";
import useSWR from "swr";

const mockStories = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Story Title ${i + 1}`,
  by: `Author ${i + 1}`,
  score: 100 - i,
  url: `https://example.com/story-${i + 1}`,
  time: Date.now() / 1000,
}));

vi.mock("swr", () => {
  return {
    default: vi.fn(),
  };
});

vi.mock("../../lib/fetcher", () => ({
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

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("Stories", () => {
  it("renders loading component", async () => {
    (useSWR as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });

    render(<Stories />);
    const loaderElements = await screen.findAllByTestId("loader-skeleton");
    expect(loaderElements.length).toBe(10);
  });

  it("renders error component", async () => {
    (useSWR as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
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

  it("renders title, author and score stories", async () => {
    (useSWR as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockStories.map((s) => s.id),
      error: undefined,
      isLoading: false,
    });

    render(<Stories />);

    for (const story of mockStories) {
      expect(await screen.findByText(story.title)).toBeInTheDocument();
      expect(await screen.findByText(story.by)).toBeInTheDocument();
      expect(await screen.findByText(String(story.score))).toBeInTheDocument();
    }
  });
});

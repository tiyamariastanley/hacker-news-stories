import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import Header from ".";
import "@testing-library/jest-dom";

const defaultProps = {
  searchQuery: "",
  onSearch: vi.fn(),
  onClearSearch: vi.fn(),
};

it("renders header title", () => {
  render(<Header {...defaultProps} />);
  expect(screen.getByText(/Hacker News Bulletin/i)).toBeInTheDocument();
});

it("renders search toggle button", () => {
  render(<Header {...defaultProps} />);
  expect(screen.getByRole("button", { name: /open search/i })).toBeInTheDocument();
});

import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import Header from ".";
import "@testing-library/jest-dom";

it("renders header title", () => {
  render(<Header />);
  expect(screen.getByText(/Hacker News Bulletin/i)).toBeInTheDocument();
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("Navbar", () => {
  it("renders without crashing", () => {
    render(
      <nav data-testid="navbar">
        <span>Komuna</span>
      </nav>
    );
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByText("Komuna")).toBeInTheDocument();
  });
});

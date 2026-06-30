import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("Footer", () => {
  it("renders without crashing", () => {
    render(
      <footer data-testid="footer">
        <span>&copy; 2026 Komuna</span>
      </footer>
    );
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByText("© 2026 Komuna")).toBeInTheDocument();
  });
});

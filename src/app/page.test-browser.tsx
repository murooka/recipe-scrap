import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import Page from "./page";

test("shows Hello, world!", async () => {
  render(<Page />);

  expect(await screen.findByText("Hello, world!")).toBeInTheDocument();
});

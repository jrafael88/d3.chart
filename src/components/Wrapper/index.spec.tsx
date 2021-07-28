import React from "react";
import { render, screen } from "@testing-library/react";
import Wrapper from ".";

it("Renders Wrapper", () => {
  render(<Wrapper />);
  expect(screen.getByTestId("wrapper"));
});
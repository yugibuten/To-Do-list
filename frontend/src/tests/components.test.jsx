import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import FilterButtons from "../components/FilterButtons";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";


test("Header shows greeting and change button", () => {
  const handleChange = vi.fn();
  render(
    <Header
      stats={{ completion_rate: 0.5, completed: 2, pending: 2 }}
      greeting="Hi Sam"
      isTyping={false}
      name="Sam"
      onChangeName={handleChange}
    />
  );

  expect(screen.getByText("Hi Sam")).toBeInTheDocument();
  const changeButton = screen.getByRole("button", { name: /change/i });
  fireEvent.click(changeButton);
  expect(handleChange).toHaveBeenCalledTimes(1);
});

test("FilterButtons marks active filter", () => {
  render(<FilterButtons active="completed" onChange={() => {}} />);
  const completed = screen.getByRole("button", { name: /completed/i });
  expect(completed).toHaveAttribute("aria-pressed", "true");
});

test("SearchBar updates value", () => {
  const handleChange = vi.fn();
  render(<SearchBar value="" onChange={handleChange} />);
  const input = screen.getByLabelText(/search tasks/i);
  fireEvent.change(input, { target: { value: "alpha" } });
  expect(handleChange).toHaveBeenCalledWith("alpha");
});

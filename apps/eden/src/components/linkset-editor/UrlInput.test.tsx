import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import UrlInput from "./UrlInput";

// Mock the translation function to return the key itself for testing
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

type UrlInputHarnessProps = {
  initialValue?: string;
};


function UrlInputHarness({ initialValue = "" }: UrlInputHarnessProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <>
      <UrlInput
        value={value}
        onChange={setValue}
        onConfirmed={vi.fn()}
        enableUrlCheck
        useProxy={false}
      />
      <div data-testid="url-value">{value}</div>
    </>
  );
}

describe("UrlInput", () => {
  it("accepts a valid URL format and enables actions", () => {
    render(<UrlInputHarness />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "https://example.org/resource.json" } });

    expect(screen.getByText("urlInput.hint.validFormatWithCheck")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "urlInput.checkButton" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "urlInput.openButton" })).toBeEnabled();
  });

  it("accepts URL input without protocol using default https and enables actions", () => {
    render(<UrlInputHarness />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "example.com/resource" } });

    expect(screen.getByText("urlInput.hint.validFormatWithCheck")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "urlInput.checkButton" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "urlInput.openButton" })).toBeEnabled();
  });

  it("shows https as the default protocol in the selector", () => {
    render(<UrlInputHarness />);

    expect(screen.getByRole("combobox")).toHaveTextContent("https://");
  });

  it("keeps selected http protocol when user picks it before typing", () => {
    render(<UrlInputHarness />);

    const protocolSelector = screen.getByRole("combobox");
    fireEvent.mouseDown(protocolSelector);
    fireEvent.click(screen.getByRole("option", { name: "http://" }));

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "example.com/resource" } });

    expect(screen.getByRole("combobox")).toHaveTextContent("http://");
    expect(screen.getByTestId("url-value")).toHaveTextContent("http://example.com/resource");
  });

  it("keeps protocol when URL text is deleted and allows switching protocol", () => {
    render(<UrlInputHarness initialValue="https://example.com/resource" />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "" } });

    expect(screen.getByTestId("url-value")).toHaveTextContent("https://");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    fireEvent.keyDown(input, { key: "Backspace" });
    expect(screen.getByRole("option", { name: "https://" })).toHaveAttribute("aria-selected", "true");
    fireEvent.click(screen.getByRole("option", { name: "http://" }));

    expect(screen.getByTestId("url-value")).toHaveTextContent("http://");
    expect(screen.getByRole("combobox")).toHaveTextContent("http://");
  });

  it("opens protocol dropdown with arrow key when only protocol remains", () => {
    render(<UrlInputHarness initialValue="https://example.com/resource" />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.keyDown(input, { key: "ArrowDown" });

    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "https://" })).toHaveAttribute("aria-selected", "true");
  });
  
  it("marks an invalid URL format (invalid host) and keeps actions disabled", () => {
    render(<UrlInputHarness />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "exam ple.org/resource.json" } });

    expect(screen.getByText("urlInput.hint.invalidFormat")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "urlInput.checkButton" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "urlInput.openButton" })).toBeDisabled();
  });

  // TODO: test HEAD request, mocking fetch 
});
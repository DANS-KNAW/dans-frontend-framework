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
    <UrlInput
      value={value}
      onChange={setValue}
      onConfirmed={vi.fn()}
      enableUrlCheck
      useProxy={false}
    />
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

  it("marks an invalid URL format (missing protocol) and keeps actions disabled", () => {
    render(<UrlInputHarness />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "example.com/resource" } });

    expect(screen.getByText("urlInput.hint.invalidFormat")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "urlInput.checkButton" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "urlInput.openButton" })).toBeDisabled();
  });
  
  it("marks an invalid URL format (spaces in URL) and keeps actions disabled", () => {
    render(<UrlInputHarness />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "https://example.org/resource with spaces.json" } });

    expect(screen.getByText("urlInput.hint.invalidFormat")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "urlInput.checkButton" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "urlInput.openButton" })).toBeDisabled();
  });

  // TODO: test HEAD request, mocking fetch 
});
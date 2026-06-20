import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MediaTypeInput from "./MediaTypeInput";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      if (options && typeof options.label === "string") {
        return `${options.label} - well-known type`;
      }
      return key;
    },
  }),
}));

describe("MediaTypeInput", () => {
  it("confirms a valid known media type", async () => {
    const onConfirmed = vi.fn();
    const onChange = vi.fn();

    render(<MediaTypeInput onConfirmed={onConfirmed} onChange={onChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "application/json" } });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith("application/json");
    });

    await waitFor(() => {
      expect(onConfirmed).toHaveBeenCalledWith({
        major: "application",
        sub: "json",
        full: "application/json",
      });
    });

    expect(screen.getByText("application/json")).toBeInTheDocument();
  });

  it("keeps invalid media type input unconfirmed", async () => {
    const onConfirmed = vi.fn();
    const onChange = vi.fn();

    render(<MediaTypeInput onConfirmed={onConfirmed} onChange={onChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "application/@@@" } });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith("application/@@@");
    });

    expect(onConfirmed).not.toHaveBeenCalled();
    expect(screen.getByText("mediaTypeInput.hint.invalidChars")).toBeInTheDocument();
    expect(screen.queryByText("application/@@@")).not.toBeInTheDocument();
  });

  it("confirms an unknown but valid media type", async () => {
    const onConfirmed = vi.fn();
    const onChange = vi.fn();

    render(<MediaTypeInput onConfirmed={onConfirmed} onChange={onChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "application/x.custom+type" } });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith("application/x.custom+type");
    });

    await waitFor(() => {
      expect(onConfirmed).toHaveBeenCalledWith({
        major: "application",
        sub: "x.custom+type",
        full: "application/x.custom+type",
      });
    });

    expect(screen.getByText("mediaTypeInput.hint.unknownValid")).toBeInTheDocument();
    expect(screen.getByText("application/x.custom+type")).toBeInTheDocument();
  });
});

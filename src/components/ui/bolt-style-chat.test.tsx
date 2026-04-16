import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BoltStyleChat } from "./bolt-style-chat";

function mockFetchWithDocumentCount(totalDocuments = 0) {
  return jest.fn(async (input: RequestInfo | URL) => {
    const url = String(input);

    if (url.endsWith("/api/v1/documents")) {
      return {
        ok: true,
        json: async () => ({ total_documents: totalDocuments }),
      };
    }

    throw new Error(`Unhandled fetch: ${url}`);
  });
}

describe("BoltStyleChat", () => {
  beforeEach(() => {
    global.fetch = mockFetchWithDocumentCount(4) as typeof fetch;
  });

  afterEach(() => {
    cleanup();
    jest.resetAllMocks();
  });

  it("shows only working primary controls in the composer", () => {
    render(React.createElement(BoltStyleChat));

    expect(screen.queryByRole("button", { name: /plan/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /flan-t5-small/i })).not.toBeInTheDocument();
  });

  it("gives the main composer accessible labels", () => {
    render(React.createElement(BoltStyleChat));

    expect(
      screen.getByRole("textbox", { name: /ask a question about your documents/i }),
    ).toHaveAttribute("name", "question");
    expect(
      screen.getByRole("button", { name: /open document actions/i }),
    ).toBeInTheDocument();
  });

  it("describes the indexed count as documents", async () => {
    render(React.createElement(BoltStyleChat));

    await waitFor(() => {
      expect(screen.getByText("4")).toBeInTheDocument();
    });

    expect(screen.getByText(/documents/i)).toBeInTheDocument();
    expect(screen.queryByText(/chunks/i)).not.toBeInTheDocument();
  });

  it("announces validation feedback through a polite status region", async () => {
    const { container } = render(React.createElement(BoltStyleChat));
    const fileInput = container.querySelector('input[type="file"]');

    expect(fileInput).not.toBeNull();

    fireEvent.change(fileInput as HTMLInputElement, {
      target: {
        files: [new File(["bad"], "notes.txt", { type: "text/plain" })],
      },
    });

    const status = await screen.findByRole("status");

    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("Only PDF files are supported");
  });
});

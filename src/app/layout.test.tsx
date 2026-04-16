import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import RootLayout, { viewport } from "./layout";

describe("RootLayout", () => {
  it("sets dark-theme metadata", () => {
    expect(viewport.themeColor).toBe("#0f0f12");
  });

  it("renders the document with a dark color scheme", () => {
    const markup = renderToStaticMarkup(
      React.createElement(
        RootLayout,
        null,
        React.createElement("div", null, "Child"),
      ),
    );

    expect(markup).toContain('style="color-scheme:dark"');
  });
});

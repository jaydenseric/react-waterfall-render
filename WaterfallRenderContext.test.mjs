// @ts-check

import { strictEqual } from "assert";
import React from "react";
import ReactDOMServer from "react-dom/server";

import assertBundleSize from "./test/assertBundleSize.mjs";
import WaterfallRenderContext from "./WaterfallRenderContext.mjs";

/**
 * Adds `WaterfallRenderContext` tests.
 * @param {import("test-director").default} tests Test director.
 */
export default (tests) => {
  tests.add("`WaterfallRenderContext` bundle size.", async () => {
    await assertBundleSize(
      new URL("./WaterfallRenderContext.mjs", import.meta.url),
      150
    );
  });

  tests.add("`WaterfallRenderContext` used as a React context.", () => {
    let contextValue;

    const TestComponent = () => {
      contextValue = React.useContext(WaterfallRenderContext);
      return null;
    };

    const value = () => {};

    ReactDOMServer.renderToStaticMarkup(
      React.createElement(
        WaterfallRenderContext.Provider,
        { value },
        React.createElement(TestComponent)
      )
    );

    strictEqual(contextValue, value);
  });
};

import { strictEqual } from "assert";
import React from "react";
import ReactDOMServer from "react-dom/server.js";
import WaterfallRenderContext from "./WaterfallRenderContext.mjs";
import assertBundleSize from "./test/assertBundleSize.mjs";

export default (tests) => {
  tests.add("`WaterfallRenderContext` bundle size.", async () => {
    await assertBundleSize(
      new URL("./WaterfallRenderContext.mjs", import.meta.url),
      150
    );
  });

  tests.add("`WaterfallRenderContext` used as a React context.", () => {
    const TestComponent = () => React.useContext(WaterfallRenderContext);
    const contextValue = "abc";

    strictEqual(
      ReactDOMServer.renderToStaticMarkup(
        React.createElement(
          WaterfallRenderContext.Provider,
          { value: contextValue },
          React.createElement(TestComponent)
        )
      ),
      contextValue
    );
  });
};

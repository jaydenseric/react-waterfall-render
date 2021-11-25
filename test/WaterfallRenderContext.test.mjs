import { ok, strictEqual } from 'assert';
import React from 'react';
import ReactDOMServer from 'react-dom/server.js';
import WaterfallRenderContext from '../WaterfallRenderContext.mjs';
import getBundleSize from './getBundleSize.mjs';

export default (tests) => {
  tests.add('`WaterfallRenderContext` used as a React context.', () => {
    const TestComponent = () => React.useContext(WaterfallRenderContext);
    const contextValue = 'abc';

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

  tests.add('`WaterfallRenderContext` bundle size.', async () => {
    const kB = await getBundleSize(
      new URL('../WaterfallRenderContext.mjs', import.meta.url)
    );

    ok(kB < 0.5);
  });
};

import { strictEqual } from 'assert';
import { useContext } from 'react';
import { renderToStaticMarkup } from 'react-dom/server.js';
import { jsx } from 'react/jsx-runtime.js';
import WaterfallRenderContext from '../public/WaterfallRenderContext.js';

export default (tests) => {
  tests.add('`WaterfallRenderContext` used as a React context.', () => {
    const TestComponent = () => useContext(WaterfallRenderContext);
    const contextValue = 'abc';

    strictEqual(
      renderToStaticMarkup(
        jsx(WaterfallRenderContext.Provider, {
          value: contextValue,
          children: jsx(TestComponent, {}),
        })
      ),
      contextValue
    );
  });
};

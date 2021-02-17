'use strict';

const { strictEqual } = require('assert');
const { useContext } = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { jsx } = require('react/jsx-runtime');
const WaterfallRenderContext = require('../public/WaterfallRenderContext');

module.exports = (tests) => {
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

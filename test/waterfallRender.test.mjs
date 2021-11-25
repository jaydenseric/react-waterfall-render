import { deepStrictEqual, ok, rejects, strictEqual } from 'assert';
import React from 'react';
import ReactDOMServer from 'react-dom/server.js';
import WaterfallRenderContext from '../WaterfallRenderContext.mjs';
import waterfallRender from '../waterfallRender.mjs';
import getBundleSize from './getBundleSize.mjs';

const LOADING_DELAY_MS = 100;

export default (tests) => {
  tests.add('`waterfallRender` with argument 1 missing.', async () => {
    await rejects(
      waterfallRender(),
      new TypeError('Argument 1 must be a React node.')
    );
  });

  tests.add('`waterfallRender` with argument 2 not a function.', async () => {
    await rejects(
      waterfallRender(null, true),
      new TypeError('Argument 2 must be a function.')
    );
  });

  tests.add('`waterfallRender` with the React node a string.', async () => {
    const string = 'abc';

    strictEqual(
      await waterfallRender(string, ReactDOMServer.renderToStaticMarkup),
      string
    );
  });

  tests.add(
    '`waterfallRender` with the React node the value `undefined`.',
    async () => {
      strictEqual(
        await waterfallRender(undefined, ReactDOMServer.renderToStaticMarkup),
        ''
      );
    }
  );

  tests.add(
    '`waterfallRender` with the React node a React element.',
    async () => {
      const string = 'abc';
      const TestComponent = () => string;

      strictEqual(
        await waterfallRender(
          React.createElement(TestComponent),
          ReactDOMServer.renderToStaticMarkup
        ),
        string
      );
    }
  );

  tests.add(
    '`waterfallRender` with 1 waterfall step, declaring single loading cache promises.',
    async () => {
      const cache = [];
      const renderCacheHistory = [];

      const LoadingComponent = ({ cacheId }) => {
        const declareLoading = React.useContext(WaterfallRenderContext);

        if (!cache.includes(cacheId))
          declareLoading(
            new Promise((resolve) => {
              setTimeout(() => {
                cache.push(cacheId);
                resolve();
              }, LOADING_DELAY_MS);
            })
          );

        return null;
      };

      const TopComponent = () => {
        renderCacheHistory.push([...cache]);

        return React.createElement(
          React.Fragment,
          null,
          React.createElement(LoadingComponent, { cacheId: 'a' }),
          React.createElement(LoadingComponent, { cacheId: 'b' })
        );
      };

      const html = await waterfallRender(
        React.createElement(TopComponent),
        ReactDOMServer.renderToStaticMarkup
      );

      strictEqual(html, '');
      deepStrictEqual(renderCacheHistory, [[], ['a', 'b']]);
    }
  );

  tests.add(
    '`waterfallRender` with 1 waterfall step, declaring multiple loading cache promises.',
    async () => {
      const cache = [];
      const renderCacheHistory = [];

      const LoadingComponent = () => {
        const declareLoading = React.useContext(WaterfallRenderContext);
        const cacheIdsToLoad = [];

        for (const cacheId of ['a', 'b'])
          if (!cache.includes(cacheId)) cacheIdsToLoad.push(cacheId);

        if (cacheIdsToLoad.length)
          declareLoading(
            ...cacheIdsToLoad.map(
              (cacheId) =>
                new Promise((resolve) => {
                  setTimeout(() => {
                    cache.push(cacheId);
                    resolve();
                  }, LOADING_DELAY_MS);
                })
            )
          );

        return null;
      };

      const TopComponent = () => {
        renderCacheHistory.push([...cache]);

        return React.createElement(
          React.Fragment,
          null,
          React.createElement(LoadingComponent)
        );
      };

      const html = await waterfallRender(
        React.createElement(TopComponent),
        ReactDOMServer.renderToStaticMarkup
      );

      strictEqual(html, '');
      deepStrictEqual(renderCacheHistory, [[], ['a', 'b']]);
    }
  );

  tests.add('`waterfallRender` with 2 waterfall steps.', async () => {
    const cache = [];
    const renderCacheHistory = [];

    const LoadingComponent = ({ cacheId, children = null }) => {
      const declareLoading = React.useContext(WaterfallRenderContext);

      if (!cache.includes(cacheId)) {
        declareLoading(
          new Promise((resolve) => {
            setTimeout(() => {
              cache.push(cacheId);
              resolve();
            }, LOADING_DELAY_MS);
          })
        );

        return null;
      }

      return children;
    };

    const TopComponent = () => {
      renderCacheHistory.push([...cache]);

      return React.createElement(
        React.Fragment,
        null,
        React.createElement(
          LoadingComponent,
          { cacheId: 'a' },
          React.createElement(LoadingComponent, { cacheId: 'aa' })
        ),
        React.createElement(
          LoadingComponent,
          { cacheId: 'b' },
          React.createElement(LoadingComponent, { cacheId: 'ba' })
        )
      );
    };

    const html = await waterfallRender(
      React.createElement(TopComponent),
      ReactDOMServer.renderToStaticMarkup
    );

    strictEqual(html, '');
    deepStrictEqual(renderCacheHistory, [
      [],
      ['a', 'b'],
      ['a', 'b', 'aa', 'ba'],
    ]);
  });

  tests.add('`waterfallRender` bundle size.', async () => {
    const kB = await getBundleSize(
      new URL('../waterfallRender.mjs', import.meta.url)
    );

    ok(kB < 0.5);
  });
};

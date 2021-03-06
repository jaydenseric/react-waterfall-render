import { deepStrictEqual, rejects, strictEqual } from 'assert';
import { useContext } from 'react';
import { renderToStaticMarkup } from 'react-dom/server.js';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime.js';
import WaterfallRenderContext from '../public/WaterfallRenderContext.js';
import waterfallRender from '../public/waterfallRender.js';

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

    strictEqual(await waterfallRender(string, renderToStaticMarkup), string);
  });

  tests.add(
    '`waterfallRender` with the React node the value `undefined`.',
    async () => {
      strictEqual(await waterfallRender(undefined, renderToStaticMarkup), '');
    }
  );

  tests.add(
    '`waterfallRender` with the React node a React element.',
    async () => {
      const string = 'abc';
      const TestComponent = () => string;

      strictEqual(
        await waterfallRender(jsx(TestComponent, {}), renderToStaticMarkup),
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
        const declareLoading = useContext(WaterfallRenderContext);

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

        return jsxs(Fragment, {
          children: [
            jsx(LoadingComponent, { cacheId: 'a' }),
            jsx(LoadingComponent, { cacheId: 'b' }),
          ],
        });
      };

      const html = await waterfallRender(
        jsx(TopComponent, {}),
        renderToStaticMarkup
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
        const declareLoading = useContext(WaterfallRenderContext);
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

        return jsxs(Fragment, {
          children: [jsx(LoadingComponent, {})],
        });
      };

      const html = await waterfallRender(
        jsx(TopComponent, {}),
        renderToStaticMarkup
      );

      strictEqual(html, '');
      deepStrictEqual(renderCacheHistory, [[], ['a', 'b']]);
    }
  );

  tests.add('`waterfallRender` with 2 waterfall steps.', async () => {
    const cache = [];
    const renderCacheHistory = [];

    const LoadingComponent = ({ cacheId, children = null }) => {
      const declareLoading = useContext(WaterfallRenderContext);

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

      return jsxs(Fragment, {
        children: [
          jsx(LoadingComponent, {
            cacheId: 'a',
            children: jsx(LoadingComponent, {
              cacheId: 'aa',
            }),
          }),
          jsx(LoadingComponent, {
            cacheId: 'b',
            children: jsx(LoadingComponent, {
              cacheId: 'ba',
            }),
          }),
        ],
      });
    };

    const html = await waterfallRender(
      jsx(TopComponent, {}),
      renderToStaticMarkup
    );

    strictEqual(html, '');
    deepStrictEqual(renderCacheHistory, [
      [],
      ['a', 'b'],
      ['a', 'b', 'aa', 'ba'],
    ]);
  });
};

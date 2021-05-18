'use strict';

const { createContext } = require('react');

/**
 * [React context object](https://reactjs.org/docs/context#api) for making the
 * [declare loading function]{@link DeclareLoading} available within components
 * when rendering with [`waterfallRender`]{@link waterfallRender}.
 * @kind member
 * @name WaterfallRenderContext
 * @type {object}
 * @prop {Function} Provider [React context provider component](https://reactjs.org/docs/context#contextprovider).
 * @prop {Function} Consumer [React context consumer component](https://reactjs.org/docs/context#contextconsumer).
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import { WaterfallRenderContext } from 'react-waterfall-render';
 * ```
 *
 * ```js
 * import WaterfallRenderContext from 'react-waterfall-render/public/WaterfallRenderContext.js';
 * ```
 * @example <caption>Ways to `require`.</caption>
 * ```js
 * const { WaterfallRenderContext } = require('react-waterfall-render');
 * ```
 *
 * ```js
 * const WaterfallRenderContext = require('react-waterfall-render/public/WaterfallRenderContext.js');
 * ```
 * @example <caption>Use within a component with the [`useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext) React hook.</caption>
 * ```js
 * const { useContext } = require('react');
 * const { WaterfallRenderContext } = require('react-waterfall-render');
 * ```
 *
 * ```js
 * const declareLoading = useContext(WaterfallRenderContext);
 * ```
 */
const WaterfallRenderContext = createContext();

if (typeof process === 'object' && process.env.NODE_ENV !== 'production')
  WaterfallRenderContext.displayName = 'WaterfallRenderContext';

module.exports = WaterfallRenderContext;

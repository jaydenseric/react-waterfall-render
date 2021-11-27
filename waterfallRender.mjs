import React from "react";
import WaterfallRenderContext from "./WaterfallRenderContext.mjs";

/**
 * A [React](https://reactjs.org) virtual DOM node; anything that can be
 * rendered.
 * @kind typedef
 * @name ReactNode
 * @type {undefined|null|boolean|number|string|React.Element|Array<ReactNode>}
 */

/**
 * Resolves a [React node]{@link ReactNode} rendered with all data loaded
 * within cached.
 *
 * It repeatedly renders the [React node]{@link ReactNode} and awaits any
 * loading cache promises declared within (using the
 * [declare loading function]{@link DeclareLoading} via
 * [`WaterfallRenderContext`]{@link WaterfallRenderContext}), until no further
 * loading is declared; implying all data has loaded and is rendered from
 * cache.
 *
 * If server side rendering, afterwards the cache should be serialized for
 * hydration on the client prior to the initial client side render.
 *
 * Intended for use in a [Node.js](https://nodejs.org) environment for server
 * side rendering, but could potentially be used for preloading components in
 * modern browser environments that support async functions, etc.
 * @kind function
 * @name waterfallRender
 * @param {ReactNode} reactNode [React](https://reactjs.org) virtual DOM node.
 * @param {Function} render Synchronous [React](https://reactjs.org) render function, e.g. [`ReactDOMServer.renderToStaticMarkup`](https://reactjs.org/docs/react-dom-server.html#rendertostaticmarkup) (faster), or [`ReactDOMServer.renderToString`](https://reactjs.org/docs/react-dom-server.html#rendertostring) (slower).
 * @returns {Promise<*>} Resolves the final render result, typically a HTML string.
 * @example <caption>How to import.</caption>
 * ```js
 * import waterfallRender from "react-waterfall-render/waterfallRender.mjs";
 * ```
 * @example <caption>How to server side render a [React](https://reactjs.org) app in [Node.js](https://nodejs.org).</caption>
 * ```jsx
 * import ReactDOMServer from "react-dom/server.js";
 * import waterfallRender from "react-waterfall-render/waterfallRender.mjs";
 * import App from "./components/App.mjs";
 *
 * waterfallRender(<App />, ReactDOMServer.renderToStaticMarkup).then((html) => {
 *   // Do something with the HTML string…
 * });
 * ```
 */
export default async function waterfallRender(reactNode, render) {
  // Check argument 1 exists, allowing an `undefined` value as that is a valid
  // React node.
  if (!arguments.length)
    throw new TypeError("Argument 1 `reactNode` must be a React node.");

  if (typeof render !== "function")
    throw new TypeError("Argument 2 `render` must be a function.");

  /**
   * Repeatedly renders and awaits declared loading cache promises, until no
   * further loading is declared.
   * @kind function
   * @name waterfallRender~recurseWaterfallRender
   * @returns {Promise<string>} Resolves the final rendered HTML string.
   * @ignore
   */
  async function recurseWaterfallRender() {
    // Tracks loading data promises for this render pass.
    const loadingPromises = [];

    /**
     * Declares loading cache promises.
     * @kind function
     * @name waterfallRender~recurseWaterfallRender~declareLoading
     * @type {DeclareLoading}
     * @ignore
     */
    function declareLoading(...promises) {
      loadingPromises.push(...promises);
    }

    const renderResult = render(
      React.createElement(
        WaterfallRenderContext.Provider,
        { value: declareLoading },
        reactNode
      )
    );

    if (loadingPromises.length) {
      await Promise.all(loadingPromises);
      return recurseWaterfallRender();
    } else return renderResult;
  }

  return recurseWaterfallRender();
}

// @ts-check

import React from "react";

import WaterfallRenderContext from "./WaterfallRenderContext.mjs";

/**
 * Resolves a {@link React.ReactNode React node} rendered with all data loaded
 * within cached; typically a HTML string.
 *
 * It repeatedly renders the {@link React.ReactNode React node} and awaits any
 * loading cache promises declared within (using the
 * {@link DeclareLoading declare loading function} via
 * {@linkcode WaterfallRenderContext}, until no further loading is declared;
 * implying all data has loaded and is rendered from cache.
 *
 * If server side rendering, afterwards the cache should be serialized for
 * hydration on the client prior to the initial client side render.
 *
 * Intended for use in a server environment environment for server side
 * rendering, but could potentially be used for preloading components in modern
 * browser environments that support async functions, etc.
 * @param {React.ReactNode} reactNode React node to render.
 * @param {Function} render Synchronous React render function, e.g.
 *   [`ReactDOMServer.renderToStaticMarkup`](https://reactjs.org/docs/react-dom-server.html#rendertostaticmarkup)
 *   (faster), or
 *   [`ReactDOMServer.renderToString`](https://reactjs.org/docs/react-dom-server.html#rendertostring)
 *   (slower).
 * @returns {Promise<unknown>} Resolves the final render result, typically a
 *   HTML string.
 * @example
 * Server side rendering a React app.
 *
 * ```jsx
 * import ReactDOMServer from "react-dom/server";
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
   * @returns {Promise<unknown>} Resolves the final rendered HTML string.
   */
  async function recurseWaterfallRender() {
    // Tracks loading data promises for this render pass.
    /** @type {Array<Promise<any>>} */
    const loadingPromises = [];

    /**
     * Declares loading cache promises.
     * @type {DeclareLoading}
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

/**
 * Declares loading cache promises to {@linkcode waterfallRender}. Available
 * within React components via {@linkcode WaterfallRenderContext}.
 * @callback DeclareLoading
 * @param {...Promise<any>} promises Promises that resolve once loading data has
 *   been cached. The values resolved don’t matter. Multiple arguments can be
 *   used, similar to how
 *   [`Array.push`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)
 *   works.
 * @returns {void}
 * @example
 * Loading data in a React component within a server and client side rendered app.
 *
 * ```jsx
 * import React from "react";
 * import WaterfallRenderContext from "react-waterfall-render/WaterfallRenderContext.mjs";
 * import useUserProfileData from "../hooks/useUserProfileData.mjs";
 * import UserProfile from "./UserProfile.mjs";
 *
 * export default function UserPage({ userId }) {
 *   const declareLoading = React.useContext(WaterfallRenderContext);
 *   const { load, loading, cache } = useUserProfileData(userId);
 *
 *   // For this example, assume loading errors are cached.
 *   if (cache) return <UserProfile data={cache} />;
 *
 *   if (!loading) {
 *     const userDataPromise = load();
 *
 *     // Only present when the app is server side rendered using the function
 *     // `waterfallRender`.
 *     if (declareLoading) {
 *       declareLoading(userDataPromise);
 *
 *       // This render is on the server and will be discarded anyway for a
 *       // re-render once the declared loading promises resolve, so it’s
 *       // slightly more efficient to render nothing; particularly if the
 *       // loading state is expensive to render.
 *       return null;
 *     }
 *   }
 *
 *   return "Loading…";
 * }
 * ```
 */

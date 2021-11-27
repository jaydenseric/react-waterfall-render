import React from "react";

/**
 * Declares loading cache promises to
 * [`waterfallRender`]{@link waterfallRender}. Available within
 * [React](https://reactjs.org) components via
 * [`WaterfallRenderContext`]{@link WaterfallRenderContext}.
 * @kind typedef
 * @name DeclareLoading
 * @type {Function}
 * @param {...Promise<*>} promises Promises that resolve once loading data has been cached. The values resolved don’t matter. Multiple arguments can be used, similar to how [`Array.push`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) works.
 * @example <caption>Loading data in a [React](https://reactjs.org) component within a server and client side rendered app.</caption>
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

/**
 * [React context object](https://reactjs.org/docs/context#api) for making the
 * [declare loading function]{@link DeclareLoading} available within components
 * when rendering with [`waterfallRender`]{@link waterfallRender}.
 * @kind member
 * @name WaterfallRenderContext
 * @type {object}
 * @prop {Function} Provider [React context provider component](https://reactjs.org/docs/context#contextprovider).
 * @prop {Function} Consumer [React context consumer component](https://reactjs.org/docs/context#contextconsumer).
 * @example <caption>How to import.</caption>
 * ```js
 * import WaterfallRenderContext from "react-waterfall-render/WaterfallRenderContext.mjs";
 * ```
 * @example <caption>Use within a component with the [`useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext) [React](https://reactjs.org) hook.</caption>
 * ```js
 * import React from "react";
 * import WaterfallRenderContext from "react-waterfall-render/WaterfallRenderContext.mjs";
 * ```
 *
 * ```js
 * const declareLoading = React.useContext(WaterfallRenderContext);
 * ```
 */
const WaterfallRenderContext = React.createContext();

WaterfallRenderContext.displayName = "WaterfallRenderContext";

export default WaterfallRenderContext;

'use strict';

exports.waterfallRender = require('./waterfallRender.js');
exports.WaterfallRenderContext = require('./WaterfallRenderContext.js');

/**
 * A [React](https://reactjs.org) virtual DOM node; anything that can be
 * rendered.
 * @kind typedef
 * @name ReactNode
 * @type {undefined|null|boolean|number|string|React.Element|Array<ReactNode>}
 */

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
 * import React from 'react';
 * import WaterfallRenderContext from 'react-waterfall-render/public/WaterfallRenderContext.js';
 * import useUserProfileData from '../hooks/useUserProfileData.mjs';
 * import UserProfile from './UserProfile.mjs';
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
 *   return 'Loading…';
 * }
 * ```
 */

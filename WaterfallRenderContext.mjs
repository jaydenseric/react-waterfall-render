// @ts-check

import React from "react";

/** @typedef {import("./waterfallRender.mjs").DeclareLoading} DeclareLoading */
/** @typedef {import("./waterfallRender.mjs").default} waterfallRender */

/**
 * [React context](https://reactjs.org/docs/context.html) for making the
 * {@link DeclareLoading declare loading function} available within components
 * when rendering with {@linkcode waterfallRender}.
 * @type {React.Context<DeclareLoading | undefined>}
 * @example
 * Use within a component with the React hook
 * [`useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext).
 *
 * ```js
 * import React from "react";
 * import WaterfallRenderContext from "react-waterfall-render/WaterfallRenderContext.mjs";
 * ```
 *
 * ```js
 * const declareLoading = React.useContext(WaterfallRenderContext);
 * ```
 */
const WaterfallRenderContext = React.createContext(
  /** @type {DeclareLoading | undefined} */ (undefined)
);

WaterfallRenderContext.displayName = "WaterfallRenderContext";

export default WaterfallRenderContext;

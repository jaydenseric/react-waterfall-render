# react-waterfall-render

[![npm version](https://badgen.net/npm/v/react-waterfall-render)](https://npm.im/react-waterfall-render) [![CI status](https://github.com/jaydenseric/react-waterfall-render/workflows/CI/badge.svg)](https://github.com/jaydenseric/react-waterfall-render/actions)

Renders nested [React](https://reactjs.org) components with asynchronous cached loading.

Useful for [GraphQL](https://graphql.org) clients (e.g. [`graphql-react`](https://npm.im/graphql-react)) and server side rendering.

## Installation

To install with [npm](https://npmjs.com/get-npm), run:

```sh
npm install react-waterfall-render
```

Use the [`WaterfallRenderContext`](#exports-WaterfallRenderContext.mjs-export-default) in [React](https://reactjs.org) components to declare asynchronous cached loading, and use the function [`waterfallRender`](#exports-waterfallRender.mjs-export-default) to server side render your [React](https://reactjs.org) app in a fully loaded state.

## Requirements

- [Node.js](https://nodejs.org): `^12.22.0 || ^14.17.0 || >= 16.0.0`
- [Browsers](https://npm.im/browserslist): `> 0.5%, not OperaMini all, not IE > 0, not dead`

## Exports

These ECMAScript modules are published to [npm](https://npmjs.com) and exported via the [`package.json`](./package.json) `exports` field:

- [`waterfallRender.mjs`](#exports-waterfallRender.mjs)
- [`WaterfallRenderContext.mjs`](#exports-WaterfallRenderContext.mjs)

### <span id="exports-waterfallRender.mjs">[`waterfallRender.mjs`](./waterfallRender.mjs)</span>

#### <span id="exports-waterfallRender.mjs-export-default">Export `default`</span>

Function `waterfallRender` — Resolves a React node rendered with all data loaded within cached; typically a HTML string.

It repeatedly renders the React node and awaits any loading cache promises declared within (using the [declare loading function](#exports-waterfallRender.mjs-type-DeclareLoading) via [`WaterfallRenderContext`](#exports-WaterfallRenderContext.mjs-export-default), until no further loading is declared; implying all data has loaded and is rendered from cache.

If server side rendering, afterwards the cache should be serialized for hydration on the client prior to the initial client side render.

Intended for use in a server environment environment for server side rendering, but could potentially be used for preloading components in modern browser environments that support async functions, etc.

##### <span id="exports-waterfallRender.mjs-export-default-parameters">Parameters</span>

1. `reactNode`: `React.ReactNode` — React node to render.
2. `render`: `Function` — Synchronous React render function, e.g. [`ReactDOMServer.renderToStaticMarkup`](https://reactjs.org/docs/react-dom-server.html#rendertostaticmarkup) (faster), or [`ReactDOMServer.renderToString`](https://reactjs.org/docs/react-dom-server.html#rendertostring) (slower).

##### <span id="exports-waterfallRender.mjs-export-default-returns">Returns</span>

`Promise<unknown>` — Resolves the final render result, typically a HTML string.

#### <span id="exports-waterfallRender.mjs-type-DeclareLoading">Type `DeclareLoading`</span>

Function — Declares loading cache promises to [`waterfallRender`](#exports-waterfallRender.mjs-export-default). Available within React components via [`WaterfallRenderContext`](#exports-WaterfallRenderContext.mjs-export-default).

##### <span id="exports-waterfallRender.mjs-type-DeclareLoading-parameters">Parameters</span>

1. `...promises`: `Promise<any>` — Promises that resolve once loading data has been cached. The values resolved don’t matter. Multiple arguments can be used, similar to how [`Array.push`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) works.

##### <span id="exports-waterfallRender.mjs-type-DeclareLoading-returns">Returns</span>

`void`

##### <span id="exports-waterfallRender.mjs-type-DeclareLoading-example-1">Example 1</span>

Loading data in a React component within a server and client side rendered app.

```jsx
import React from "react";
import WaterfallRenderContext from "react-waterfall-render/WaterfallRenderContext.mjs";
import useUserProfileData from "../hooks/useUserProfileData.mjs";
import UserProfile from "./UserProfile.mjs";

export default function UserPage({ userId }) {
  const declareLoading = React.useContext(WaterfallRenderContext);
  const { load, loading, cache } = useUserProfileData(userId);

  // For this example, assume loading errors are cached.
  if (cache) return <UserProfile data={cache} />;

  if (!loading) {
    const userDataPromise = load();

    // Only present when the app is server side rendered using the function
    // `waterfallRender`.
    if (declareLoading) {
      declareLoading(userDataPromise);

      // This render is on the server and will be discarded anyway for a
      // re-render once the declared loading promises resolve, so it’s
      // slightly more efficient to render nothing; particularly if the
      // loading state is expensive to render.
      return null;
    }
  }

  return "Loading…";
}
```

### <span id="exports-WaterfallRenderContext.mjs">[`WaterfallRenderContext.mjs`](./WaterfallRenderContext.mjs)</span>

#### <span id="exports-WaterfallRenderContext.mjs-export-default">Export `default`</span>

`React.Context`<[`DeclareLoading`](#exports-waterfallRender.mjs-type-DeclareLoading) | `undefined`> — The `WaterfallRenderContext` [React context](https://reactjs.org/docs/context.html) for making the [declare loading function](#exports-waterfallRender.mjs-type-DeclareLoading) available within components when rendering with [`waterfallRender`](#exports-waterfallRender.mjs-export-default).

##### <span id="exports-WaterfallRenderContext.mjs-export-default-example-1">Example 1</span>

Use within a component with the React hook [`useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext).

```js
import React from "react";
import WaterfallRenderContext from "react-waterfall-render/WaterfallRenderContext.mjs";
```

```js
const declareLoading = React.useContext(WaterfallRenderContext);
```

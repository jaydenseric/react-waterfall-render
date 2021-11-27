# react-waterfall-render

[![npm version](https://badgen.net/npm/v/react-waterfall-render)](https://npm.im/react-waterfall-render) [![CI status](https://github.com/jaydenseric/react-waterfall-render/workflows/CI/badge.svg)](https://github.com/jaydenseric/react-waterfall-render/actions)

Renders nested [React](https://reactjs.org) components with asynchronous cached loading.

Useful for [GraphQL](https://graphql.org) clients (e.g. [`graphql-react`](https://npm.im/graphql-react)) and server side rendering.

## Installation

To install with [npm](https://npmjs.com/get-npm), run:

```sh
npm install react-waterfall-render
```

Use the [`WaterfallRenderContext`](#member-waterfallrendercontext) in [React](https://reactjs.org) components to declare asynchronous cached loading, and use the function [`waterfallRender`](#function-waterfallrender) to server side render your [React](https://reactjs.org) app in a fully loaded state.

## Requirements

- [Node.js](https://nodejs.org): `^12.22.0 || ^14.17.0 || >= 16.0.0`
- [Browsers](https://npm.im/browserslist): `> 0.5%, not OperaMini all, not IE > 0, not dead`

## API

- [function waterfallRender](#function-waterfallrender)
- [member WaterfallRenderContext](#member-waterfallrendercontext)
- [type DeclareLoading](#type-declareloading)
- [type ReactNode](#type-reactnode)

### function waterfallRender

Resolves a [React node](#type-reactnode) rendered with all data loaded within cached.

It repeatedly renders the [React node](#type-reactnode) and awaits any loading cache promises declared within (using the [declare loading function](#type-declareloading) via [`WaterfallRenderContext`](#member-waterfallrendercontext)), until no further loading is declared; implying all data has loaded and is rendered from cache.

If server side rendering, afterwards the cache should be serialized for hydration on the client prior to the initial client side render.

Intended for use in a [Node.js](https://nodejs.org) environment for server side rendering, but could potentially be used for preloading components in modern browser environments that support async functions, etc.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `reactNode` | [ReactNode](#type-reactnode) | [React](https://reactjs.org) virtual DOM node. |
| `render` | Function | Synchronous [React](https://reactjs.org) render function, e.g. [`ReactDOMServer.renderToStaticMarkup`](https://reactjs.org/docs/react-dom-server.html#rendertostaticmarkup) (faster), or [`ReactDOMServer.renderToString`](https://reactjs.org/docs/react-dom-server.html#rendertostring) (slower). |

**Returns:** Promise<\*> — Resolves the final render result, typically a HTML string.

#### Examples

_How to import._

> ```js
> import waterfallRender from "react-waterfall-render/waterfallRender.mjs";
> ```

_How to server side render a [React](https://reactjs.org) app in [Node.js](https://nodejs.org)._

> ```jsx
> import ReactDOMServer from "react-dom/server.js";
> import waterfallRender from "react-waterfall-render/waterfallRender.mjs";
> import App from "./components/App.mjs";
>
> waterfallRender(<App />, ReactDOMServer.renderToStaticMarkup).then((html) => {
>   // Do something with the HTML string…
> });
> ```

---

### member WaterfallRenderContext

[React context object](https://reactjs.org/docs/context#api) for making the [declare loading function](#type-declareloading) available within components when rendering with [`waterfallRender`](#function-waterfallrender).

**Type:** object

| Property | Type | Description |
| :-- | :-- | :-- |
| `Provider` | Function | [React context provider component](https://reactjs.org/docs/context#contextprovider). |
| `Consumer` | Function | [React context consumer component](https://reactjs.org/docs/context#contextconsumer). |

#### Examples

_How to import._

> ```js
> import WaterfallRenderContext from "react-waterfall-render/WaterfallRenderContext.mjs";
> ```

_Use within a component with the [`useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext) [React](https://reactjs.org) hook._

> ```js
> import React from "react";
> import WaterfallRenderContext from "react-waterfall-render/WaterfallRenderContext.mjs";
> ```
>
> ```js
> const declareLoading = React.useContext(WaterfallRenderContext);
> ```

---

### type DeclareLoading

Declares loading cache promises to [`waterfallRender`](#function-waterfallrender). Available within [React](https://reactjs.org) components via [`WaterfallRenderContext`](#member-waterfallrendercontext).

**Type:** Function

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `promises` | …Promise<\*> | Promises that resolve once loading data has been cached. The values resolved don’t matter. Multiple arguments can be used, similar to how [`Array.push`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) works. |

#### Examples

_Loading data in a [React](https://reactjs.org) component within a server and client side rendered app._

> ```jsx
> import React from "react";
> import WaterfallRenderContext from "react-waterfall-render/WaterfallRenderContext.mjs";
> import useUserProfileData from "../hooks/useUserProfileData.mjs";
> import UserProfile from "./UserProfile.mjs";
>
> export default function UserPage({ userId }) {
>   const declareLoading = React.useContext(WaterfallRenderContext);
>   const { load, loading, cache } = useUserProfileData(userId);
>
>   // For this example, assume loading errors are cached.
>   if (cache) return <UserProfile data={cache} />;
>
>   if (!loading) {
>     const userDataPromise = load();
>
>     // Only present when the app is server side rendered using the function
>     // `waterfallRender`.
>     if (declareLoading) {
>       declareLoading(userDataPromise);
>
>       // This render is on the server and will be discarded anyway for a
>       // re-render once the declared loading promises resolve, so it’s
>       // slightly more efficient to render nothing; particularly if the
>       // loading state is expensive to render.
>       return null;
>     }
>   }
>
>   return "Loading…";
> }
> ```

---

### type ReactNode

A [React](https://reactjs.org) virtual DOM node; anything that can be rendered.

**Type:** `undefined` | `null` | boolean | number | string | React.Element | Array<[ReactNode](#type-reactnode)>

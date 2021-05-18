# react-waterfall-render

[![npm version](https://badgen.net/npm/v/react-waterfall-render)](https://npm.im/react-waterfall-render) [![CI status](https://github.com/jaydenseric/react-waterfall-render/workflows/CI/badge.svg)](https://github.com/jaydenseric/react-waterfall-render/actions)

Renders nested [React](https://reactjs.org) components with asynchronous cached loading.

Useful for GraphQL clients (e.g. [`graphql-react`](https://npm.im/graphql-react)) and server side rendering.

## Setup

To install with [npm](https://npmjs.com/get-npm), run:

```shell
npm install react-waterfall-render
```

Use the [`WaterfallRenderContext`](#member-waterfallrendercontext) in React components to declare asynchronous cached loading, and use the function [`waterfallRender`](#function-waterfallrender) to server side render your React app in a fully loaded state.

## Support

- [Node.js](https://nodejs.org): `^12.20 || >= 14.13`
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
| `reactNode` | [ReactNode](#type-reactnode) | React virtual DOM node. |
| `render` | Function | Synchronous React render function, e.g. [`ReactDOMServer.renderToStaticMarkup`](https://reactjs.org/docs/react-dom-server.html#rendertostaticmarkup) (faster), or [`ReactDOMServer.renderToString`](https://reactjs.org/docs/react-dom-server.html#rendertostring) (slower). |

**Returns:** Promise<\*> — Resolves the final render result, typically a HTML string.

#### Examples

_Ways to `import`._

> ```js
> import { waterfallRender } from 'react-waterfall-render';
> ```
>
> ```js
> import waterfallRender from 'react-waterfall-render/public/waterfallRender.js';
> ```

_Ways to `require`._

> ```js
> const { waterfallRender } = require('react-waterfall-render');
> ```
>
> ```js
> const waterfallRender = require('react-waterfall-render/public/waterfallRender.js');
> ```

_How to server side render a React app in [Node.js](https://nodejs.org)._

> ```jsx
> const { renderToStaticMarkup } = require('react-dom/server');
> const { waterfallRender } = require('react-waterfall-render');
> const App = require('./components/App');
>
> waterfallRender(<App />, renderToStaticMarkup).then((html) => {
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

_Ways to `import`._

> ```js
> import { WaterfallRenderContext } from 'react-waterfall-render';
> ```
>
> ```js
> import WaterfallRenderContext from 'react-waterfall-render/public/WaterfallRenderContext.js';
> ```

_Ways to `require`._

> ```js
> const { WaterfallRenderContext } = require('react-waterfall-render');
> ```
>
> ```js
> const WaterfallRenderContext = require('react-waterfall-render/public/WaterfallRenderContext.js');
> ```

_Use within a component with the [`useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext) React hook._

> ```js
> const { useContext } = require('react');
> const { WaterfallRenderContext } = require('react-waterfall-render');
> ```
>
> ```js
> const declareLoading = useContext(WaterfallRenderContext);
> ```

---

### type DeclareLoading

Declares loading cache promises to [`waterfallRender`](#function-waterfallrender). Available within React components via [`WaterfallRenderContext`](#member-waterfallrendercontext).

**Type:** Function

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `promises` | …Promise<\*> | Promises that resolve once loading data has been cached. The values resolved don’t matter. Multiple arguments can be used, similar to how [`Array.push`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) works. |

#### Examples

_Loading data in a React component within a server and client side rendered app._

> ```jsx
> const { useContext } = require('react');
> const { WaterfallRenderContext } = require('react-waterfall-render');
> const useUserProfileData = require('../hooks/useUserProfileData');
> const UserProfile = require('./UserProfile');
>
> module.exports = function UserPage({ userId }) {
>   const declareLoading = useContext(WaterfallRenderContext);
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
>   return 'Loading…';
> };
> ```

---

### type ReactNode

A React virtual DOM node; anything that can be rendered.

**Type:** `undefined` | `null` | boolean | number | string | React.Element | Array<[ReactNode](#type-reactnode)>

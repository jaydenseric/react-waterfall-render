# react-waterfall-render

Renders nested [React](https://reactjs.org) components with asynchronous cached loading.

Useful for [GraphQL](https://graphql.org) clients (e.g. [`graphql-react`](https://npm.im/graphql-react)) and server side rendering.

## Installation

For [Node.js](https://nodejs.org), to install [`react-waterfall-render`](https://npm.im/react-waterfall-render) and its [`react`](https://npm.im/react) peer dependency with [npm](https://npmjs.com/get-npm), run:

```sh
npm install react-waterfall-render react
```

For [Deno](https://deno.land) and browsers, an example import map (realistically use 4 import maps, with optimal URLs for server vs client and development vs production):

```json
{
  "imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react-waterfall-render/": "https://unpkg.com/react-waterfall-render@5.0.0/"
  }
}
```

Use the [`WaterfallRenderContext`](./WaterfallRenderContext.mjs) in [React](https://reactjs.org) components to declare asynchronous cached loading, and use the function [`waterfallRender`](./waterfallRender.mjs) to server side render your [React](https://reactjs.org) app in a fully loaded state.

## Requirements

Supported runtime environments:

- [Node.js](https://nodejs.org) versions `^14.17.0 || ^16.0.0 || >= 18.0.0`.
- [Deno](https://deno.land), importing from a CDN that might require an import map for dependencies.
- Browsers matching the [Browserslist](https://npm.im/browserslist) query `> 0.5%, not OperaMini all, not dead`.

Non [Deno](https://deno.land) projects must configure [TypeScript](https://typescriptlang.org) to use types from the ECMAScript modules that have a `// @ts-check` comment:

- [`compilerOptions.allowJs`](https://typescriptlang.org/tsconfig#allowJs) should be `true`.
- [`compilerOptions.maxNodeModuleJsDepth`](https://typescriptlang.org/tsconfig#maxNodeModuleJsDepth) should be reasonably large, e.g. `10`.
- [`compilerOptions.module`](https://typescriptlang.org/tsconfig#module) should be `"node16"` or `"nodenext"`.

## Exports

The [npm](https://npmjs.com) package [`react-waterfall-render`](https://npm.im/react-waterfall-render) features [optimal JavaScript module design](https://jaydenseric.com/blog/optimal-javascript-module-design). It doesn’t have a main index module, so use deep imports from the ECMAScript modules that are exported via the [`package.json`](./package.json) field [`exports`](https://nodejs.org/api/packages.html#exports):

- [`waterfallRender.mjs`](./waterfallRender.mjs)
- [`WaterfallRenderContext.mjs`](./WaterfallRenderContext.mjs)

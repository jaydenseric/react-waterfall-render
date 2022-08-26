# react-waterfall-render changelog

## Next

### Major

- Updated Node.js support to `^14.17.0 || ^16.0.0 || >= 18.0.0`.
- Updated dev dependencies, some of which require newer Node.js versions than previously supported.
- Use the `node:` URL scheme for Node.js builtin module imports in tests.

### Patch

- Corrected the v4.0.1 changelog entry.

## 4.0.1

### Patch

- Updated the [`react`](https://npm.im/react) peer dependency to `16.14 - 18`.
- Updated dev dependencies.
- Simplified dev dependencies and config for ESLint.
- Removed the now redundant `not IE > 0` from the Browserslist query.
- Updated `jsconfig.json`:
  - Set `compilerOptions.maxNodeModuleJsDepth` to `10`.
  - Set `compilerOptions.module` to `nodenext`.
- Updated `react-dom/server` imports in tests and JSDoc code examples to suit React v18.
- Updated the ESLint config.
- Updated GitHub Actions CI config.
- Revamped the readme:
  - Removed the badges.
  - Removed the detailed API docs. The JSDoc comments and TypeScript types in the exported modules are now the primary documentation.
  - Added information about Deno, import maps, TypeScript config, and [optimal JavaScript module design](https://jaydenseric.com/blog/optimal-javascript-module-design).

## 4.0.0

### Major

- Implemented TypeScript types via JSDoc comments.

### Patch

- Updated dev dependencies.
- Removed the [`jsdoc-md`](https://npm.im/jsdoc-md) dev dependency and the package `docs-update` and `docs-check` scripts, replacing the readme “API” section with a manually written “Exports” section.
- Check TypeScript types via a new package `types` script.

## 3.0.0

### Major

- Updated Node.js support to `^12.22.0 || ^14.17.0 || >= 16.0.0`.
- Updated dev dependencies, some of which require newer Node.js versions than previously supported.
- Public modules are now individually listed in the package `files` and `exports` fields.
- Removed `./package` from the package `exports` field; the full `package.json` filename must be used in a `require` path.
- Removed the package main index module; deep imports must be used.
- Shortened public module deep import paths, removing the `/public/`.
- The API is now ESM in `.mjs` files instead of CJS in `.js` files, [accessible via `import` but not `require`](https://nodejs.org/dist/latest/docs/api/esm.html#require).
- Now uses `React.createElement` instead of the [the new React JSX runtime](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).

### Patch

- Also run GitHub Actions CI with Node.js v17.
- Simplified package scripts.
- Avoid named imports from [`react`](https://npm.im/react) and [`react-dom`](https://npm.im/react-dom) as they’re not proper Node.js ESM.
- Removed conditionality on the Node.js global `process.env.NODE_ENV`.
- Error messages are now more detailed.
- Reorganized the test file structure.
- Renamed imports in the test index module.
- Test the bundle sizes for public modules individually.
- Use a new `assertBundleSize` function to assert module bundle size in tests:
  - Failure message contains details about the bundle size and how much the limit was exceeded.
  - Errors when the surplus is greater than 25% of the limit, suggesting the limit should be reduced.
  - Resolves the minified bundle and its gzipped size for debugging in tests.
- Configured Prettier option `singleQuote` to the default, `false`.
- Documentation tweaks.
- Amended the changelog entry for v2.0.0.

## 2.0.0

### Major

- Updated Node.js support to `^12.20 || >= 14.13`.
- Updated browser support to the Browserslist query `> 0.5%, not OperaMini all, not IE > 0, not dead`.
- Updated dev dependencies, some of which require newer Node.js versions than were previously supported.
- Replaced the the `package.json` `exports` field public [subpath folder mapping](https://nodejs.org/api/packages.html#packages_subpath_folder_mappings) (deprecated by Node.js) with a [subpath pattern](https://nodejs.org/api/packages.html#packages_subpath_patterns). Deep `require` paths within `react-waterfall-render/public/` must now include the `.js` file extension.
- The tests are now ESM in `.mjs` files instead of CJS in `.js` files.

### Patch

- Updated GitHub Actions CI config to run tests with Node.js v12, v14, v16.
- Simplified JSDoc related package scripts now that [`jsdoc-md`](https://npm.im/jsdoc-md) v10+ automatically generates a Prettier formatted readme.
- Added a package `test:jsdoc` script that checks the readme API docs are up to date with the source JSDoc.
- Moved the bundle test into its own file.
- Test the bundle size using [`esbuild`](https://npm.im/esbuild) instead of [`webpack`](https://npm.im/webpack) and [`disposable-directory`](https://npm.im/disposable-directory).
- Use the `.js` file extension in internal `require` paths.
- Converted code examples from CJS to ESM, using deep imports.
- Fixed a code example comment typo.
- Documentation tweaks.
- The file `changelog.md` is no longer published.

## 1.0.0

Initial release.

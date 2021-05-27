# react-waterfall-render changelog

## Next

### Patch

- Updated dev dependencies.

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

## 1.0.0

Initial release.

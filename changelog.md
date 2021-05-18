# react-waterfall-render changelog

## Next

### Major

- Updated Node.js support to `^12.20 || >= 14.13`.
- Updated browser support to the Browserslist query `> 0.5%, not OperaMini all, not IE > 0, not dead`.
- Updated dev dependencies, some of which require newer Node.js versions than were previously supported.
- The tests are now ESM in `.mjs` files instead of CJS in `.js` files.

### Patch

- Updated GitHub Actions CI config to run tests with Node.js v12, v14, v16.
- Simplified JSDoc related package scripts now that [`jsdoc-md`](https://npm.im/jsdoc-md) v10+ automatically generates a Prettier formatted readme.
- Added a package `test:jsdoc` script that checks the readme API docs are up to date with the source JSDoc.
- Moved the bundle test into its own file.
- Code example typo and lint fixes.

## 1.0.0

Initial release.

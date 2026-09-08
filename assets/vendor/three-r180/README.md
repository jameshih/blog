# Three.js r180 (0.180.0)

Vendored from https://github.com/mrdoob/three.js/tree/0af9729d0c143a86a1d725d6e2c3ad83301f3f34 (tag r180).

`three.module.min.js` and its `three.core.min.js` dependency are the upstream builds. `STLLoader.js` and `OrbitControls.js` are upstream source with only their bare `three` import rewritten to `./three.module.min.js`, so they run on GitHub Pages without an import map or CDN. `LICENSE` is the upstream MIT license. `manifest.json` records source URLs and both upstream and vendored SHA-256 hashes. `package.json` lets the Node regression test import the same browser modules.

To update: select a specific release commit, copy these five upstream files, apply the two import rewrites, regenerate hashes, and run the asset and browser checks in `test/README.md`. Keep the core, loader and controls on one version.

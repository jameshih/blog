# Lucide 0.468.0

The five SVG files are unmodified official assets from [Lucide 0.468.0](https://github.com/lucide-icons/lucide/tree/f12b0de177fbc2a6795e99be065887e72b237123), pinned at commit `f12b0de177fbc2a6795e99be065887e72b237123`. `manifest.json` records each exact source URL and SHA-256 checksum, including the upstream `LICENSE` with Lucide ISC and Feather-derived MIT notices.

The viewer uses `rotate-ccw` / `rotate-cw` for rotation, `zoom-in` / `zoom-out` for zoom, and `maximize` for resetting to the fitted view. SVGs are decorative images inside labeled buttons; labels and keyboard shortcuts remain available through `aria-label`, `title` and `aria-describedby`. CSS sets their display size to 20 px; no SVG paths or attributes are edited. No icon runtime or CDN is needed.

To update, select an official tagged commit, copy the same SVGs and license unchanged, regenerate the manifest hashes, and run the checks in `test/README.md`.

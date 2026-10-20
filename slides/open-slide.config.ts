import type { OpenSlideConfig } from '@open-slide/core';

// Served from irsyad.dev/slides alongside the Astro site. The site drops
// trailing slashes, so the built router needs base '/slides' to match the
// bare URL — but the dev server joins base + '@fs/…' and needs the slash.
const isBuild = process.argv.includes('build');

const openSlideConfig: OpenSlideConfig = {
  base: isBuild ? '/slides' : '/slides/',
};

export default openSlideConfig;

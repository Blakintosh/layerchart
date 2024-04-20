import pageSource from './+page.svelte?raw';
import { parse } from 'svelte-ux';

export async function load({ fetch }) {
  return {
    geojson: await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(
      (r) => r.json()
    ),
    eclipses: await fetch('/data/examples/geo/eclipses.json').then(async (r) =>
      parse(await r.text())
    ),
    meta: {
      pageSource,
      related: ['https://www.visionscarto.net/empreintes-d-eclipses'],
    },
  };
}

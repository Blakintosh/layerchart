import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	// TODO: Support different US (https://github.com/topojson/us-atlas) and World (https://github.com/topojson/world-atlas) files
	// TODO: Cache: https://github.com/sveltejs/kit/issues/3642
	return {
		geojson: (await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json')).json()
	};
}) satisfies PageLoad;

<script lang="ts">
	import { ApiDocs } from 'svelte-ux';

	import api from '$lib/components/GeoContext.svelte?raw&sveld';

	import Chart, { Svg } from '$lib/components/Chart.svelte';

	import Preview from '$lib/docs/Preview.svelte';
</script>

# Examples

> TODO

# API

<ApiDocs {api} />

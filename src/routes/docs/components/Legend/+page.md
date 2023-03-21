---
name: $name
sourceUrl: $sourceUrl
docUrl: $docUrl
---

<script lang="ts">
	import { range } from 'd3-array';
	import { randomNormal } from 'd3-random';

	import {
		scaleSequential,
		scaleSequentialSqrt,
		scaleDiverging,
		scaleDivergingSqrt,
		scaleSequentialLog,
		scaleSequentialQuantile,
		scaleSqrt,
		scaleQuantize,
		scaleQuantile,
		scaleThreshold,
		scaleOrdinal,
	} from 'd3-scale';

	import {
		interpolateViridis,
		interpolateTurbo,
		interpolatePiYG,
		interpolateRdBu,
		interpolateBlues,
		schemePurples,
		schemeSpectral,
		schemeRdBu,
	} from 'd3-scale-chromatic';

	import { ApiDocs } from 'svelte-ux';

	import api from '$lib/components/Legend.svelte?raw&sveld';

	import Chart, { Svg } from '$lib/components/Chart.svelte';
	import Legend from '$lib/components/Legend.svelte';
	import Pie from '$lib/components/Pie.svelte';

	import Preview from '$lib/docs/Preview.svelte';

	const data = [];
</script>

# Examples

## scaleSequential

<Preview>
	<Legend scale={scaleSequential([0, 100], interpolateViridis)} title="Temperature (°F)" />
</Preview>

## scaleSequentialSqrt

<Preview>
	<Legend scale={scaleSequentialSqrt([0, 1], interpolateTurbo)} title="Speed (kts)" />
</Preview>

## scaleDiverging

<Preview>
	<Legend scale={scaleDiverging([-0.1, 0, 0.1], interpolatePiYG)} title="Daily change" tickFormat="percentRound" />
</Preview>

## scaleDivergingSqrt

<Preview>
	<Legend scale={scaleDivergingSqrt([-0.1, 0, 0.1], interpolateRdBu)} title="Daily change" tickFormat="percentRound" />
</Preview>

## scaleSequentialLog

<Preview>
	<Legend scale={scaleSequentialLog([1, 100], interpolateBlues)} title="Energy (joules)" ticks={10} />
</Preview>

## scaleSequentialQuantile

<Preview>
	<Legend scale={scaleSequentialQuantile(range(100).map(() => Math.random() ** 2), interpolateBlues)} title="Quantile" tickFormat="decimal" />
</Preview>

## scaleSqrt

<Preview>
	<Legend scale={scaleSqrt([-100, 0, 100], ["blue", "white", "red"])} title="Temperature (°C)" />
</Preview>

## scaleQuantize

<Preview>
	<Legend scale={scaleQuantize([1, 10], schemePurples[9])} title="Unemployment rate (%)" />
</Preview>

## scaleQuantile

<Preview>
	<Legend scale={scaleQuantile(range(1000).map(randomNormal(100, 20)), schemeSpectral[9])} title="Height (cm)" tickFormat="integer" />
</Preview>

## scaleThreshold

<Preview>
	<Legend scale={scaleThreshold([2.5, 3.1, 3.5, 3.9, 6, 7, 8, 9.5], schemeRdBu[9])} title="Unemployment rate (%)" tickSize={0} />
</Preview>

## scaleOrdinal

<Preview>
	<Legend scale={scaleOrdinal(["<10", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "≥80"], schemeSpectral[10])} title="Age (years)" tickSize={0} />
</Preview>

## Chart integration

<Preview>
	<Chart
		data={[{ name: 'One' }, { name: 'Two' }, { name: 'Three' }]}
		r="name"
		rScale={scaleOrdinal()}
		rRange={['var(--color-blue-500)', 'var(--color-green-500)', 'var(--color-purple-500)']}
	>
		<Legend title="I am Legend" />
	</Chart>
</Preview>

## Chart placement

<Preview>
	<div class="h-[300px]">
		<Chart
			data={[{ name: 'One' }, { name: 'Two' }, { name: 'Three' }]}
			r="name"
			rScale={scaleOrdinal()}
			rRange={['var(--color-blue-500)', 'var(--color-green-500)', 'var(--color-purple-500)']}
		>
			<Legend title="top-left" placement="top-left"  />
			<Legend title="top" placement="top"  />
			<Legend title="top-right" placement="top-right"  />
			<Legend title="left" placement="left"  />
			<Legend title="center" placement="center"  />
			<Legend title="right" placement="right"  />
			<Legend title="bottom-left" placement="bottom-left"  />
			<Legend title="bottom" placement="bottom"  />
			<Legend title="bottom-right" placement="bottom-right" />
		</Chart>
	</div>
</Preview>

## Styling

<Preview>
	<Legend
		scale={scaleSequential([0, 100], interpolateViridis)}
		title="Temperature (°F)"
		width={600}
		tickFontSize={12}
		classes={{
			root: 'ml-10',
			title: 'text-lg text-center',
			label: 'fill-black/50',
			tick: 'stroke-white'
		}}
	/>
</Preview>

## slot override

<Preview>
	<Legend scale={scaleOrdinal(["<10", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "≥80"], schemeSpectral[10])} title="Age (years)" let:values let:scale>
		<div class="flex gap-4">
			{#each values as value}
				<div class="flex gap-1">
					<div
						class="h-4 w-4 rounded-full"
						style:background-color={scale(value)}
					/>
					<div class="text-xs text-black/50">{value}</div>
				</div>
			{/each}
		</div>
	</Legend>
</Preview>

# API

<ApiDocs {api} />

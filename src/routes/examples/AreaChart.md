---
title: ['Charts', 'Area Chart']
---

<script lang="ts">
	import { scaleTime } from 'd3-scale';
	import { format } from 'date-fns';
	import { formatDate, PeriodType } from 'svelte-ux/utils/date';
	import { formatNumberAsStyle } from 'svelte-ux/utils/number';

	import Chart, { Svg } from '$lib/components/Chart.svelte';
	import Area from '$lib/components/Area.svelte';
	import AxisX from '$lib/components/AxisX.svelte';
	import AxisY from '$lib/components/AxisY.svelte';
	import Baseline from '$lib/components/Baseline.svelte';
	import HighlightLine from '$lib/components/HighlightLine.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';

	import Preview from '$lib/docs/Preview.svelte';
	import { createDateSeries } from '$lib/utils/genData';


	const data = createDateSeries({ min: 50, max: 100, value: 'integer' });
</script>

## Basic

<Preview>
	<div class="h-[300px] p-4 border rounded">
		<Chart
			{data}
			x="date"
			xScale={scaleTime()}
			y="value"
			yDomain={[0, null]}
			yNice
			padding={{ right: 10, bottom: 56, left: 40 }}
		>
			<Svg>
				<AxisY gridlines />
				<AxisX formatTick={(d) => formatDate(d, PeriodType.Day, 'short')} />
				<Baseline x y />
				<Area color="var(--color-blue-500)" line={{ width: 2 }} />
			</Svg>
		</Chart>
	</div>
</Preview>

## With Tooltip and HighlightLine

<Preview>
	<div class="h-[300px] p-4 border rounded">
		<Chart
			{data}
			x="date"
			xScale={scaleTime()}
			y="value"
			yDomain={[0, null]}
			yNice
			padding={{ right: 10, bottom: 56, left: 40 }}
		>
			<Svg>
				<AxisY gridlines />
				<AxisX formatTick={(d) => formatDate(d, PeriodType.Day, 'short')} />
				<Baseline x y />
				<Area color="var(--color-blue-500)" line={{ width: 2 }} />
			</Svg>
			<Tooltip let:data>
				<div class="tooltip">
					<div class="tooltip-header">
						{format(data.date, 'eee, MMMM do')}
					</div>
					<div class="grid grid-cols-[1fr,auto] gap-x-2 gap-y-1 items-center">
						<div class="tooltip-label">value:</div>
						<div class="tooltip-value">
							{formatNumberAsStyle(data.value, 'integer')}
						</div>
					</div>
				</div>
				<g slot="highlight">
					<HighlightLine {data} color="var(--color-blue-500)" />
				</g>
			</Tooltip>
		</Chart>
	</div>
</Preview>

<style lang="postcss">
	.tooltip {
		@apply bg-gray-900/90 backdrop-filter backdrop-blur-[2px] text-white rounded elevation-1 px-2 py-1;
	}
	.tooltip-header {
		@apply text-center font-semibold pb-1 whitespace-nowrap;
	}
	.tooltip-label {
		@apply text-xs text-white/75 text-right whitespace-nowrap;
	}
	.tooltip-value {
		@apply text-sm text-right;
	}
	.tooltip-separator {
		@apply rounded bg-white/50 my-1;
		grid-column: 1 / -1;
		height: 2px;
	}
</style>

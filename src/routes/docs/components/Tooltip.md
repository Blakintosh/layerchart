---
name: $name
sourceUrl: $sourceUrl
docUrl: $docUrl
---

<script lang="ts">
	import { get } from 'svelte/store';
	import { extent, sort } from 'd3-array';
	import { scaleBand, scaleOrdinal, scaleTime } from 'd3-scale';
	import { stack } from 'd3-shape';
	import { addHours, addMinutes, format, startOfDay } from 'date-fns';

	import { ApiDocs, Duration, Field, Switch, ToggleGroup, ToggleOption } from 'svelte-ux';
	import { flatten } from 'svelte-ux/utils/array';
	import { formatDate, PeriodType } from 'svelte-ux/utils/date';
	import { formatNumberAsStyle } from 'svelte-ux/utils/number';
		
	import api from '$lib/components/Tooltip.svelte?raw&sveld';

	import Chart, { Svg } from '$lib/components/Chart.svelte';
	import Area from '$lib/components/Area.svelte';
	import AreaStack from '$lib/components/AreaStack.svelte';
	import AxisX from '$lib/components/AxisX.svelte';
	import AxisY from '$lib/components/AxisY.svelte';
	import Bars from '$lib/components/Bars.svelte';
	import Baseline from '$lib/components/Baseline.svelte';
	import ConnectedPoints from '$lib/components/ConnectedPoints.svelte';
	import HighlightLine from '$lib/components/HighlightLine.svelte';
	import HighlightRect from '$lib/components/HighlightRect.svelte';
	import Labels from '$lib/components/Labels.svelte';
	import Points from '$lib/components/Points.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import TooltipContainer from '$lib/components/TooltipContainer.svelte';
	import TooltipItem from '$lib/components/TooltipItem.svelte';
	import TooltipSeparator from '$lib/components/TooltipSeparator.svelte';

	import Preview from '$lib/docs/Preview.svelte';

	import { createDateSeries, createTimeSeries, getRandomInteger, getSpiral } from '$lib/utils/genData';

	const dateSeries = createDateSeries({ min: 20, max: 100, value: 'integer', keys: ['value', 'baseline'] });

	const timeSeries = createTimeSeries({ min: 20, max: 100, value: 'integer', keys: ['value', 'baseline'] })
	const overlapTimeSeries = [
		...createTimeSeries({ min: 20, max: 100, value: 'integer', keys: ['value', 'baseline'] }),
		...createTimeSeries({ min: 20, max: 100, value: 'integer', keys: ['value', 'baseline'] })
	]

	const keys = ['apples', 'bananas', 'oranges']
	const stackDateSeries = createDateSeries({ min: 50, max: 100, value: 'integer', keys });
	const stackData = stack().keys(keys)(stackDateSeries);

	const spiralData = 	getSpiral({ angle: 137.5, radius: 10, count: 100, width: 500, height: 500 })

	let showVoronoi = false;
	let showQuadtree = false;

	let charts = [
		{ mode: 'bisect-x', highlight: 'line', axis: undefined, snapToDataX: false, snapToDataY: false, debug: false },
		{ mode: 'bisect-x', highlight: 'line', axis: undefined, snapToDataX: false, snapToDataY: false, debug: false },
		{ mode: 'bisect-x', highlight: 'line', axis: undefined, snapToDataX: false, snapToDataY: false, debug: false },
		{ mode: 'bounds', highlight: 'rect', axis: undefined, snapToDataX: false, snapToDataY: false, debug: false },
		{ mode: 'bounds', highlight: 'rect', axis: 'both', snapToDataX: false, snapToDataY: false, debug: false },
		{ mode: 'band', highlight: 'rect', axis: undefined, snapToDataX: false, snapToDataY: false, debug: false },
		{ mode: 'band', highlight: 'rect', axis: undefined,  snapToDataX: false, snapToDataY: false, debug: false },
		{ mode: 'voronoi', highlight: 'line', axis: 'both', snapToDataX: false, snapToDataY: false, debug: false },
	]

</script>

# Examples

---

## Area

### x: scaleTime, y: scaleLinear

### bisect-x recommended. voronoi and quadtree supported. bounds and band to be improved

<div class="grid grid-cols-[1fr,148px,248px,248px,100px] gap-2 mb-2">
	<Field label="Mode">
		<ToggleGroup bind:value={charts[0].mode} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value="bisect-x">bisect-x</ToggleOption>
				<ToggleOption value="bisect-y">bisect-y</ToggleOption>
				<ToggleOption value="bisect-band">bisect-band</ToggleOption>
				<ToggleOption value="band">band</ToggleOption>
				<ToggleOption value="bounds">bounds</ToggleOption>
				<ToggleOption value="voronoi">voronoi</ToggleOption>
				<ToggleOption value="quadtree">quadtree</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Highlight">
		<ToggleGroup bind:value={charts[0].highlight} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value="none">none</ToggleOption>
				<ToggleOption value="line">line</ToggleOption>
				<ToggleOption value="rect">rect</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Highlight Axis">
		<ToggleGroup bind:value={charts[0].axis} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value={undefined}>default</ToggleOption>
				<ToggleOption value="x">x</ToggleOption>
				<ToggleOption value="y">y</ToggleOption>
				<ToggleOption value="both">both</ToggleOption>
				<ToggleOption value="none">none</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Snap to Data">
		<div class="grid grid-cols-[auto,1fr,auto,1fr] items-center gap-1 w-full">
			<span>x:</span>
			<ToggleGroup bind:value={charts[0].snapToDataX} contained>
				<div class="options w-full border">
					<ToggleOption value={false}>off</ToggleOption>
					<ToggleOption value={true}>on</ToggleOption>
				</div>
			</ToggleGroup>
			<span>y:</span>
			<ToggleGroup bind:value={charts[0].snapToDataY} contained>
				<div class="options w-full border">
					<ToggleOption value={false}>off</ToggleOption>
					<ToggleOption value={true}>on</ToggleOption>
				</div>
			</ToggleGroup>
		</div>
	</Field>
	<Field label="Debug" let:id>
		<Switch bind:checked={charts[0].debug} {id} />
	</Field>
</div>

<Preview>
	<div class="h-[300px] p-4 border rounded">
		<Chart
			data={dateSeries}
			x="date"
			xScale={scaleTime()}
			y="value"
			yDomain={[0, null]}
			yNice
			padding={{ left: 16, bottom: 24 }}
		>
			<Svg>
				<AxisY gridlines />
				<AxisX formatTick={(d) => formatDate(d, PeriodType.Day, 'short')} />
				<Baseline x y />
				<Area line={{ width: 2 }} />
			</Svg>
			<Tooltip let:data mode={charts[0].mode} snapToDataX={charts[0].snapToDataX} snapToDataY={charts[0].snapToDataY} debug={charts[0].debug}>
				<TooltipContainer header={format(data.date, 'eee, MMMM do')}>
					<TooltipItem label="value" value={formatNumberAsStyle(data.value, 'integer')} />
				</TooltipContainer>
				<g slot="highlight">
					{#if charts[0].highlight === 'line'}
						<HighlightLine {data} {...charts[0].axis && { axis: charts[0].axis}} color="var(--color-blue-500)" />
					{:else if charts[0].highlight === 'rect'}
						<HighlightRect {data} {...charts[0].axis && { axis: charts[0].axis}} />
					{/if}
				</g>
			</Tooltip>
		</Chart>
	</div>
</Preview>

## Stacked Area

### x: scaleTime, y: scaleLinear (multi/stack)

### bisect-x recommended. voronoi and quadtree supported. bounds and band to be improved

<div class="grid grid-cols-[1fr,148px,248px,248px,100px] gap-2 mb-2">
	<Field label="Mode">
		<ToggleGroup bind:value={charts[1].mode} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value="bisect-x">bisect-x</ToggleOption>
				<ToggleOption value="bisect-y">bisect-y</ToggleOption>
				<ToggleOption value="bisect-band">bisect-band</ToggleOption>
				<ToggleOption value="band">band</ToggleOption>
				<ToggleOption value="bounds">bounds</ToggleOption>
				<ToggleOption value="voronoi">voronoi</ToggleOption>
				<ToggleOption value="quadtree">quadtree</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Highlight">
		<ToggleGroup bind:value={charts[1].highlight} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value="none">none</ToggleOption>
				<ToggleOption value="line">line</ToggleOption>
				<ToggleOption value="rect">rect</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Highlight Axis">
		<ToggleGroup bind:value={charts[1].axis} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value={undefined}>default</ToggleOption>
				<ToggleOption value="x">x</ToggleOption>
				<ToggleOption value="y">y</ToggleOption>
				<ToggleOption value="both">both</ToggleOption>
				<ToggleOption value="none">none</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Snap to Data">
		<div class="grid grid-cols-[auto,1fr,auto,1fr] items-center gap-1 w-full">
			<span>x:</span>
			<ToggleGroup bind:value={charts[1].snapToDataX} contained>
				<div class="options w-full border">
					<ToggleOption value={false}>off</ToggleOption>
					<ToggleOption value={true}>on</ToggleOption>
				</div>
			</ToggleGroup>
			<span>y:</span>
			<ToggleGroup bind:value={charts[1].snapToDataY} contained>
				<div class="options w-full border">
					<ToggleOption value={false}>off</ToggleOption>
					<ToggleOption value={true}>on</ToggleOption>
				</div>
			</ToggleGroup>
		</div>
	</Field>
	<Field label="Debug" let:id>
		<Switch bind:checked={charts[1].debug} {id} />
	</Field>
</div>

<Preview>
	<div class="h-[300px] p-4 border rounded">
		<Chart
			data={stackData}
			flatData={flatten(stackData)}
			x={d => d.data.date}
			xScale={scaleTime()}
			y={[0,1]}
			yNice
			z="key"
			zScale={scaleOrdinal()}
			zDomain={keys}
			zRange={[
				'var(--color-red-500)',
				'var(--color-green-500)',
				'var(--color-blue-500)',
			]}
			padding={{ left: 16, bottom: 24 }}
		>
			<Svg>
				<AxisY gridlines />
				<AxisX formatTick={(d) => formatDate(d, PeriodType.Day, 'short')} />
				<Baseline x y />
				<AreaStack line={{ width: 2 }} />
			</Svg>
			<Tooltip let:data mode={charts[1].mode} snapToDataX={charts[1].snapToDataX} snapToDataY={charts[1].snapToDataY} debug={charts[1].debug}>
				<TooltipContainer header={format(data.data.date, 'eee, MMMM do')}>
					{#each keys as key}
						<TooltipItem label="{key}" value={formatNumberAsStyle(data.data[key], 'integer')} />
					{/each}
				</TooltipContainer>
				<g slot="highlight">
					{#if charts[1].highlight === 'line'}
						<HighlightLine {data} {...charts[1].axis && { axis: charts[1].axis}} color="var(--color-blue-500)" />
					{:else if charts[1].highlight === 'rect'}
						<HighlightRect {data} {...charts[1].axis && { axis: charts[1].axis}} />
					{/if}
				</g>
			</Tooltip>
		</Chart>
	</div>
</Preview>

## Single Date / Time

### x: scaleTime, y: scaleBand

### bisect-x recommended. band, voronoi, and quadtree supported.

<div class="grid grid-cols-[1fr,148px,248px,248px,100px] gap-2 mb-2">
	<Field label="Mode">
		<ToggleGroup bind:value={charts[2].mode} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value="bisect-x">bisect-x</ToggleOption>
				<ToggleOption value="bisect-y">bisect-y</ToggleOption>
				<ToggleOption value="bisect-band">bisect-band</ToggleOption>
				<ToggleOption value="band">band</ToggleOption>
				<ToggleOption value="bounds">bounds</ToggleOption>
				<ToggleOption value="voronoi">voronoi</ToggleOption>
				<ToggleOption value="quadtree">quadtree</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Highlight">
		<ToggleGroup bind:value={charts[2].highlight} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value="none">none</ToggleOption>
				<ToggleOption value="line">line</ToggleOption>
				<ToggleOption value="rect">rect</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Highlight Axis">
		<ToggleGroup bind:value={charts[2].axis} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value={undefined}>default</ToggleOption>
				<ToggleOption value="x">x</ToggleOption>
				<ToggleOption value="y">y</ToggleOption>
				<ToggleOption value="both">both</ToggleOption>
				<ToggleOption value="none">none</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
		<Field label="Snap to Data">
		<div class="grid grid-cols-[auto,1fr,auto,1fr] items-center gap-1 w-full">
			<span>x:</span>
			<ToggleGroup bind:value={charts[2].snapToDataX} contained>
				<div class="options w-full border">
					<ToggleOption value={false}>off</ToggleOption>
					<ToggleOption value={true}>on</ToggleOption>
				</div>
			</ToggleGroup>
			<span>y:</span>
			<ToggleGroup bind:value={charts[2].snapToDataY} contained>
				<div class="options w-full border">
					<ToggleOption value={false}>off</ToggleOption>
					<ToggleOption value={true}>on</ToggleOption>
				</div>
			</ToggleGroup>
		</div>
	</Field>
	<Field label="Debug" let:id>
		<Switch bind:checked={charts[2].debug} {id} />
	</Field>
</div>

<Preview>
	<div class="h-[300px] p-4 border rounded">
		<Chart
			data={timeSeries}
			x="startDate"
			xScale={scaleTime()}
			y="name"
			yScale={scaleBand()}
			yDomain={timeSeries.map((x) => x.name)}
			padding={{ left: 36, bottom: 36 }}
		>
			<Svg>
				<AxisY gridlines={{ style: 'stroke-dasharray: 2' }} />
				<AxisX formatTick={(d) => format(d, 'h:mm aa')} />
				<Baseline y />
				<Points class="fill-blue-500 stroke-blue-800" />
			</Svg>
			<Tooltip let:data mode={charts[2].mode} snapToDataX={charts[2].snapToDataX} snapToDataY={charts[2].snapToDataY}  debug={charts[2].debug}>
				<TooltipContainer header={data.name}>
					<TooltipItem label="date" value={format(data.startDate, 'h:mm a')} />
				</TooltipContainer>
				<g slot="highlight">
					{#if charts[2].highlight === 'line'}
						<HighlightLine {data} {...charts[2].axis && { axis: charts[2].axis}} color="var(--color-blue-500)" />
					{:else if charts[2].highlight === 'rect'}
						<HighlightRect {data} {...charts[2].axis && { axis: charts[2].axis}} />
					{/if}
				</g>
			</Tooltip>
		</Chart>
	</div>
</Preview>

## Duration

### x: scaleTime (multi), y: scaleBand

### bisect-band or bounds recommended. band supported (when no overlap on same band). bisect supported (when no overlap on time scale). voronoi and quadtree partially supported (using first point)

<div class="grid grid-cols-[1fr,148px,248px,248px,100px] gap-2 mb-2">
	<Field label="Mode">
		<ToggleGroup bind:value={charts[3].mode} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value="bisect-x">bisect-x</ToggleOption>
				<ToggleOption value="bisect-y">bisect-y</ToggleOption>
				<ToggleOption value="bisect-band">bisect-band</ToggleOption>
				<ToggleOption value="band">band</ToggleOption>
				<ToggleOption value="bounds">bounds</ToggleOption>
				<ToggleOption value="voronoi">voronoi</ToggleOption>
				<ToggleOption value="quadtree">quadtree</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Highlight">
		<ToggleGroup bind:value={charts[3].highlight} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value="none">none</ToggleOption>
				<ToggleOption value="line">line</ToggleOption>
				<ToggleOption value="rect">rect</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Highlight Axis">
		<ToggleGroup bind:value={charts[3].axis} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value={undefined}>default</ToggleOption>
				<ToggleOption value="x">x</ToggleOption>
				<ToggleOption value="y">y</ToggleOption>
				<ToggleOption value="both">both</ToggleOption>
				<ToggleOption value="none">none</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Snap to Data">
		<div class="grid grid-cols-[auto,1fr,auto,1fr] items-center gap-1 w-full">
			<span>x:</span>
			<ToggleGroup bind:value={charts[3].snapToDataX} contained>
				<div class="options w-full border">
					<ToggleOption value={false}>off</ToggleOption>
					<ToggleOption value={true}>on</ToggleOption>
				</div>
			</ToggleGroup>
			<span>y:</span>
			<ToggleGroup bind:value={charts[3].snapToDataY} contained>
				<div class="options w-full border">
					<ToggleOption value={false}>off</ToggleOption>
					<ToggleOption value={true}>on</ToggleOption>
				</div>
			</ToggleGroup>
		</div>
	</Field>
	<Field label="Debug" let:id>
		<Switch bind:checked={charts[3].debug} {id} />
	</Field>
</div>

<Preview>
	<div class="h-[300px] p-4 border rounded">
		<Chart
			data={timeSeries}
			x={['startDate', 'endDate']}
			xScale={scaleTime()}
			y="name"
			yScale={scaleBand()}
			yDomain={timeSeries.map((x) => x.name)}
			padding={{ left: 36, bottom: 36 }}
		>
			<Svg>
				<AxisY gridlines={{ style: 'stroke-dasharray: 2' }} />
				<AxisX formatTick={(d) => format(d, 'h:mm aa')} />
				<Baseline y />
				<ConnectedPoints stroke="#000" />
				<Points class="fill-blue-500 stroke-blue-800" />
			</Svg>
			<Tooltip let:data mode={charts[3].mode} snapToDataX={charts[3].snapToDataX} snapToDataY={charts[3].snapToDataY}  debug={charts[3].debug}>
				<TooltipContainer header={data.name}>
					<TooltipItem label="start" value={format(data.startDate, 'h:mm a')} />
					<TooltipItem label="end" value={format(data.endDate, 'h:mm a')} />
					<TooltipSeparator />
					<TooltipItem label="duration" valueAlign="right">
						<Duration start={data.startDate} end={data.endDate} />
					</TooltipItem>
				</TooltipContainer>
				<g slot="highlight">
					{#if charts[3].highlight === 'line'}
						<HighlightLine {data} {...charts[3].axis && { axis: charts[3].axis}} color="var(--color-blue-500)" />
					{:else if charts[3].highlight === 'rect'}
						<HighlightRect {data} {...charts[3].axis && { axis: charts[3].axis}} />
					{/if}
				</g>
			</Tooltip>
		</Chart>
	</div>
</Preview>

## Multiple (overlapping) Durations

### x: scaleTime (multi), y: scaleBand

### bounds recommends. voronoi and quadtree partially supported (using first point)

<div class="grid grid-cols-[1fr,148px,248px,248px,100px] gap-2 mb-2">
	<Field label="Mode">
		<ToggleGroup bind:value={charts[4].mode} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value="bisect-x">bisect-x</ToggleOption>
				<ToggleOption value="bisect-y">bisect-y</ToggleOption>
				<ToggleOption value="bisect-band">bisect-band</ToggleOption>
				<ToggleOption value="band">band</ToggleOption>
				<ToggleOption value="bounds">bounds</ToggleOption>
				<ToggleOption value="voronoi">voronoi</ToggleOption>
				<ToggleOption value="quadtree">quadtree</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Highlight">
		<ToggleGroup bind:value={charts[4].highlight} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value="none">none</ToggleOption>
				<ToggleOption value="line">line</ToggleOption>
				<ToggleOption value="rect">rect</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Highlight Axis">
		<ToggleGroup bind:value={charts[4].axis} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value={undefined}>default</ToggleOption>
				<ToggleOption value="x">x</ToggleOption>
				<ToggleOption value="y">y</ToggleOption>
				<ToggleOption value="both">both</ToggleOption>
				<ToggleOption value="none">none</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Snap to Data">
		<div class="grid grid-cols-[auto,1fr,auto,1fr] items-center gap-1 w-full">
			<span>x:</span>
			<ToggleGroup bind:value={charts[4].snapToDataX} contained>
				<div class="options w-full border">
					<ToggleOption value={false}>off</ToggleOption>
					<ToggleOption value={true}>on</ToggleOption>
				</div>
			</ToggleGroup>
			<span>y:</span>
			<ToggleGroup bind:value={charts[4].snapToDataY} contained>
				<div class="options w-full border">
					<ToggleOption value={false}>off</ToggleOption>
					<ToggleOption value={true}>on</ToggleOption>
				</div>
			</ToggleGroup>
		</div>
	</Field>
	<Field label="Debug" let:id>
		<Switch bind:checked={charts[4].debug} {id} />
	</Field>
</div>

<Preview>
	<div class="h-[300px] p-4 border rounded">
		<Chart
			data={overlapTimeSeries}
			x={['startDate', 'endDate']}
			xScale={scaleTime()}
			y="name"
			yScale={scaleBand()}
			yDomain={overlapTimeSeries.map((x) => x.name)}
			padding={{ left: 36, bottom: 36 }}
		>
			<Svg>
				<AxisY gridlines={{ style: 'stroke-dasharray: 2' }} />
				<AxisX formatTick={(d) => format(d, 'h:mm aa')} />
				<Baseline y />
				<ConnectedPoints stroke="#000" />
				<Points class="fill-blue-500 stroke-blue-800" />
			</Svg>
			<Tooltip let:data mode={charts[4].mode} snapToDataX={charts[4].snapToDataX} snapToDataY={charts[4].snapToDataY} debug={charts[4].debug}>
				<TooltipContainer header={data.name}>
					<TooltipItem label="start" value={format(data.startDate, 'h:mm a')} />
					<TooltipItem label="end" value={format(data.endDate, 'h:mm a')} />
					<TooltipSeparator />
					<TooltipItem label="duration" valueAlign="right">
						<Duration start={data.startDate} end={data.endDate} />
					</TooltipItem>
				</TooltipContainer>
				<g slot="highlight">
					{#if charts[4].highlight === 'line'}
						<HighlightLine {data} {...charts[4].axis && { axis: charts[4].axis}} color="var(--color-blue-500)" />
					{:else if charts[4].highlight === 'rect'}
						<HighlightRect {data} {...charts[4].axis && { axis: charts[4].axis}} />
					{/if}
				</g>
			</Tooltip>
		</Chart>
	</div>
</Preview>

## Simple Bars

### x: scaleBand, y: scaleLinear

### band or bounds recommended. bisect-x supported. voronoi and quadtree partially support (using value / bar top)

<div class="grid grid-cols-[1fr,148px,248px,248px,100px] gap-2 mb-2">
	<Field label="Mode">
		<ToggleGroup bind:value={charts[5].mode} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value="bisect-x">bisect-x</ToggleOption>
				<ToggleOption value="bisect-y">bisect-y</ToggleOption>
				<ToggleOption value="bisect-band">bisect-band</ToggleOption>
				<ToggleOption value="band">band</ToggleOption>
				<ToggleOption value="bounds">bounds</ToggleOption>
				<ToggleOption value="voronoi">voronoi</ToggleOption>
				<ToggleOption value="quadtree">quadtree</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Highlight">
		<ToggleGroup bind:value={charts[5].highlight} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value="none">none</ToggleOption>
				<ToggleOption value="line">line</ToggleOption>
				<ToggleOption value="rect">rect</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Highlight Axis">
		<ToggleGroup bind:value={charts[5].axis} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value={undefined}>default</ToggleOption>
				<ToggleOption value="x">x</ToggleOption>
				<ToggleOption value="y">y</ToggleOption>
				<ToggleOption value="both">both</ToggleOption>
				<ToggleOption value="none">none</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Snap to Data">
		<div class="grid grid-cols-[auto,1fr,auto,1fr] items-center gap-1 w-full">
			<span>x:</span>
			<ToggleGroup bind:value={charts[5].snapToDataX} contained>
				<div class="options w-full border">
					<ToggleOption value={false}>off</ToggleOption>
					<ToggleOption value={true}>on</ToggleOption>
				</div>
			</ToggleGroup>
			<span>y:</span>
			<ToggleGroup bind:value={charts[5].snapToDataY} contained>
				<div class="options w-full border">
					<ToggleOption value={false}>off</ToggleOption>
					<ToggleOption value={true}>on</ToggleOption>
				</div>
			</ToggleGroup>
		</div>
	</Field>
	<Field label="Debug" let:id>
		<Switch bind:checked={charts[5].debug} {id} />
	</Field>
</div>

<Preview>
	<div class="h-[300px] p-4 border rounded">
		<Chart
			data={dateSeries}
			x="date"
			xScale={scaleBand().padding(0.4)}
			xDomain={dateSeries.map((d) => d.date)}
			y="value"
			yDomain={[0, null]}
			yNice
			padding={{ left: 16, bottom: 24 }}
		>
			<Svg>
				<AxisY gridlines />
				<AxisX formatTick={(d) => formatDate(d, PeriodType.Day, 'short')} />
				<Baseline x y />
				<Bars radius={4} strokeWidth={1} />
			</Svg>
			<Tooltip let:data mode={charts[5].mode} snapToDataX={charts[5].snapToDataX} snapToDataY={charts[5].snapToDataY}  debug={charts[5].debug}>
				<TooltipContainer header={format(data.date, 'eee, MMMM do')}>
					<TooltipItem label="value" value={formatNumberAsStyle(data.value, 'integer')} />
				</TooltipContainer>
				<g slot="highlight">
					{#if charts[5].highlight === 'line'}
						<HighlightLine {data} {...charts[5].axis && { axis: charts[5].axis}} color="var(--color-blue-500)" />
					{:else if charts[5].highlight === 'rect'}
						<HighlightRect {data} {...charts[5].axis && { axis: charts[5].axis}} />
					{/if}
				</g>
			</Tooltip>
    	</Chart>
    </div>
</Preview>

## Multiple (overlapping) Bars

### x: scaleBand, y: scaleLinear

### band or bounds recommended. bisect-x supported. voronoi and quadtree partially support (using value / bar top)

<div class="grid grid-cols-[1fr,148px,248px,248px,100px] gap-2 mb-2">
	<Field label="Mode">
		<ToggleGroup bind:value={charts[6].mode} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value="bisect-x">bisect-x</ToggleOption>
				<ToggleOption value="bisect-y">bisect-y</ToggleOption>
				<ToggleOption value="bisect-band">bisect-band</ToggleOption>
				<ToggleOption value="band">band</ToggleOption>
				<ToggleOption value="bounds">bounds</ToggleOption>
				<ToggleOption value="voronoi">voronoi</ToggleOption>
				<ToggleOption value="quadtree">quadtree</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Highlight">
		<ToggleGroup bind:value={charts[6].highlight} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value="none">none</ToggleOption>
				<ToggleOption value="line">line</ToggleOption>
				<ToggleOption value="rect">rect</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Highlight Axis">
		<ToggleGroup bind:value={charts[6].axis} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value={undefined}>default</ToggleOption>
				<ToggleOption value="x">x</ToggleOption>
				<ToggleOption value="y">y</ToggleOption>
				<ToggleOption value="both">both</ToggleOption>
				<ToggleOption value="none">none</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Snap to Data">
		<div class="grid grid-cols-[auto,1fr,auto,1fr] items-center gap-1 w-full">
			<span>x:</span>
			<ToggleGroup bind:value={charts[6].snapToDataX} contained>
				<div class="options w-full border">
					<ToggleOption value={false}>off</ToggleOption>
					<ToggleOption value={true}>on</ToggleOption>
				</div>
			</ToggleGroup>
			<span>y:</span>
			<ToggleGroup bind:value={charts[6].snapToDataY} contained>
				<div class="options w-full border">
					<ToggleOption value={false}>off</ToggleOption>
					<ToggleOption value={true}>on</ToggleOption>
				</div>
			</ToggleGroup>
		</div>
	</Field>
	<Field label="Debug" let:id>
		<Switch bind:checked={charts[6].debug} {id} />
	</Field>
</div>

<Preview>
	<div class="h-[300px] p-4 border rounded">
		<Chart
			data={dateSeries}
			x="date"
			xScale={scaleBand().padding(0.4)}
			xDomain={dateSeries.map((d) => d.date)}
			y={d => Math.max(d.value, d.baseline)}
			yDomain={[0, null]}
			yNice
			padding={{ left: 16, bottom: 24 }}
		>
			<Svg>
				<AxisY gridlines />
				<AxisX formatTick={(d) => formatDate(d, PeriodType.Day, 'short')} />
				<Baseline x y />
				<Bars y="baseline" radius={4} strokeWidth={1} color="#ddd" />
				<Bars y="value" radius={4} strokeWidth={1} widthOffset={-16} />
			</Svg>
			<Tooltip let:data mode={charts[6].mode} snapToDataX={charts[6].snapToDataX} snapToDataY={charts[6].snapToDataY}  debug={charts[6].debug}>
				<TooltipContainer header={format(data.date, 'eee, MMMM do')}>
					<TooltipItem label="value" value={formatNumberAsStyle(data.value, 'integer')} />
					<TooltipItem label="baseline" value={formatNumberAsStyle(data.baseline, 'integer')} />
				</TooltipContainer>
				<g slot="highlight">
					{#if charts[6].highlight === 'line'}
						<HighlightLine {data} {...charts[6].axis && { axis: charts[6].axis}} color="var(--color-blue-500)" />
					{:else if charts[6].highlight === 'rect'}
						<HighlightRect {data} {...charts[6].axis && { axis: charts[6].axis}} />
					{/if}
				</g>
			</Tooltip>
		</Chart>
	</div>
</Preview>

## Scatter Plot

### x: scaleLinear, y: scaleLinear

### voronoi or quadtree recommended

<div class="grid grid-cols-[1fr,148px,248px,248px,100px] gap-2 mb-2">
	<Field label="Mode">
		<ToggleGroup bind:value={charts[7].mode} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value="bisect-x">bisect-x</ToggleOption>
				<ToggleOption value="bisect-y">bisect-y</ToggleOption>
				<ToggleOption value="bisect-band">bisect-band</ToggleOption>
				<ToggleOption value="band">band</ToggleOption>
				<ToggleOption value="bounds">bounds</ToggleOption>
				<ToggleOption value="voronoi">voronoi</ToggleOption>
				<ToggleOption value="quadtree">quadtree</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Highlight">
		<ToggleGroup bind:value={charts[7].highlight} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value="none">none</ToggleOption>
				<ToggleOption value="line">line</ToggleOption>
				<ToggleOption value="rect">rect</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Highlight Axis">
		<ToggleGroup bind:value={charts[7].axis} contained class="w-full">
			<div class="options w-full border">
				<ToggleOption value={undefined}>default</ToggleOption>
				<ToggleOption value="x">x</ToggleOption>
				<ToggleOption value="y">y</ToggleOption>
				<ToggleOption value="both">both</ToggleOption>
				<ToggleOption value="none">none</ToggleOption>
			</div>
		</ToggleGroup>
	</Field>
	<Field label="Snap to Data">
		<div class="grid grid-cols-[auto,1fr,auto,1fr] items-center gap-1 w-full">
			<span>x:</span>
			<ToggleGroup bind:value={charts[7].snapToDataX} contained>
				<div class="options w-full border">
					<ToggleOption value={false}>off</ToggleOption>
					<ToggleOption value={true}>on</ToggleOption>
				</div>
			</ToggleGroup>
			<span>y:</span>
			<ToggleGroup bind:value={charts[7].snapToDataY} contained>
				<div class="options w-full border">
					<ToggleOption value={false}>off</ToggleOption>
					<ToggleOption value={true}>on</ToggleOption>
				</div>
			</ToggleGroup>
		</div>
	</Field>
	<Field label="Debug" let:id>
		<Switch bind:checked={charts[7].debug} {id} />
	</Field>
</div>

<Preview>
	<div class="h-[300px] p-4 border rounded">
		<Chart
			data={spiralData}
			x="x"
			y="y"
			padding={{ left: 30, bottom: 30 }}
		>
			<Svg>
				<AxisY gridlines />
				<AxisX gridlines />
				<Points class="fill-blue-500 stroke-blue-800" />
			</Svg>
			<Tooltip let:data mode={charts[7].mode} snapToDataX={charts[7].snapToDataX} snapToDataY={charts[7].snapToDataY} debug={charts[7].debug}>
				<TooltipContainer>
					<TooltipItem label="x" value={formatNumberAsStyle(data.x, 'decimal')} />
					<TooltipItem label="y" value={formatNumberAsStyle(data.y, 'decimal')} />
				</TooltipContainer>
				<g slot="highlight">
					{#if charts[7].highlight === 'line'}
						<HighlightLine {data} {...charts[7].axis && { axis: charts[7].axis}} color="var(--color-blue-500)" />
					{:else if charts[7].highlight === 'rect'}
						<HighlightRect {data} {...charts[7].axis && { axis: charts[7].axis}} />
					{/if}
				</g>
			</Tooltip>
		</Chart>
	</div>
</Preview>

# API

<ApiDocs {api} />

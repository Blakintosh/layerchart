---
title: ['Charts', 'Sunburst']
---

<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { hierarchy } from 'd3-hierarchy';
	import { scaleSequential, scaleOrdinal, scaleLinear } from 'd3-scale';
	import * as chromatic from 'd3-scale-chromatic';
	import { hsl } from 'd3-color';

	import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';

	import { Breadcrumb, Button, Field, Tabs, Tab } from 'svelte-ux';
	import { formatNumberAsStyle } from 'svelte-ux/utils/number';

	import Chart, { Svg } from '$lib/components/Chart.svelte';
	import Arc from '$lib/components/Arc.svelte';
	import Bounds from '$lib/components/Bounds.svelte';
	import Group from '$lib/components/Group.svelte';
	import Text from '$lib/components/Text.svelte';
	import Partition from '$lib/components/Partition.svelte';
	import { findAncestor } from '$lib/utils/hierarchy';

	import Preview from '$lib/docs/Preview.svelte';

	import { complexData } from './data/hierarchy';
	import { tweenedScale } from '$lib/utils/scales';

	const complexHierarchy = hierarchy(complexData)
		.sum((d) => d.value)
		// .sort((a, b) => b.value - a.value);
		.sort((a, b) => b.height - a.height || (b.value ?? 0) - (a.value ?? 0));

	let colorBy = 'parent';

	let selected = complexHierarchy; // select root initially

	const tweenedOptions = { easing: cubicOut, duration: 800 };

	const xScale = tweenedScale(scaleLinear, tweenedOptions);
	$: xScale.domain([0, 1]);
	$: xScale.range([0, 2 * Math.PI]);

	const yScale = tweenedScale(scaleLinear, tweenedOptions);
	$: yScale.domain([0, 1]);
	$: yScale.range([0, 250]); // [0, width / 2]

	const sequentialColor = scaleSequential([4, -1], chromatic.interpolateGnBu)
	// filter out hard to see yellow and green
	const ordinalColor = scaleOrdinal(chromatic.schemeSpectral[9].filter(c => hsl(c).h < 60 || hsl(c).h > 90))
	// const ordinalColor = scaleOrdinal(chromatic.schemeCategory10)

	function getNodeColor(node, colorBy) {
		switch (colorBy) {
			case 'children':
				return node.children ? '#ccc' : '#ddd'
			case 'depth':
				return sequentialColor(node.depth);
			case 'parent':
				const colorParent = findAncestor(node, n => n.depth === 1)
				return colorParent ? hsl(ordinalColor((colorParent).data.name)).brighter(node.depth * .3) : '#ddd'
		}
	}
</script>

<div class="grid grid-flow-col gap-4 mb-4">
	<div class="grid grid-cols-[1fr,1fr] gap-2">
		<Field label="Color By">
			<Tabs bind:selected={colorBy} contained class="w-full">
				<div class="tabList w-full border h-8">
					<Tab value="children">Children</Tab>
					<Tab value="depth">Depth</Tab>
					<Tab value="parent">Parent</Tab>
				</div>
			</Tabs>
		</Field>
	</div>
</div>

## Suburst

<Preview>
	<Breadcrumb items={selected?.ancestors().reverse() ?? []}>
		<Button slot="item" let:item on:click={() => selected = item} base class="px-2 py-1 rounded">
			<div class="text-left">
				<div class="text-sm">{item.data.name}</div>
				<div class="text-xs text-black/50">{formatNumberAsStyle(item.value, 'integer')}</div>
			</div>
		</Button>
	</Breadcrumb>
	<div class="h-[600px] p-4 border rounded">
		<Chart data={complexHierarchy}>
			<Svg>
				<Partition size={[1,1]} let:nodes>
					<Group center>
						{#each nodes as node}
							{@const nodeColor = getNodeColor(node, colorBy)}
							<Arc
								value={node.value}
								startAngle={Math.max(0, Math.min(2 * Math.PI, $xScale(node.x0)))}
								endAngle={Math.max(0, Math.min(2 * Math.PI, $xScale(node.x1)))}
								innerRadius={Math.max(0, $yScale(node.y0))}
								outerRadius={Math.max(0, $yScale(node.y1))}
								fill={nodeColor}
								stroke={hsl(nodeColor).darker(colorBy === 'children' ? 0.5 : 1)}
								let:centroid
								on:click={() => {
									xScale.domain([node.x0, node.x1]);
									yScale.domain([node.y0, 1]);
									yScale.range([node.y0 ? 20 : 0, 250 /*width / 2*/]);
								}}
							>
								<!-- <text x={centroid[0]} y={centroid[1]}>{node.data.name}</text> -->
							</Arc>
						{/each}
					</Group>
				</Partition>
			</Svg>
		</Chart>
	</div>
</Preview>

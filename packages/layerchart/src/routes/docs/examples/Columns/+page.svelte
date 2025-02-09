<script lang="ts">
  import { cubicInOut } from 'svelte/easing';
  import { scaleBand, scaleOrdinal, scaleTime } from 'd3-scale';
  import { extent, mean } from 'd3-array';
  import { stackOffsetExpand } from 'd3-shape';
  import { format } from 'date-fns';

  import {
    Axis,
    Bar,
    Bars,
    Chart,
    Highlight,
    Labels,
    LinearGradient,
    Pattern,
    RectClipPath,
    Rule,
    Svg,
    Text,
    Tooltip,
    TooltipItem,
    createStackData,
    stackOffsetSeparated,
  } from 'layerchart';

  import {
    Field,
    ToggleGroup,
    ToggleOption,
    formatDate,
    PeriodType,
    Toggle,
    Switch,
  } from 'svelte-ux';

  import Preview from '$lib/docs/Preview.svelte';
  import { createDateSeries, longData } from '$lib/utils/genData.js';

  const data = createDateSeries({
    count: 30,
    min: 20,
    max: 100,
    value: 'integer',
    keys: ['value', 'baseline'],
  });
  const negativeData = createDateSeries({ count: 30, min: -20, max: 50, value: 'integer' });

  const groupedData = createStackData(longData, { xKey: 'year', groupBy: 'fruit' });
  const stackedData = createStackData(longData, { xKey: 'year', stackBy: 'fruit' });
  const groupedStackedData = createStackData(longData, {
    xKey: 'year',
    groupBy: 'basket',
    stackBy: 'fruit',
  });
  const stackedPercentData = createStackData(longData, {
    xKey: 'year',
    stackBy: 'fruit',
    offset: stackOffsetExpand,
  });
  const stackedSeperatedData = createStackData(longData, {
    xKey: 'year',
    stackBy: 'fruit',
    offset: stackOffsetSeparated,
  });

  const colorKeys = [...new Set(longData.map((x) => x.fruit))];
  const keyColors = [
    'hsl(var(--color-info))',
    'hsl(var(--color-success))',
    'hsl(var(--color-warning))',
    'hsl(var(--color-danger))',
  ];

  let transitionChartMode = 'group';
  $: transitionChart =
    transitionChartMode === 'group'
      ? {
          groupBy: 'fruit',
          stackBy: undefined,
        }
      : transitionChartMode === 'stack'
        ? {
            groupBy: undefined,
            stackBy: 'fruit',
          }
        : transitionChartMode === 'groupStack'
          ? {
              groupBy: 'basket',
              stackBy: 'fruit',
            }
          : {
              groupBy: undefined,
              stackBy: undefined,
            };
  $: transitionData = createStackData(longData, {
    xKey: 'year',
    groupBy: transitionChart.groupBy,
    stackBy: transitionChart.stackBy,
  }) as {
    basket: number;
    fruit: string;
    keys: string[];
    value: number;
    values: number[];
    year: string;
  }[];
</script>

<h1>Examples</h1>

<h2>Basic</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      {data}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yDomain={[0, null]}
      yNice={4}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Bars radius={4} strokeWidth={1} class="fill-primary" />
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Rounded (top-only)</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      {data}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yDomain={[0, null]}
      yNice={4}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Bars radius={4} rounded="top" strokeWidth={1} class="fill-primary" />
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Tooltip and Highlight</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      {data}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yDomain={[0, null]}
      yNice={4}
      padding={{ left: 16, bottom: 24 }}
      tooltip={{ mode: 'band' }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Bars radius={4} strokeWidth={1} class="fill-primary" />
        <Highlight area />
      </Svg>
      <Tooltip header={(data) => format(data.date, 'eee, MMMM do')} let:data>
        <TooltipItem label="value" value={data.value} />
      </Tooltip>
    </Chart>
  </div>
</Preview>

<h2>Tooltip and Bar Highlight</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded group">
    <Chart
      {data}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yDomain={[0, null]}
      yNice={4}
      padding={{ left: 16, bottom: 24 }}
      tooltip={{ mode: 'band' }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Bars
          radius={4}
          strokeWidth={1}
          class="fill-primary group-hover:fill-gray-300 transition-colors"
        />
        <Highlight area bar={{ class: 'fill-primary', strokeWidth: 1, radius: 4 }} />
      </Svg>
      <Tooltip header={(data) => format(data.date, 'eee, MMMM do')} let:data>
        <TooltipItem label="value" value={data.value} />
      </Tooltip>
    </Chart>
  </div>
</Preview>

<h2>Tooltip and Clipped Highlight</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded group">
    <Chart
      {data}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yDomain={[0, null]}
      yNice={4}
      padding={{ left: 16, bottom: 24 }}
      tooltip={{ mode: 'band' }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Bars
          radius={4}
          strokeWidth={1}
          class="fill-primary group-hover:fill-gray-300 transition-colors"
        />
        <Highlight area>
          <svelte:fragment slot="area" let:area>
            <RectClipPath x={area.x} y={area.y} width={area.width} height={area.height} spring>
              <Bars radius={4} strokeWidth={1} class="fill-primary" />
            </RectClipPath>
          </svelte:fragment>
        </Highlight>
      </Svg>
      <Tooltip header={(data) => format(data.date, 'eee, MMMM do')} let:data>
        <TooltipItem label="value" value={data.value} />
      </Tooltip>
    </Chart>
  </div>
</Preview>

<h2>Calculated value domain (positive)</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      data={createDateSeries({ count: 30, min: 50, max: 100 })}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yNice={4}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Bars radius={4} strokeWidth={1} class="fill-primary" />
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Calculated value domain (negative)</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      data={createDateSeries({ count: 30, min: -100, max: -50 })}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yNice={4}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Bars radius={4} strokeWidth={1} class="fill-primary" />
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Outside Labels (default)</h2>

<Preview data={negativeData}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      data={negativeData}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yBaseline={0}
      yNice={4}
      yPadding={[16, 16]}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Rule y={0} />
        <Bars radius={4} strokeWidth={1} class="fill-primary" />
        <Labels format="integer" />
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Inside Labels</h2>

<Preview data={negativeData}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      data={negativeData}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yBaseline={0}
      yNice={4}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Rule y={0} />
        <Bars radius={4} strokeWidth={1} class="fill-primary" />
        <Labels placement="inside" format="integer" />
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Limit ticks (count)</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      {data}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yDomain={[0, null]}
      yNice={4}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          ticks={4}
          rule
        />
        <Bars radius={4} strokeWidth={1} class="fill-primary" />
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Limit ticks (second scale)</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      {data}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yDomain={[0, null]}
      yNice={4}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          ticks={(scale) => scaleTime(scale.domain(), scale.range()).ticks(4)}
          rule
        />
        <Bars radius={4} strokeWidth={1} class="fill-primary" />
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Gradient</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      {data}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yDomain={[0, null]}
      yNice={4}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <LinearGradient class="from-blue-500 to-green-400" vertical units="userSpaceOnUse" let:url>
          <Bars radius={4} strokeWidth={1} fill={url} class="stroke-blue-900" />
        </LinearGradient>
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Customize individual styles</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      {data}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yDomain={[0, null]}
      yNice={4}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Bars>
          {#each data as bar, i}
            <Bar
              {bar}
              radius={4}
              strokeWidth={1}
              class={i === data.length - 4 ? 'fill-primary' : 'fill-surface-content'}
            />
          {/each}
        </Bars>
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Highlight individual bar</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      {data}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yDomain={[0, null]}
      yNice={4}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Bars radius={4} strokeWidth={1} class="fill-primary" />
        <Pattern id="highlight-pattern" width={8} height={8}>
          <rect width={8} height={8} class="fill-secondary/10" />
          <line x1={8} y2={8} class="stroke-secondary/30" />
        </Pattern>
        <Highlight
          data={data[3]}
          area={{ fill: 'url(#highlight-pattern)', class: 'stroke-secondary/50' }}
        />
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Highlight individual bar (line)</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      {data}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yDomain={[0, null]}
      yNice={4}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Bars radius={4} strokeWidth={1} class="fill-primary" />
        <Highlight
          data={data[3]}
          lines={{ class: 'stroke-2 stroke-danger [stroke-dasharray:4] [stroke-linecap:round] ' }}
          axis="y"
        />
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Average annotation Rule</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      {data}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yDomain={[0, null]}
      yNice={4}
      padding={{ left: 16, bottom: 24 }}
      let:width
      let:yScale
    >
      {@const avg = mean(data, (d) => d.value)}
      <Svg>
        <Axis placement="left" grid rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Bars radius={4} strokeWidth={1} class="fill-primary" />
        <Rule y={avg} class="stroke-2 stroke-danger [stroke-dasharray:4] [stroke-linecap:round] " />
        <Text
          x={width}
          y={yScale(avg)}
          dy={-4}
          value="Avg"
          textAnchor="end"
          verticalAnchor="end"
          class="text-sm fill-danger stroke-surface-100 stroke-2"
        />
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>with grid on top</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      {data}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yDomain={[0, null]}
      yNice={4}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Bars radius={4} strokeWidth={1} class="fill-primary" />
        <Axis placement="left" grid={{ class: 'stroke-surface-100' }} rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>with grid on top (mix-blend)</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      {data}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yDomain={[0, null]}
      yNice={4}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Bars radius={4} strokeWidth={1} class="fill-primary" />
        <Axis placement="left" grid={{ class: 'mix-blend-multiply' }} rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Multiple (overlapping)</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      {data}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y={(d) => Math.max(d.value, d.baseline)}
      yDomain={[0, null]}
      yNice={4}
      padding={{ left: 16, bottom: 24 }}
      tooltip={{ mode: 'bisect-x' }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Bars y="baseline" radius={4} strokeWidth={1} class="fill-surface-content/20" />
        <Bars y="value" radius={4} strokeWidth={1} inset={8} class="fill-primary" />
        <Highlight area />
      </Svg>
      <Tooltip header={(data) => format(data.date, 'eee, MMMM do')} let:data>
        <TooltipItem label="value" value={data.value} />
        <TooltipItem label="baseline" value={data.baseline} />
      </Tooltip>
    </Chart>
  </div>
</Preview>

<h2>Tween on mount</h2>

<Toggle on let:on={show} let:toggle>
  <div class="grid grid-cols-[auto,1fr] gap-2 mb-2">
    <Field label="Show bars" let:id>
      <Switch checked={show} on:change={toggle} {id} size="md" />
    </Field>
  </div>

  <Preview {data}>
    <div class="h-[300px] p-4 border rounded">
      <Chart
        {data}
        x="date"
        xScale={scaleBand().padding(0.4)}
        y="value"
        yDomain={[0, null]}
        yNice={4}
        padding={{ left: 16, bottom: 24 }}
      >
        <Svg>
          <Axis placement="left" grid rule />
          <Axis
            placement="bottom"
            format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
            rule
          />
          {#if show}
            <Bars
              initialY={300 - 16 * 2 - 2 - 24}
              initialHeight={0}
              tweened={{
                y: { duration: 500, easing: cubicInOut },
                height: { duration: 500, easing: cubicInOut },
              }}
              radius={4}
              strokeWidth={1}
              class="fill-primary"
            />
          {/if}
        </Svg>
      </Chart>
    </div>
  </Preview>
</Toggle>

<h2>Grouped</h2>

<Preview data={groupedData}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      data={groupedData}
      flatData={longData}
      x="year"
      xScale={scaleBand().paddingInner(0.4).paddingOuter(0.1)}
      y="values"
      yDomain={extent(groupedData.flatMap((d) => d.values))}
      yNice={4}
      r={(d) => d}
      rScale={scaleOrdinal()}
      rDomain={colorKeys}
      rRange={keyColors}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis placement="bottom" rule />
        <Bars groupBy="fruit" radius={4} strokeWidth={1} />
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Stacked</h2>

<Preview data={stackedData}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      data={stackedData}
      x="year"
      xScale={scaleBand().paddingInner(0.4).paddingOuter(0.1)}
      y="values"
      yDomain={extent(stackedData.flatMap((d) => d.values))}
      yNice={4}
      r={(d) => d.keys[1]}
      rScale={scaleOrdinal()}
      rDomain={colorKeys}
      rRange={keyColors}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis placement="bottom" rule />
        <Bars radius={4} strokeWidth={1} />
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Stacked (Percent)</h2>

<Preview data={stackedPercentData}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      data={stackedPercentData}
      x="year"
      xScale={scaleBand().paddingInner(0.4).paddingOuter(0.1)}
      y="values"
      yDomain={extent(stackedPercentData.flatMap((d) => d.values))}
      yNice={4}
      r={(d) => d.keys[1]}
      rScale={scaleOrdinal()}
      rDomain={colorKeys}
      rRange={keyColors}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="left" grid rule format="percentRound" />
        <Axis placement="bottom" rule />
        <Bars radius={4} strokeWidth={1} />
      </Svg>
    </Chart>
  </div>
</Preview>

<!-- <h2>Stack (Separated)</h2>

<Preview data={stackedSeperatedData}>
	<div class="h-[300px] p-4 border rounded">
		<Chart
			data={stackedSeperatedData}
			x="year"
			xScale={scaleBand().paddingInner(0.4).paddingOuter(0.1)}
			y="values"
      yDomain={extent(stackedSeperatedData.flatMap((d) => d.values))}
      yNice={4}
			r={(d) => d.keys[1]}
			rScale={scaleOrdinal()}
			rDomain={colorKeys}
			rRange={keyColors}
			padding={{ left: 16, bottom: 24 }}
		>
			<Svg>
				<Axis placement="left" grid rule />
				<Axis placement="bottom" rule />
				<Bars radius={4} strokeWidth={1} />
			</Svg>
		</Chart>
	</div>
</Preview> -->

<h2>Grouped and Stacked</h2>

<Preview data={groupedStackedData}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      data={groupedStackedData}
      flatData={longData}
      x="year"
      xScale={scaleBand().paddingInner(0.4).paddingOuter(0.1)}
      y="values"
      yDomain={extent(groupedStackedData.flatMap((d) => d.values))}
      yNice={4}
      r={(d) => d}
      rScale={scaleOrdinal()}
      rDomain={colorKeys}
      rRange={keyColors}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis placement="bottom" rule />
        <Bars groupBy="basket" radius={4} strokeWidth={1} />
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Grouped, Stacked, or Both (transition)</h2>

<div class="grid grid-cols-[1fr,1fr] gap-2 mb-2">
  <Field label="Mode">
    <ToggleGroup bind:value={transitionChartMode} variant="outline" size="sm" inset class="w-full">
      <ToggleOption value="group">Grouped</ToggleOption>
      <ToggleOption value="stack">Stacked</ToggleOption>
      <ToggleOption value="groupStack">Grouped & Stacked</ToggleOption>
    </ToggleGroup>
  </Field>
</div>

<Preview data={transitionData}>
  <div class="h-[300px] p-4 border rounded">
    <!-- Always use stackedData for extents for consistent scale -->
    <Chart
      data={transitionData}
      x="year"
      xScale={scaleBand().paddingInner(0.4).paddingOuter(0.1)}
      y="values"
      yDomain={extent(stackedData.flatMap((d) => d.values))}
      yNice={4}
      r={(d) => {
        // Color by fruit (last key)
        return d.keys.at(-1);
      }}
      rScale={scaleOrdinal()}
      rDomain={colorKeys}
      rRange={keyColors}
      padding={{ left: 16, bottom: 24 }}
      let:data
      let:rScale
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis placement="bottom" rule />
        <g>
          <!-- TODO: 'data' can be used once type issue is resolved -->
          {#each transitionData as bar (bar.keys
            .filter((key) => typeof key !== 'number')
            .join('-'))}
            <Bar
              {bar}
              groupBy={transitionChart.groupBy}
              groupPaddingInner={0.2}
              groupPaddingOuter={0}
              fill={rScale(bar.keys.at(-1))}
              radius={4}
              strokeWidth={1}
              tweened={{
                x: { easing: cubicInOut, delay: transitionChart.groupBy ? 0 : 300 },
                y: { easing: cubicInOut, delay: transitionChart.groupBy ? 300 : 0 },
                width: { easing: cubicInOut, delay: transitionChart.groupBy ? 0 : 300 },
                height: { easing: cubicInOut, delay: transitionChart.groupBy ? 300 : 0 },
              }}
            />
          {/each}
        </g>
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Click handler</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      {data}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yDomain={[0, null]}
      yNice={4}
      padding={{ left: 16, bottom: 24 }}
      tooltip={{
        mode: 'band',
        onClick({ data }) {
          alert('You clicked on:\n' + JSON.stringify(data, null, 2));
        },
      }}
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis
          placement="bottom"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Bars radius={4} strokeWidth={1} class="fill-primary" />
        <Highlight area />
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Click handlers for stack/grouped bars</h2>

<div class="grid grid-cols-[1fr,1fr] gap-2 mb-2">
  <Field label="Mode">
    <ToggleGroup bind:value={transitionChartMode} variant="outline" size="sm" inset class="w-full">
      <ToggleOption value="group">Grouped</ToggleOption>
      <ToggleOption value="stack">Stacked</ToggleOption>
      <ToggleOption value="groupStack">Grouped & Stacked</ToggleOption>
    </ToggleGroup>
  </Field>
</div>

<Preview data={transitionData}>
  <div class="h-[300px] p-4 border rounded">
    <!-- Always use stackedData for extents for consistent scale -->
    <Chart
      data={transitionData}
      x="year"
      xScale={scaleBand().paddingInner(0.4).paddingOuter(0.1)}
      y="values"
      yDomain={extent(stackedData.flatMap((d) => d.values))}
      yNice={4}
      r={(d) => {
        // Color by fruit (last key)
        return d.keys.at(-1);
      }}
      rScale={scaleOrdinal()}
      rDomain={colorKeys}
      rRange={keyColors}
      padding={{ left: 16, bottom: 24 }}
      let:data
      let:rScale
    >
      <Svg>
        <Axis placement="left" grid rule />
        <Axis placement="bottom" rule />
        <g>
          <!-- TODO: 'data' can be used once type issue is resolved -->
          {#each transitionData as bar (bar.keys
            .filter((key) => typeof key !== 'number')
            .join('-'))}
            <Bar
              {bar}
              groupBy={transitionChart.groupBy}
              groupPaddingInner={0.2}
              groupPaddingOuter={0}
              fill={rScale(bar.keys.at(-1))}
              radius={4}
              strokeWidth={1}
              tweened={{
                x: { easing: cubicInOut, delay: transitionChart.groupBy ? 0 : 300 },
                y: { easing: cubicInOut, delay: transitionChart.groupBy ? 300 : 0 },
                width: { easing: cubicInOut, delay: transitionChart.groupBy ? 0 : 300 },
                height: { easing: cubicInOut, delay: transitionChart.groupBy ? 300 : 0 },
              }}
              class="cursor-pointer"
              on:click={(e) => {
                alert('You clicked on:\n' + JSON.stringify(bar, null, 2));
              }}
            />
          {/each}
        </g>
      </Svg>
    </Chart>
  </div>
</Preview>

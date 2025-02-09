<script lang="ts">
  import { cubicInOut } from 'svelte/easing';
  import { scaleBand, scaleOrdinal, scaleTime } from 'd3-scale';
  import { format } from 'date-fns';
  import { extent, mean } from 'd3-array';
  import { stackOffsetExpand } from 'd3-shape';

  import {
    Field,
    ToggleGroup,
    ToggleOption,
    formatDate,
    PeriodType,
    Toggle,
    Switch,
  } from 'svelte-ux';

  import {
    Bar,
    Bars,
    Axis,
    Chart,
    Highlight,
    Labels,
    LinearGradient,
    RectClipPath,
    Rule,
    Svg,
    Text,
    Tooltip,
    TooltipItem,
    createStackData,
    stackOffsetSeparated,
    Pattern,
  } from 'layerchart';

  import Preview from '$lib/docs/Preview.svelte';
  import { createDateSeries, longData } from '$lib/utils/genData.js';

  const data = createDateSeries({
    count: 10,
    min: 20,
    max: 100,
    value: 'integer',
    keys: ['value', 'baseline'],
  });
  const negativeData = createDateSeries({ min: -20, max: 50, value: 'integer' });

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
  });
</script>

<h1>Examples</h1>

<h2>Basic</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      {data}
      x="value"
      xDomain={[0, null]}
      xNice
      y="date"
      yScale={scaleBand().padding(0.4)}
      padding={{ left: 20, bottom: 20 }}
    >
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis
          placement="left"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Bars radius={4} strokeWidth={1} class="fill-primary" />
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Rounded (right-only)</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      {data}
      x="value"
      xDomain={[0, null]}
      xNice
      y="date"
      yScale={scaleBand().padding(0.4)}
      padding={{ left: 20, bottom: 20 }}
    >
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis
          placement="left"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Bars radius={4} rounded="right" strokeWidth={1} class="fill-primary" />
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Tooltip and Highlight</h2>

<Preview {data}>
  <div class="h-[300px] p-4 border rounded">
    <Chart
      {data}
      x="value"
      xDomain={[0, null]}
      xNice
      y="date"
      yScale={scaleBand().padding(0.4)}
      padding={{ left: 16, bottom: 24 }}
      tooltip={{ mode: 'band' }}
    >
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis
          placement="left"
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
      x="value"
      xDomain={[0, null]}
      xNice
      y="date"
      yScale={scaleBand().padding(0.4)}
      padding={{ left: 16, bottom: 24 }}
      tooltip={{ mode: 'band' }}
    >
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis
          placement="left"
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
      x="value"
      xDomain={[0, null]}
      xNice
      y="date"
      yScale={scaleBand().padding(0.4)}
      padding={{ left: 16, bottom: 24 }}
      tooltip={{ mode: 'band' }}
    >
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis
          placement="left"
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
      data={createDateSeries({ count: 10, min: 50, max: 100 })}
      x="value"
      xNice
      y="date"
      yScale={scaleBand().padding(0.4)}
      padding={{ left: 20, bottom: 20 }}
    >
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis
          placement="left"
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
      data={createDateSeries({ count: 10, min: -100, max: -50 })}
      x="value"
      xNice
      y="date"
      yScale={scaleBand().padding(0.4)}
      padding={{ left: 20, bottom: 20 }}
    >
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis
          placement="left"
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
      x="value"
      xNice
      xPadding={[20, 20]}
      y="date"
      yScale={scaleBand().padding(0.4)}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis
          placement="left"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Rule x={0} />
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
      x="value"
      xNice
      y="date"
      yScale={scaleBand().padding(0.4)}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis
          placement="left"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Rule x={0} />
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
      x="value"
      xDomain={[0, null]}
      xNice
      y="date"
      yScale={scaleBand().padding(0.4)}
      padding={{ left: 20, bottom: 20 }}
    >
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis
          placement="left"
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
      x="value"
      xDomain={[0, null]}
      xNice
      y="date"
      yScale={scaleBand().padding(0.4)}
      padding={{ left: 20, bottom: 20 }}
    >
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis
          placement="left"
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
      x="value"
      xDomain={[0, null]}
      xNice
      y="date"
      yScale={scaleBand().padding(0.4)}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis
          placement="left"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <LinearGradient class="from-green-400 to-blue-500" units="userSpaceOnUse" let:url>
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
      x="value"
      xDomain={[0, null]}
      xNice
      y="date"
      yScale={scaleBand().padding(0.4)}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis
          placement="left"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Bars>
          {#each data as bar, i}
            <Bar
              {bar}
              radius={4}
              strokeWidth={1}
              class={i === data.length - 1 ? 'fill-primary' : 'fill-surface-content'}
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
      x="value"
      xDomain={[0, null]}
      xNice
      y="date"
      yScale={scaleBand().padding(0.4)}
      padding={{ left: 20, bottom: 20 }}
    >
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis
          placement="left"
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
      x="value"
      xDomain={[0, null]}
      xNice
      y="date"
      yScale={scaleBand().padding(0.4)}
      padding={{ left: 20, bottom: 20 }}
    >
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis
          placement="left"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Bars radius={4} strokeWidth={1} class="fill-primary" />
        <Highlight
          data={data[3]}
          lines={{ class: 'stroke-2 stroke-danger [stroke-dasharray:4] [stroke-linecap:round] ' }}
          axis="x"
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
      x="value"
      xDomain={[0, null]}
      xNice
      y="date"
      yScale={scaleBand().padding(0.4)}
      padding={{ left: 20, bottom: 20 }}
      let:xScale
    >
      {@const avg = mean(data, (d) => d.value)}
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis
          placement="left"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Bars radius={4} strokeWidth={1} class="fill-primary" />
        <Rule x={avg} class="stroke-2 stroke-danger [stroke-dasharray:4] [stroke-linecap:round] " />
        <Text
          x={xScale(avg)}
          y={0}
          dx={-4}
          value="Avg"
          textAnchor="end"
          verticalAnchor="start"
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
      x="value"
      xDomain={[0, null]}
      xNice
      y="date"
      yScale={scaleBand().padding(0.4)}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Bars radius={4} strokeWidth={1} class="fill-primary" />
        <Axis placement="bottom" grid={{ class: 'stroke-surface-100' }} rule />
        <Axis
          placement="left"
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
      x="value"
      xDomain={[0, null]}
      xNice
      y="date"
      yScale={scaleBand().padding(0.4)}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Bars radius={4} strokeWidth={1} class="fill-primary" />
        <Axis placement="bottom" grid={{ class: 'mix-blend-multiply' }} rule />
        <Axis
          placement="left"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
      </Svg>
    </Chart>
  </div>
</Preview>

<h2>Multiple (overlapping)</h2>

<Preview {data}>
  <div class="h-[500px] p-4 border rounded">
    <Chart
      {data}
      x={(d) => Math.max(d.value, d.baseline)}
      xDomain={[0, null]}
      xNice
      y="date"
      yScale={scaleBand().padding(0.4)}
      padding={{ left: 16, bottom: 24 }}
      tooltip={{ mode: 'band' }}
    >
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis
          placement="left"
          format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
          rule
        />
        <Bars x="baseline" radius={4} strokeWidth={1} class="fill-surface-content/20" />
        <Bars x="value" radius={4} strokeWidth={1} inset={16} class="fill-primary" />
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
        x="value"
        xDomain={[0, null]}
        xNice
        y="date"
        yScale={scaleBand().padding(0.4)}
        padding={{ left: 16, bottom: 24 }}
      >
        <Svg>
          <Axis placement="bottom" grid rule />
          <Axis
            placement="left"
            format={(d) => formatDate(d, PeriodType.Day, { variant: 'short' })}
            rule
          />
          {#if show}
            <Bars
              initialX={0}
              initialWidth={0}
              tweened={{
                x: { duration: 500, easing: cubicInOut },
                width: { duration: 500, easing: cubicInOut },
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
  <div class="h-[400px] p-4 border rounded">
    <Chart
      data={groupedData}
      flatData={longData}
      x="values"
      xDomain={extent(groupedData.flatMap((d) => d.values))}
      xNice
      y="year"
      yScale={scaleBand().paddingInner(0.3).paddingOuter(0.1)}
      r={(d) => d}
      rScale={scaleOrdinal()}
      rDomain={colorKeys}
      rRange={keyColors}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis placement="left" rule />
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
      x="values"
      xDomain={extent(stackedData.flatMap((d) => d.values))}
      xNice
      y="year"
      yScale={scaleBand().paddingInner(0.4).paddingOuter(0.1)}
      r={(d) => d.keys[1]}
      rScale={scaleOrdinal()}
      rDomain={colorKeys}
      rRange={keyColors}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis placement="left" rule />
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
      x="values"
      xDomain={extent(stackedPercentData.flatMap((d) => d.values))}
      xNice
      y="year"
      yScale={scaleBand().paddingInner(0.4).paddingOuter(0.1)}
      r={(d) => d.keys[1]}
      rScale={scaleOrdinal()}
      rDomain={colorKeys}
      rRange={keyColors}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="bottom" grid rule format="percentRound" />
        <Axis placement="left" rule />
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
			x="values"
      xDomain={extent(stackedSeperatedData.flatMap((d) => d.values))}
			xNice
			y="year"
			yScale={scaleBand().paddingInner(0.4).paddingOuter(0.1)}
			r={(d) => d.keys[1]}
			rScale={scaleOrdinal()}
			rDomain={colorKeys}
			rRange={keyColors}
			padding={{ left: 16, bottom: 24 }}
		>
			<Svg>
        <Axis placement="bottom" grid rule />
				<Axis placement="left" rule />
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
      x="values"
      xDomain={extent(groupedStackedData.flatMap((d) => d.values))}
      xNice
      y="year"
      yScale={scaleBand().paddingInner(0.4).paddingOuter(0.1)}
      r={(d) => d}
      rScale={scaleOrdinal()}
      rDomain={colorKeys}
      rRange={keyColors}
      padding={{ left: 16, bottom: 24 }}
    >
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis placement="left" rule />
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
  <div class="h-[400px] p-4 border rounded">
    <!-- Always use stackedData for extents for consistent scale -->
    <Chart
      data={transitionData}
      x="values"
      xDomain={extent(stackedData.flatMap((d) => d.values))}
      xNice
      y="year"
      yScale={scaleBand().paddingInner(0.2).paddingOuter(0.1)}
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
        <Axis placement="bottom" grid rule />
        <Axis placement="left" rule />
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
      x="value"
      xDomain={[0, null]}
      xNice
      y="date"
      yScale={scaleBand().padding(0.4)}
      padding={{ left: 20, bottom: 20 }}
      tooltip={{
        mode: 'band',
        onClick({ data }) {
          alert('You clicked on:\n' + JSON.stringify(data, null, 2));
        },
      }}
    >
      <Svg>
        <Axis placement="bottom" grid rule />
        <Axis
          placement="left"
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
  <div class="h-[400px] p-4 border rounded">
    <!-- Always use stackedData for extents for consistent scale -->
    <Chart
      data={transitionData}
      x="values"
      xDomain={extent(stackedData.flatMap((d) => d.values))}
      xNice
      y="year"
      yScale={scaleBand().paddingInner(0.2).paddingOuter(0.1)}
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
        <Axis placement="bottom" grid rule />
        <Axis placement="left" rule />
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

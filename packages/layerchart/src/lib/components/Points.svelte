<script lang="ts">
  import { type ComponentProps } from 'svelte';
  import { extent } from 'd3-array';
  import { pointRadial } from 'd3-shape';
  import { notNull } from 'svelte-ux';

  import { chartContext } from './ChartContext.svelte';
  import Circle from './Circle.svelte';
  import Link from './Link.svelte';
  import { isScaleBand, type AnyScale } from '../utils/scales.js';

  const context = chartContext() as any;
  const { data: contextData, xGet, y, yGet, xScale, yScale, rGet, config } = context;

  type Offset = number | ((value: number, context: any) => number) | undefined;

  /** Override data instead of using context */
  export let data: any = undefined;

  export let r = 5;
  export let offsetX: Offset = undefined;
  export let offsetY: Offset = undefined;

  /** Use radial instead of cartesian line generator, mapping `x` to `angle` and `y` to `radius`.  Radial points are positioned relative to the origin, use transform (ex. `<Group center>`) to change the origin */
  export let radial = false;

  /** Enable showing links between related points (array x/y accessors) */
  export let links: boolean | Partial<ComponentProps<Link>> = false;

  function getOffset(value: any, offset: Offset, scale: AnyScale) {
    if (typeof offset === 'function') {
      return offset(value, context);
    } else if (offset != null) {
      return offset;
    } else if (isScaleBand(scale) && !radial) {
      return scale.bandwidth() / 2;
    } else {
      return 0;
    }
  }

  $: pointsData = data ?? $contextData;

  $: points = pointsData.flatMap((d: any) => {
    if (Array.isArray($config.x)) {
      /*
				x={["prop1" ,"prop2"]}
				y="prop3"
			*/
      return $xGet(d)
        .filter(notNull)
        .map((x: number) => {
          return {
            x: x + getOffset(x, offsetX, $xScale),
            y: $yGet(d) + getOffset($yGet(d), offsetY, $yScale),
            data: d,
          };
        });
    } else if (Array.isArray($config.y)) {
      /*
				x="prop1"
				y={["prop2" ,"prop3"]}
			*/
      return $yGet(d)
        .filter(notNull)
        .map((y: number) => {
          return {
            x: $xGet(d) + getOffset($xGet(d), offsetX, $xScale),
            y: y + getOffset(y, offsetY, $yScale),
            data: d,
          };
        });
    } else {
      /*
				x="prop1"
				y="prop2"
			*/
      return {
        x: $xGet(d) + getOffset($xGet(d), offsetX, $xScale),
        y: $yGet(d) + getOffset($yGet(d), offsetY, $yScale),
        data: d,
      };
    }
  });

  $: _links = pointsData.flatMap((d: any) => {
    if (Array.isArray($config.x)) {
      /*
				x={["prop1" ,"prop2"]}
				y="prop3"
			*/
      const [xMin, xMax] = extent($xGet(d)) as unknown as [number, number];
      const y = $yGet(d) + getOffset($yGet(d), offsetY, $yScale);
      return {
        source: {
          x: xMin + getOffset(xMin, offsetX, $xScale) + r,
          y,
        },
        target: {
          x: xMax + getOffset(xMax, offsetX, $xScale) - r,
          y: y,
        },
      };
    } else if (Array.isArray($config.y)) {
      /*
				x="prop1"
				y={["prop2" ,"prop3"]}
			*/
      const x = $xGet(d) + getOffset($xGet(d), offsetX, $xScale);
      const [yMin, yMax] = extent($yGet(d)) as unknown as [number, number];
      return {
        source: {
          x: x,
          y: yMin + getOffset(yMin, offsetY, $yScale),
        },
        target: {
          x: x,
          y: yMax + getOffset(yMax, offsetY, $yScale),
        },
      };
    }
  });
</script>

<slot {points}>
  {#if links}
    <g class="link-group">
      {#each _links as link}
        <Link
          data={link}
          class="stroke-surface-content/50"
          {...typeof links === 'object' ? links : null}
        />
      {/each}
    </g>
  {/if}

  <g class="point-group">
    {#each points as point}
      {@const radialPoint = pointRadial(point.x, point.y)}
      <Circle
        cx={radial ? radialPoint[0] : point.x}
        cy={radial ? radialPoint[1] : point.y}
        {r}
        fill={$config.r ? $rGet(point.data) : null}
        {...$$restProps}
      />
    {/each}
  </g>
</slot>

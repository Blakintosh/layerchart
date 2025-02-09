<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { SVGAttributes } from 'svelte/elements';
  import { extent } from 'd3-array';
  import { clamp, cls } from 'svelte-ux';

  import { chartContext } from './ChartContext.svelte';
  import Frame from './Frame.svelte';
  import { localPoint } from '$lib/utils/event.js';
  import Group from './Group.svelte';

  const { xScale, yScale, width, height, padding } = chartContext();

  const dispatch = createEventDispatcher<{
    change: { xDomain?: [any, any]; yDomain?: [any, any] };
    brushStart: { xDomain?: [any, any]; yDomain?: [any, any] };
    brushEnd: { xDomain?: [any, any]; yDomain?: [any, any] };
  }>();

  /** Axis to apply brushing */
  export let axis: 'x' | 'y' | 'both' = 'x';

  /** Size of draggable handles (width/height) */
  export let handleSize = 5;

  /** Only show range while actively brushing.  Useful with `brushEnd` event */
  export let resetOnEnd = false;

  export let xDomain: [number | Date | null, number | Date | null] = $xScale.domain() as [
    number,
    number,
  ];
  export let yDomain: [number | Date | null, number | Date | null] = $yScale.domain() as [
    number,
    number,
  ];

  // Capture original domains for reset()
  const originalXDomain = $xScale.domain() as [number, number];
  const originalYDomain = $yScale.domain() as [number, number];

  $: [xDomainMin, xDomainMax] = extent<number>($xScale.domain()) as [number, number];
  $: [yDomainMin, yDomainMax] = extent<number>($yScale.domain()) as [number, number];

  /** Attributes passed to range <rect> element */
  export let range: SVGAttributes<SVGRectElement> | undefined = undefined;

  /** Attributes passed to handle <rect> elements */
  export let handle: SVGAttributes<SVGRectElement> | undefined = undefined;

  export let classes: {
    root?: string;
    frame?: string;
    range?: string;
    handle?: string;
  } = {};

  let frameEl: SVGRectElement;

  function handler(
    fn: (
      start: {
        xDomain: [number, number];
        yDomain: [number, number];
        value: { x: number; y: number };
      },
      value: { x: number; y: number }
    ) => void
  ) {
    return (e: PointerEvent) => {
      const start = {
        xDomain: [xDomain[0] ?? xDomainMin, xDomain[1] ?? xDomainMax] as [number, number],
        yDomain: [yDomain[0] ?? yDomainMin, yDomain[1] ?? yDomainMax] as [number, number],
        value: {
          x: $xScale.invert?.(localPoint(frameEl, e)?.x ?? 0 - $padding.left),
          y: $yScale.invert?.(localPoint(frameEl, e)?.y ?? 0 - $padding.top),
        },
      };

      dispatch('brushStart', { xDomain, yDomain });

      const onPointerMove = (e: PointerEvent) => {
        fn(start, {
          x: $xScale.invert?.(localPoint(frameEl, e)?.x ?? 0 - $padding.left),
          y: $yScale.invert?.(localPoint(frameEl, e)?.y ?? 0 - $padding.top),
        });

        // if (xDomain[0] === xDomain[1] || yDomain[0] === yDomain[1]) {
        //   // Ignore?
        //   // TODO: What about when using `x` or `y` axis?
        // } else {
        dispatch('change', { xDomain, yDomain });
        // }
      };

      const onPointerUp = (e: PointerEvent) => {
        if (e.target === frameEl) {
          reset();
          dispatch('change', { xDomain, yDomain });
        }

        dispatch('brushEnd', { xDomain, yDomain });

        if (resetOnEnd) {
          reset();
        }

        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    };
  }

  const createRange = handler((start, value) => {
    isActive = true;

    xDomain = [
      clamp(Math.min(start.value.x, value.x), xDomainMin, xDomainMax),
      clamp(Math.max(start.value.x, value.x), xDomainMin, xDomainMax),
    ];

    yDomain = [
      clamp(Math.min(start.value.y, value.y), yDomainMin, yDomainMax),
      clamp(Math.max(start.value.y, value.y), yDomainMin, yDomainMax),
    ];
  });

  const adjustRange = handler((start, value) => {
    const dx = clamp(
      value.x - start.value.x,
      xDomainMin - start.xDomain[0],
      xDomainMax - start.xDomain[1]
    );
    xDomain = [Number(start.xDomain[0]) + dx, Number(start.xDomain[1]) + dx];

    const dy = clamp(
      value.y - start.value.y,
      yDomainMin - start.yDomain[0],
      yDomainMax - start.yDomain[1]
    );
    yDomain = [Number(start.yDomain[0]) + dy, Number(start.yDomain[1]) + dy];
  });

  const adjustBottom = handler((start, value) => {
    yDomain = [
      clamp(value.y > start.yDomain[1] ? start.yDomain[1] : value.y, yDomainMin, yDomainMax),
      clamp(value.y > start.yDomain[1] ? value.y : start.yDomain[1], yDomainMin, yDomainMax),
    ];
  });

  const adjustTop = handler((start, value) => {
    yDomain = [
      clamp(value.y < start.yDomain[1] ? value.y : start.yDomain[0], yDomainMin, yDomainMax),
      clamp(value.y < start.yDomain[1] ? start.yDomain[0] : value.y, yDomainMin, yDomainMax),
    ];
  });

  const adjustLeft = handler((start, value) => {
    xDomain = [
      clamp(value.x > start.xDomain[1] ? start.xDomain[1] : value.x, xDomainMin, xDomainMax),
      clamp(value.x > start.xDomain[1] ? value.x : start.xDomain[1], xDomainMin, xDomainMax),
    ];
  });

  const adjustRight = handler((start, value) => {
    xDomain = [
      clamp(value.x < start.xDomain[0] ? value.x : start.xDomain[0], xDomainMin, xDomainMax),
      clamp(value.x < start.xDomain[0] ? start.xDomain[0] : value.x, xDomainMin, xDomainMax),
    ];
  });

  function reset() {
    isActive = false;

    xDomain = originalXDomain;
    yDomain = originalYDomain;
  }

  function selectAll() {
    xDomain = [xDomainMin, xDomainMax];
    yDomain = [yDomainMin, yDomainMax];
  }

  $: top = $yScale(yDomain[1]);
  $: bottom = $yScale(yDomain[0]);
  $: left = $xScale(xDomain[0]);
  $: right = $xScale(xDomain[1]);

  $: rangeTop = axis === 'both' || axis === 'y' ? top : 0;
  $: rangeLeft = axis === 'both' || axis === 'x' ? left : 0;
  $: rangeWidth = axis === 'both' || axis === 'x' ? right - left : $width;
  $: rangeHeight = axis === 'both' || axis === 'y' ? bottom - top : $height;

  // Set reactively to handle cases where xDomain/yDomain are set externally (ex. `bind:xDomain`)
  $: isActive =
    xDomain[0]?.valueOf() !== originalXDomain[0]?.valueOf() ||
    xDomain[1]?.valueOf() !== originalXDomain[1]?.valueOf() ||
    yDomain[0]?.valueOf() !== originalYDomain[0]?.valueOf() ||
    yDomain[1]?.valueOf() !== originalYDomain[1]?.valueOf();
</script>

<g class={cls('Brush select-none', classes.root, $$props.class)}>
  <Frame
    class={cls('frame', 'fill-transparent', classes.frame)}
    on:pointerdown={createRange}
    on:dblclick={() => selectAll()}
    bind:rectEl={frameEl}
  />

  {#if isActive}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <Group x={rangeLeft} y={rangeTop} class="range">
      <slot name="range" {rangeWidth} {rangeHeight}>
        <rect
          width={rangeWidth}
          height={rangeHeight}
          class={cls(
            'cursor-move select-none',
            range?.fill == null && 'fill-surface-content/10',
            classes.range
          )}
          on:pointerdown={adjustRange}
          on:dblclick={() => reset()}
          {...range}
        />
      </slot>
    </Group>

    {#if axis === 'both' || axis === 'y'}
      <Group
        x={rangeLeft}
        y={rangeTop}
        class="handle top"
        on:pointerdown={adjustTop}
        on:dblclick={() => {
          yDomain[0] = yDomainMin;
          dispatch('change', { xDomain, yDomain });
        }}
      >
        <slot name="handle" edge="top" {rangeWidth} {rangeHeight}>
          <rect
            width={rangeWidth}
            height={handleSize}
            class={cls('fill-transparent cursor-ns-resize select-none', classes.handle)}
            {...handle}
          />
        </slot>
      </Group>

      <Group
        x={rangeLeft}
        y={bottom - handleSize + 1}
        class="handle bottom"
        on:pointerdown={adjustBottom}
        on:dblclick={() => {
          yDomain[1] = yDomainMax;
        }}
      >
        <slot name="handle" edge="bottom" {rangeWidth} {rangeHeight}>
          <rect
            width={rangeWidth}
            height={handleSize}
            class={cls('fill-transparent cursor-ns-resize select-none', classes.handle)}
            {...handle}
          />
        </slot>
      </Group>
    {/if}

    {#if axis === 'both' || axis === 'x'}
      <Group
        x={rangeLeft}
        y={rangeTop}
        class="handle left"
        on:pointerdown={adjustLeft}
        on:dblclick={() => {
          xDomain[0] = xDomainMin;
          dispatch('change', { xDomain, yDomain });
        }}
      >
        <slot name="handle" edge="left" {rangeWidth} {rangeHeight}>
          <rect
            width={handleSize}
            height={rangeHeight}
            class={cls('fill-transparent cursor-ew-resize select-none', classes.handle)}
            {...handle}
          />
        </slot>
      </Group>

      <Group
        x={right - handleSize + 1}
        y={rangeTop}
        class="handle right"
        on:pointerdown={adjustRight}
        on:dblclick={() => {
          xDomain[1] = xDomainMax;
          dispatch('change', { xDomain, yDomain });
        }}
      >
        <slot name="handle" edge="right" {rangeWidth} {rangeHeight}>
          <rect
            width={handleSize}
            height={rangeHeight}
            class={cls('fill-transparent cursor-ew-resize select-none', classes.handle)}
            {...handle}
          />
        </slot>
      </Group>
    {/if}

    <!-- TODO: Add diagonal/corner handles -->
  {/if}
</g>

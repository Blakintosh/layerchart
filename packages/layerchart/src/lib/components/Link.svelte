<script lang="ts">
  /*
		TODO:
		- [ ] Show path progressively show / animated in on load.  Also fix sliding in from left side (at last in from bottom)
    - [ ] Support link types
      - [ ] https://airbnb.io/visx/linktypes
        - [ ] https://github.com/airbnb/visx/tree/master/packages/visx-shape/src/shapes/link
      - [ ] https://observablehq.com/@nitaku/corner-connectors
      - [ ] Straight
      - [ ] Square
      - [ ] Beveled
      - [ ] Rounded
    - [ ] Investigate: https://observablehq.com/@fil/sankey-link-paths
    - [ ] Use for annotations - https://github.com/techniq/layerchart/issues/11
	*/
  import type { tweened as tweenedStore } from 'svelte/motion';
  import { link as d3Link, curveBumpX, curveBumpY } from 'd3-shape';
  import { interpolatePath } from 'd3-interpolate-path';

  import { motionStore } from '$lib/stores/motionStore.js';

  // Override what is used from context
  export let data: any = undefined; // TODO: Update Type

  /**
   * Update source and target accessors to be compatible with d3-sankey.  see: https://github.com/d3/d3-sankey#sankeyLinkHorizontal
   */
  export let sankey = false;
  export let source = sankey ? (d: any) => [d.source.x1, d.y0] : (d: any) => d.source;
  export let target = sankey ? (d: any) => [d.target.x0, d.y1] : (d: any) => d.target;

  /** Convenient property to swap x/y accessor logic */
  export let orientation: 'vertical' | 'horizontal' = sankey ? 'horizontal' : 'vertical';
  export let x = (d: any) => (sankey ? d[0] : orientation === 'horizontal' ? d.y : d.x);
  export let y = (d: any) => (sankey ? d[1] : orientation === 'horizontal' ? d.x : d.y);
  export let curve = orientation === 'horizontal' ? curveBumpX : curveBumpY;

  export let tweened: boolean | Parameters<typeof tweenedStore>[1] = undefined;
  // @ts-expect-error
  $: tweenedOptions = tweened ? { interpolate: interpolatePath, ...tweened } : false;
  $: tweened_d = motionStore('', { tweened: tweenedOptions });

  $: {
    orientation; // subscribe to orientation changes to update link
    const link = d3Link(curve).source(source).target(target).x(x).y(y);
    const d = link(data) ?? '';
    tweened_d.set(d);
  }
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<path
  class="path-link"
  d={$tweened_d}
  fill="none"
  on:click
  on:pointerover
  on:pointermove
  on:pointerout
  on:pointerleave
  {...$$restProps}
/>

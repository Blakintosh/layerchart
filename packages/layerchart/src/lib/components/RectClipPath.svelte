<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { uniqueId } from 'svelte-ux';

  import ClipPath from './ClipPath.svelte';
  import Rect from './Rect.svelte';

  /** Unique id for clipPath */
  export let id: string = uniqueId('clipPath-');

  export let x: number = 0;
  export let y: number = 0;
  export let width: number;
  export let height: number;
  export let spring: ComponentProps<Rect>['spring'] = undefined;
  export let tweened: ComponentProps<Rect>['tweened'] = undefined;
</script>

<ClipPath {id} let:url>
  <Rect slot="clip" {x} {y} {width} {height} {spring} {tweened} {...$$restProps} />
  <slot {id} {url} />
</ClipPath>

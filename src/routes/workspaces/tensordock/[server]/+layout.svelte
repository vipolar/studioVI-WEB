<script lang="ts">
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<pre>{JSON.stringify(data.server, null, 2)}</pre>
<div>s</div>

{@render children()}

<style>
	pre, div {
		background: white;
	}
</style>

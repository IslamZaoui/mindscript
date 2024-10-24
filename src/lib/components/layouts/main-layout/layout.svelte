<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		header: Snippet;
		footer: Snippet;
		children: Snippet;
	}

	let { header, footer, children }: Props = $props();
</script>

<div class="flex min-h-screen flex-col">
	{@render header()}

	<main class="min-h-screen flex-1">
		{@render children()}
	</main>

	{@render footer()}
</div>

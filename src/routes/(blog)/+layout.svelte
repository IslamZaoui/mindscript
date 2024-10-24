<script>
	import * as Layout from '@/components/layouts/main-layout';
	let { data, children } = $props();
</script>

<Layout.Root>
	{#snippet header()}
		<Layout.Header user={data.user} />
	{/snippet}

	{@render children()}

	{#snippet footer()}
		<Layout.Footer />
	{/snippet}
</Layout.Root>

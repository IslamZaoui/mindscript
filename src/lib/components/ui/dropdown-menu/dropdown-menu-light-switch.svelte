<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive, type WithElementRef } from 'bits-ui';
	import { setMode, mode } from 'mode-watcher';
	import { cn } from '@/utils/shadcn.js';
	import { Switch } from '@/components/ui/switch';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	let theme = $state($mode == 'dark' ? false : true);
	const toggleTheme = () => {
		theme = !theme;
		setMode(!theme ? 'dark' : 'light');
	};
</script>

<div bind:this={ref} class={cn('px-2 py-1.5 flex items-center justify-between text-sm font-semibold', className)} {...restProps}>
	<label for="light-switch">Theme</label>
	<Switch name="light-switch" checked={theme} onCheckedChange={toggleTheme} />
</div>

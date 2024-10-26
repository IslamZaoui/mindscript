<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { setMode, mode } from 'mode-watcher';
	import { cn } from '@/utils/shadcn.js';
	import { Switch } from '@/components/ui/switch';

	let { class: className = undefined, ...restProps }: DropdownMenuPrimitive.LabelProps = $props();

	let theme = $state($mode == 'dark' ? false : true);
	const toggleTheme = () => {
		theme = !theme;
		setMode(!theme ? 'dark' : 'light');
	};
</script>

<DropdownMenuPrimitive.Label
	class={cn('flex items-center justify-between px-2 py-1.5 text-sm font-semibold', className)}
	{...restProps}
>
	<label for="light-switch">Theme</label>
	<Switch name="light-switch" includeInput checked={theme} onCheckedChange={toggleTheme} />
</DropdownMenuPrimitive.Label>

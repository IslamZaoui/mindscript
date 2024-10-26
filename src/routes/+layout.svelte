<script>
	import '../app.css';
	import { Toaster } from '@/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { setSonner } from '@/utils/sonner';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';

	export const flash = getFlash(page);
	let { children } = $props();

	$effect(() => {
		if ($flash) {
			setSonner($flash);
			$flash = undefined;
		}
	});
</script>

<ModeWatcher />
<Toaster position="top-center" />
{@render children()}

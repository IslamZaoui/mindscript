<script>
	import '../app.css';
	import { Toaster } from '@/components/ui/sonner';
	import { setSonner } from '@/utils/sonner';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';

	export const flash = getFlash(page);

	$: if ($flash) {
		setSonner($flash);
		$flash = undefined;
	}
</script>

<Toaster position="bottom-right" />
<slot />

import { toast } from 'svelte-sonner';

export const setSonner = ($flash: Flash) => {
	switch ($flash.type) {
		case 'success':
			toast.success($flash.message, {
				description: $flash.description
			});
			break;
		case 'error':
			toast.error($flash.message, {
				description: $flash.description
			});
			break;
		case 'info':
			toast.info($flash.message, {
				description: $flash.description
			});
			break;
		case 'warning':
			toast.warning($flash.message, {
				description: $flash.description
			});
	}
};

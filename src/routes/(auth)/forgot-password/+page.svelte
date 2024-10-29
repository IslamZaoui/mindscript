<script lang="ts">
	import ForgotPasswordForm from '@/components/forms/forgot-password-form.svelte';
	import Feather from 'lucide-svelte/icons/feather';

	let { data } = $props();
</script>

<div class="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
	<div class="w-full max-w-md space-y-8">
		<div class="flex flex-col items-center space-y-2 text-center">
			<Feather class="h-12 w-12 text-primary" />
			<h1 class="text-2xl font-bold">Forgot your password?</h1>
			<p class="text-muted-foreground">No worries, we'll send you reset instructions.</p>
		</div>

		<ForgotPasswordForm data={data.form} />

		<div class="text-center">
			<a
				href={!data.user ? '/sign-in' : `/${data.user.username}`}
				class="text-sm text-primary hover:underline"
			>
				{!data.user ? 'Back to Sign In' : 'Back to Profile'}
			</a>
		</div>
	</div>
</div>

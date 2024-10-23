<script lang="ts">
	import ResetPasswordForm from '@/components/forms/reset-password-form.svelte';
	import Feather from 'lucide-svelte/icons/feather';

	export let data;
</script>

<div class="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
	<div class="w-full max-w-md space-y-8">
		<div class="flex flex-col items-center space-y-2 text-center">
			<Feather class="h-12 w-12 text-primary" />
			<h1 class="text-2xl font-bold">Reset your password?</h1>
			<p class="text-muted-foreground">Enter the code we sent to your email</p>
		</div>

		<ResetPasswordForm data={data.form} />
	</div>
</div>

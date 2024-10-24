<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '@/components/ui/button';
	import Feather from 'lucide-svelte/icons/feather';
	import Mail from 'lucide-svelte/icons/mail';
	import { onDestroy } from 'svelte';
	import LogOut from 'lucide-svelte/icons/log-out';
	import EmailVerificationForm from '@/components/forms/email-verification-form.svelte';
	import { formatTime } from '@/utils/format';

	let { data } = $props();

	let timeToExpire = $state<number>(0);

	function updateCountdown() {
		timeToExpire = Math.max(
			0,
			Math.floor((data.expiresAt.getTime() - new Date().getTime()) / 1000)
		);
	}

	const interval = setInterval(updateCountdown, 1000);

	onDestroy(() => clearInterval(interval));
</script>

<div class="container relative mx-auto flex min-h-screen flex-col items-center justify-center p-4">
	<div class="w-full max-w-md space-y-8">
		<div class="flex flex-col items-center space-y-2 text-center">
			<Feather class="h-12 w-12 text-primary" />
			<h1 class="text-2xl font-bold">Verify your email</h1>
			<p class="text-muted-foreground">
				We've sent a verification code to <strong>{data.email}</strong>.
			</p>
		</div>

		<div class="space-y-4 rounded-lg bg-muted p-6">
			<div class="flex items-center space-x-2 text-muted-foreground">
				<Mail class="h-5 w-5" />
				<p>Enter the 8-digit code sent to your email</p>
			</div>

			<EmailVerificationForm data={data.form} />

			<div class="flex items-center justify-between">
				<form action="?/resend" method="post" use:enhance>
					<Button type="submit" variant="link">Resend code</Button>
				</form>
				{#if timeToExpire > 0}
					<p class="text-sm text-muted-foreground">
						code will expire in {formatTime(timeToExpire)}
					</p>
				{/if}
			</div>
		</div>
	</div>

	<Button class="absolute right-4 top-6" variant="outline" size="icon" href="/sign-out">
		<LogOut />
		<span class="sr-only">sign out</span>
	</Button>
</div>

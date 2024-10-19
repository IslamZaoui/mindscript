<script>
	import SignInForm from '@/components/forms/sign-in-form.svelte';
import Feather from 'lucide-svelte/icons/feather';

	export let data;
</script>

<div class="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
	<div class="w-full max-w-md space-y-8">
		<div class="flex flex-col items-center space-y-2 text-center">
			<Feather class="h-12 w-12 text-primary" />
			<h1 class="text-2xl font-bold">Welcome back to MindScript</h1>
			<p class="text-muted-foreground">Sign in to continue your writing journey</p>
		</div>

        <SignInForm data={data.form} />

		<p class="text-center text-sm text-muted-foreground">
			Don't have an account?{' '}
			<a href="/sign-up" class="underline"> Sign up </a>
		</p>
	</div>
</div>

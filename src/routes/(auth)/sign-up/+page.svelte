<script>
	import SignUpForm from '@/components/forms/sign-up-form.svelte';
	import Feather from 'lucide-svelte/icons/feather';
	import Github from 'lucide-svelte/icons/github';
	import { Button } from '@/components/ui/button';

	let { data } = $props();
</script>

<div class="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
	<div class="w-full max-w-md space-y-8">
		<div class="flex flex-col items-center space-y-2 text-center">
			<Feather class="h-12 w-12 text-primary" />
			<h1 class="text-2xl font-bold">Create your MindScript account</h1>
			<p class="text-muted-foreground">Start your writing journey with MindScript</p>
		</div>

		<SignUpForm data={data.form} />

		<div class="my-4 flex items-center justify-center">
			<div class="w-full border-t border-muted-foreground"></div>
			<span class="mx-2 text-muted-foreground">or</span>
			<div class="w-full border-t border-muted-foreground"></div>
		</div>

		<Button href="/api/auth/github" variant="outline" class="w-full">
			<Github class="mr-2 size-4" />
			<span>Sign in with github</span>
		</Button>

		<p class="text-center text-sm text-muted-foreground">
			Already have an account?{' '}
			<a href="/sign-in" class="underline"> Sign in </a>
		</p>
	</div>
</div>

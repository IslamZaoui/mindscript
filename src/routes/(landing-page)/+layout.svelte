<script class="ts">
	import Feather from 'lucide-svelte/icons/feather';
</script>

<div class="flex min-h-screen flex-col">
	<header class="flex h-14 items-center border-b px-4 lg:px-6">
		<a class="flex items-center justify-center" href="/">
			<Feather class="mr-2 h-6 w-6 text-primary" />
			<span class="font-bold text-primary">MindScript</span>
		</a>
		<nav class="ml-auto flex gap-4 sm:gap-6">
			<a class="text-sm font-medium text-muted-foreground hover:text-primary" href="/sign-in"> Sign In </a>
		</nav>
	</header>

	<main class="flex-1">
		<slot />
	</main>

	<footer
		class="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6"
	>
		<p class="text-xs text-muted-foreground">© 2024 MindScript. All rights reserved.</p>
		<nav class="flex gap-4 sm:ml-auto sm:gap-6">
			<a class="text-xs text-muted-foreground hover:text-primary" href="##"> Terms of Service </a>
			<a class="text-xs text-muted-foreground hover:text-primary" href="##"> Privacy </a>
		</nav>
	</footer>
</div>

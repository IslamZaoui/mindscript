<script lang="ts">
	import type { User } from '@/server/auth';
	import { Feather } from 'lucide-svelte';
	import UserMenu from './user-menu.svelte';

	interface Props {
		user: User | null;
	}

	let { user }: Props = $props();
</script>

<header class="flex h-14 items-center border-b px-4 lg:px-6">
	<a class="flex items-center justify-center" href="/">
		<Feather class="mr-2 h-6 w-6 text-primary" />
		<span class="font-bold text-primary">MindScript</span>
	</a>
	<nav class="ml-auto flex gap-4 sm:gap-6">
		{#if !user}
			<a class="text-sm font-medium text-muted-foreground hover:text-primary" href="/sign-in">
				Sign In
			</a>
		{:else}
			<UserMenu {user} />
		{/if}
	</nav>
</header>

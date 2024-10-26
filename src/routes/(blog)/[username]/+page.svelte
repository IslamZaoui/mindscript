<script>
	import * as Avatar from '@/components/ui/avatar';
	import { Badge } from '@/components/ui/badge';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import Mail from 'lucide-svelte/icons/mail';
	import MapPin from 'lucide-svelte/icons/map-pin';
	import Calendar from 'lucide-svelte/icons/calendar';
	import Settings from 'lucide-svelte/icons/settings';
	import Globe from 'lucide-svelte/icons/globe';

	let { data } = $props();
	let user = $derived(data.userProfile);
</script>

<div class="container mx-auto px-4 py-8">
	<div class="flex flex-col gap-8 md:flex-row">
		<aside class="w-full md:w-1/4">
			<Card.Root>
				<Card.Header>
					<div class="flex items-center space-x-4">
						<Avatar.Root class="h-20 w-20">
							<Avatar.Image src={user.image} alt={user.username} />
							<Avatar.Fallback>{user.username[0]}</Avatar.Fallback>
						</Avatar.Root>
						<div class="flex-1 space-y-1">
							<Card.Title>
								{user.username}
								{#if user.id === data.user?.id}
									<Badge class="ml-1 " variant="secondary">You</Badge>
								{/if}
							</Card.Title>
							{#if user.bio}
								<Card.Description>{user.bio}</Card.Description>
							{/if}
						</div>
					</div>
				</Card.Header>
				<Card.Content>
					<div class="space-y-4">
						<div class="flex items-center">
							<Mail class="mr-2 h-4 w-4" />
							<a href="mailto:{user.email}">{user.email}</a>
						</div>
						{#if user.location}
							<div class="flex items-center">
								<MapPin class="mr-2 h-4 w-4" />
								<span>{user.location}</span>
							</div>
						{/if}
						{#if user.website}
							<div class="flex items-center">
								<Globe class="mr-2 h-4 w-4" />
								<a href={user.website}>{user.website}</a>
							</div>
						{/if}
						<div class="flex items-center">
							<Calendar class="mr-2 h-4 w-4" />
							<span>Joined {user.createdAt.toDateString()}</span>
						</div>
					</div>
				</Card.Content>
				<Card.Footer class="flex justify-between">
					{#if user.id == data.user?.id}
						<Button href="/settings#profile" variant="outline" class="w-full">
							<Settings class="mr-2 h-4 w-4" />
							Edit Profile
						</Button>
					{/if}
				</Card.Footer>
			</Card.Root>
		</aside>

		<main class="w-full md:w-3/4">
			<h2 class="mb-6 text-2xl font-bold">Posts</h2>
			<div class="space-y-6">
				{#await data.getUserPosts}
					<p>Loading...</p>
				{:then posts}
					{#each posts as post}
						<Card.Root>
							<Card.Header>
								<Card.Title>{post.title}</Card.Title>
								<Card.Description>{post.createdAt}</Card.Description>
							</Card.Header>
							<Card.Content>
								<p>{post.description}</p>
							</Card.Content>
							<Card.Footer>
								<Button variant="outline">Read More</Button>
							</Card.Footer>
						</Card.Root>
					{:else}
						<p>No posts found.</p>
					{/each}
				{/await}
			</div>
		</main>
	</div>
</div>

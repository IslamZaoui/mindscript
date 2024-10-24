<script>
	import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
	import { Badge } from '@/components/ui/badge';
	import { Button } from '@/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '@/components/ui/card';
	import { Mail, MapPin, Calendar, Settings, Globe } from 'lucide-svelte';

	let { data } = $props();
	let user = $derived(data.userProfile);
</script>

<div class="container mx-auto px-4 py-8">
	<div class="flex flex-col gap-8 md:flex-row">
		<aside class="w-full md:w-1/4">
			<Card>
				<CardHeader>
					<div class="flex items-center space-x-4">
						<Avatar class="h-20 w-20">
							<AvatarImage src={user.image} alt={user.username} />
							<AvatarFallback>{user.username[0]}</AvatarFallback>
						</Avatar>
						<div>
							<CardTitle>
                                {user.username}
                                {#if user.id === data.user?.id}
                                    <Badge variant="secondary">You</Badge>
                                {/if}
                            </CardTitle>
							{#if user.bio}
								<CardDescription>{user.bio}</CardDescription>
							{/if}
						</div>
					</div>
				</CardHeader>
				<CardContent>
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
				</CardContent>
				<CardFooter class="flex justify-between">
					{#if user.id == data.user?.id}
						<Button variant="outline" class="w-full">
							<Settings class="mr-2 h-4 w-4" />
							Edit Profile
						</Button>
					{/if}
				</CardFooter>
			</Card>
		</aside>

		<main class="w-full md:w-3/4">
			<h2 class="mb-6 text-2xl font-bold">My Blog Posts</h2>
			<div class="space-y-6">
				{#await data.getUserPosts}
					<p>Loading...</p>
				{:then posts}
					{#each posts as post}
						<Card>
							<CardHeader>
								<CardTitle>{post.title}</CardTitle>
								<CardDescription>{post.createdAt}</CardDescription>
							</CardHeader>
							<CardContent>
								<p>{post.description}</p>
							</CardContent>
							<CardFooter>
								<Button variant="outline">Read More</Button>
							</CardFooter>
						</Card>
					{:else}
						<p>No posts found.</p>
					{/each}
				{/await}
			</div>
		</main>
	</div>
</div>

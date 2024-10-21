<script>
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import Edit from 'lucide-svelte/icons/square-pen';
	import Users from 'lucide-svelte/icons/users';
	import TrendingUp from 'lucide-svelte/icons/trending-up';
</script>

<section class="w-full bg-background py-12 md:py-24 lg:py-32 xl:py-48">
	<div class="container px-4 md:px-6">
		<div class="flex flex-col items-center space-y-4 text-center">
			<div class="space-y-2">
				<h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
					Welcome to MindScript
				</h1>
				<p class="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
					Unleash your creativity, share your stories, and connect with readers from around the
					world.
				</p>
			</div>
			<div class="space-x-4">
				<Button href="/sign-up">Get Started</Button>
				<Button variant="outline">Learn More</Button>
			</div>
		</div>
	</div>
</section>

<section class="w-full bg-muted py-12 md:py-24 lg:py-32">
	<div class="container px-4 md:px-6">
		<h2 class="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
			Why Choose MindScript?
		</h2>
		<div class="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
			<Card.Root>
				<Card.Header>
					<Edit class="mb-2 h-8 w-8 text-primary" />
					<Card.Title>Easy Writing</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground">
						Our intuitive editor makes writing and formatting a breeze.
					</p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Users class="mb-2 h-8 w-8 text-primary" />
					<Card.Title>Engaged Community</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground">Connect with like-minded writers and readers.</p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<TrendingUp class="mb-2 h-8 w-8 text-primary" />
					<Card.Title>Grow Your Audience</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground">
						Reach more readers with our smart distribution system.
					</p>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</section>

<section class="w-full bg-background py-12 md:py-24 lg:py-32">
	<div class="container px-4 md:px-6">
		<div class="flex flex-col items-center justify-center space-y-4 text-center">
			<div class="space-y-2">
				<h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
					Start Writing Today
				</h2>
				<p
					class="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
				>
					Join thousands of writers who have already found their voice on MindScript.
				</p>
			</div>
			<div class="w-full max-w-sm space-y-2">
				<Button href="/sign-up" class="w-full">Get Started</Button>
				<p class="text-xs text-muted-foreground">
					By signing up, you agree to our{' '}
					<a class="underline underline-offset-2 hover:text-primary" href="##">
						Terms & Conditions
					</a>
				</p>
			</div>
		</div>
	</div>
</section>

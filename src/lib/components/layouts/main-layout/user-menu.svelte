<script lang="ts">
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import * as Avatar from '@/components/ui/avatar';
	import type { User } from '@/server/auth';

	interface Props {
		user: User;
	}

	let { user }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Avatar.Root class="size-8">
			<Avatar.Image src={user.image} alt={user.username} />
			<Avatar.Fallback>{user.username[0]}</Avatar.Fallback>
		</Avatar.Root>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label class="flex flex-col">
				<span class="text-sm font-medium">{user.username}</span>
				<span class="text-xs text-muted-foreground">{user.email}</span>
			</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item href="/{user.username}">Profile</DropdownMenu.Item>
			<DropdownMenu.Item href="/settings">Settings</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.LightSwitch />
			<DropdownMenu.Separator />
			<DropdownMenu.Item href="/sign-out">Sign out</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

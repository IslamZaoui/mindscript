<script lang="ts">
	import { updateUserInfoSchema } from '@/schemas';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { Textarea } from '@/components/ui/textarea';
	import type { User } from '@/server/auth';
	import { Button } from '@/components/ui/button';

	interface Props {
		data: SuperValidated<Infer<typeof updateUserInfoSchema>>;
	}

	let { data }: Props = $props();

	const form = superForm(data, {
		dataType: 'json',
		resetForm: false,
		validators: zod(updateUserInfoSchema)
	});
	const { form: formData, enhance, delayed } = form;
</script>

<form method="post" use:enhance action="?/updateUserInfo" class="space-y-2">
	<Form.Field {form} name="username">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Username</Form.Label>
				<Input
					autocomplete="username"
					placeholder="Username..."
					type="text"
					{...props}
					bind:value={$formData.username}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="text-[12px]" />
	</Form.Field>
	<Form.Field {form} name="bio">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Bio</Form.Label>
				<Textarea placeholder="bio..." {...props} bind:value={$formData.bio} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="text-[12px]" />
	</Form.Field>
	<Form.Field {form} name="location">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Location</Form.Label>
				<Input placeholder="location..." type="text" {...props} bind:value={$formData.location} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="text-[12px]" />
	</Form.Field>
	<Form.Field {form} name="website">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Website</Form.Label>
				<Input placeholder="website..." type="url" {...props} bind:value={$formData.website} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="text-[12px]" />
	</Form.Field>

	<Button type="submit" disabled={$delayed}>
		{$delayed ? 'Updating...' : 'Update'}
	</Button>
</form>

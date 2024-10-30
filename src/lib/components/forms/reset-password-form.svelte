<script lang="ts">
	import * as Form from '@/components/ui/form';
	import { resetPasswordSchema } from '@/schemas';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';

	interface Props {
		data: SuperValidated<Infer<typeof resetPasswordSchema>>;
	}

	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zod(resetPasswordSchema)
	});
	const { form: formData, enhance, delayed } = form;
</script>

<form method="post" use:enhance class="space-y-2">
	<Form.Field {form} name="code">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password Reset Code</Form.Label>
				<Input
					placeholder="code..."
					autocomplete="one-time-code"
					type="text"
					{...props}
					bind:value={$formData.code}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="text-[12px]" />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>New Password</Form.Label>
				<Input
					placeholder="new password..."
					type="password"
					autocomplete="new-password"
					{...props}
					bind:value={$formData.password}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="text-[12px]" />
	</Form.Field>
	<Form.Field {form} name="confirmPassword">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Confirm New Password</Form.Label>
				<Input
					placeholder="confirm new password..."
					type="password"
					autocomplete="new-password"
					{...props}
					bind:value={$formData.confirmPassword}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="text-[12px]" />
	</Form.Field>
	<Button type="submit" class="w-full" disabled={$delayed}>
		{$delayed ? 'Changing...' : 'Change password'}
	</Button>
</form>

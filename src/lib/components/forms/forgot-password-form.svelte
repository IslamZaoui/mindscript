<script lang="ts">
	import * as Form from '@/components/ui/form';
	import { forgotPasswordSchema } from '@/schemas';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';

	interface Props {
		data: SuperValidated<Infer<typeof forgotPasswordSchema>>;
	}

	let { data }: Props = $props();
	const form = superForm(data, {
		validators: zod(forgotPasswordSchema)
	});
	const { form: formData, enhance, delayed } = form;
</script>

<form method="post" use:enhance class="space-y-2">
	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Your email</Form.Label>
				<Input placeholder="email..." type="email" {...props} bind:value={$formData.email} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="text-[12px]" />
	</Form.Field>
	<Button type="submit" class="w-full" disabled={$delayed}>
		{$delayed ? 'Sending...' : 'Send reset email'}
	</Button>
</form>

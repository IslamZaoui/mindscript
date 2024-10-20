<script lang="ts">
	import * as Form from '@/components/ui/form';
	import { resetPasswordSchema } from '@/schemas';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';

	export let data: SuperValidated<Infer<typeof resetPasswordSchema>>;

	const form = superForm(data, {
		validators: zod(resetPasswordSchema)
	});
	const { form: formData, enhance, delayed } = form;
</script>

<form method="post" use:enhance class="space-y-2">
	<Form.Field {form} name="code">
		<Form.Control let:attrs>
			<Form.Label>Password Reset Code</Form.Label>
			<Input placeholder="code..." type="text" {...attrs} bind:value={$formData.code} />
		</Form.Control>
		<Form.FieldErrors class="text-[12px]" />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<Input placeholder="password..." type="password" {...attrs} bind:value={$formData.password} />
		</Form.Control>
		<Form.FieldErrors class="text-[12px]" />
	</Form.Field>
	<Form.Field {form} name="confirmPassword">
		<Form.Control let:attrs>
			<Form.Label>Confirm Password</Form.Label>
			<Input
				placeholder="confirm password..."
				type="password"
				{...attrs}
				bind:value={$formData.confirmPassword}
			/>
		</Form.Control>
		<Form.FieldErrors class="text-[12px]" />
	</Form.Field>
	<Button type="submit" class="w-full" disabled={$delayed}>
		{$delayed ? 'Changing...' : 'Change password'}
	</Button>
</form>

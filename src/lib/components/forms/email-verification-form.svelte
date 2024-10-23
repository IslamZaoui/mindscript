<script lang="ts">
	import * as Form from '@/components/ui/form';
	import { emailVerificationCodeSchema } from '@/schemas';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';

	interface Props {
		data: SuperValidated<Infer<typeof emailVerificationCodeSchema>>;
	}

	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zod(emailVerificationCodeSchema)
	});
	const { form: formData, enhance, delayed } = form;
</script>

<form method="post" action="?/verifyEmail" use:enhance class="space-y-2">
	<Form.Field {form} name="code">
		<Form.Control let:attrs>
			<Form.Label>Verification Code</Form.Label>
			<Input
				placeholder="code..."
				type="text"
				autocomplete="one-time-code"
				{...attrs}
				bind:value={$formData.code}
			/>
		</Form.Control>
		<Form.FieldErrors class="text-[12px]" />
	</Form.Field>
	<Button type="submit" class="w-full" disabled={$delayed}>
		{$delayed ? 'Verifying...' : 'Verify Email'}
	</Button>
</form>

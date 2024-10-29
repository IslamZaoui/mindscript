<script lang="ts">
	import * as Form from '@/components/ui/form';
	import { signUpSchema } from '@/schemas';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import { Checkbox } from '@/components/ui/checkbox';

	interface Props {
		data: SuperValidated<Infer<typeof signUpSchema>>;
	}

	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zod(signUpSchema)
	});
	const { form: formData, enhance, delayed } = form;
</script>

<form method="post" use:enhance class="space-y-6">
	<Form.Field {form} name="username">
		<Form.Control let:attrs>
			<Form.Label>Username</Form.Label>
			<Input
				autocomplete="username"
				placeholder="username..."
				type="text"
				{...attrs}
				bind:value={$formData.username}
			/>
		</Form.Control>
		<Form.FieldErrors class="text-[12px]" />
	</Form.Field>
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input
				autocomplete="email"
				placeholder="Email..."
				type="email"
				{...attrs}
				bind:value={$formData.email}
			/>
		</Form.Control>
		<Form.FieldErrors class="text-[12px]" />
	</Form.Field>
	<div class="flex gap-2">
		<Form.Field {form} class="flex-1" name="password">
			<Form.Control let:attrs>
				<Form.Label>Password</Form.Label>
				<Input
					autocomplete="new-password"
					placeholder="password..."
					type="password"
					{...attrs}
					bind:value={$formData.password}
				/>
			</Form.Control>
			<Form.FieldErrors class="text-[12px]" />
		</Form.Field>
		<Form.Field {form} class="flex-1" name="confirmPassword">
			<Form.Control let:attrs>
				<Form.Label>Confirm Password</Form.Label>
				<Input
					autocomplete="new-password"
					placeholder="confirm password..."
					type="password"
					{...attrs}
					bind:value={$formData.confirmPassword}
				/>
			</Form.Control>
			<Form.FieldErrors class="text-[12px]" />
		</Form.Field>
	</div>
	<Form.Field {form} name="tos">
		<Form.Control let:attrs>
			<div class="flex flex-row items-center space-x-3 space-y-0">
				<Checkbox bind:checked={$formData.tos} />
				<Form.Label class="flex items-center gap-[5px]">
					<span>Accept</span>
					<a href="/tos" target="_blank" class="text-primary hover:underline">terms of service</a>
				</Form.Label>
				<input type="hidden" name={attrs.name} value={$formData.tos} hidden />
			</div>
		</Form.Control>
		<Form.FieldErrors class="text-[12px]" />
	</Form.Field>
	<Button type="submit" class="w-full" disabled={$delayed}>
		{$delayed ? 'Registering...' : 'Register'}
	</Button>
</form>

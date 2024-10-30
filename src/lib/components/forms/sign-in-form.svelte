<script lang="ts">
	import * as Form from '@/components/ui/form';
	import { signInUsernameSchema } from '@/schemas';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import { Checkbox } from '@/components/ui/checkbox';

	interface Props {
		data: SuperValidated<Infer<typeof signInUsernameSchema>>;
	}

	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zod(signInUsernameSchema)
	});
	const { form: formData, enhance, delayed } = form;
</script>

<form method="post" use:enhance class="space-y-6">
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
	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password</Form.Label>
				<Input
					autocomplete="current-password"
					placeholder="password..."
					type="password"
					{...props}
					bind:value={$formData.password}
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="text-[12px]" />
	</Form.Field>
	<div class="flex items-start justify-between">
		<Form.Field {form} name="rememberMe">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-row items-center space-x-3 space-y-0">
						<Checkbox bind:checked={$formData.rememberMe} />
						<Form.Label class="flex items-center gap-[5px]">Remember Me</Form.Label>
						<input type="hidden" name={props.name} value={$formData.rememberMe} hidden />
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors class="text-[12px]" />
		</Form.Field>

		<a href="/forgot-password" class="text-sm font-medium text-primary hover:underline">
			Forgot Password?
		</a>
	</div>
	<Button type="submit" class="w-full" disabled={$delayed}>
		{$delayed ? 'Signing in...' : 'sign in'}
	</Button>
</form>

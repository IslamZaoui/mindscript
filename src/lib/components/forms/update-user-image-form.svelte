<script lang="ts">
	import { updateUserImageSchema } from '@/schemas';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import * as Dialog from '@/components/ui/dialog';
	import { zod } from 'sveltekit-superforms/adapters';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import Camera from 'lucide-svelte/icons/camera';
	import Edit from 'lucide-svelte/icons/square-pen';

	interface Props {
		data: SuperValidated<Infer<typeof updateUserImageSchema>>;
	}

	let { data }: Props = $props();
	let open = $state(false);

	const form = superForm(data, {
		dataType: 'json',
		validators: zod(updateUserImageSchema),
		onUpdated({ form }) {
			if (form.valid) open = false;
		}
	});
	const { form: formData, enhance, delayed } = form;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class="absolute -right-1 -top-1 rounded-full bg-primary p-2 text-primary-foreground"
	>
		<Edit size={20} />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Changer your profile image</Dialog.Title>
			<Dialog.Description>You can use image url or base64 image string</Dialog.Description>
		</Dialog.Header>
		<form method="post" use:enhance action="?/updateUserImage" class="space-x-4">
			<Form.Field class="flex-1" {form} name="image">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Image</Form.Label>
						<div class="flex items-center gap-2">
							<Input placeholder="image..." class="w-full" {...props} bind:value={$formData.image} />
							<Button type="submit" disabled={$delayed}>
								<Camera class="mr-2 h-4 w-4" />
								{$delayed ? 'Updating...' : 'Update'}
							</Button>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors class="text-[12px]" />
			</Form.Field>
		</form>
	</Dialog.Content>
</Dialog.Root>

<script>
	import UpdateUserInfoForm from '@/components/forms/update-user-info-form.svelte';
	import UpdateUserImageForm from '@/components/forms/update-user-image-form.svelte';
	import * as Avatar from '@/components/ui/avatar';

	let { data } = $props();
</script>

<div class="container mx-auto flex flex-col items-center gap-8 p-6">
	<h1 class="text-3xl font-bold">Settings</h1>

	<div class="w-full max-w-2xl space-y-6">
		<section>
			<h2 class="mb-4 text-2xl font-semibold">Profile Information</h2>
			<div class="relative mb-4 w-fit">
				<Avatar.Root class="size-24">
					<Avatar.Image src={data.user.image} alt={data.user.username} />
					<Avatar.Fallback>{data.user.username[0]}</Avatar.Fallback>
				</Avatar.Root>
				<UpdateUserImageForm data={data.updateUserImageForm} />
			</div>
			<UpdateUserInfoForm data={data.updateUserInfoForm} />
		</section>
	</div>
</div>

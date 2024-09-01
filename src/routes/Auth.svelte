<script lang="ts">
	import { supabase } from '$lib/database';

	let email: string;
	let password: string;

	async function authenticate() {
		let authRequest = await supabase.auth.signInWithPassword({ email, password });
		if (authRequest.error) {
			await supabase.auth.signUp({ email, password });
			await supabase.auth.signInWithPassword({ email, password });
		}
	}
</script>

<div class="flex flex-col max-w-lg mx-auto w-full gap-4 text-lg p-6">
	<label class="flex flex-col gap-2">
		Email
		<input bind:value={email} type="email" class="p-4 rounded-md" />
	</label>
	<label class="flex flex-col gap-2">
		Password
		<input bind:value={password} type="password" class="p-4 rounded-md" />
	</label>
	<button class="p-4 rounded-md mt-4 bg-blue-600" on:click={authenticate}>Authenticate</button>
</div>

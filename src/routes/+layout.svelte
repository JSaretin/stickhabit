<script lang="ts">
	import Auth from './Auth.svelte';
	import { onMount, setContext } from 'svelte';
	import '../app.css';
	import { writable, type Writable } from 'svelte/store';
	import type { User } from '@supabase/supabase-js';
	import { supabase } from '$lib/database';
	import type { Habit } from '$lib/structure';

	const user = writable() as Writable<User | undefined>;

	setContext('user', user);

	let loading = true;
	let checkedUser = false;

	supabase.auth.onAuthStateChange(async (e, session) => {
		if (e === 'SIGNED_IN') {
			$user = session?.user;
			return;
		}
		if (e === 'SIGNED_OUT') {
			$user = undefined;
			return;
		}
	});

	onMount(async () => {
		if ('serviceWorker' in navigator) navigator.serviceWorker.register('/service-worker.js');

		const session = await supabase.auth.getSession();
		if (!session.error && session.data.session?.user) {
			await supabase.auth.refreshSession(session.data.session);
		}
		checkedUser = true;
		loading = false;
	});
</script>

{#if !loading && $user === undefined}
	<Auth />
{:else if $user !== undefined}
	<slot />
{:else}
	<div class="w-full h-screen flex justify-center align-middle place-items-center">
		<div class="flex justify-center align-middle place-items-center">
			<span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
			<h2 class="text-3xl font-medium border-y p-4 text-white border-white">loading habits</h2>
			<span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
		</div>
	</div>
{/if}

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.neutral.800);
		font-family: theme(fontFamily.Kodchasan);
	}
</style>

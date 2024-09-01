<script lang="ts">
	import Auth from './Auth.svelte';
	import { onMount, setContext } from 'svelte';
	import '../app.css';
	import { writable, type Writable } from 'svelte/store';
	import type { User } from '@supabase/supabase-js';
	import { supabase } from '$lib/database';
	import type { Habit } from '$lib/structure';

	const user = writable() as Writable<User | undefined>;
	const habits: Writable<Habit[]> = writable([]);

	setContext('user', user);
	setContext('habits', habits);

	let loading = true;

	async function getOrCreateHabit() {
		if ($user === undefined) return;
		let query = await supabase.from('habits').select('*').eq('user_id', $user.id);
		if (query.error || query.data.length == 0) {
			const query = await supabase
				.from('habits')
				.insert({ habits: [], user_id: $user.id })
				.select('*');
			if (!query.error) {
				$habits = query.data[0].habits;
			}
		} else {
			$habits = query.data[0].habits;
		}
	}

	supabase.auth.onAuthStateChange(async (e, session) => {
		if (e === 'SIGNED_IN') {
			$user = session?.user;
			await getOrCreateHabit();
			return;
		}
		if (e === 'SIGNED_OUT') {
			$user = undefined;
			return;
		}
	});

	onMount(async () => {
		if ('serviceWorker' in navigator) {
			console.log('Service Worker is supported, registering service worker');
			navigator.serviceWorker.register('/service-worker.js');
		}

		const session = await supabase.auth.getSession();
		if (!session.error && session.data.session?.user) {
			$user = session.data.session.user;
		}
		await getOrCreateHabit();
		loading = false;
	});
</script>

{#if loading}
	loading..
{:else if $user === undefined}
	<Auth />
{:else}
	<slot />
{/if}

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.neutral.800);
		font-family: theme(fontFamily.Kodchasan);
	}
</style>

<script lang="ts">
	import { cleanHabits, getStartOfToday } from '$lib';
	import type { Habit } from '$lib/structure';
	import { getContext, onMount, setContext } from 'svelte';
	import RenderHabits from './RenderHabits.svelte';
	import { writable, type Writable } from 'svelte/store';
	import CreateHabit from './CreateHabit.svelte';
	import { supabase } from '$lib/database';
	import type { User } from '@supabase/supabase-js';

	let today = getStartOfToday();
	const daysInCurrentMonth: Writable<number> = writable();
	const secondsOfLastDayOfCurrentMonth: Writable<number> = writable();
	const expand: Writable<boolean> = writable(false);

	const user = getContext('user') as Writable<User>;
	const habits: Writable<Habit[]> = writable([]);

	setContext('today', today);
	setContext('expand', expand);
	setContext('daysInCurrentMonth', daysInCurrentMonth);
	setContext('secondsOfLastDayOfCurrentMonth', secondsOfLastDayOfCurrentMonth);

	async function getOrCreateHabit() {
		if ($user === undefined) return;
		let query = await supabase.from('habits').select('*').eq('user_id', $user.id);
		if (!query.error && query.data.length >= 0) {
			$habits = query.data[0].habits;
			return;
		}

		query = await supabase.from('habits').insert({ habits: [], user_id: $user.id }).select('*');
		if (!query.error) {
			$habits = query.data[0].habits;
		}
	}
	onMount(async () => {
		await getOrCreateHabit();
		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth();

		const nextMonth = new Date(year, month + 1, 1);
		nextMonth.setDate(nextMonth.getDate() - 1);

		$secondsOfLastDayOfCurrentMonth = nextMonth.getTime();
		$daysInCurrentMonth = nextMonth.getDate();
	});

	let showCreateHabit = false;

	async function updateHabits() {
		const req = await supabase
			.from('habits')
			.update({ habits: cleanHabits($habits) })
			.eq('user_id', $user.id);
		// console.log(req);
	}
</script>

<div class="sticky top-0 left-0 w-full">
	<div class="flex max-w-xl lg:rounded-md w-full mx-auto justify-between bg-neutral-700 p-2">
		<div class=""></div>
		<div class="flex gap-2">
			<button
				on:click={() => {
					showCreateHabit = true;
				}}
				class="p-2 rounded-md bg-blue-500 text-xs font-medium">create habit</button
			>
			<button
				on:click={async () => {
					await supabase.auth.signOut();
				}}
				class="p-2 rounded-md bg-red-500 text-xs font-medium">logout</button
			>
		</div>
	</div>
</div>

{#if showCreateHabit}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		on:click|self={() => {
			showCreateHabit = false;
		}}
		class="fixed inset-0 bg-neutral-900 bg-opacity-80 backdrop-blur-sm z-20 overflow-y-scroll p-4"
	>
		<div class="max-w-lg w-full mx-auto">
			<CreateHabit
				on:newhabit={async (e) => {
					$habits = [...$habits, e.detail];
					showCreateHabit = false;
					await updateHabits();
				}}
			/>
		</div>
	</div>
{/if}

<div class="h-screen w-full max-w-xl mx-auto flex flex-col p-2">
	<div class="p-2 flex justify-between bg-neutral-700 mt-4 rounded-md">
		<h2 class="uppercase">Habits</h2>
		<div class="flex">
			<label>expand <input type="checkbox" bind:checked={$expand} /></label>
		</div>
	</div>
	<RenderHabits bind:habits={$habits} on:togglecheck={updateHabits} />
</div>

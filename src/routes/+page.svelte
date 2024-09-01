<script lang="ts">
	import { cleanHabits, getStartOfToday } from '$lib';
	import type { Habit } from '$lib/structure';
	import { onMount, setContext } from 'svelte';
	import RenderHabits from './RenderHabits.svelte';
	import { writable, type Writable } from 'svelte/store';
	import CreateHabit from './CreateHabit.svelte';

	let habits: Habit[] = [];
	let loaded = false;

	let today = getStartOfToday();
	const daysInCurrentMonth: Writable<number> = writable();
	const secondsOfLastDayOfCurrentMonth: Writable<number> = writable();
	const expand: Writable<boolean> = writable(false);

	setContext('today', today);
	setContext('expand', expand);
	setContext('daysInCurrentMonth', daysInCurrentMonth);
	setContext('secondsOfLastDayOfCurrentMonth', secondsOfLastDayOfCurrentMonth);

	$: loaded && localStorage.setItem('habits', JSON.stringify(cleanHabits(habits)));

	onMount(() => {
		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth();

		const nextMonth = new Date(year, month + 1, 1);
		nextMonth.setDate(nextMonth.getDate() - 1);

		$secondsOfLastDayOfCurrentMonth = nextMonth.getTime();
		$daysInCurrentMonth = nextMonth.getDate();

		habits = JSON.parse(localStorage.getItem('habits') || '[]');
		loaded = true;
	});

	let showCreateHabit = false;
</script>

<div class="sticky top-0 left-0 w-full">
	<div class="flex max-w-xl lg:rounded-md w-full mx-auto justify-between bg-neutral-700 p-2">
		<div class=""></div>
		<button
			on:click={() => {
				showCreateHabit = true;
			}}
			class="p-2 rounded-md bg-blue-500 text-xs font-medium">create habit</button
		>
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
				on:newhabit={(e) => {
					habits = [...habits, e.detail];
					showCreateHabit = false;
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
	<RenderHabits bind:habits />
</div>

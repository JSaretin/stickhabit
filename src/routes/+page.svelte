<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import RenderHabit from './RenderHabit.svelte';
	import type { Habit } from '$lib/structure';
	import { convertTo24Hour, sortHabitsByStartTime, getStartOfToday } from '$lib';

	const habits: Writable<Habit[]> = writable([]);

	let name: string = '';
	let date: string;

	function saveHabits() {
		localStorage.setItem('habits', JSON.stringify($habits));
	}

	function updateHabits(habitIndex: number, index: number) {
		$habits[habitIndex].completed[index] = !$habits[habitIndex].completed[index];
		if (!$habits[habitIndex].completed[index]) {
			delete $habits[habitIndex].completed[index];
		}

		saveHabits();
	}

	function addHabit() {
		const habit: Habit = {
			name,
			start_time: convertTo24Hour(date),
			start_date: getStartOfToday(),
			completed: {}
		};
		$habits = sortHabitsByStartTime([...$habits, habit]);
		name = '';
		saveHabits();
	}

	onMount(() => {
		$habits = JSON.parse(localStorage.getItem('habits') || '[]');
	});
	let search: string;
</script>

<div class="max-w-2xl mx-auto flex flex-col w-full h-full gap-4 p-2">
	<div class="flex flex-col md:flex-row gap-2 md:gap-0">
		<textarea
			placeholder="Describe your habit..."
			rows="2"
			bind:value={name}
			class="flex-1 bg-neutral-800 text-white rounded-l-md rounded-r-md md:rounded-r-none p-2 resize-none border-none outline-none"
		></textarea>
		<input
			class="p-2 w-full md:w-fit rounded-md md:rounded-none bg-neutral-800 text-neutral-100 border-none outline-none"
			type="time"
			bind:value={date}
		/>
		<button
			disabled={!Boolean(name) || !Boolean(name.replaceAll(' ', ''))}
			on:click={addHabit}
			class="p-2 rounded-l-md md:rounded-l-none bg-blue-500 rounded-r-md">Add habit</button
		>
	</div>

	<div class="sticky top-0 flex justify-between gap-2">
		<input
			bind:value={search}
			placeholder="search habit"
			type="text"
			class="p-2 border-none flex-1 outline-none text-white placeholder:text-neutral-900 bg-neutral-700 rounded-md"
		/>
	</div>
	<div class="w-full flex flex-col gap-4">
		{#each $habits as habit, habit_index}
			{#if !Boolean(search)}
				<RenderHabit
					bind:habit={$habits[habit_index]}
					on:update={(e) => {
						updateHabits(habit_index, e.detail);
					}}
				/>
			{:else if habit.name.toLowerCase().includes(search.toLowerCase())}
				<RenderHabit
					bind:habit={$habits[habit_index]}
					on:update={(e) => {
						updateHabits(habit_index, e.detail);
					}}
				/>
			{/if}
		{/each}
	</div>
</div>

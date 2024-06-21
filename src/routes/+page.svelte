<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import RenderHabit from './RenderHabit.svelte';
	import type { Habit } from '$lib/structure';
	import { convertTo24Hour, sortHabitsByStartTime, getStartOfToday } from '$lib';

	const habits: Writable<Habit[]> = writable([]);

	let name: string = '';
	let date: string;

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		const hours = date.getUTCHours().toString().padStart(2, '0');
		const minutes = date.getUTCMinutes().toString().padStart(2, '0');
		const formattedTime = `${hours}:${minutes}:00`;
		const formattedDateString = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}T${formattedTime}Z`;
		return formattedDateString;
	}

	function updateHabits() {
		localStorage.setItem('habits', JSON.stringify($habits));
	}

	function addHabit() {
		// if (now > startTime) {
		// 	alert('future time only');
		// 	return;
		// }
		const habit: Habit = {
			name,
			start_time: convertTo24Hour(date),
			start_date: getStartOfToday(),
			completed: {}
		};
		$habits = sortHabitsByStartTime([...$habits, habit]);
		name = '';
		updateHabits();
	}

	onMount(() => {
		$habits = JSON.parse(localStorage.getItem('habits') || '[]');
	});
	let search: string;
</script>

<div class="h-screen w-full text-sm overflow-y-hidden bg-neutral-900 font-mono">
	<div class="max-w-2xl mx-auto flex flex-col w-full h-full">
		<div class="flex p-2 flex-col md:flex-row gap-2 md:gap-0">
			<input
				placeholder="Describe your habit..."
				bind:value={name}
				class="flex-1 bg-neutral-800 text-white rounded-l-md rounded-r-md md:rounded-r-none p-2 resize-none border-none outline-none"
			/>
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

		<div class="flex mt-4 justify-between gap-2 p-2">
			<input
				bind:value={search}
				placeholder="search habit"
				type="text"
				class="p-2 border-none flex-1 outline-none text-white placeholder:text-neutral-900 bg-neutral-700 rounded-md"
			/>
		</div>
		<div class="p-2 w-full flex flex-col gap-4 overflow-y-scroll">
			{#each $habits as habit, habit_index}
				{#if !Boolean(search)}
					<RenderHabit bind:habit={$habits[habit_index]} on:update={updateHabits} />
				{:else if habit.name.toLowerCase().includes(search.toLowerCase())}
					<RenderHabit bind:habit={$habits[habit_index]} on:update={updateHabits} />
				{/if}
			{/each}
		</div>
	</div>
</div>

<script lang="ts">
	import { getStartOfToday } from '$lib';
	import type { Habit } from '$lib/structure';
	import { createEventDispatcher } from 'svelte';

	function generateNewHabit() {
		return {
			id: crypto.randomUUID(),
			description: '',
			checked: {},
			start_date: getStartOfToday(),
			habits: []
		};
	}

	export let isChild = false;
	export let habit: Habit = generateNewHabit();
	const dispatcher = createEventDispatcher();

	function addNewHabit() {
		const newHabit = { ...generateNewHabit(), id: `${habit.id}-${habit.habits.length}` };
		habit.habits = [...habit.habits, newHabit];
	}
	function generateRandomHexColor() {
		const randomColor = Math.floor(Math.random() * 16777215).toString(16);
		const hexColor = randomColor.padStart(6, '0');
		return `#${hexColor}`;
	}

	const color = generateRandomHexColor();
</script>

<div class="w-full flex-col flex p-2 rounded-md border bg-neutral-800" style:border-color={color}>
	<div class="w-full relative rounded-md overflow-hidden">
		<textarea
			class="p-2 w-full resize-none bg-neutral-600 border-none outline-none text-white"
			placeholder="Enter your new habit"
			bind:value={habit.description}
		></textarea>

		<div class="flex absolute right-1 bottom-1 gap-1">
			{#if isChild}
				<button
					on:click
					class="border-red-600 border bg-opacity-60 p-1 rounded-md text-xs text-red-600 bg-neutral-900 font-medium"
					>remove</button
				>
			{/if}

			<button
				on:click={addNewHabit}
				style:border-color={color}
				class="border p-1 rounded-md text-xs text-neutral-100 font-medium">add child</button
			>
		</div>
	</div>
	{#if habit.habits.length > 0}
		<div class="mt-2 flex gap-2 flex-col">
			{#each habit.habits as _, index}
				<svelte:self
					bind:habit={habit.habits[index]}
					isChild="true"
					on:click={() => {
						habit.habits = habit.habits.filter((h) => h.id != _.id);
					}}
				/>
			{/each}
		</div>
	{/if}

	{#if !isChild}
		<button
			class="p-2 mt-4 border font-bold text-sm text-white rounded-md"
			on:click={() => {
				dispatcher('newhabit', habit);
				habit = generateNewHabit();
			}}>Add Habit</button
		>
	{/if}
</div>
